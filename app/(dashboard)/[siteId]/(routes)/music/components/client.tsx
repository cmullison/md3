"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SongColumn, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { ApiList } from "@/components/api-list";

interface SongsClientProps {
  data: SongColumn[];
}

export const SongsClient: React.FC<SongsClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
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

      <Heading title="API" description="API calls for songs" />
      <Separator />
      <ApiList entityName="songs" entityIdName="songsId" />
    </>
  );
};
