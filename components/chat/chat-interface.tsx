"use client";

import { useState, useRef, useEffect } from "react";
import MessageList from "./message-list";
import MessageInput from "./message-input";
import TypingIndicator from "./typing-indicator";
import { Button } from "../ui/button";
import { MessageCircleIcon } from "lucide-react";
import EmptyChatState from "./empty-chat";

interface Message {
  text: string;
  sender: "user" | "claude";
  tokenCount?: number;
  cost?: number;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const [isClaudeTyping, setIsClaudeTyping] = useState(false);

  const sendMessage = async (message: string) => {
    setMessages([...messages, { text: message, sender: "user" }]);
    setIsClaudeTyping(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const formattedReply = formatCodeBlocks(data.reply);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: formattedReply,
          sender: "claude",
          tokenCount: data.tokenCount,
          cost: data.cost,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsClaudeTyping(false);
    }
  };

  useEffect(() => {
    if (isClaudeTyping && typingIndicatorRef.current) {
      typingIndicatorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isClaudeTyping]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-background text-foreground py-2 px-4 flex items-center justify-center">
        <div className="text-lg font-bold"></div>
        <Button variant="ghost" size="icon" className="hidden rounded-full">
          <MessageCircleIcon className="w-6 h-6" />
          <span className="sr-only">Open chat</span>
        </Button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <EmptyChatState />
            </div>
          ) : (
            <MessageList messages={messages} />
          )}
          <div
            ref={typingIndicatorRef}
            className={`${isClaudeTyping ? "p-4" : "hidden"}`}
          >
            <TypingIndicator />
          </div>

          <div className="sticky bottom-0 bg-background">
            <MessageInput onSendMessage={sendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatCodeBlocks(text: string): string {
  return text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || "plaintext";
    return `\n\`\`\`${language}\n${code.trim()}\n\`\`\`\n`;
  });
}
