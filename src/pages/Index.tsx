
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { play, stop, restart, download, gif } from 'lucide-react';
import CounterPreview from '@/components/CounterPreview';
import ControlPanel from '@/components/ControlPanel';
import DesignSelector from '@/components/DesignSelector';
import RecordingControls from '@/components/RecordingControls';

const Index = () => {
  const [counterSettings, setCounterSettings] = useState({
    startValue: 0,
    endValue: 100,
    duration: 5,
    fontFamily: 'orbitron',
    fontSize: 120,
    design: 'classic',
    background: 'black',
    speed: 1,
    customFont: ''
  });

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentValue, setCurrentValue] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    if (!canvasRef.current) return;

    try {
      const stream = canvasRef.current.captureStream(60); // 60 FPS
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
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
      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      console.log('Recording stopped');
    }
  };

  const handlePauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        console.log('Recording resumed');
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        console.log('Recording paused');
      }
    }
  };

  const handleDownloadVideo = () => {
    if (recordedChunks.current.length === 0) return;

    const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `counter-animation-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('Video downloaded');
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
      setCurrentValue(prev => {
        const progress = (prev - counterSettings.startValue) / (counterSettings.endValue - counterSettings.startValue);
        if (progress >= 1) {
          handleStopRecording();
          return counterSettings.endValue;
        }
        
        const step = (counterSettings.endValue - counterSettings.startValue) / (counterSettings.duration * 60 / counterSettings.speed);
        return Math.min(prev + step, counterSettings.endValue);
      });

      setRecordingTime(prev => prev + (1000 / 60));
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(interval);
  }, [isRecording, isPaused, counterSettings]);

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Counter Studio
            </h1>
            <Badge variant="secondary" className="bg-gray-800 text-gray-300">
              Professional
            </Badge>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Recording Time: {(recordingTime / 1000).toFixed(1)}s</span>
            {isRecording && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Controls */}
        <div className="w-80 border-r border-gray-800 p-6 overflow-y-auto">
          <ControlPanel 
            settings={counterSettings}
            onSettingsChange={setCounterSettings}
          />
        </div>

        {/* Center - Preview */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-8">
            <CounterPreview 
              ref={canvasRef}
              settings={counterSettings}
              currentValue={currentValue}
              isRecording={isRecording}
            />
          </div>
          
          {/* Bottom Controls */}
          <div className="border-t border-gray-800 p-6">
            <RecordingControls
              isRecording={isRecording}
              isPaused={isPaused}
              onStart={handleStartRecording}
              onStop={handleStopRecording}
              onPause={handlePauseRecording}
              onRestart={handleRestartRecording}
              onDownloadVideo={handleDownloadVideo}
              recordedChunksLength={recordedChunks.current.length}
            />
          </div>
        </div>

        {/* Right Panel - Designs */}
        <div className="w-80 border-l border-gray-800 p-6 overflow-y-auto">
          <DesignSelector
            selectedDesign={counterSettings.design}
            onDesignChange={(design) => setCounterSettings(prev => ({ ...prev, design }))}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
