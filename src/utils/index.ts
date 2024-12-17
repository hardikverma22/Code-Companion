import { ChatHistory, ChatHistoryParsed } from "../types/Chat";

export function extractCode(htmlContent: NodeListOf<Element>) {
  // Extract the text content of each line with the 'view-line' class
  const code = Array.from(htmlContent)
    .map((line) => line.textContent || "") // Ensure textContent is not null
    .join("\n");

  return code;
}

export const parseChatHistory = (
  chatHistory: ChatHistory[]
): ChatHistoryParsed[] => {
  return chatHistory.map((history) => {
    return {
      role: history.role,
      content:
        typeof history.content === "string"
          ? history.content
          : JSON.stringify(history.content),
    };
  });
};
