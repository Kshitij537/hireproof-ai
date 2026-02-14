import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fetchGithubData } from "../services/githubService";
import { calculateAuthenticity } from "../services/scoringEngine";
import { detectRisks } from "../services/riskAnalyzer";
import { generateInterviewQuestions } from "../services/interviewGenerator";

const router = Router();
const DB_PATH = path.join(__dirname, "..", "data", "candidates.json");

type AnalyzeRequestBody = {
    githubUsername?: string;
    targetRole?: string;
};

type CandidateReport = {
    githubUsername: string;
    authenticityScore: number;
    skills: {
        Python: number;
        DSA: number;
        "System Design": number;
        Collaboration: number;
    };
    strengths: string[];
    weaknesses: string[];
    riskFlags: string[];
    interviewQuestions: string[];
};

function randomScore(): number {
    return Math.floor(Math.random() * 101);
}

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
        const { githubUsername, targetRole } = req.body as AnalyzeRequestBody;

        if (!githubUsername || typeof githubUsername !== "string") {
            res.status(400).json({ error: "githubUsername is required and must be a string" });
            return;
        }

        if (!targetRole || typeof targetRole !== "string") {
            res.status(400).json({ error: "targetRole is required and must be a string" });
            return;
        }

        const githubData = await fetchGithubData(githubUsername);
        const authenticityScore = calculateAuthenticity(githubData);
        const riskFlags = detectRisks(githubData);
        const interviewQuestions = generateInterviewQuestions(targetRole);

        const report: CandidateReport = {
            githubUsername,
            authenticityScore,
            skills: {
                Python: randomScore(),
                DSA: randomScore(),
                "System Design": randomScore(),
                Collaboration: githubData.collaborationScore,
            },
            strengths: ["Consistent commits", "Strong backend focus"],
            weaknesses: ["Limited documentation"],
            riskFlags,
            interviewQuestions,
        };

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
