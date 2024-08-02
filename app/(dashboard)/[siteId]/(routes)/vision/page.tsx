"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import VisionInterface from "@/components/chat/vision-interface";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js"; // Import the User type

export default function Page() {
  const [user, setUser] = useState<User | null>(null); // Update the type here
  const router = useRouter();
  const supabase = createClient();

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
    <div className="h-full">
      <div className="flex items-center space-x-2 mb-6">
        <Avatar>
          <AvatarImage src="/logo.png" alt="Fikri Studio" />
          <AvatarFallback>FS</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">Fikri Studio</h2>
          <p className="text-sm text-muted-foreground">Agent Admin</p>
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
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden ml-4 mt-4">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 p-4 border-r bg-background">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 overflow-auto">
        <div className="flex justify-between items-center mb-6"></div>

        <VisionInterface user={user} />
      </main>
    </div>
  );
}
