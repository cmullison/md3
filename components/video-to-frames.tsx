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
  const [isLoading, setIsLoading] = useState(false);

  const captureFrame = (): string | null => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const aspectRatio = video.videoWidth / video.videoHeight;

      const maxWidth = 800;
      const width = Math.min(video.videoWidth, maxWidth);
      const height = width / aspectRatio;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        const frameDataUrl = canvas.toDataURL("image/jpeg");
        const base64Data = frameDataUrl.split(",")[1];
        console.log("Frame captured at time:", video.currentTime);
        return base64Data;
      }
    }
    return null;
  };

  const processVideo = async () => {
    if (videoRef.current && isVideoReady) {
      console.log("Starting video processing");
      const video = videoRef.current;
      const duration = video.duration;
      let numberOfFrames = 10;

      const minFrameInterval = 0.5;
      if (duration < minFrameInterval * numberOfFrames) {
        numberOfFrames = Math.floor(duration / minFrameInterval);
      }

      const frameInterval = duration / (numberOfFrames - 1);
      const captureTimes = Array.from(
        { length: numberOfFrames },
        (_, i) => i * frameInterval
      );

      setIsProcessing(true);
      const capturedFrames: string[] = [];

      for (let i = 0; i < captureTimes.length; i++) {
        video.currentTime = captureTimes[i];
        await new Promise<void>((resolve) => {
          const handleTimeUpdate = () => {
            const frame = captureFrame();
            if (frame) {
              capturedFrames.push(frame);
              console.log(`Captured frame ${i + 1}/${captureTimes.length}`);
            }
            video.removeEventListener("timeupdate", handleTimeUpdate);
            resolve();
          };
          video.addEventListener("timeupdate", handleTimeUpdate);
        });
      }

      setFrames(capturedFrames);
      setIsProcessing(false);
      console.log(
        "Frame capture complete. Total frames:",
        capturedFrames.length
      );
      sendFramesForAnalysis(capturedFrames);
    } else {
      console.error("Video is not ready for processing");
    }
  };

  const sendFramesForAnalysis = async (capturedFrames: string[]) => {
    console.log("Sending frames for analysis:", capturedFrames.length);
    if (capturedFrames.length === 0) {
      console.error("No frames to analyze");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post("/api/analyze-frames", {
        frames: capturedFrames,
      });
      const feedback = response.data;
      if (feedback.result && feedback.result.content) {
        const audioUrl = await generateSpeech(feedback.result.content);
        setAnalysisResult(feedback.result.content);
        setAudioSrc(audioUrl);
      } else {
        setAnalysisResult("No description available");
      }
    } catch (error) {
      console.error("Error analyzing frames:", error);
      setAnalysisResult("Error occurred during analysis");
    } finally {
      setIsLoading(false);
    }
  };

  const generateSpeech = async (text: string): Promise<string> => {
    try {
      const response = await axios.post(
        "/api/generate-speech",
        { text },
        { responseType: "blob" }
      );
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error generating speech:", error);
      return "";
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
        disabled={isProcessing || !videoSrc || !isVideoReady}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? "Processing..." : "Analyze Swing"}
      </button>
      {isLoading && <p>Analyzing your swing...</p>}
      {!isLoading && analysisResult && audioSrc && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mt-6">Swing analysis</h2>
          <div className="my-6">
            <audio controls src={audioSrc} className="mt-2">
              Your browser does not support the audio element.
            </audio>
          </div>
          <div
            className="formatted-text"
            dangerouslySetInnerHTML={{
              __html: analysisResult
                .replace(
                  /###\s*(.*)/g,
                  '<h3 class="text-lg mt-6 font-semibold">$1</h3>'
                )
                .replace(/\n/g, '<p class="mt-2"></p>'),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default VideoToFrames;
