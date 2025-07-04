import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface TextControlsProps {
  settings: {
    enabled: boolean;
    text: string;
    position: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    offsetX: number;
    offsetY: number;
    opacity: number;
  };
  onSettingsChange: (settings: any) => void;
}

const TextControls: React.FC<TextControlsProps> = ({
  settings,
  onSettingsChange,
}) => {
  const updateSetting = (key: string, value: any) => {
    onSettingsChange((prev) => ({ ...prev, [key]: value }));
  };

  const fontOptions = [
    { value: "inter", label: "Inter" },
    { value: "mono", label: "Roboto Mono" },
    { value: "poppins", label: "Poppins" },
    { value: "orbitron", label: "Orbitron" },
    { value: "rajdhani", label: "Rajdhani" },
  ];

  const positionOptions = [
    { value: "top", label: "Top" },
    { value: "bottom", label: "Bottom" },
    { value: "left", label: "Left" },
    { value: "right", label: "Right" },
    { value: "center", label: "Center" },
  ];

  const colorOptions = [
    { value: "#ffffff", label: "White", preview: "#ffffff" },
    { value: "#000000", label: "Black", preview: "#000000" },
    { value: "#ff0000", label: "Red", preview: "#ff0000" },
    { value: "#00ff00", label: "Green", preview: "#00ff00" },
    { value: "#0000ff", label: "Blue", preview: "#0000ff" },
    { value: "#ffff00", label: "Yellow", preview: "#ffff00" },
    { value: "#ff00ff", label: "Magenta", preview: "#ff00ff" },
    { value: "#00ffff", label: "Cyan", preview: "#00ffff" },
    {
      value: "gradient-rainbow",
      label: "Rainbow Gradient",
      preview:
        "linear-gradient(45deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff)",
    },
    {
      value: "gradient-fire",
      label: "Fire Gradient",
      preview: "linear-gradient(45deg, #ff4444, #ff8800, #ffff00)",
    },
    {
      value: "gradient-ocean",
      label: "Ocean Gradient",
      preview: "linear-gradient(45deg, #00aaff, #0066cc, #003388)",
    },
    {
      value: "gradient-sunset",
      label: "Sunset Gradient",
      preview: "linear-gradient(45deg, #ff6b6b, #ff8e53, #ff6b9d)",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Enable Text */}
      <Card className="!bg-[#101010] border-gray-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-medium flex items-center gap-2">
            📝 Text Element
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-gray-300 text-sm">Enable Text</Label>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(value) => updateSetting("enabled", value)}
            />
          </div>

          {settings.enabled && (
            <>
              <div className="space-y-2">
                <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">
                  Text Content
                </Label>
                <Textarea
                  value={settings.text}
                  onChange={(e) => updateSetting("text", e.target.value)}
                  placeholder="Enter your text..."
                  className="!bg-[#181818]/80 border-gray-600/50 text-white text-sm resize-none h-20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">
                  Position
                </Label>
                <Select
                  value={settings.position}
                  onValueChange={(value) => updateSetting("position", value)}
                >
                  <SelectTrigger className="!bg-[#181818]/80 border-gray-600/50 text-white text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="!bg-[#101010] border-gray-600">
                    {positionOptions.map((pos) => (
                      <SelectItem
                        key={pos.value}
                        value={pos.value}
                        className="!bg-[#101010] text-white text-sm data-[state=checked]:!bg-[#101010] data-[state=checked]:text-white"
                      >
                        {pos.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {settings.enabled && (
        <>
          {/* Typography */}
          <Card className="!bg-[#101010] border-gray-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base font-medium">
                Typography
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">
                  Font Family
                </Label>
                <Select
                  value={settings.fontFamily}
                  onValueChange={(value) => updateSetting("fontFamily", value)}
                >
                  <SelectTrigger className="!bg-[#181818]/80 border-gray-600/50 text-white text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="!bg-[#101010] border-gray-600">
                    {fontOptions.map((font) => (
                      <SelectItem
                        key={font.value}
                        value={font.value}
                        className="!bg-[#101010] text-white text-sm data-[state=checked]:!bg-[#101010] data-[state=checked]:text-white"
                      >
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">
                    Font Size
                  </Label>
                  <span className="text-blue-400 text-sm font-medium">
                    {settings.fontSize}px
                  </span>
                </div>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={(value) => updateSetting("fontSize", value[0])}
                  min={12}
                  max={120}
                  step={2}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">
                  Text Color & Gradients
                </Label>
                <Select
                  value={settings.color}
                  onValueChange={(value) => updateSetting("color", value)}
                >
                  <SelectTrigger className="!bg-[#181818]/80 border-gray-600/50 text-white text-sm h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="!bg-[#101010] border-gray-600 max-h-60">
                    {colorOptions.map((color) => (
                      <SelectItem
                        key={color.value}
                        value={color.value}
                        className="!bg-[#101010] text-white text-sm data-[state=checked]:!bg-[#101010] data-[state=checked]:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded border border-gray-500"
                            style={{
                              background: color.preview.startsWith(
                                "linear-gradient"
                              )
                                ? color.preview
                                : color.preview,
                            }}
                          />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">
                  Custom Color
                </Label>
                <Input
                  type="color"
                  value={
                    settings.color.startsWith("#") ? settings.color : "#ffffff"
                  }
                  onChange={(e) => updateSetting("color", e.target.value)}
                  className="!bg-[#181818]/80 border-gray-600/50 h-9 w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">
                    Opacity
                  </Label>
                  <span className="text-purple-400 text-sm font-medium">
                    {Math.round(settings.opacity * 100)}%
                  </span>
                </div>
                <Slider
                  value={[settings.opacity]}
                  onValueChange={(value) => updateSetting("opacity", value[0])}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Position Fine-tuning */}
          <Card className="!bg-[#101010] border-gray-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base font-medium">
                Position Offset
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">
                    Horizontal Offset
                  </Label>
                  <span className="text-green-400 text-sm font-medium">
                    {settings.offsetX}px
                  </span>
                </div>
                <Slider
                  value={[settings.offsetX]}
                  onValueChange={(value) => updateSetting("offsetX", value[0])}
                  min={-200}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">
                    Vertical Offset
                  </Label>
                  <span className="text-green-400 text-sm font-medium">
                    {settings.offsetY}px
                  </span>
                </div>
                <Slider
                  value={[settings.offsetY]}
                  onValueChange={(value) => updateSetting("offsetY", value[0])}
                  min={-200}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview Demo */}
          <Card className="!bg-[#101010] border-gray-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base font-medium">
                Text Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="!bg-[#181818]/60 rounded-lg p-4 min-h-[80px] flex items-center justify-center">
                <div
                  className="text-center"
                  style={{
                    fontSize: `${Math.min(settings.fontSize, 32)}px`,
                    fontFamily: settings.fontFamily,
                    color: settings.color.startsWith("gradient-")
                      ? "transparent"
                      : settings.color,
                    background: settings.color.startsWith("gradient-")
                      ? colorOptions.find((c) => c.value === settings.color)
                          ?.preview || "white"
                      : "transparent",
                    backgroundClip: settings.color.startsWith("gradient-")
                      ? "text"
                      : "unset",
                    WebkitBackgroundClip: settings.color.startsWith("gradient-")
                      ? "text"
                      : "unset",
                    opacity: settings.opacity,
                  }}
                >
                  {settings.text || "Sample Text"}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default TextControls;
