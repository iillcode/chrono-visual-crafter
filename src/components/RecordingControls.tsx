
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Play, Square, RotateCcw, Download, Image, Loader2 } from 'lucide-react';

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onRestart: () => void;
  onDownloadVideo: () => void;
  onDownloadGif: () => void;
  recordedChunksLength: number;
  isGeneratingGif: boolean;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isPaused,
  onStart,
  onStop,
  onPause,
  onRestart,
  onDownloadVideo,
  onDownloadGif,
  recordedChunksLength,
  isGeneratingGif
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700/50">
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
        {/* Recording Controls */}
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <Button 
              onClick={onStart}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-red-500/25 transition-all duration-200"
              size="lg"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Recording
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                onClick={onPause}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800 bg-gray-900/50 backdrop-blur-sm"
                size="lg"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button 
                onClick={onStop}
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-900/30 bg-gray-900/50 backdrop-blur-sm"
                size="lg"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </div>
          )}
          
          <Button 
            onClick={onRestart}
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-800 bg-gray-900/50 backdrop-blur-sm"
            size="lg"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8 bg-gray-600 hidden sm:block" />

        {/* Status */}
        <div className="flex items-center gap-2">
          {isRecording && (
            <Badge variant="destructive" className="animate-pulse bg-red-600/90 backdrop-blur-sm">
              {isPaused ? 'PAUSED' : 'RECORDING'}
            </Badge>
          )}
          {recordedChunksLength > 0 && !isRecording && (
            <Badge className="bg-green-800/90 text-green-200 backdrop-blur-sm">
              Ready to Export
            </Badge>
          )}
        </div>
      </div>

      {/* Export Controls */}
      <div className="flex items-center gap-2 w-full lg:w-auto justify-center lg:justify-end">
        <Button 
          onClick={onDownloadVideo}
          disabled={recordedChunksLength === 0}
          variant="outline"
          className="border-blue-600 text-blue-400 hover:bg-blue-900/30 disabled:opacity-50 bg-gray-900/50 backdrop-blur-sm flex-1 sm:flex-none"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Video
        </Button>
        
        <Button 
          onClick={onDownloadGif}
          disabled={recordedChunksLength === 0 || isGeneratingGif}
          variant="outline"
          className="border-purple-600 text-purple-400 hover:bg-purple-900/30 disabled:opacity-50 bg-gray-900/50 backdrop-blur-sm flex-1 sm:flex-none"
        >
          {isGeneratingGif ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Image className="w-4 h-4 mr-2" />
              Export GIF
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default RecordingControls;
