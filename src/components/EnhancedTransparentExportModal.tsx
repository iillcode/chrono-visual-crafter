import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
  Smartphone,
  Tv,
  Cpu,
  HardDrive,
} from "lucide-react";
import {
  EnhancedTransparentCounterExporter,
  EnhancedTransparentExportOptions,
} from "@/utils/enhancedTransparentExport";

interface EnhancedTransparentExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  counterSettings: any;
  textSettings: any;
  designSettings: any;
}

const PRESET_SIZES = [
  { name: "HD (1920x1080)", width: 1920, height: 1080, icon: Monitor },
  { name: "4K (3840x2160)", width: 3840, height: 2160, icon: Tv },
  { name: "Mobile (1080x1920)", width: 1080, height: 1920, icon: Smartphone },
  { name: "Square (1080x1080)", width: 1080, height: 1080, icon: Monitor },
  { name: "Custom", width: 800, height: 600, icon: Settings },
];

const PRESET_FRAME_RATES = [24, 25, 30, 50, 60, 120];

export const EnhancedTransparentExportModal: React.FC<EnhancedTransparentExportModalProps> = ({
  open,
  onOpenChange,
  counterSettings,
  textSettings,
  designSettings,
}) => {
  const [exportOptions, setExportOptions] = useState<EnhancedTransparentExportOptions>({
    includeCounter: true,
    includeText: textSettings.enabled,
    format: 'both',
    width: 1920,
    height: 1080,
    frameRate: 60,
    duration: counterSettings.duration,
    scale: 1.0,
    
    // PNG specific options
    pngOptions: {
      format: '8bit',
      colorSpace: 'rgba',
      compression: 'best',
      namingConvention: 'sequence_####',
    },
    
    // WebM specific options
    webmOptions: {
      codec: 'vp9',
      bitrate: 12,
      colorSubsampling: '4:2:0',
      twoPassEncoding: true,
      gammaCorrection: true,
      keyframeInterval: 30,
      pixelFormat: 'yuva420p',
      autoAltRef: false,
    },
    
    preserveAnimations: true,
    transitionType: counterSettings.transition,
    easingFunction: counterSettings.easing,
  });

  const [isExporting, setIsExporting] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customSize, setCustomSize] = useState({ width: 800, height: 600 });
  const { toast } = useToast();

  const handlePresetChange = (presetIndex: number) => {
    setSelectedPreset(presetIndex);
    const preset = PRESET_SIZES[presetIndex];
    
    if (preset.name === "Custom") {
      setExportOptions(prev => ({
        ...prev,
        width: customSize.width,
        height: customSize.height,
      }));
    } else {
      setExportOptions(prev => ({
        ...prev,
        width: preset.width,
        height: preset.height,
      }));
    }
  };

  const handleCustomSizeChange = (dimension: 'width' | 'height', value: number) => {
    setCustomSize(prev => ({ ...prev, [dimension]: value }));
    if (selectedPreset === PRESET_SIZES.length - 1) {
      setExportOptions(prev => ({ ...prev, [dimension]: value }));
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const exporter = new EnhancedTransparentCounterExporter(
        exportOptions,
        counterSettings,
        textSettings,
        designSettings
      );

      const exports = await exporter.export();
      
      await EnhancedTransparentCounterExporter.downloadOptimizedExports(
        exports,
        'optimized-transparent-counter-overlay'
      );

      toast({
        title: "Export Complete",
        description: "Your optimized transparent counter overlay has been exported successfully!",
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Enhanced export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your optimized counter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const estimatedFileSize = () => {
    const frameCount = Math.ceil(exportOptions.frameRate * exportOptions.duration);
    const pixelCount = exportOptions.width * exportOptions.height * exportOptions.scale * exportOptions.scale;
    
    // More accurate estimates based on optimization
    const pngSize = frameCount * (pixelCount * (exportOptions.pngOptions.format === '8bit' ? 1 : 4)) / 1024 / 1024;
    const webmSize = (pixelCount * exportOptions.duration * exportOptions.webmOptions.bitrate) / 8 / 1024 / 1024;
    
    return { pngSize, webmSize, frameCount };
  };

  const { pngSize, webmSize, frameCount } = estimatedFileSize();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Enhanced Transparent Counter Export
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Export optimized PNG sequences and WebM alpha videos with professional quality settings.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/[0.03] border border-white/[0.08]">
            <TabsTrigger value="content" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              Content
            </TabsTrigger>
            <TabsTrigger value="format" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              Format
            </TabsTrigger>
            <TabsTrigger value="optimization" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              Optimization
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <Card className="bg-white/[0.03] border border-white/[0.08]">
              <CardHeader>
                <CardTitle className="text-white text-sm">Content Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Include Counter Numbers</Label>
                    <p className="text-xs text-white/40">Export the animated counter display</p>
                  </div>
                  <Switch
                    checked={exportOptions.includeCounter}
                    onCheckedChange={(checked) =>
                      setExportOptions(prev => ({ ...prev, includeCounter: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Include Text Elements</Label>
                    <p className="text-xs text-white/40">Export additional text overlays</p>
                  </div>
                  <Switch
                    checked={exportOptions.includeText}
                    onCheckedChange={(checked) =>
                      setExportOptions(prev => ({ ...prev, includeText: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Preserve Animations</Label>
                    <p className="text-xs text-white/40">Include transition effects and animations</p>
                  </div>
                  <Switch
                    checked={exportOptions.preserveAnimations}
                    onCheckedChange={(checked) =>
                      setExportOptions(prev => ({ ...prev, preserveAnimations: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="format" className="space-y-6">
            <Card className="bg-white/[0.03] border border-white/[0.08]">
              <CardHeader>
                <CardTitle className="text-white text-sm">Export Format</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Output Format</Label>
                  <Select
                    value={exportOptions.format}
                    onValueChange={(value: 'png-sequence' | 'webm-alpha' | 'both') =>
                      setExportOptions(prev => ({ ...prev, format: value }))
                    }
                  >
                    <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png-sequence">
                        <div className="flex items-center gap-2">
                          <Image className="w-4 h-4" />
                          PNG Sequence (8-bit optimized)
                        </div>
                      </SelectItem>
                      <SelectItem value="webm-alpha">
                        <div className="flex items-center gap-2">
                          <Film className="w-4 h-4" />
                          WebM Alpha (VP9 codec)
                        </div>
                      </SelectItem>
                      <SelectItem value="both">
                        <div className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Both Formats
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* PNG Options */}
                {(exportOptions.format === 'png-sequence' || exportOptions.format === 'both') && (
                  <Card className="bg-white/[0.02] border border-white/[0.05]">
                    <CardHeader>
                      <CardTitle className="text-white text-xs">PNG Sequence Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white text-xs">Color Format</Label>
                          <Select
                            value={exportOptions.pngOptions.format}
                            onValueChange={(value: '8bit' | '24bit' | '32bit') =>
                              setExportOptions(prev => ({
                                ...prev,
                                pngOptions: { ...prev.pngOptions, format: value }
                              }))
                            }
                          >
                            <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="8bit">8-bit (256 colors)</SelectItem>
                              <SelectItem value="24bit">24-bit (16M colors)</SelectItem>
                              <SelectItem value="32bit">32-bit (16M + alpha)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white text-xs">Compression</Label>
                          <Select
                            value={exportOptions.pngOptions.compression}
                            onValueChange={(value: 'none' | 'fast' | 'best') =>
                              setExportOptions(prev => ({
                                ...prev,
                                pngOptions: { ...prev.pngOptions, compression: value }
                              }))
                            }
                          >
                            <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None (fastest)</SelectItem>
                              <SelectItem value="fast">Fast</SelectItem>
                              <SelectItem value="best">Best (smallest)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* WebM Options */}
                {(exportOptions.format === 'webm-alpha' || exportOptions.format === 'both') && (
                  <Card className="bg-white/[0.02] border border-white/[0.05]">
                    <CardHeader>
                      <CardTitle className="text-white text-xs">WebM Alpha Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white text-xs">Codec</Label>
                          <Select
                            value={exportOptions.webmOptions.codec}
                            onValueChange={(value: 'vp8' | 'vp9') =>
                              setExportOptions(prev => ({
                                ...prev,
                                webmOptions: { ...prev.webmOptions, codec: value }
                              }))
                            }
                          >
                            <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vp8">VP8 (compatible)</SelectItem>
                              <SelectItem value="vp9">VP9 (better quality)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white text-xs">Bitrate: {exportOptions.webmOptions.bitrate} Mbps</Label>
                          <Slider
                            value={[exportOptions.webmOptions.bitrate]}
                            onValueChange={([bitrate]) =>
                              setExportOptions(prev => ({
                                ...prev,
                                webmOptions: { ...prev.webmOptions, bitrate }
                              }))
                            }
                            min={5}
                            max={25}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white text-xs">Two-Pass Encoding</Label>
                          <p className="text-xs text-white/40">Better quality, slower encoding</p>
                        </div>
                        <Switch
                          checked={exportOptions.webmOptions.twoPassEncoding}
                          onCheckedChange={(checked) =>
                            setExportOptions(prev => ({
                              ...prev,
                              webmOptions: { ...prev.webmOptions, twoPassEncoding: checked }
                            }))
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <Card className="bg-white/[0.03] border border-white/[0.08]">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  Resolution & Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-white">Size Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_SIZES.map((preset, index) => {
                      const Icon = preset.icon;
                      return (
                        <button
                          key={preset.name}
                          onClick={() => handlePresetChange(index)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            selectedPreset === index
                              ? "border-cyan-400 bg-cyan-500/20"
                              : "border-white/20 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="w-4 h-4" />
                            <span className="text-white text-sm font-medium">{preset.name}</span>
                          </div>
                          <p className="text-xs text-white/60">
                            {preset.width} × {preset.height}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedPreset === PRESET_SIZES.length - 1 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Width</Label>
                      <Input
                        type="number"
                        value={customSize.width}
                        onChange={(e) => handleCustomSizeChange('width', parseInt(e.target.value) || 800)}
                        className="bg-white/[0.03] border-white/[0.08] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Height</Label>
                      <Input
                        type="number"
                        value={customSize.height}
                        onChange={(e) => handleCustomSizeChange('height', parseInt(e.target.value) || 600)}
                        className="bg-white/[0.03] border-white/[0.08] text-white"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-white">Scale Factor</Label>
                    <span className="text-sm text-white">{exportOptions.scale}x</span>
                  </div>
                  <Slider
                    value={[exportOptions.scale]}
                    onValueChange={([scale]) =>
                      setExportOptions(prev => ({ ...prev, scale }))
                    }
                    min={0.5}
                    max={4.0}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-xs text-white/40">
                    Higher scale = better quality but larger file size
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Frame Rate (FPS)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_FRAME_RATES.map((fps) => (
                      <button
                        key={fps}
                        onClick={() => setExportOptions(prev => ({ ...prev, frameRate: fps }))}
                        className={`p-2 rounded border text-center transition-all ${
                          exportOptions.frameRate === fps
                            ? "border-cyan-400 bg-cyan-500/20 text-cyan-400"
                            : "border-white/20 bg-white/5 hover:bg-white/10 text-white"
                        }`}
                      >
                        {fps}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card className="bg-white/[0.03] border border-white/[0.08]">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Export Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs text-white/60">Final Resolution</p>
                    <p className="text-white font-medium">
                      {Math.round(exportOptions.width * exportOptions.scale)} × {Math.round(exportOptions.height * exportOptions.scale)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-white/60">Frame Count</p>
                    <p className="text-white font-medium">{frameCount} frames</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-white/60">Frame Rate</p>
                    <p className="text-white font-medium">{exportOptions.frameRate} FPS</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-white/60">Duration</p>
                    <p className="text-white font-medium">{exportOptions.duration}s</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-white/60">Estimated File Sizes (Optimized)</p>
                  <div className="flex gap-2">
                    {(exportOptions.format === 'png-sequence' || exportOptions.format === 'both') && (
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        PNG: ~{pngSize.toFixed(1)}MB
                      </Badge>
                    )}
                    {(exportOptions.format === 'webm-alpha' || exportOptions.format === 'both') && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        WebM: ~{webmSize.toFixed(1)}MB
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-white/60">Optimizations Applied</p>
                  <div className="flex gap-2 flex-wrap">
                    {exportOptions.pngOptions.format === '8bit' && (
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        8-bit PNG
                      </Badge>
                    )}
                    {exportOptions.webmOptions.codec === 'vp9' && (
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        VP9 Codec
                      </Badge>
                    )}
                    {exportOptions.webmOptions.twoPassEncoding && (
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                        Two-Pass
                      </Badge>
                    )}
                    {exportOptions.preserveAnimations && (
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                        Transitions
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Cpu className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-cyan-200 font-medium mb-2">Enhanced Export Features</p>
                  <ul className="text-cyan-200/80 space-y-1 text-xs">
                    <li>• 8-bit PNG optimization reduces file sizes by up to 75%</li>
                    <li>• VP9 codec with alpha channel for superior WebM quality</li>
                    <li>• Hardware-accelerated transitions with transform3d</li>
                    <li>• Consistent frame dimensions and color profiles</li>
                    <li>• Professional naming convention: sequence_0001.png</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-4 border-t border-white/[0.08]">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-white/20 bg-white/5 hover:bg-white/10 text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || (!exportOptions.includeCounter && !exportOptions.includeText)}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export Optimized
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};