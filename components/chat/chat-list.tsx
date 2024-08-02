"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Conversation } from "@prisma/client"; // Make sure to import the Conversation type
import axios from "axios";
import { useParams } from "next/navigation";

interface ChatListProps {
  isChatListOpen: boolean;
}

export const ChatList: React.FC<ChatListProps> = ({ isChatListOpen }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();

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

  return (
    <div className="overflow-y-scroll py-2">
      <ul>
        {conversations.map((conversation) => (
          <li key={conversation.id} className="px-2 py-2">
            {conversation.title || "Untitled"}
          </li>
        ))}
      </ul>
    </div>
  );
};
