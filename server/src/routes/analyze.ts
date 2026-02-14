import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { generateId } from "../utils/id";
import { analyzeUrl } from "../services/urlAnalyzerService";
import type { CandidateReport, Skills } from "../types";
import { generateGithubAutomationInsights, generateInsights } from "../services/aiService";
import { fetchGithubData } from "../services/githubService";
import { calculateScore } from "../services/scoringService";
import { detectRisks } from "../services/riskAnalyzer";

const router = Router();
const DB_PATH = path.join(__dirname, "..", "data", "candidates.json");

type AnalyzeRequestBody = {
    url?: string;
    githubUrl?: string;
};

function readCandidates(): CandidateReport[] {
    try {
        const raw = fs.readFileSync(DB_PATH, "utf-8");
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function saveCandidates(candidates: CandidateReport[]): void {
    fs.writeFileSync(DB_PATH, JSON.stringify(candidates, null, 2), "utf-8");
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

function levelFromScore(score: number): "High" | "Medium" | "Low" {
    return score > 75 ? "High" : score > 45 ? "Medium" : "Low";
}

function dedupe(items: string[]): string[] {
    const seen = new Set<string>();
    const output: string[] = [];
    items.forEach((item) => {
        const key = item.trim().toLowerCase();
        if (!key || seen.has(key)) {
            return;
        }
        seen.add(key);
        output.push(item.trim());
    });
    return output;
}

function mergeSkills(a: Skills, b: Skills): Skills {
    return {
        frontend: clamp(Math.round((a.frontend + b.frontend) / 2), 0, 10),
        backend: clamp(Math.round((a.backend + b.backend) / 2), 0, 10),
        dsa: clamp(Math.round((a.dsa + b.dsa) / 2), 0, 10),
        system: clamp(Math.round((a.system + b.system) / 2), 0, 10),
        testing: clamp(Math.round((a.testing + b.testing) / 2), 0, 10),
    };
}

function extractGithubUsername(input: string): string | null {
    try {
        const parsed = new URL(input);
        if (!parsed.hostname.toLowerCase().includes("github.com")) {
            return null;
        }
        const firstPath = parsed.pathname.split("/").filter(Boolean)[0];
        return firstPath ?? null;
    } catch {
        return null;
    }
}

router.post("/analyze", async (req: Request, res: Response): Promise<void> => {
    try {
        const { url, githubUrl } = req.body as AnalyzeRequestBody;
        const analysisUrl = url ?? githubUrl;

        if (!analysisUrl || typeof analysisUrl !== "string") {
            res.status(400).json({ error: "url is required and must be a string" });
            return;
        }

        const automated = await analyzeUrl(analysisUrl);

        const report: CandidateReport = {
            id: generateId(),
            name: automated.name,
            profileUrl: automated.profileUrl,
            score: automated.score,
            authenticityLevel: automated.authenticityLevel,
            skills: automated.skills,
            strengths: automated.strengths,
            weaknesses: automated.weaknesses,
            risks: automated.risks,
            questions: automated.questions,
        };

        // GitHub monitoring automation (adds richer signal + actionable suggestions).
        const githubUsername = extractGithubUsername(analysisUrl);
        if (githubUsername) {
            const githubData = await fetchGithubData(githubUsername);

            const githubSignals = {
                repoCount: githubData.repoCount,
                stars: clamp(Math.round((githubData.complexityScore + githubData.collaborationScore) / 8), 0, 100),
                languages: githubData.languages,
                activityScore: clamp(Math.round(githubData.contributionConsistency / 10), 0, 10),
                projectDepthScore: clamp(Math.round(githubData.complexityScore / 10), 0, 10),
            };

            const githubScore = calculateScore(githubSignals);
            report.score = clamp(Math.round(report.score * 0.6 + githubScore.score * 0.4), 0, 100);
            report.authenticityLevel = levelFromScore(report.score);
            report.skills = mergeSkills(report.skills, githubScore.skills);

            const sortedSkills = (Object.entries(report.skills) as [keyof Skills, number][])
                .sort((a, b) => b[1] - a[1])
                .map(([skill]) => skill);

            const automationInsights = await generateGithubAutomationInsights({
                username: githubUsername,
                score: report.score,
                authenticityLevel: report.authenticityLevel,
                totalCommits: githubData.totalCommits,
                repoCount: githubData.repoCount,
                contributionConsistency: githubData.contributionConsistency,
                complexityScore: githubData.complexityScore,
                collaborationScore: githubData.collaborationScore,
                topSkills: sortedSkills.slice(0, 2).map((s) => String(s)),
                risks: detectRisks(githubData),
            });

            report.strengths = dedupe([
                ...report.strengths,
                ...automationInsights.monitorSummary,
            ]).slice(0, 6);

            report.weaknesses = dedupe([
                ...report.weaknesses,
                ...automationInsights.suggestions,
            ]).slice(0, 6);

            report.risks = dedupe([
                ...report.risks,
                ...detectRisks(githubData),
            ]).slice(0, 6);

            report.questions = dedupe([
                ...report.questions,
                "How would you automate GitHub activity monitoring for contribution consistency?",
                "Which repository best demonstrates system design decisions, and what tradeoffs did you choose?",
                "What metrics would you track weekly to prove engineering depth and collaboration quality?",
            ]).slice(0, 7);

            report.githubMonitoring = {
                username: githubUsername,
                repoCount: githubData.repoCount,
                totalCommits: githubData.totalCommits,
                contributionConsistency: githubData.contributionConsistency,
                complexityScore: githubData.complexityScore,
                collaborationScore: githubData.collaborationScore,
                suggestions: automationInsights.suggestions,
                automation: automationInsights.automation,
                monitorSummary: automationInsights.monitorSummary,
            };
        }

        // INTEGRATION: Gemini AI Insights
        try {
            const ai = await generateInsights({
                skills: report.skills,
                score: report.score,
                githubMonitoring: report.githubMonitoring ?? null,
            });

            if (ai) {
                report.strengths = dedupe([...report.strengths, ...ai.strengths]).slice(0, 6);
                report.weaknesses = dedupe([...report.weaknesses, ...ai.weaknesses]).slice(0, 6);
                report.risks = dedupe([...report.risks, ...ai.risks]).slice(0, 6);
                report.questions = dedupe([...report.questions, ...ai.questions]).slice(0, 7);
            }
        } catch (err) {
            console.error("[analyze] AI generation failed, using defaults:", err);
            // Fallback is already in report from automated analysis
        }

        const candidates = readCandidates();
        candidates.push(report);
        saveCandidates(candidates);

        res.json(report);
    } catch (error) {
        console.error("[analyze] Error while analyzing candidate:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
