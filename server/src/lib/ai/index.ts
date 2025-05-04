import { createOpenAI } from "@ai-sdk/openai";

const openaiProvider = createOpenAI({
  compatibility: "strict",
});

export const model = openaiProvider("gpt-4o", {
  structuredOutputs: true,
});
