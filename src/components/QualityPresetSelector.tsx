import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Clock,
  HardDrive,
  Monitor,
  Zap,
  AlertTriangle,
  CheckCircle,
  Info,
  Gauge,
} from "lucide-react";
import {
  ExportQualityManager,
  QualityPreset,
  ExportOptions,
  ExportEstimation,
} from "@/utils/exportQualityManager";

interface QualityPresetSelectorProps {
  selectedPreset: string;
  onPresetChange: (presetId: string) => void;
  exportOptions: ExportOptions;
  className?: string;
}

const QualityPresetSelector: React.FC<QualityPresetSelectorProps> = ({
  selectedPreset,
  onPresetChange,
  exportOptions,
  className = "",
}) => {
  const [estimation, setEstimation] = useState<ExportEstimation | null>(null);
  const [selectedPresetData, setSelectedPresetData] =
    useState<QualityPreset | null>(null);

  const presets = ExportQualityManager.getQualityPresets();

  // Update estimation when preset or options change
  useEffect(() => {
    const preset = ExportQualityManager.getPresetById(selectedPreset);
    if (preset) {
      setSelectedPresetData(preset);
      const newEstimation = ExportQualityManager.estimateExport(
        preset,
        exportOptions
      );
      setEstimation(newEstimation);
    }
  }, [selectedPreset, exportOptions]);

  const getQualityIcon = (presetId: string) => {
    switch (presetId) {
      case "draft":
        return <Zap className="w-4 h-4 text-yellow-500" />;
      case "standard":
        return <Gauge className="w-4 h-4 text-blue-500" />;
      case "high":
        return <Monitor className="w-4 h-4 text-green-500" />;
      case "ultra":
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getQualityColor = (presetId: string) => {
    switch (presetId) {
      case "draft":
        return "border-yellow-500/30 bg-yellow-500/5";
      case "standard":
        return "border-blue-500/30 bg-blue-500/5";
      case "high":
        return "border-green-500/30 bg-green-500/5";
      case "ultra":
        return "border-purple-500/30 bg-purple-500/5";
      default:
        return "border-gray-500/30 bg-gray-500/5";
    }
  };

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB < 1) {
      return `${Math.round(sizeInMB * 1000)} KB`;
    } else if (sizeInMB < 1000) {
      return `${sizeInMB.toFixed(1)} MB`;
    } else {
      return `${(sizeInMB / 1000).toFixed(1)} GB`;
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (timeInSeconds < 60) {
      return `${timeInSeconds}s`;
    } else if (timeInSeconds < 3600) {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      return `${minutes}m ${seconds}s`;
    } else {
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label className="text-white">Export Quality</Label>

        {/* Quality Preset Grid */}
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset) => (
            <TooltipProvider key={preset.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onPresetChange(preset.id)}
                    className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                      selectedPreset === preset.id
                        ? "border-[#2BA6FF] bg-[#2BA6FF]/20"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getQualityIcon(preset.id)}
                      <span className="font-medium text-white text-sm">
                        {preset.name}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-white/60">
                        {preset.resolution.width}×{preset.resolution.height} •{" "}
                        {preset.fps}fps
                      </div>
                      <div className="text-xs text-white/60">
                        {preset.bitrate}Mbps • {preset.codec.toUpperCase()}
                      </div>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-xs p-3 bg-gray-900 border-gray-700"
                >
                  <div className="space-y-2">
                    <div className="font-medium text-white">{preset.name}</div>
                    <div className="text-sm text-gray-300">
                      {preset.description}
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-medium text-blue-400">
                        Best for:
                      </div>
                      {preset.recommendedFor.slice(0, 3).map((use, index) => (
                        <div
                          key={index}
                          className="text-xs text-gray-400 flex items-start gap-1"
                        >
                          <CheckCircle className="w-2 h-2 mt-0.5 flex-shrink-0 text-green-400" />
                          {use}
                        </div>
                      ))}
                    </div>

                    {preset.limitations && preset.limitations.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-yellow-400">
                          Limitations:
                        </div>
                        {preset.limitations
                          .slice(0, 2)
                          .map((limitation, index) => (
                            <div
                              key={index}
                              className="text-xs text-yellow-300 flex items-start gap-1"
                            >
                              <AlertTriangle className="w-2 h-2 mt-0.5 flex-shrink-0" />
                              {limitation}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

      {/* Export Estimation */}
      {estimation && selectedPresetData && (
        <Card className="bg-white/[0.03] border border-white/[0.08]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
              <Info className="w-4 h-4" />
              Export Estimation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* File Size and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-sm font-medium text-white">
                    {formatFileSize(estimation.fileSize)}
                  </div>
                  <div className="text-xs text-white/60">File Size</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-400" />
                <div>
                  <div className="text-sm font-medium text-white">
                    {formatTime(estimation.exportTime)}
                  </div>
                  <div className="text-xs text-white/60">Export Time</div>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-white/[0.02] rounded-lg p-3 space-y-2">
              <div className="text-xs font-medium text-white/80">
                Technical Details
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
                <div>
                  Resolution: {selectedPresetData.resolution.width}×
                  {selectedPresetData.resolution.height}
                </div>
                <div>Frame Rate: {selectedPresetData.fps} fps</div>
                <div>Bitrate: {selectedPresetData.bitrate} Mbps</div>
                <div>Codec: {selectedPresetData.codec.toUpperCase()}</div>
              </div>
            </div>

            {/* Warnings */}
            {estimation.warnings.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-yellow-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Considerations
                </div>
                {estimation.warnings.map((warning, index) => (
                  <div
                    key={index}
                    className="text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded p-2"
                  >
                    {warning}
                  </div>
                ))}
              </div>
            )}

            {/* Quality Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {estimation.quality} Quality
              </Badge>
              {exportOptions.hasTransparency && (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  Transparency
                </Badge>
              )}
              {exportOptions.hasComplexEffects && (
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  Complex Effects
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Format Selection Helper */}
      <div className="text-xs text-white/40">
        💡 Tip: Use Draft for quick previews, Standard for most content, High
        for professional work, and Ultra for premium quality.
      </div>
    </div>
  );
};

export default QualityPresetSelector;
