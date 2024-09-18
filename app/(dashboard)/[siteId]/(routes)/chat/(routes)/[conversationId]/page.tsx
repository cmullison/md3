"use client";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { User } from "@supabase/supabase-js";
import AuthButtonClient from "@/components/nav/auth-button-client";
import { useProfile } from "@/providers/profile-provider";
import SavedChats from "@/components/chat/saved-conversation";
import prismadb from "@/lib/prismadb";

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

export default function Page() {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const params = useParams();
  const profile = useProfile();

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

  useEffect(() => {
    const fetchConversation = async () => {
      if (params.conversationId) {
        try {
          const response = await fetch(
            `/api/conversation/${params.conversationId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch conversation");
          }
          const data = await response.json();
          setConversation(data);
        } catch (error) {
          console.error("Error fetching conversation:", error);
        }
      }
    };

    fetchConversation();
  }, [params.conversationId]);

  // ... (rest of the component remains the same)

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Desktop Sidebar */}

      {/* Main content */}
      <main className="flex-1 p-2 overflow-auto lg:p-2">
        <div className="flex justify-between items-center"></div>

        {conversation && <SavedChats conversation={conversation} />}
      </main>
    </div>
  );
}
