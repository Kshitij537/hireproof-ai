import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { generateId } from "../utils/id";
import { analyzeUrl } from "../services/urlAnalyzerService";
import type { CandidateReport } from "../types";
import { generateInsights } from "../services/aiService";

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

        // INTEGRATION: Gemini AI Insights
        try {
            const ai = await generateInsights({
                skills: report.skills,
                score: report.score,
                // repoCount not available in automated analysis, omitting
            });

            if (ai) {
                report.strengths = ai.strengths;
                report.weaknesses = ai.weaknesses;
                report.risks = ai.risks;
                report.questions = ai.questions;
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
