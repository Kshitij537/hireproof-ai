import dotenv from "dotenv";

dotenv.config();

console.log("KEY:", process.env.GEMINI_API_KEY);

async function test() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  // Lazy-load to avoid hard dependency when Gemini package is not installed.
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

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent("Say hello from Gemini API test");
  console.log(result.response.text());
}

test().catch((err) => {
  console.error("Gemini test failed:", err);
});
