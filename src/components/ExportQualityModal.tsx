import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  Settings,
  Film,
  Image,
  Loader2,
  Info,
  Zap,
  Monitor,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import QualityPresetSelector from "./QualityPresetSelector";
import {
  ExportQualityManager,
  ExportOptions,
} from "@/utils/exportQualityManager";
import { VideoExportManager } from "@/utils/videoExportFixes";

// Custom scrollbar styles
import "./scrollbar-styles.css";

interface ExportQualityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (preset: string, format: "webm" | "mp4" | "gif") => void;
  counterSettings: any;
  duration: number;
  hasRecordedVideo: boolean;
  isExporting?: boolean;
}

const ExportQualityModal: React.FC<ExportQualityModalProps> = ({
  isOpen,
  onClose,
  onExport,
  counterSettings,
  duration,
  hasRecordedVideo,
  isExporting = false,
}) => {
  const [selectedPreset, setSelectedPreset] = useState("standard");
  const [selectedFormat, setSelectedFormat] = useState<"webm" | "mp4" | "gif">(
    "webm"
  );
  const [activeTab, setActiveTab] = useState("quality");
  const [formatCapabilities, setFormatCapabilities] = useState<any[]>([]);
  const [browserValidation, setBrowserValidation] = useState<any>(null);
  const { toast } = useToast();

  // Create export options based on counter settings
  const exportOptions: ExportOptions = {
    duration,
    hasTransparency: counterSettings.background === "transparent",
    hasComplexEffects:
      [
        "neon",
        "glow",
        "matrixRain",
        "particleExplosion",
        "liquidMorph",
        "hologramFlicker",
      ].includes(counterSettings.design) ||
      [
        "matrixRain",
        "particleExplosion",
        "liquidMorph",
        "hologramFlicker",
      ].includes(counterSettings.transition),
    targetFormat: selectedFormat,
  };

  // Reset to default values and detect format capabilities when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedPreset("standard");
      setActiveTab("quality");

      // Detect browser format capabilities
      const capabilities = VideoExportManager.detectFormatCapabilities();
      setFormatCapabilities(capabilities);

      // Validate export settings for current browser
      const validation = VideoExportManager.validateExportSettings(
        exportOptions.hasTransparency,
        exportOptions.hasComplexEffects
      );
      setBrowserValidation(validation);

      // Set recommended format based on capabilities
      const recommendations = VideoExportManager.getFormatRecommendations(
        exportOptions.hasTransparency,
        exportOptions.hasComplexEffects,
        "quality"
      );

      if (recommendations.primary) {
        const formatType = recommendations.primary.mimeType.includes("mp4")
          ? "mp4"
          : "webm";
        setSelectedFormat(formatType);
      } else {
        setSelectedFormat("webm"); // Fallback
      }

      // Show browser compatibility warnings if needed
      if (validation.warnings.length > 0) {
        validation.warnings.forEach((warning) => {
          toast({
            title: "Browser Compatibility Notice",
            description: warning,
            variant: "default",
          });
        });
      }
    }
  }, [
    isOpen,
    counterSettings.background,
    exportOptions.hasTransparency,
    exportOptions.hasComplexEffects,
  ]);

  const handleExport = () => {
    if (!hasRecordedVideo) {
      toast({
        title: "No Recording Available",
        description: "Please record an animation before exporting.",
        variant: "destructive",
      });
      return;
    }

    // Validate export settings
    const preset = ExportQualityManager.getPresetById(selectedPreset);
    if (!preset) {
      toast({
        title: "Invalid Quality Preset",
        description: "Please select a valid quality preset.",
        variant: "destructive",
      });
      return;
    }

    const validation = ExportQualityManager.validateExportSettings(
      preset,
      exportOptions
    );

    // Show warnings if any
    if (validation.issues.length > 0) {
      toast({
        title: "Export Issues Detected",
        description: validation.issues[0],
        variant: "destructive",
      });
      return;
    }

    if (validation.recommendations.length > 0) {
      toast({
        title: "Export Recommendation",
        description: validation.recommendations[0],
        variant: "default",
      });
    }

    onExport(selectedPreset, selectedFormat);
    onClose();
  };

  const formatInfo = ExportQualityManager.getFormatInfo(selectedFormat);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-[#171717]/60 border border-white/[0.08] backdrop-blur-sm max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-cyan-400" />
            Export Quality Settings
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Choose your export quality and format settings for optimal results.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-white/[0.03] border border-white/[0.08]">
              <TabsTrigger
                value="quality"
                className="data-[state=active]:bg-[#2BA6FF]/20 data-[state=active]:text-[#2BA6FF]"
              >
                Quality Presets
              </TabsTrigger>
              <TabsTrigger
                value="format"
                className="data-[state=active]:bg-[#2BA6FF]/20 data-[state=active]:text-[#2BA6FF]"
              >
                Format Options
              </TabsTrigger>
              <TabsTrigger
                value="advanced"
                className="data-[state=active]:bg-[#2BA6FF]/20 data-[state=active]:text-[#2BA6FF]"
              >
                Advanced Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quality" className="space-y-4 custom-scrollbar">
              <QualityPresetSelector
                selectedPreset={selectedPreset}
                onPresetChange={setSelectedPreset}
                exportOptions={exportOptions}
              />
            </TabsContent>

            <TabsContent value="format" className="space-y-4 custom-scrollbar">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Export Format</Label>
                  <Select
                    value={selectedFormat}
                    onValueChange={(value: "webm" | "mp4" | "gif") =>
                      setSelectedFormat(value)
                    }
                  >
                    <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="webm">WebM (Recommended)</SelectItem>
                      <SelectItem value="mp4">MP4 (Universal)</SelectItem>
                      <SelectItem value="gif">GIF (Animated)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Format Information Card */}
                <Card className="bg-white/[0.03] border border-white/[0.08]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      {formatInfo.name} Format Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-gray-300">
                      {formatInfo.description}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-medium text-blue-400 mb-2">
                          Best For:
                        </div>
                        {formatInfo.bestFor.map((use, index) => (
                          <div
                            key={index}
                            className="text-xs text-gray-400 flex items-start gap-1 mb-1"
                          >
                            <CheckCircle className="w-2 h-2 mt-0.5 flex-shrink-0 text-green-400" />
                            {use}
                          </div>
                        ))}
                      </div>

                      <div>
                        <div className="text-xs font-medium text-yellow-400 mb-2">
                          Limitations:
                        </div>
                        {formatInfo.limitations.map((limitation, index) => (
                          <div
                            key={index}
                            className="text-xs text-yellow-300 flex items-start gap-1 mb-1"
                          >
                            <AlertTriangle className="w-2 h-2 mt-0.5 flex-shrink-0" />
                            {limitation}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          formatInfo.supportsTransparency
                            ? "border-green-500/30 text-green-400"
                            : "border-red-500/30 text-red-400"
                        }`}
                      >
                        {formatInfo.supportsTransparency ? "✓" : "✗"}{" "}
                        Transparency
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs border-blue-500/30 text-blue-400"
                      >
                        {formatInfo.browserSupport}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Format Compatibility Warnings */}
                {selectedFormat === "mp4" && exportOptions.hasTransparency && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-yellow-300">
                        <p className="font-medium mb-1">Transparency Warning</p>
                        <p>
                          MP4 format does not support transparency. Your
                          transparent background will become black. Consider
                          using WebM format instead.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedFormat === "gif" && duration > 10 && (
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-orange-300">
                        <p className="font-medium mb-1">
                          Large File Size Warning
                        </p>
                        <p>
                          Long animations as GIF can result in very large file
                          sizes. Consider using WebM for better compression.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="advanced"
              className="space-y-4 custom-scrollbar"
            >
              <Card className="bg-white/[0.03] border border-white/[0.08]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Export Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-white/60 mb-1">
                        Animation Duration
                      </div>
                      <div className="text-white font-medium">{duration}s</div>
                    </div>
                    <div>
                      <div className="text-white/60 mb-1">Background Type</div>
                      <div className="text-white font-medium capitalize">
                        {counterSettings.background}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/60 mb-1">
                        Transition Effect
                      </div>
                      <div className="text-white font-medium">
                        {counterSettings.transition || "None"}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/60 mb-1">Design Style</div>
                      <div className="text-white font-medium capitalize">
                        {counterSettings.design}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {exportOptions.hasTransparency && (
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        Transparency Enabled
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

              {/* Browser Compatibility Information */}
              {formatCapabilities.length > 0 && (
                <Card className="bg-white/[0.03] border border-white/[0.08]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      Browser Compatibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-xs text-white/80 mb-2">
                      Supported formats in your browser:
                    </div>
                    <div className="space-y-2">
                      {formatCapabilities.map((capability, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-white/[0.02] rounded"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                capability.quality === "excellent"
                                  ? "bg-green-400"
                                  : capability.quality === "good"
                                  ? "bg-blue-400"
                                  : capability.quality === "fair"
                                  ? "bg-yellow-400"
                                  : "bg-red-400"
                              }`}
                            />
                            <span className="text-xs text-white font-medium">
                              {capability.description}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            {capability.supportsTransparency && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-1 py-0">
                                Alpha
                              </Badge>
                            )}
                            <Badge
                              className={`text-xs px-1 py-0 ${
                                capability.browserSupport === "universal"
                                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                  : capability.browserSupport === "modern"
                                  ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                                  : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                              }`}
                            >
                              {capability.browserSupport}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Browser Validation Results */}
              {browserValidation && (
                <Card className="bg-white/[0.03] border border-white/[0.08]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Export Validation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      {browserValidation.isValid ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          browserValidation.isValid
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {browserValidation.isValid
                          ? "Export Ready"
                          : "Export Issues Detected"}
                      </span>
                    </div>

                    {browserValidation.errors.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-red-400">
                          Errors:
                        </div>
                        {browserValidation.errors.map((error, index) => (
                          <div
                            key={index}
                            className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded p-2"
                          >
                            {error}
                          </div>
                        ))}
                      </div>
                    )}

                    {browserValidation.warnings.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-yellow-400">
                          Warnings:
                        </div>
                        {browserValidation.warnings.map((warning, index) => (
                          <div
                            key={index}
                            className="text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded p-2"
                          >
                            {warning}
                          </div>
                        ))}
                      </div>
                    )}

                    {browserValidation.fallbackOptions.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-blue-400">
                          Recommendations:
                        </div>
                        {browserValidation.fallbackOptions.map(
                          (option, index) => (
                            <div
                              key={index}
                              className="text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded p-2"
                            >
                              • {option}
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {browserValidation.recommendedFormat && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded p-2">
                        <div className="text-xs font-medium text-green-400 mb-1">
                          Recommended Format:
                        </div>
                        <div className="text-xs text-green-300">
                          {browserValidation.recommendedFormat}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="bg-[#2BA6FF]/10 border border-[#2BA6FF]/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#2BA6FF] flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-[#2BA6FF] font-medium mb-2">
                      💡 Export Tips
                    </p>
                    <ul className="text-[#2BA6FF] space-y-1 text-xs">
                      <li>
                        • Use WebM format for best quality and transparency
                        support
                      </li>
                      <li>
                        • Choose Draft quality for quick previews and testing
                      </li>
                      <li>
                        • High or Ultra quality is recommended for professional
                        content
                      </li>
                      <li>
                        • GIF format is best for simple animations and broad
                        compatibility
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Export Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/[0.08]">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isExporting}
              className="flex-1 border-white/20 bg-white/5 hover:bg-white/10 text-white"
            >
              Cancel
            </Button>

            <Button
              onClick={handleExport}
              disabled={!hasRecordedVideo || isExporting}
              className="flex-1 bg-[#2BA6FF]/60 hover:bg-[#2BA6FF]/80 text-white"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export {selectedFormat.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportQualityModal;
