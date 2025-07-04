import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useClerkAuth } from "@/hooks/useClerkAuth";
import { useNavigate } from "react-router-dom";
import CounterPreview from "@/components/CounterPreview";
import RecordingControls from "@/components/RecordingControls";
import StudioSidebar from "@/components/StudioSidebar";
import GlassCard from "@/components/ui/glass-card";
import AuthButton from "@/components/auth/AuthButton";
import { Loader2 } from "lucide-react";

// @ts-ignore
import GIF from "gif.js";

const Studio = () => {
  const { toast } = useToast();
  const { user, profile, loading } = useClerkAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [counterSettings, setCounterSettings] = useState({
    startValue: 0,
    endValue: 100,
    duration: 5,
    fontFamily: "orbitron",
    fontSize: 120,
    design: "classic",
    background: "black",
    speed: 1,
    customFont: "",
    transition: "slideUp",
  });

  const [textSettings, setTextSettings] = useState({
    enabled: false,
    text: "Sample Text",
    position: "bottom",
    fontSize: 32,
    fontFamily: "inter",
    color: "#ffffff",
    offsetX: 0,
    offsetY: 0,
    opacity: 1,
  });

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentValue, setCurrentValue] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isGeneratingGif, setIsGeneratingGif] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    if (!canvasRef.current) return;

    try {
      const stream = canvasRef.current.captureStream(60);
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
      });

      recordedChunks.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setCurrentValue(counterSettings.startValue);
      toast({
        title: "Recording Started",
        description: "Counter animation recording has begun.",
      });
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast({
        title: "Recording Failed",
        description: "Could not start recording. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      toast({
        title: "Recording Stopped",
        description: "Your counter animation is ready for export.",
      });
    }
  };

  const handlePauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        toast({
          title: "Recording Resumed",
          description: "Counter animation recording continued.",
        });
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        toast({
          title: "Recording Paused",
          description: "Counter animation recording paused.",
        });
      }
    }
  };

  const handleDownloadVideo = () => {
    if (recordedChunks.current.length === 0) return;

    const blob = new Blob(recordedChunks.current, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `counter-animation-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Video Downloaded",
      description: "Your counter animation video has been saved.",
    });
  };

  const handleDownloadGif = async () => {
    if (!canvasRef.current || recordedChunks.current.length === 0) return;

    setIsGeneratingGif(true);

    try {
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: 800,
        height: 600,
      });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const frameCount = 30;
      const delay = 100;

      for (let i = 0; i < frameCount; i++) {
        const progress = i / (frameCount - 1);
        const value =
          counterSettings.startValue +
          (counterSettings.endValue - counterSettings.startValue) * progress;

        if (counterSettings.background === "transparent") {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle =
            counterSettings.background === "white" ? "#FFFFFF" : "#000000";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.fillStyle =
          counterSettings.background === "white" ? "#000000" : "#FFFFFF";
        ctx.font = `${counterSettings.fontSize}px ${counterSettings.fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          Math.floor(value).toString(),
          canvas.width / 2,
          canvas.height / 2
        );

        gif.addFrame(canvas, { delay });
      }

      gif.on("finished", (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `counter-animation-${Date.now()}.gif`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setIsGeneratingGif(false);
        toast({
          title: "GIF Downloaded",
          description: "Your counter animation GIF has been saved.",
        });
      });

      gif.render();
    } catch (error) {
      console.error("Failed to generate GIF:", error);
      setIsGeneratingGif(false);
      toast({
        title: "GIF Generation Failed",
        description: "Could not generate GIF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRestartRecording = () => {
    handleStopRecording();
    setTimeout(() => {
      setCurrentValue(counterSettings.startValue);
      setRecordingTime(0);
    }, 100);
  };

  // Counter animation logic
  useEffect(() => {
    if (!isRecording || isPaused) return;

    const interval = setInterval(() => {
      setCurrentValue((prev) => {
        const progress =
          (prev - counterSettings.startValue) /
          (counterSettings.endValue - counterSettings.startValue);
        if (progress >= 1) {
          handleStopRecording();
          return counterSettings.endValue;
        }

        const step =
          (counterSettings.endValue - counterSettings.startValue) /
          ((counterSettings.duration * 60) / counterSettings.speed);
        return Math.min(prev + step, counterSettings.endValue);
      });

      setRecordingTime((prev) => prev + 1000 / 60);
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [isRecording, isPaused, counterSettings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101010] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block mb-4 animate-spin">
            <Loader2 className="w-8 h-8 text-[#2BA6FF]" />
          </div>
          <p className="text-white">Loading Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#101010] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#171717] px-4 sm:px-6 py-3 sticky top-0 z-30 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Counter Studio Pro
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-400 px-3 py-1 rounded border border-[#2BA6FF]/30">
              <span className="hidden sm:inline">Recording Time:</span>
              <span className="font-mono text-[#2BA6FF]">
                {(recordingTime / 1000).toFixed(1)}s
              </span>
              {isRecording && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>

            <div className="flex items-center gap-2">
              {user && <AuthButton mode="user" />}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Studio Sidebar */}
        <StudioSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          counterSettings={counterSettings}
          onCounterSettingsChange={setCounterSettings}
          textSettings={textSettings}
          onTextSettingsChange={setTextSettings}
        />

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            sidebarOpen ? "" : ""
          } overflow-hidden h-full`}
        >
          {/* Preview Area - Smaller and on Left */}
          <div className="flex-1 flex p-4 justify-center items-center">
            <div className="w-[600px] h-[450px] bg-[#171717] border border-white/10 flex items-center justify-center rounded-lg overflow-hidden">
              <CounterPreview
                ref={canvasRef}
                settings={counterSettings}
                textSettings={textSettings}
                currentValue={currentValue}
                isRecording={isRecording}
              />
            </div>
          </div>
          {/* Recording Controls - Moved to Top */}
          <div className="flex-shrink-0 p-4   flex items-center justify-center">
            <RecordingControls
              isRecording={isRecording}
              isPaused={isPaused}
              onStart={handleStartRecording}
              onStop={handleStopRecording}
              onPause={handlePauseRecording}
              onRestart={handleRestartRecording}
              onDownloadVideo={handleDownloadVideo}
              onDownloadGif={handleDownloadGif}
              recordedChunksLength={recordedChunks.current.length}
              isGeneratingGif={isGeneratingGif}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
