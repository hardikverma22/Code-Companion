export const useChromeStorage = () => {
  return {
    setKey: async (openApiKey: string) => {
      await chrome.storage.local.set({ openApiKey });
    },

    getKey: async () => {
      return (await chrome.storage.local.get("openApiKey")) as {
        openApiKey?: string;
      };
    },
  };
};
