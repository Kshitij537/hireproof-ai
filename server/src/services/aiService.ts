import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateInsights(data: any) {
  try {
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

    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.log("Gemini failed → using fallback");

    return {
      strengths: ["Active GitHub contributions"],
      weaknesses: ["Limited test coverage"],
      risks: ["Possible shallow project depth"],
      questions: ["Explain your most complex project in detail"],
    };
  }
}
