import { Router, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

interface HiringTestBody {
    name?: string;
    skills?: string[];
    score?: number;
    strengths?: string[];
    weaknesses?: string[];
}

interface MCQ {
    question: string;
    options: string[];
    answer: string;
}

interface HiringTestResponse {
    codingRound: string[];
    mcqs: MCQ[];
    projectTask: string;
}

const FALLBACK_TEST: HiringTestResponse = {
    codingRound: [
        "Build a REST API with CRUD operations for a task management system using Node.js and Express.",
        "Implement a function that finds the longest substring without repeating characters. Optimize for O(n) time.",
    ],
    mcqs: [
        {
            question: "What is the time complexity of binary search?",
            options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
            answer: "O(log n)",
        },
        {
            question: "Which HTTP method is idempotent?",
            options: ["POST", "PATCH", "PUT", "None of the above"],
            answer: "PUT",
        },
        {
            question: "What does ACID stand for in databases?",
            options: [
                "Atomicity, Consistency, Isolation, Durability",
                "Association, Consistency, Isolation, Durability",
                "Atomicity, Concurrency, Isolation, Durability",
                "Atomicity, Consistency, Integration, Durability",
            ],
            answer: "Atomicity, Consistency, Isolation, Durability",
        },
        {
            question: "What is the purpose of an index in a database?",
            options: [
                "To enforce constraints",
                "To speed up query performance",
                "To normalize data",
                "To create backups",
            ],
            answer: "To speed up query performance",
        },
        {
            question: "Which data structure uses LIFO ordering?",
            options: ["Queue", "Stack", "Linked List", "Tree"],
            answer: "Stack",
        },
    ],
    projectTask:
        "Build a mini full-stack project: a URL shortener with analytics. Include a REST API backend, a simple frontend to shorten URLs, and a dashboard showing click counts and referrer data.",
};

router.post("/hiring-test", async (req: Request, res: Response) => {
    try {
        const body = req.body as HiringTestBody;

        console.log("[HiringTest] Received:", {
            name: body.name,
            skills: body.skills?.length,
            score: body.score,
        });

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.log("[HiringTest] No GEMINI_API_KEY — using fallback");
            return res.json(FALLBACK_TEST);
        }

        const { GoogleGenerativeAI } = require("@google/generative-ai") as {
            GoogleGenerativeAI: new (key: string) => {
                getGenerativeModel: (config: { model: string }) => {
                    generateContent: (prompt: string) => Promise<{
                        response: { text: () => string };
                    }>;
                };
            };
        };

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
You are a senior engineering hiring manager.

Generate a hiring test for this candidate.

Candidate data:
${JSON.stringify(body, null, 2)}

Include:
1. 2 coding round tasks (practical implementation challenges)
2. 5 MCQs with 4 options each and the correct answer
3. 1 project assignment task

Tailor the test to the candidate's skills and level.

Return ONLY valid JSON in this exact format:
{
  "codingRound": ["task1", "task2"],
  "mcqs": [
    { "question": "...", "options": ["A", "B", "C", "D"], "answer": "B" }
  ],
  "projectTask": "Build a mini project..."
}
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log("[HiringTest] AI raw response:", text);

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Invalid JSON from Gemini");
        }

        const parsed = JSON.parse(jsonMatch[0]) as HiringTestResponse;

        if (
            !Array.isArray(parsed.codingRound) ||
            !Array.isArray(parsed.mcqs) ||
            !parsed.projectTask
        ) {
            throw new Error("Incomplete test response");
        }

        console.log("[HiringTest] Generated test via Gemini");
        return res.json(parsed);
    } catch (err) {
        console.error("[HiringTest] Gemini failed, using fallback:", err);
        return res.json(FALLBACK_TEST);
    }
});

export default router;
