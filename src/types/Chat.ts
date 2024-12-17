import { z } from "zod";
import { outputSchema } from "../utils/schema";

export type Roles = "system" | "user" | "assistant" | "data";

export interface ChatHistory {
  role: Roles;
  content: string | z.infer<typeof outputSchema>;
}

export interface ChatHistoryParsed {
  role: Roles;
  content: string;
}
