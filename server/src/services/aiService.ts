import dotenv from "dotenv";

dotenv.config();

type AiInsights = {
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  questions: string[];
};

type GithubAutomationInput = {
  username: string;
  score: number;
  authenticityLevel: "High" | "Medium" | "Low";
  totalCommits: number;
  repoCount: number;
  contributionConsistency: number;
  complexityScore: number;
  collaborationScore: number;
  topSkills: string[];
  risks: string[];
};

type GithubAutomationInsights = {
  suggestions: string[];
  automation: string[];
  monitorSummary: string[];
};

function fallbackGithubAutomation(input: GithubAutomationInput): GithubAutomationInsights {
  const suggestions: string[] = [];
  const automation: string[] = [];
  const monitorSummary: string[] = [];

  if (input.contributionConsistency < 50) {
    suggestions.push("Schedule a weekly contribution goal and track streak stability.");
    automation.push("Enable a weekly consistency monitor that flags 2+ inactive days.");
  } else {
    suggestions.push("Maintain current commit consistency with monthly quality checkpoints.");
  }

  if (input.complexityScore < 60) {
    suggestions.push("Add one architecture-focused repo with README decisions and tradeoffs.");
    automation.push("Auto-detect repos missing architecture docs and open reminder tasks.");
  } else {
    suggestions.push("Publish postmortems for complex features to strengthen engineering signal.");
  }

  if (input.collaborationScore < 55) {
    suggestions.push("Increase PR review activity to improve collaboration evidence.");
    automation.push("Track PR comments/reviews per week and surface low-engagement alerts.");
  } else {
    suggestions.push("Keep cross-repo reviews active to preserve collaboration momentum.");
  }

  automation.push("Run monthly language diversity checks to detect one-dimensional project trends.");

  monitorSummary.push(`${input.username} has ${input.repoCount} repos and ${input.totalCommits} total commits.`);
  monitorSummary.push(`GitHub monitoring score is ${input.score} (${input.authenticityLevel}).`);
  monitorSummary.push(`Top inferred skills: ${input.topSkills.join(", ")}.`);

  return {
    suggestions: suggestions.slice(0, 4),
    automation: automation.slice(0, 4),
    monitorSummary: monitorSummary.slice(0, 3),
  };
}

export async function generateInsights(data: unknown): Promise<AiInsights> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    // Lazy-load so server can boot even when Gemini dependency is missing.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
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
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
You are an AI hiring intelligence system.

Based on this candidate data:
${JSON.stringify(data)}

Return ONLY valid JSON in this format:

{
  "strengths": [],
  "weaknesses": [],
  "risks": [],
  "questions": []
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid JSON");

    return JSON.parse(jsonMatch[0]) as AiInsights;
  } catch (err) {
    console.log("Gemini failed -> using fallback");

    return {
      strengths: ["Active GitHub contributions"],
      weaknesses: ["Limited test coverage"],
      risks: ["Possible shallow project depth"],
      questions: ["Explain your most complex project in detail"],
    };
  }
}

export async function generateGithubAutomationInsights(
  input: GithubAutomationInput
): Promise<GithubAutomationInsights> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
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
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
You are a GitHub monitoring copilot for hiring intelligence.
Generate concise, actionable improvements and automations from this profile data:
${JSON.stringify(input)}

Return ONLY valid JSON in this shape:
{
  "suggestions": [],
  "automation": [],
  "monitorSummary": []
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Invalid JSON");
    }

    const parsed = JSON.parse(jsonMatch[0]) as GithubAutomationInsights;
    if (!Array.isArray(parsed.suggestions) || !Array.isArray(parsed.automation) || !Array.isArray(parsed.monitorSummary)) {
      throw new Error("Invalid automation payload");
    }

    return {
      suggestions: parsed.suggestions.slice(0, 4),
      automation: parsed.automation.slice(0, 4),
      monitorSummary: parsed.monitorSummary.slice(0, 3),
    };
  } catch {
    return fallbackGithubAutomation(input);
  }
}
