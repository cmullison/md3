import VideoToFrames from "@/components/video-to-frames";

const VideoProcessingPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl text-center font-bold mb-2">
        Biddeman: AI Golf Coach
      </h1>
      <div className="text-center mb-6">
        <a
          href="/morikawa-slomo.mov"
          className="text-blue-500 hover:text-blue-700 underline text-sm"
          download
        >
          Download example video
        </a>
      </div>
      <VideoToFrames frameInterval={250} /> {/* Capture a frame every second */}
    </div>
  );
};

export default VideoProcessingPage;
