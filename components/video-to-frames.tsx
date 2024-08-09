"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { Loader2, Upload, Play } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { marked } from "marked";

const renderMarkdown = (markdown: string) => {
  return marked(markdown);
};

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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
    setLoadingProgress(0);

    // Start the loading progress animation
    startLoadingAnimation();

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
      stopLoadingAnimation();
      setLoadingProgress(100); // Ensure the progress bar reaches 100% when done
    }
  };

  const startLoadingAnimation = () => {
    if (loadingIntervalRef.current) return;

    loadingIntervalRef.current = setInterval(() => {
      setLoadingProgress((prevProgress) => {
        if (prevProgress >= 90) {
          return prevProgress; // Stop at 90% and wait for the API call to complete
        }
        // Gradually slow down the progress
        const increment = Math.max(0.5, 10 * (1 - prevProgress / 100));
        return Math.min(90, prevProgress + increment);
      });
    }, 200);
  };

  const stopLoadingAnimation = () => {
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
      loadingIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopLoadingAnimation();
    };
  }, []);

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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add swing video</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  MP4, MOV, or AVI (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept="video/*"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </div>
          {isUploading && (
            <p className="mt-4 text-center">Uploading video...</p>
          )}
        </CardContent>
      </Card>

      {videoSrc && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="aspect-w-16 aspect-h-9">
              <video
                ref={videoRef}
                src={videoSrc}
                controls
                crossOrigin="anonymous"
                className="w-full h-full object-contain"
                onLoadedData={() => {
                  console.log("Video loaded");
                  setIsVideoReady(true);
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex justify-center">
        <Button
          onClick={processVideo}
          disabled={isProcessing || !videoSrc || !isVideoReady}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </div>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Analyze Swing
            </>
          )}
        </Button>
      </div>

      {isLoading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p className="text-center mt-2">
            Analyzing your swing... {Math.round(loadingProgress)}%
          </p>
        </div>
      )}

      {!isLoading && analysisResult && audioSrc && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Swing Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <audio controls src={audioSrc} className="w-full">
                Your browser does not support the audio element.
              </audio>
            </div>
            <div
              className="prose-golf max-w-none"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(analysisResult),
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoToFrames;
