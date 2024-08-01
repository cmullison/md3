import ChatInterface from "@/components/chat/chat-interface";
import { useProfile } from "@/providers/profile-provider";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex flex-col h-screen w-full max-w-4xl mx-auto">
      <ChatInterface user={user} />
    </div>
  );
}
