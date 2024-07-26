"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { HeroColumn, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { ApiList } from "@/components/api-list";

interface HeroClientProps {
  data: HeroColumn[];
}

export const HeroClient: React.FC<HeroClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Heroes (${data.length})`}
          description="Manage heroes for your site"
        />
        <Button onClick={() => router.push(`/${params.siteId}/heroes/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable columns={columns} data={data} searchKey="label" />

      <Heading title="API" description="API calls for Heroes" />
      <Separator />
      <ApiList entityName="heroes" entityIdName="heroId" />
    </>
  );
};
