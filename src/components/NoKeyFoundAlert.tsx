import { AlertTriangle, Settings } from "lucide-react";

const NoKeyFoundAlert = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <AlertTriangle className="text-yellow-600 w-6 h-6" />
        <div>
          <p className="text-yellow-800 font-medium">
            OpenAI API Key Not Configured
          </p>
          <p className="text-yellow-700 text-sm mt-1">
            Please set up your API key to enable AI assistance
          </p>
        </div>
      </div>
      <button
        onClick={() => {
          chrome.runtime.sendMessage({ action: "openPopup" });
        }}
        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors flex items-center space-x-2"
      >
        <Settings className="w-4 h-4" />
        <span>Configure</span>
      </button>
    </div>
  );
};
export default NoKeyFoundAlert;
