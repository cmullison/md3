import VideoToFrames from "@/components/video-to-frames";
import Link from "next/link";

const VideoProcessingPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl text-center font-bold mb-4">
        Biddeman: AI Golf Coach
      </h1>
      <p className="text-center mb-4">
        Try it out by saving{" "}
        <a
          href="https://hephebyszkkaamlckwjm.supabase.co/storage/v1/object/public/videos/videos/morikawa-slomo.mov"
          className="text-blue-500 hover:underline"
          download="example-golf-swing.mov"
        >
          this video
        </a>{" "}
        and uploading it below.
      </p>
      <VideoToFrames frameInterval={250} /> {/* Capture a frame every second */}
    </div>
  );
};

export default VideoProcessingPage;
