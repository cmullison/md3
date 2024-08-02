"use client";

import { useState, useRef, useEffect } from "react";
import MessageList from "./message-list";
import MessageInput from "./message-input";
import TypingIndicator from "./typing-indicator";
import { Button } from "../ui/button";
import {
  AlertCircle,
  Check,
  MessageCircleIcon,
  MessageSquare,
  Save,
} from "lucide-react";
import EmptyChatState from "./empty-chat";
import { createClient } from "@/utils/supabase/client";
import { redirect, useParams } from "next/navigation";
import { useProfile } from "@/providers/profile-provider";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ChatList } from "./chat-list";

interface Message {
  text: string;
  sender: "user" | "claude";
  tokenCount?: number;
  cost?: number;
}

interface ChatInterfaceProps {
  user: { id: string };
}

export default function ChatInterface({ user }: ChatInterfaceProps) {
  const profile = useProfile();
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const params = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const typingIndicatorRef = useRef<HTMLDivElement | null>(null);
  const [isClaudeTyping, setIsClaudeTyping] = useState(false);

  const sendMessage = async (message: string) => {
    setMessages([...messages, { text: message, sender: "user" }]);
    setIsClaudeTyping(true);
    try {
      const response = await fetch("/api/[siteId]/chat/", {
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

  async function saveConversation(
    userId: string | undefined,
    title: string,
    messages: Message[]
  ) {
    if (!userId) {
      throw new Error("User ID is not available");
    }

    const response = await axios.post(
      `/api/${params.siteId}/chat/conversations/`,
      { userId, title, messages } // Send as an object, not stringified
    );

    if (!response.data) {
      throw new Error("Failed to save conversation");
    }

    return response.data;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-background text-foreground py-2 px-4 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
          onClick={() => {
            if (user && user.id) {
              saveConversation(user.id, "New Conversation", messages)
                .then((savedConversation) => {
                  toast.success("Conversation saved successfully");
                  console.log(
                    "Conversation saved successfully",
                    savedConversation
                  );
                })
                .catch((error) => {
                  toast.error("Failed to save conversation");
                  console.error("Failed to save conversation:", error);
                });
            } else {
              toast.error("User or user ID is not available");
              console.error("User or user ID is not available");
            }
          }}
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Save Conversation</span>
        </Button>
        <Sheet open={isChatListOpen} onOpenChange={setIsChatListOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Saved Chats</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-scroll">
            <SheetHeader>
              <SheetTitle>Saved conversations</SheetTitle>
            </SheetHeader>
            <ChatList isChatListOpen={isChatListOpen} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <EmptyChatState />
            </div>
          ) : (
            <MessageList
              messages={messages}
              onDeleteTempImage={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
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
