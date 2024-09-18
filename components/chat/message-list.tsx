import React from "react";
import { ComponentPropsWithoutRef } from "react";
import CodeBlock from "./code-block";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useProfile } from "@/providers/profile-provider";
import { redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ComponentProps } from "react";
import TempImageDisplay from "./temp-image-display";
import Image from "next/image";

interface Message {
  text: string;
  sender: "user" | "claude";
  tokenCount?: number;
  cost?: number | string;
  image?: string;
  tempImage?: string;
}

interface MessageListProps {
  messages: Message[];
  onDeleteTempImage: () => void;
}

export default function MessageList({
  messages,
  onDeleteTempImage,
}: MessageListProps) {
  const profile = useProfile();

  if (!profile) {
    return redirect("/login");
  }

  const renderMessageContent = (content: string) => {
    const components: Partial<
      ComponentProps<typeof ReactMarkdown>["components"]
    > = {
      code({
        inline,
        className,
        children,
        ...props
      }: ComponentPropsWithoutRef<"code"> & { inline?: boolean }) {
        const match = /language-(\w+)/.exec(className || "");
        return !inline && match ? (
          <CodeBlock
            code={String(children).replace(/\n$/, "")}
            language={match[1]}
          />
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
    };

    return <ReactMarkdown components={components}>{content}</ReactMarkdown>;
  };

  const renderTokenInfo = (message: Message) => {
    if (message.tokenCount !== undefined && message.cost !== undefined) {
      const formattedCost =
        typeof message.cost === "number"
          ? message.cost.toFixed(4)
          : message.cost.toString();

      return (
        <div className="token-info text-xs text-gray-500 mt-2">
          Tokens: {message.tokenCount} | Cost: ${formattedCost}
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
    <div className="flex-1 overflow-auto p-2 sm:p-4">
      <div className="flex flex-col gap-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 sm:gap-4 ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <Avatar
              className={`w-6 h-6 sm:w-8 sm:h-8 border flex-shrink-0 ${
                message.sender === "user" ? "hidden" : ""
              }`}
            >
              <AvatarFallback className="text-xs sm:text-sm p-1">
                CL
              </AvatarFallback>
            </Avatar>
            <div
              className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 ${
                message.sender === "user"
                  ? "bg-primary/60 text-foreground"
                  : "bg-secondary text-foreground"
              }`}
            >
              <div className="text-xs p-2 sm:text-sm prose prose-sm dark:prose-invert max-w-none [&>*]:text-inherit">
                {renderMessageContent(message.text)}
              </div>
              {message.tempImage && (
                <TempImageDisplay
                  imageUrl={message.tempImage}
                  onDelete={onDeleteTempImage}
                />
              )}
              {message.image && (
                <Image
                  src={message.image}
                  alt="Uploaded image"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              )}
              <div
                className={`${
                  message.sender === "user"
                    ? ""
                    : "mt-1 sm:mt-2 text-xs opacity-70"
                }`}
              >
                {renderTokenInfo(message)}
              </div>
            </div>
            <Avatar
              className={`w-6 h-6 sm:w-8 sm:h-8 border flex-shrink-0 ${
                message.sender === "user" ? "" : "hidden"
              }`}
            >
              <AvatarFallback className="text-xs sm:text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        ))}
      </div>
    </div>
  );
}
