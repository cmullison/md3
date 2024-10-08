import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { Menu, MessageSquare, PlusCircle } from "lucide-react";
import { ChatList } from "./chat-list";
import { Button } from "../ui/button";
import { updateTitle } from "@/app/actions";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import AuthButtonClient from "../nav/auth-button-client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
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

export default function SavedChats({ conversation }: SavedChatsProps) {
  const profile = useProfile();
  const params = useParams();
  const router = useRouter();
  const [conversationTitle, setConversationTitle] = useState(
    conversation?.title || "New Conversation"
  );
  const [debouncedTitle, setDebouncedTitle] = useState(conversationTitle);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [isChatListOpen, setIsChatListOpen] = useState(false);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  if (!profile) {
    redirect("/login");
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
  const Sidebar = () => (
    <div className="h-full p-2">
      <div className="flex items-center space-x-2 mb-6">
        <AuthButtonClient variant="sidebar" />
        <div>
          <h2 className="font-semibold">
            {profile?.first_name} {profile?.last_name}
          </h2>
          <p className="text-sm text-muted-foreground">{profile?.email}</p>
        </div>
      </div>
      <Input className="mb-4" placeholder="Search" />
      <ScrollArea className="h-[calc(100vh-200px)]">
        <nav className="space-y-2">
          {[
            "Dashboard",
            "Inbox",
            "Notification",
            "Ticket",
            "Knowledge Base",
            "Customer",
            "Forum",
            "Report",
          ].map((item) => (
            <Button key={item} variant="ghost" className="w-full justify-start">
              {item}
            </Button>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
  const initials = getInitials(profile.first_name, profile.last_name);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateTitle = useCallback(
    debounce(async (id: string, title: string) => {
      const result = await updateTitle(id, title);
      if (!result.success) {
        toast.error(result.message || "Failed to update title");
      }
    }, 1000),
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTitle(conversationTitle);
    }, 900); // Adjust this delay as needed

    return () => clearTimeout(timer);
  }, [conversationTitle]);

  useEffect(() => {
    if (conversation?.id && debouncedTitle !== conversation.title) {
      debouncedUpdateTitle(conversation.id, debouncedTitle);
    }
  }, [
    debouncedTitle,
    conversation?.id,
    conversation?.title,
    debouncedUpdateTitle,
  ]);

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
            onClick={() => router.push(`/${params.siteId}/chat`)}
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">New Chat</span>
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
                    ? "bg-primary/60 text-foreground"
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
