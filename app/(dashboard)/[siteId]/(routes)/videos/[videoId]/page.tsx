import prismadb from "@/lib/prismadb";
import { VideoForm } from "./components/video-form";

const VideoPage = async ({
  params,
}: {
  params: { videoId: string; siteId: string };
}) => {
  const video = await prismadb.video.findUnique({
    where: {
      id: params.videoId,
      // id: params.siteId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <VideoForm initialData={video} />
      </div>
    </div>
  );
};

export default VideoPage;
