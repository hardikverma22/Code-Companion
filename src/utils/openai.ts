import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { outputSchema } from "./schema";
import { ChatHistoryParsed } from "../types/Chat";
import { z } from "zod";

export type GenerateResponseReturnType = Promise<{
  error: Error | null;
  success: z.infer<typeof outputSchema> | null | any;
}>;

export const askAI = async ({
  prompt,
  systemPrompt,
  messages,
  extractedCode,
  apiKey,
}: {
  prompt: string;
  systemPrompt: string;
  messages: ChatHistoryParsed[] | [];
  extractedCode?: string;
  apiKey: string;
}): GenerateResponseReturnType => {
  try {
    const openai = createOpenAI({
      compatibility: "strict",
      apiKey,
    });

    let data = await generateObject({
      model: openai("gpt-4o"),
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "system",
          content: `extractedCode (this code is writen by user): ${extractedCode}`,
        },
        ...messages,
        { role: "user", content: prompt },
      ],
      output: "object",
      schema: outputSchema,
    });

    return {
      error: null,
      success: data.object,
    };
  } catch (error: any) {
    return { error, success: null };
  }
};
