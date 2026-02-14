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
import { supabase } from "../lib/supabaseClient";

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

/* ══════════════════════════════════════════
   POST /analyze — scan a GitHub profile
   ══════════════════════════════════════════ */
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
        }

        // ── Save to JSON file (fallback / local backup) ──
        const candidates = readCandidates();
        candidates.push(report);
        saveCandidates(candidates);

        // ── Save to Supabase ──
        try {
            const topSkills = (Object.entries(report.skills) as [string, number][])
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([skill]) => skill);

            const { data: sbRow, error: sbError } = await supabase
                .from("candidates")
                .insert({
                    report_id: report.id,
                    name: report.name,
                    github_url: report.profileUrl,
                    authenticity_score: report.score,
                    authenticity_level: report.authenticityLevel,
                    top_skills: topSkills,
                    repo_count: report.githubMonitoring?.repoCount ?? 0,
                    followers: report.githubMonitoring?.collaborationScore ?? 0,
                    report_data: report,
                })
                .select()
                .single();

            if (sbError) {
                console.error("[analyze] Supabase insert failed:", sbError.message);
            } else {
                console.log("[analyze] Saved to Supabase, row id:", sbRow?.id);
                // Attach the Supabase row id for the frontend
                (report as any).supabase_id = sbRow?.id;
            }
        } catch (sbErr) {
            console.error("[analyze] Supabase insert error:", sbErr);
            // Non-fatal — JSON file is the fallback
        }

        res.json(report);
    } catch (error) {
        console.error("[analyze] Error while analyzing candidate:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/* ══════════════════════════════════════════
   GET /candidate/:id — single candidate
   ══════════════════════════════════════════ */
router.get("/candidate/:id", async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    // Try Supabase first
    try {
        const { data, error } = await supabase
            .from("candidates")
            .select("report_data")
            .or(`report_id.eq.${id},id.eq.${id}`)
            .single();

        if (!error && data?.report_data) {
            res.json(data.report_data);
            return;
        }
    } catch {
        // Fall through to JSON file
    }

    // Fallback: JSON file
    const candidates = readCandidates();
    const candidate = candidates.find((c) => c.id === id);

    if (!candidate) {
        res.status(404).json({ error: "Candidate not found" });
        return;
    }

    res.json(candidate);
});

/* ══════════════════════════════════════════
   GET /candidates — all candidates
   ══════════════════════════════════════════ */
router.get("/candidates", async (_req: Request, res: Response): Promise<void> => {
    // Try Supabase first
    try {
        const { data, error } = await supabase
            .from("candidates")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
            res.json(data);
            return;
        }
    } catch {
        // Fall through to JSON file
    }

    // Fallback: JSON file
    const candidates = readCandidates().slice().reverse();
    res.json(candidates);
});

export default router;
