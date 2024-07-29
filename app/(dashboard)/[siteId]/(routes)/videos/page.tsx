import prismadb from "@/lib/prismadb";
import { VideoClient } from "./components/client";
import { VideoColumn } from "./components/columns";
import { format } from "date-fns";

const VideosPage = async ({ params }: { params: { siteId: string } }) => {
  const videos = await prismadb.video.findMany({
    where: {
      siteId: params.siteId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedVideos: VideoColumn[] = videos.map((item) => ({
    id: item.id,
    title: item.title,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <VideoClient data={formattedVideos} />
      </div>
    </div>
  );
};

export default VideosPage;
