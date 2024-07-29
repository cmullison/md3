"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { VideoColumn, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { ApiList } from "@/components/api-list";

interface VideoClientProps {
  data: VideoColumn[];
}

export const VideoClient: React.FC<VideoClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Videos (${data.length})`}
          description="Manage videos for your site"
        />
        <Button onClick={() => router.push(`/${params.siteId}/videos/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable columns={columns} data={data} searchKey="title" />

      <Heading title="API" description="API calls for videos" />
      <Separator />
      <ApiList entityName="videos" entityIdName="videosId" />
    </>
  );
};
