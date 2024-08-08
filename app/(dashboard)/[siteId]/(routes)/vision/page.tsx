import VideoToFrames from "@/components/video-to-frames";

const VideoProcessingPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Video Frame Splitter</h1>
      <VideoToFrames frameInterval={250} /> {/* Capture a frame every second */}
    </div>
  );
};

export default VideoProcessingPage;
