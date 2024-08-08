"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

interface VideoToFramesProps {
  frameInterval: number; // Interval in milliseconds between frame captures
}

const VideoToFrames: React.FC<VideoToFramesProps> = ({ frameInterval }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); //
  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const aspectRatio = video.videoWidth / video.videoHeight;

      const maxWidth = 500;
      const width = Math.min(video.videoWidth, maxWidth);
      const height = width / aspectRatio;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        const frameDataUrl = canvas.toDataURL("image/jpeg");
        const base64Data = frameDataUrl.split(",")[1];
        setFrames((prevFrames) => [...prevFrames, base64Data]);
        console.log("Frame captured at time:", video.currentTime);
      }
    }
  };

  const processVideo = () => {
    if (videoRef.current && isVideoReady) {
      console.log("Starting video processing");
      setIsProcessing(true);
      setIsLoading(true);
      setFrames([]);
      videoRef.current.currentTime = 0;

      const captureInterval = frameInterval / 1000;

      const processFrame = () => {
        if (
          videoRef.current &&
          videoRef.current.currentTime < videoRef.current.duration
        ) {
          captureFrame();
          videoRef.current.currentTime += captureInterval;
          setTimeout(processFrame, frameInterval);
        } else {
          setIsProcessing(false);
          console.log("Video processing ended");
          sendFramesForAnalysis();
        }
      };

      videoRef.current.play();
      processFrame();
    } else {
      console.error("Video is not ready for processing");
    }
  };

  const sendFramesForAnalysis = async () => {
    try {
      const responsea = await axios.post("/api/analyze-frames", { frames });
      // Extract the 'content' from the response
      const feedback = responsea.data;
      if (feedback.result && feedback.result.content) {
        setAnalysisResult(feedback.result.content);
        setIsLoading(true);
        generateSpeech(feedback.result.content);
        setIsLoading(false);
      } else {
        setAnalysisResult("No description available");
      }
    } catch (error) {
      console.error("Error analyzing frames:", error);
      setAnalysisResult("Error occurred during analysis");
    }
  };
  const generateSpeech = async (text: string) => {
    try {
      const responseb = await axios.post("/api/generate-speech", { text });
      setAudioSrc(responseb.data.audioUrl);
    } catch (error) {
      console.error("Error generating speech:", error);
    }
  };
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setIsVideoReady(false);

    try {
      const fileURL = URL.createObjectURL(file);
      setVideoSrc(fileURL);
      console.log("Video uploaded successfully:", fileURL);
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      setIsProcessing(false);
      if (videoRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        videoRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <input
        type="file"
        accept="video/*"
        onChange={handleFileUpload}
        disabled={isUploading}
        className="mb-4"
      />
      {isUploading && <p>Uploading video...</p>}
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          controls
          crossOrigin="anonymous"
          className="w-full max-w-2xl mx-auto mb-4"
          onLoadedData={() => {
            console.log("Video loaded");
            setIsVideoReady(true);
          }}
        />
      )}
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={processVideo}
        disabled={isProcessing || !videoSrc || !isVideoReady || isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? "Processing..." : "Split Video into Frames"}
      </button>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {frames.map((frame, index) => (
          <Image
            key={index}
            src={`data:image/jpeg;base64,${frame}`}
            alt={`Frame ${index}`}
            width={0}
            height={0}
            className="w-full h-auto"
          />
        ))}
      </div>
      {isLoading && <p>Checking out your swing...</p>}
      {analysisResult && (
        <div className={isLoading ? "hidden" : "mt-4"}>
          <h2 className="text-xl font-bold mt-6">Swing analysis</h2>
          {audioSrc && (
            <div className="my-6">
              <audio controls src={audioSrc} className="mt-2">
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          <div
            className="formatted-text"
            dangerouslySetInnerHTML={{
              __html: analysisResult
                .replace(
                  /###\s*(.*)/g,
                  '<h3 class="text-lg mt-6 font-semibold">$1</h3>'
                ) // Replace ### with <h3> tags
                .replace(/\n/g, '<p class="mt-2"></p>'), // Replace newlines with <p> tags for paragraphs
            }}
          />
        </div>
      )}
    </div>
  );
};

export default VideoToFrames;
