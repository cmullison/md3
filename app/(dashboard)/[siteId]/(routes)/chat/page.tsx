"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import VisionInterface from "@/components/chat/chat-interface";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js"; // Import the User type
import AuthButtonClient from "@/components/nav/auth-button-client";
import { useProfile } from "@/providers/profile-provider";

export default function Page() {
  const [user, setUser] = useState<User | null>(null); // Update the type here
  const router = useRouter();
  const supabase = createClient();
  const profile = useProfile();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        router.push("/login");
      }
    };
    checkUser();
  }, [router, supabase.auth]);

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

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Sidebar */}

      {/* Main content */}
      <main className="flex-1 p-2 overflow-auto lg:p-4">
        <div className="flex justify-between items-center mb-6"></div>

        <VisionInterface user={user} />
      </main>
    </div>
  );
}
