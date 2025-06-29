
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Play, Square, RotateCcw, Download, Image } from 'lucide-react';

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onRestart: () => void;
  onDownloadVideo: () => void;
  recordedChunksLength: number;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isPaused,
  onStart,
  onStop,
  onPause,
  onRestart,
  onDownloadVideo,
  recordedChunksLength
}) => {
  const handleDownloadGif = () => {
    console.log('GIF download not implemented yet');
    // TODO: Implement GIF conversion and download
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Recording Controls */}
        <div className="flex items-center space-x-2">
          {!isRecording ? (
            <Button 
              onClick={onStart}
              className="bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Recording
            </Button>
          ) : (
            <>
              <Button 
                onClick={onPause}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800"
                size="lg"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button 
                onClick={onStop}
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-900"
                size="lg"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </>
          )}
          
          <Button 
            onClick={onRestart}
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-800"
            size="lg"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8 bg-gray-600" />

        {/* Status */}
        <div className="flex items-center space-x-2">
          {isRecording && (
            <Badge variant="destructive" className="animate-pulse">
              {isPaused ? 'PAUSED' : 'RECORDING'}
            </Badge>
          )}
          {recordedChunksLength > 0 && !isRecording && (
            <Badge variant="secondary" className="bg-green-800 text-green-200">
              Ready to Export
            </Badge>
          )}
        </div>
      </div>

      {/* Export Controls */}
      <div className="flex items-center space-x-2">
        <Button 
          onClick={onDownloadVideo}
          disabled={recordedChunksLength === 0}
          variant="outline"
          className="border-blue-600 text-blue-400 hover:bg-blue-900 disabled:opacity-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Video
        </Button>
        
        <Button 
          onClick={handleDownloadGif}
          disabled={recordedChunksLength === 0}
          variant="outline"
          className="border-purple-600 text-purple-400 hover:bg-purple-900 disabled:opacity-50"
        >
          <Image className="w-4 h-4 mr-2" />
          Export GIF
        </Button>
      </div>
    </div>
  );
};

export default RecordingControls;
