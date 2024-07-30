"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SongColumn, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { ApiList } from "@/components/api-list";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

interface SongsClientProps {
  data: SongColumn[];
}

export const SongsClient: React.FC<SongsClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [isApiListOpen, setIsApiListOpen] = useState(false);
  return (
    <>
      <div className="space-y-6 p-2">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
          <Heading
            title={`Songs (${data.length})`}
            description="Manage songs for your site"
          />
          <Button onClick={() => router.push(`/${params.siteId}/music/new`)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
        <Separator />

        <DataTable columns={columns} data={data} searchKey="name" />

        <div className="flex justify-between items-center">
          <Heading title="API" description="API calls for music" />
          <Sheet open={isApiListOpen} onOpenChange={setIsApiListOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">View API</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>API List</SheetTitle>
              </SheetHeader>
              <ApiList entityName="music" entityIdName="songId" />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};
