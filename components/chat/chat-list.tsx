"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Conversation } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Assuming you're using shadcn-ui

interface ChatListProps {
  isChatListOpen: boolean;
}

export const ChatList: React.FC<ChatListProps> = ({ isChatListOpen }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchConversations = async () => {
      if (!isChatListOpen) return;

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        try {
          const response = await fetch(
            `/api/${params.siteId}/chat/conversations/`
          );

          const chats = await response.json();
          setConversations(chats);
        } catch (error) {
          console.error("Failed to fetch conversations:", error);
        }
      }

      setLoading(false);
    };

    fetchConversations();
  }, [params.siteId, isChatListOpen]);

  if (!isChatListOpen) return null;

  if (loading) {
    return <p>Loading...</p>;
  }

  if (conversations.length === 0) {
    return <p>No conversations found.</p>;
  }

  const handleConversationClick = (conversationId: string) => {
    router.push(`/${params.siteId}/chat/${conversationId}`);
  };

  return (
    <div className="overflow-y-scroll py-2">
      <ul className="space-y-2">
        {conversations.map((conversation) => (
          <li key={conversation.id} className="px-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => handleConversationClick(conversation.id)}
            >
              {conversation.title || "Untitled"}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
