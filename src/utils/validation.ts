export const validateApiKey = (key: string): { isValid: boolean; message: string } => {
    if (!key.trim()) {
      return {
        isValid: false,
        message: 'API key is required',
      };
    }
  
    if (!key.trim().startsWith('sk-')) {
      return {
        isValid: false,
        message: 'Invalid API key format. Must start with "sk-"',
      };
    }
  
    if (key.trim().length < 20) {
      return {
        isValid: false,
        message: 'API key seems too short. Please check your key',
      };
    }
  
    return {
      isValid: true,
      message: 'API key saved successfully!',
    };
  };