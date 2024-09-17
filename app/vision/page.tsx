import VideoToFrames from "@/components/video-to-frames";

const VideoProcessingPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl text-center font-bold mb-4">
        Biddeman: AI Golf Coach
      </h1>
      <VideoToFrames frameInterval={250} /> {/* Capture a frame every second */}
    </div>
  );
};

export default VideoProcessingPage;
