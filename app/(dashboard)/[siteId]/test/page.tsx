import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";

const UserProfile: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row justify-between items-start mb-6">
        <div className="flex items-center mb-4 lg:mb-0">
          <Avatar className="h-20 w-20 mr-4">
            <AvatarImage src="/path-to-image.jpg" alt="Charlie Romance" />
            <AvatarFallback>CR</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Charlie Romance</h1>
            <Badge variant="secondary">Locked</Badge>
            <p className="text-sm text-gray-500">Active</p>
          </div>
        </div>
        <div className="space-x-2">
          <Button variant="outline">User object</Button>
          <Button variant="outline">Edit profile</Button>
          <Button variant="outline">...</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium text-gray-500">User ID</dt>
                  <dd>user_2c2KrMPNwm2XFNO8ZQNO8ZQnUIJuV</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Username</dt>
                  <dd>@charlie_r</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Phone number</dt>
                  <dd>+1 (555) 123-4567</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Email address</dt>
                  <dd>hello@personalemail.com</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Password</dt>
                  <dd>None</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">2-step auth</dt>
                  <dd>SMS code +1 (555) 123-4567</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Passkey</dt>
                  <dd>My mac, set on 15 Jun, 2024</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">User since</dt>
                  <dd>April 29, 2021</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Acme, Ltd</p>
                  <p className="text-sm text-gray-500">Admin</p>
                </div>
                <p className="text-sm text-gray-500">since 23 Jul, 2024</p>
              </div>
              <Button variant="outline" className="mt-4">
                + Add to organization
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium mb-2">Email addresses</h3>
              {/* Repeat this block for each email */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p>hi@company.dev</p>
                  <Badge variant="secondary" className="text-xs">
                    Primary
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  <p>used 3 hours ago</p>
                  <p>added 23 Jul, 2024</p>
                </div>
              </div>
              <Button variant="outline" className="mt-2">
                + Add email
              </Button>
              <h3 className="font-medium mt-6 mb-2">Phone numbers</h3>
              {/* Repeat this block for each phone number */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p>(+44) 141 556-9988</p>
                  <Badge variant="secondary" className="text-xs">
                    Primary
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  <p>used 14 days ago</p>
                  <p>added 23 Jul, 2024</p>
                </div>
              </div>
              <Button variant="outline" className="mt-2">
                + Add phone
              </Button>
              <h3 className="font-medium mt-6 mb-2">Social accounts</h3>
              {/* Repeat this block for each social account */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p>Facebook - @charlie_r</p>
                </div>
                <div className="text-sm text-gray-500">
                  <p>used 14 days ago</p>
                  <p>added 23 Jul, 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Web3 wallets</CardTitle>
            </CardHeader>
            <CardContent>
              <Button>Connect</Button>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>User activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="multiple"
                selected={[
                  new Date(2024, 0, 15),
                  new Date(2024, 0, 16),
                  // Add more dates as needed
                ]}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
