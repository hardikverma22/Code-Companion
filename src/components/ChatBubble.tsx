import { Copy, MessageCircle, Send, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useChromeStorage } from "../hooks/useChromeStorage";
import { askAI } from "../utils/openai";
import { ChatHistory } from "../types/Chat";
import { extractCode, parseChatHistory } from "../utils";
import { SYSTEM_PROMPT } from "../constants";
import { Highlight, themes } from "prism-react-renderer";
import NoKeyFoundAlert from "./NoKeyFoundAlert";
import BubbleButton from "./BubbleButton";
import { LIMIT_VALUE } from "../../lib/indexDB";
import { useIndexDB } from "../hooks/useIndexDB";

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [openAiApiKey, setOpenAiApiKey] = useState<string | undefined>(
    undefined
  );
  const { fetchChatHistory, saveChatHistory } = useIndexDB();
  const [isResponseLoading, setIsResponseLoading] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputFieldRef = useRef<HTMLInputElement>(null);
  const { getKey } = useChromeStorage();
  const getProblemName = () => {
    const url = window.location.href;
    const match = /\/problems\/([^/]+)/.exec(url);
    return match ? match[1] : "Unknown Problem";
  };

  const problemName = getProblemName();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    inputFieldRef?.current?.focus();
  }, [chatHistory, isOpen]);

  useEffect(() => {
    const loadChromeStorage = async () => {
      if (!chrome) return;

      const key = await getKey();
      setOpenAiApiKey(key.openApiKey);
    };

    loadChromeStorage();
  }, [isOpen]);

  const loadInitialChatHistory = async () => {
    const { allChatHistory } = await fetchChatHistory(
      problemName,
      LIMIT_VALUE,
      0
    );
    if (!allChatHistory || allChatHistory.length === 0) {
      setChatHistory([
        {
          role: "assistant",
          content: `Hello! I'm here to help you solve the "${problemName}" problem. Feel free to ask me about the problem, request hints, or seek code explanation.`,
        },
      ]);
      return;
    }
    setChatHistory(allChatHistory);

    // setTotalMessages(totalMessageCount)
    // setChatHistory(chatHistory);
    // setOffset(LIMIT_VALUE)
  };

  useEffect(() => {
    loadInitialChatHistory();
  }, [problemName]);

  const sendMessagetoAI = async () => {
    if (!openAiApiKey)
      return { success: undefined, error: new Error("No API Key found") };

    let programmingLanguage = "UNKNOWN";

    const changeLanguageButton = document.querySelector(
      "button.rounded.items-center.whitespace-nowrap.inline-flex.bg-transparent.dark\\:bg-dark-transparent.text-text-secondary.group"
    );
    if (changeLanguageButton) {
      if (changeLanguageButton.textContent)
        programmingLanguage = changeLanguageButton.textContent;
    }
    const userCurrentCodeContainer = document.querySelectorAll(".view-line");
    const metaDescriptionEl = document.querySelector("meta[name=description]");
    const problemStatement = metaDescriptionEl?.getAttribute(
      "content"
    ) as string;

    const extractedCode = extractCode(userCurrentCodeContainer);

    const systemPromptModified = SYSTEM_PROMPT.replace(
      /{{problem_statement}}/gi,
      problemStatement
    )
      .replace(/{{programming_language}}/g, programmingLanguage)
      .replace(/{{user_code}}/g, extractedCode);

    const PCH = parseChatHistory(chatHistory);

    return askAI({
      prompt: `${inputMessage}`,
      systemPrompt: systemPromptModified,
      messages: PCH,
      extractedCode: extractedCode,
      apiKey: openAiApiKey,
    });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!openAiApiKey) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Please set up your OpenAI API key in the extension popup.",
        },
      ]);
      return;
    }

    setIsResponseLoading(true);
    const newMessage: ChatHistory = { role: "user", content: inputMessage };
    setChatHistory([...chatHistory, newMessage]);
    setInputMessage("");

    const { success, error } = await sendMessagetoAI();
    if (error) {
      const errorMessage: ChatHistory = {
        role: "assistant",
        content: error.message,
      };
      await saveChatHistory(problemName, [
        ...chatHistory,
        { role: "user", content: inputMessage },
        errorMessage,
      ]);
      // setPreviousChatHistory((prev) => [...prev, errorMessage]);
      setChatHistory((prev) => {
        const updatedChatHistory: ChatHistory[] = [...prev, errorMessage];
        return updatedChatHistory;
      });
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    if (success) {
      const res: ChatHistory = {
        role: "assistant",
        content: success,
      };
      await saveChatHistory(problemName, [
        ...chatHistory,
        { role: "user", content: inputMessage },
        res,
      ]);
      // setPreviousChatHistory((prev) => [...prev, res]);
      setChatHistory((prev) => [...prev, res]);

      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    setIsResponseLoading(false);
    setIsResponseLoading(false);
    setTimeout(() => {
      messagesEndRef.current?.focus();
    }, 0);
    //
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Chat Button */}
      <BubbleButton isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 bg-white border rounded-lg shadow-xl">
          {/* header */}
          <div className="flex justify-between items-center bg-blue-50 px-4 py-2 rounded-t-lg border-b">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-800 capitalize">
                {problemName}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="h-96 overflow-y-auto p-4 space-y-3">
            {!openAiApiKey && <NoKeyFoundAlert />}
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`
                    p-2 rounded-lg max-w-[80%]
                    ${
                      message.role === "user"
                        ? "bg-blue-50 text-blue-800 border border-blue-500 self-end ml-auto"
                        : "bg-stone-300 border shadow-sm text-gray-800 self-start"
                    }
                  `}
              >
                <p className="max-w-80">
                  {typeof message.content === "string"
                    ? message.content
                    : message.content.feedback}
                </p>
                {!(typeof message.content === "string") && (
                  <div>
                    <ul className="space-y-4">
                      {message.content?.hints?.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                    {message.content?.snippet && (
                      <div className="max-w-80">
                        <span>Code 🧑🏻‍💻</span>

                        <div className="mt-4 rounded-md">
                          <div className="relative">
                            <Copy
                              onClick={() => {
                                if (typeof message.content !== "string")
                                  navigator.clipboard.writeText(
                                    `${message.content?.snippet}`
                                  );
                              }}
                              className="absolute right-2 top-2 h-4 w-4 z-10 text-yellow-100 cursor-pointer"
                            />
                            <Highlight
                              theme={themes.github}
                              code={message.content?.snippet || ""}
                              language={
                                message.content?.programmingLanguage?.toLowerCase() ||
                                "javascript"
                              }
                            >
                              {({
                                className,
                                style,
                                tokens,
                                getLineProps,
                                getTokenProps,
                              }) => (
                                <pre
                                  style={style}
                                  className={`p-3 rounded-md ${className}`}
                                >
                                  {tokens.map((line, i) => (
                                    <div key={i} {...getLineProps({ line })}>
                                      {line.map((token, key) => (
                                        <span
                                          key={key}
                                          {...getTokenProps({ token })}
                                        />
                                      ))}
                                    </div>
                                  ))}
                                </pre>
                              )}
                            </Highlight>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isResponseLoading && (
              <div className={"flex w-max max-w-[75%] flex-col my-2"}>
                <div className="w-5 h-5 rounded-full animate-pulse bg-primary"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex p-4 border-t gap-1">
            <input
              type="text"
              disabled={!openAiApiKey || isResponseLoading}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask about the LeetCode problem..."
              className="flex-grow p-2 
              border rounded-l-lg 
              focus:outline-none focus:ring-1 focus:ring-blue-500
              disabled:bg-slate-300"
              ref={inputFieldRef}
            />
            <button
              onClick={handleSendMessage}
              disabled={!openAiApiKey || isResponseLoading}
              className="bg-blue-500 disabled:bg-slate-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
