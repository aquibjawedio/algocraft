import { GoogleGenAI } from "@google/genai";
import { env } from "./env";

const geminiClient = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

export { geminiClient };
