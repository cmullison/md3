"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Conversation } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { AlertModal } from "../modals/alert-modal";

interface ChatListProps {
  isChatListOpen: boolean;
}

export const ChatList: React.FC<ChatListProps> = ({ isChatListOpen }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deletingConversationId, setDeletingConversationId] = useState<
    string | null
  >(null);

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

  const onDelete = async () => {
    if (!deletingConversationId) return;

    try {
      setLoading(true);
      await axios.delete(`/api/conversation/${deletingConversationId}`);
      router.refresh();
      toast.success("Conversation deleted.");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
      setDeletingConversationId(null);
      router.push(`/${params.siteId}/chat`);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="overflow-y-scroll py-2">
        <ul className="space-y-2">
          {conversations.map((conversation) => (
            <li
              key={conversation.id}
              className="flex items-center justify-between w-full px-2"
            >
              <Button
                variant="ghost"
                className="flex-grow justify-start text-left"
                onClick={() => handleConversationClick(conversation.id)}
              >
                {conversation.title || "Untitled"}
              </Button>
              <Button
                variant="ghost"
                className="p-2"
                onClick={() => {
                  setDeletingConversationId(conversation.id);
                  setOpen(true);
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
