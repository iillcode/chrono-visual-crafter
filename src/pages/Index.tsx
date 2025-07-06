import React, { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import CounterPreview from "@/components/CounterPreview";
import RecordingControls from "@/components/RecordingControls";
import StudioSidebar from "@/components/StudioSidebar";
import { User, Home } from "lucide-react";

// @ts-ignore
import GIF from "gif.js";

const Index = () => {
  const { toast } = useToast();
  const { user, profile, updateProfile } = useAuth();
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
    prefix: "",
    suffix: "",
    separator: "none",
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
  const [cancelGifGeneration, setCancelGifGeneration] = useState(false);

  const [designSettings] = useState({
    neonColor: "#00FFFF",
    neonIntensity: 10,
    glowColor: "#FFFFFF",
    glowIntensity: 15,
    gradientColors:
      "linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7)",
    fireColors: "linear-gradient(45deg, #FF4444, #FF8800, #FFFF00)",
    fireGlow: 10,
    rainbowColors:
      "linear-gradient(45deg, #FF0000, #FF8800, #FFFF00, #00FF00, #0088FF, #8800FF, #FF0088)",
    chromeColors: "linear-gradient(45deg, #FFFFFF, #CCCCCC, #999999)",
  });

  const formatNumber = (value: number) => {
    let formattedValue = Math.floor(value).toString();

    // Apply separator
    if (counterSettings.separator && counterSettings.separator !== "none") {
      const separator =
        counterSettings.separator === "comma"
          ? ","
          : counterSettings.separator === "dot"
          ? "."
          : counterSettings.separator === "space"
          ? " "
          : "";

      if (separator) {
        formattedValue = formattedValue.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          separator
        );
      }
    }

    // Add prefix and suffix
    return `${counterSettings.prefix || ""}${formattedValue}${
      counterSettings.suffix || ""
    }`;
  };

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
    // Check credits for free users
    if (
      profile?.subscription_plan === "free" &&
      typeof profile?.credits === "number" &&
      profile.credits <= 0
    ) {
      toast({
        title: "Out of Credits",
        description:
          "You have reached your monthly export limit. Upgrade to Pro for unlimited exports.",
        variant: "destructive",
      });
      return;
    }

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

    if (
      profile?.subscription_plan === "free" &&
      typeof profile?.credits === "number" &&
      profile.credits > 0
    ) {
      updateProfile({ credits: profile.credits - 1 });
    }
  };

  const handleCancelGif = () => {
    setCancelGifGeneration(true);
    toast({
      title: "GIF Generation Cancelled",
      description: "The GIF generation process has been stopped.",
    });
  };

  const handleDownloadGif = async () => {
    if (!canvasRef.current || recordedChunks.current.length === 0) return;

    setIsGeneratingGif(true);
    setCancelGifGeneration(false);

    try {
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: 800,
        height: 600,
        workerScript:
          "https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js",
      });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const frameCount = 30;
      const delay = 100;

      for (let i = 0; i < frameCount; i++) {
        if (cancelGifGeneration) {
          setIsGeneratingGif(false);
          setCancelGifGeneration(false);
          return;
        }

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
        ctx.fillText(formatNumber(value), canvas.width / 2, canvas.height / 2);

        gif.addFrame(canvas, { delay });
      }

      gif.on("finished", (blob: Blob) => {
        if (!cancelGifGeneration) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `counter-animation-${Date.now()}.gif`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          toast({
            title: "GIF Downloaded",
            description: "Your counter animation GIF has been saved.",
          });
        }

        setIsGeneratingGif(false);
        setCancelGifGeneration(false);
      });

      gif.render();
    } catch (error) {
      console.error("Failed to generate GIF:", error);
      setIsGeneratingGif(false);
      setCancelGifGeneration(false);
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

  return (
    <div className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/30 px-4 sm:px-6 py-3 sticky top-0 z-30 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
              Counter Studio Pro
            </h1>
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              Professional
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="hidden sm:inline">Recording Time:</span>
              <span className="font-mono text-blue-400">
                {(recordingTime / 1000).toFixed(1)}s
              </span>
              {isRecording && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="border-white/30 text-white hover:bg-white/20"
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Button>

              {user && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/profile")}
                  className="border-white/30 text-white hover:bg-white/20"
                >
                  <User className="w-4 h-4 mr-1" />
                  {profile?.full_name?.split(" ")[0] || "Profile"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Studio Sidebar - Now on Left */}
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
            sidebarOpen ? "lg:ml-80" : ""
          } overflow-hidden`}
        >
          {/* Preview Area - Fixed Height, Smaller Size */}
          <div className="flex-1 flex items-center justify-center p-4 lg:p-6 min-h-0">
            <div className="w-full max-w-3xl aspect-[4/3] bg-gray-900/30 rounded-lg border border-gray-700/50 backdrop-blur-sm overflow-hidden">
              <CounterPreview
                ref={canvasRef}
                settings={counterSettings}
                textSettings={textSettings}
                designSettings={designSettings}
                currentValue={currentValue}
                isRecording={isRecording}
                formatNumber={formatNumber}
              />
            </div>
          </div>

          {/* Recording Controls - Directly Below Preview */}
          <div className="border-t border-gray-800/50 py-4 px-4 flex-shrink-0">
            <RecordingControls
              isPaused={isPaused}
              onStart={handleStartRecording}
              onStop={handleStopRecording}
              onPause={handlePauseRecording}
              onRestart={handleRestartRecording}
              onDownloadVideo={handleDownloadVideo}
              onDownloadGif={handleDownloadGif}
              recordedChunksLength={recordedChunks.current.length}
              isGeneratingGif={isGeneratingGif}
              onCancelGif={handleCancelGif}
              isProcessingVideo={false}
              hasCredits={
                profile?.subscription_plan === "pro" ||
                profile?.credits === null ||
                (typeof profile?.credits === "number" && profile.credits > 0)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
