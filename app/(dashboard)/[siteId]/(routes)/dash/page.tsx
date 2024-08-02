// app/customers/[id]/page.tsx

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import {
  Phone,
  Mail,
  Bell,
  MessageSquare,
  Plus,
  Download,
  MoreHorizontal,
} from "lucide-react";
import ChatInterface from "@/components/chat/chat-interface";
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
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 p-4 border-r">
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
        {/* Add other sidebar elements */}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </Button>
          <Button>Add New Ticket</Button>
        </div>

        <ChatInterface user={user} />
      </main>
    </div>
  );
}
