"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import MessageList from "./message-list";
import MessageInput from "./message-input";
import TypingIndicator from "./typing-indicator";
import { Button } from "../ui/button";
import { Save, MessageSquare } from "lucide-react";
import EmptyChatState from "./empty-chat";
import { useParams } from "next/navigation";
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
import ImageUpload from "./image-upload";
import TempImageDisplay from "./temp-image-display";
import { debounce } from "lodash";
import { updateTitle } from "@/app/actions";

interface Message {
  text: string;
  sender: "user" | "claude";
  tokenCount?: number;
  cost?: number;
  image?: string;
  tempImage?: string;
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
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [tempImage, setTempImage] = useState<string | undefined>(undefined);
  const [conversationTitle, setConversationTitle] =
    useState("New Conversation");
  const [debouncedTitle, setDebouncedTitle] = useState(conversationTitle);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateTitle = useCallback(
    debounce(async (id: string, title: string) => {
      const result = await updateTitle(id, title);
      if (!result.success) {
        toast.error(result.message || "Failed to update title");
      }
    }, 2000),
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTitle(conversationTitle);
    }, 1900);

    return () => clearTimeout(timer);
  }, [conversationTitle]);

  useEffect(() => {
    if (params.conversationId && debouncedTitle !== conversationTitle) {
      debouncedUpdateTitle(params.conversationId as string, debouncedTitle);
    }
  }, [
    debouncedTitle,
    params.conversationId,
    conversationTitle,
    debouncedUpdateTitle,
  ]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  const sendMessage = async (message: string) => {
    const newMessage: Message = {
      text: message,
      sender: "user",
      image: tempImage,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsClaudeTyping(true);
    setTempImage(undefined);

    try {
      const response = await fetch(`/api/${params.siteId}/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          imageUrl: tempImage,
        }),
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
          sender: "claude" as const,
          tokenCount: data.tokenCount,
          cost: Number(data.cost),
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to send message");
    } finally {
      setIsClaudeTyping(false);
      setTempImage(undefined);
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
      { userId, title, messages }
    );

    if (!response.data) {
      throw new Error("Failed to save conversation");
    }

    return response.data;
  }

  const handleImageUpload = (imageUrl: string) => {
    setTempImage(imageUrl);
  };

  const handleDeleteTempImage = () => {
    setTempImage(undefined);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConversationTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      setIsEditingTitle(false);
    }
  };
  return (
    <>
      <div className="flex flex-col">
        <div className="bg-background text-foreground py-2 px-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
            onClick={() => {
              if (user && user.id) {
                saveConversation(user.id, conversationTitle, messages)
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
            <span className="hidden sm:inline">Save</span>
          </Button>

          <div className="flex-1 text-center px-4">
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                value={conversationTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="bg-transparent border-none text-center focus:outline-none"
              />
            ) : (
              <h2
                onClick={() => setIsEditingTitle(true)}
                className="cursor-pointer hover:underline"
              >
                {conversationTitle}
              </h2>
            )}
          </div>

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

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyChatState />
            </div>
          ) : (
            <MessageList
              messages={messages}
              onDeleteTempImage={handleDeleteTempImage}
            />
          )}
          <div
            ref={typingIndicatorRef}
            className={`${isClaudeTyping ? "p-4" : "hidden"}`}
          >
            <TypingIndicator />
          </div>
          {tempImage && (
            <div className="flex justify-end mt-2">
              <TempImageDisplay
                imageUrl={tempImage}
                onDelete={handleDeleteTempImage}
                width={150}
                height={150}
              />
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-background border-t">
          <div className="max-w-3xl mx-auto px-4 py-2">
            <div className="flex items-center space-x-2">
              <ImageUpload onImageUpload={handleImageUpload} />
              <MessageInput onSendMessage={sendMessage} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
function formatCodeBlocks(text: string): string {
  return text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || "plaintext";
    return `\n\`\`\`${language}\n${code.trim()}\n\`\`\`\n`;
  });
}
