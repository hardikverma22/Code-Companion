import { useState, useEffect, MouseEvent } from "react";
import "./App.css";
import { Code2, Eye, PencilIcon } from "lucide-react";
import { validateApiKey } from "./utils/validation";
import { Alert } from "./components/Alert";
function App() {
  const [apiKey, setApiKey] = useState("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  useEffect(() => {
    (async function loadOpenAIAPIKey() {
      if (!chrome) return;
      const { openApiKey } = (await chrome.storage.local.get("openApiKey")) as {
        openApiKey?: string;
      };
      if (openApiKey) {
        setSavedKey(openApiKey);
        setApiKey(openApiKey);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("form submitted");
    const validation = validateApiKey(apiKey);
    if (!validation.isValid) {
      setAlert({ type: "error", message: validation.message });
      return;
    }

    if (apiKey.trim().startsWith("sk-")) {
      await chrome.storage.local.set({ openApiKey: apiKey });
      setSavedKey(apiKey);
      setIsEditing(false);
      setAlert({ type: "success", message: validation.message });
    }
  };

  useEffect(() => {
    if (alert) {
      const ref = setTimeout(() => setAlert(null), 2000);
      return () => clearTimeout(ref);
    }
  }, [alert]);

  const handleClickEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("clicked ediitng");
    setAlert(null);
    setIsEditing(true);
  };

  const handlePasswordVisibility = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    console.log(isEditing);
  }, [isEditing]);

  return (
    <div className="bg-gray-900 flex items-center justify-center">
      <div className="w-full bg-gray-800 rounded-xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Code2 className="w-8 h-8 text-indigo-400" />
          <h1 className="text-2xl font-bold text-white">Code Companion</h1>
        </div>

        {alert && (
          <div className="mb-6">
            <Alert type={alert.type} message={alert.message} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {savedKey && !isEditing ? (
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Saved API Key</div>
                <div className="text-indigo-400 font-mono">
                  {savedKey.slice(0, 3)}...{savedKey.slice(-4)}
                </div>
              </div>
              <button
                type="button"
                onClick={handleClickEdit}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <PencilIcon className="w-4 h-4" />
                Edit API Key
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="apiKey"
                  className="block text-sm font-medium text-gray-300 mb-2 text-left"
                >
                  Enter OpenAI API Key
                </label>
                <div className="relative flex justify-end items-center ">
                  <input
                    id="apiKey"
                    type={showPassword ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    className={`absolute right-3 ${!apiKey && "hidden"}`}
                    onClick={handlePasswordVisibility}
                  >
                    <Eye className="h-4 w-4  text-white" />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Save API Key
              </button>
            </div>
          )}
        </form>

        <div className="mt-6 text-sm text-gray-400">
          Your API key is stored securely in your browser's local storage.
        </div>
      </div>
    </div>
  );
}

export default App;
