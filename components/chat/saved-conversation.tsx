import React, { useState } from "react";
import { ComponentPropsWithoutRef } from "react";
import CodeBlock from "./code-block";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useProfile } from "@/providers/profile-provider";
import { redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ComponentProps } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { MessageSquare } from "lucide-react";
import { ChatList } from "./chat-list";
import { Button } from "../ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface SavedChatsProps {
  conversation: Conversation;
}

// ... (rest of the file remains the same)
export default function SavedChats({ conversation }: SavedChatsProps) {
  const profile = useProfile();

  const [isChatListOpen, setIsChatListOpen] = useState(false);

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

  function getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  }

  const initials = getInitials(profile.first_name, profile.last_name);

  return (
    <>
      <div className="flex flex-col">
        <div className="bg-background text-foreground py-2 px-4 flex items-center justify-between">
          <div></div>
          <Sheet open={isChatListOpen} onOpenChange={setIsChatListOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Chats</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Saved Conversations</SheetTitle>
              </SheetHeader>
              <ChatList isChatListOpen={isChatListOpen} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-2 sm:p-4">
        <div className="flex flex-col gap-4">
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 sm:gap-4 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <Avatar
                className={`w-6 h-6 sm:w-8 sm:h-8 border flex-shrink-0 ${
                  message.role === "user" ? "hidden" : ""
                }`}
              >
                <AvatarFallback className="text-xs sm:text-sm">
                  CL
                </AvatarFallback>
              </Avatar>
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <div className="text-xs sm:text-sm prose prose-sm dark:prose-invert max-w-none">
                  {renderMessageContent(message.content)}
                </div>
                <div className="mt-1 sm:mt-2 text-xs opacity-70">
                  {new Date(message.createdAt).toLocaleString()}
                </div>
              </div>
              <Avatar
                className={`w-6 h-6 sm:w-8 sm:h-8 border flex-shrink-0 ${
                  message.role === "user" ? "" : "hidden"
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
    </>
  );
}
