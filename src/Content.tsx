import "./index.css";

import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import ChatBubble from "./components/ChatBubble";
const root = document.createElement("div");
root.id = "__leetcode_ai_whisper_container";
document.body.append(root);

createRoot(root).render(
  <StrictMode>
    <ChatBubble />
  </StrictMode>
);
