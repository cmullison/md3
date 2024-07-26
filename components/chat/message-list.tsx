import React from "react";
import CodeBlock from "./code-block";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useProfile } from "@/providers/profile-provider";
import { redirect } from "next/navigation";

interface Message {
  text: string;
  sender: "user" | "claude";
  tokenCount?: number;
  cost?: number;
}

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const profile = useProfile();

  if (!profile) {
    return redirect("/login");
  }

  const renderMessageContent = (content: string | React.ReactNode) => {
    if (typeof content !== "string") return content;

    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before the code block
      if (match.index > lastIndex) {
        parts.push(
          <span key={lastIndex}>{content.slice(lastIndex, match.index)}</span>
        );
      }

      // Add the code block
      const [, language, code] = match;
      parts.push(
        <CodeBlock
          key={match.index}
          code={code.trim()}
          language={language || "plaintext"}
        />
      );

      lastIndex = match.index + match[0].length;
    }

    // Add any remaining text after the last code block
    if (lastIndex < content.length) {
      parts.push(<span key={lastIndex}>{content.slice(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : <span>{content}</span>;
  };

  const renderTokenInfo = (message: Message) => {
    if (message.tokenCount && message.cost) {
      return (
        <div className="token-info">
          Tokens: {message.tokenCount} | Cost: ${message.cost}
        </div>
      );
    }
    return null;
  };

  function getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  }

  const initials = getInitials(profile.first_name, profile.last_name);

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="grid gap-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <Avatar
              className={`w-8 h-8 border ${
                message.sender === "user" ? "hidden" : ""
              }`}
            >
              <AvatarFallback>CL</AvatarFallback>
            </Avatar>
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              <div className="text-sm">
                {renderMessageContent(message.text)}
              </div>
              <div
                className={`${
                  message.sender === "user" ? "" : "mt-2 text-xs opacity-70"
                }`}
              >
                {renderTokenInfo(message)}
              </div>
            </div>
            <Avatar
              className={`w-8 h-8 border ${
                message.sender === "user" ? "" : "hidden"
              }`}
            >
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </div>
        ))}
      </div>
    </div>
  );
}
