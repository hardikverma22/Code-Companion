import { ChatHistory } from "../types/Chat";
import {
  clearChatHistory,
  getChatHistory,
  saveChatHistory,
} from "../../lib/indexDB";

export const useIndexDB = () => {
  return {
    saveChatHistory: async (problemName: string, history: ChatHistory[]) => {
      await saveChatHistory(problemName, history);
    },

    fetchChatHistory: async (
      problemName: string,
      limit: number,
      offset: number
    ) => {
      return await getChatHistory(problemName, limit, offset);
    },

    clearChatHistory: async (problemName: string) => {
      await clearChatHistory(problemName);
    },
  };
};