"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { PageColumn, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { ApiList } from "@/components/api-list";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface PageClientProps {
  data: PageColumn[];
}

export const PageClient: React.FC<PageClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [isApiListOpen, setIsApiListOpen] = useState(false);
  return (
    <>
      <div className="space-y-6 p-2">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
          <Heading
            title={`Pages (${data.length})`}
            description="Manage pages for your site"
          />
          <Button onClick={() => router.push(`/${params.siteId}/pages/new`)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
        <Separator />

        <DataTable columns={columns} data={data} searchKey="name" />

        <div className="flex justify-between items-center">
          <Heading title="API" description="API calls for pages" />
          <Sheet open={isApiListOpen} onOpenChange={setIsApiListOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">View API</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>API List</SheetTitle>
              </SheetHeader>
              <ApiList entityName="pages" entityIdName="pageId" />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};
