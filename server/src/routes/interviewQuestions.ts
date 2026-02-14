import { Router, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

interface InterviewQuestionsBody {
    name?: string;
    skills?: string[];
    score?: number;
    strengths?: string[];
    weaknesses?: string[];
}

const FALLBACK_QUESTIONS = [
    "Walk me through the architecture of your most complex project.",
    "How do you approach debugging a production issue under time pressure?",
    "Describe a time you had to learn a new technology quickly for a project.",
    "How do you balance shipping features fast vs. maintaining code quality?",
    "Explain your testing strategy — what do you test and why?",
    "How would you design a system to handle 10x the current traffic?",
    "Tell me about a time you disagreed with a technical decision. How did you handle it?",
    "What's a technical mistake you made and what did you learn from it?",
];

router.post("/interview-questions", async (req: Request, res: Response) => {
    try {
        const body = req.body as InterviewQuestionsBody;

        console.log("[InterviewQuestions] Received:", {
            name: body.name,
            skills: body.skills?.length,
            score: body.score,
        });

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.log("[InterviewQuestions] No GEMINI_API_KEY — using fallback");
            return res.json({ questions: FALLBACK_QUESTIONS });
        }

        // Lazy-load Gemini SDK
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
You are a senior engineering interviewer at a top tech company.

Generate exactly 8 personalized interview questions for this candidate.

Candidate data:
${JSON.stringify(body, null, 2)}

Rules:
- Mix technical, project-based, and system design questions
- Tailor questions to the candidate's skills and weaknesses
- Questions should probe depth, not just surface knowledge
- Be specific — reference their actual skills where possible

Return ONLY valid JSON in this exact format:
{ "questions": ["question1", "question2", ...] }
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log("[InterviewQuestions] AI raw response:", text);

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Invalid JSON from Gemini");
        }

        const parsed = JSON.parse(jsonMatch[0]);

        if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
            throw new Error("No questions in response");
        }

        console.log("[InterviewQuestions] Generated", parsed.questions.length, "questions via Gemini");
        return res.json({ questions: parsed.questions.slice(0, 8) });
    } catch (err) {
        console.error("[InterviewQuestions] Gemini failed, using fallback:", err);
        return res.json({ questions: FALLBACK_QUESTIONS });
    }
});

export default router;
