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

export default function CustomerPage() {
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

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/avatar.jpg" alt="Santi Cazorla" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">Santi Cazorla</CardTitle>
                <Badge>Microsoft</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Button size="icon" variant="outline">
                <Phone className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline">
                <Mail className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline">
                <Bell className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Customer Details</h3>
                <div className="space-y-2">
                  <div>
                    <Label>Source</Label>
                    <p>Contact us form</p>
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <div className="flex items-center">
                      <p>(209) 555-0104</p>
                      <Button size="icon" variant="ghost">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {/* Add other customer details */}
                </div>
              </div>

              <div>
                <Tabs defaultValue="activity">
                  <TabsList>
                    <TabsTrigger value="ticket">Ticket</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="attachment">Attachment</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="activity">
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold">Today</h4>
                          <div className="ml-4 space-y-2">
                            <p className="text-sm">
                              Ticket Created by Fikti Studio for Santi Cazorla •
                              11:12 AM- May 17, 2023
                            </p>
                            <p className="text-sm">
                              Santi Cazorla was created by Fikri Studio • 11:12
                              AM- May 17, 2023
                            </p>
                          </div>
                        </div>
                        {/* Add other activity sections */}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
