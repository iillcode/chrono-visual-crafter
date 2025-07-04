import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ControlPanelProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  settings,
  onSettingsChange,
}) => {
  return (
    <div className="space-y-4">
      <Card className="!bg-[#101010] border-gray-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-medium flex items-center gap-2">
            ⚙️ Counter Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Start Value</Label>
              <Input
                type="number"
                value={settings.startValue}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    startValue: parseInt(e.target.value) || 0,
                  })
                }
                className="bg-[#181818] border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">End Value</Label>
              <Input
                type="number"
                value={settings.endValue}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    endValue: parseInt(e.target.value) || 100,
                  })
                }
                className="bg-[#181818] border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Duration (seconds): {settings.duration}</Label>
            <Slider
              value={[settings.duration]}
              onValueChange={([duration]) =>
                onSettingsChange({ ...settings, duration })
              }
              min={1}
              max={30}
              step={0.5}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Font Family</Label>
            <Select
              value={settings.fontFamily}
              onValueChange={(fontFamily) =>
                onSettingsChange({ ...settings, fontFamily })
              }
            >
              <SelectTrigger className="bg-[#181818] border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="orbitron">Orbitron</SelectItem>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="montserrat">Montserrat</SelectItem>
                <SelectItem value="arial">Arial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Font Size: {settings.fontSize}px</Label>
            <Slider
              value={[settings.fontSize]}
              onValueChange={([fontSize]) =>
                onSettingsChange({ ...settings, fontSize })
              }
              min={40}
              max={300}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Transition Effect</Label>
            <Select
              value={settings.transition}
              onValueChange={(transition) =>
                onSettingsChange({ ...settings, transition })
              }
            >
              <SelectTrigger className="bg-[#181818] border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="slideUp">Slide Up</SelectItem>
                <SelectItem value="slideDown">Slide Down</SelectItem>
                <SelectItem value="slideLeft">Slide Left</SelectItem>
                <SelectItem value="slideRight">Slide Right</SelectItem>
                <SelectItem value="fadeIn">Fade In</SelectItem>
                <SelectItem value="scale">Scale</SelectItem>
                <SelectItem value="rotate">Rotate</SelectItem>
                <SelectItem value="bounce">Bounce</SelectItem>
                <SelectItem value="elastic">Elastic</SelectItem>
                <SelectItem value="wave">Wave</SelectItem>
                <SelectItem value="spiral">Spiral</SelectItem>
                <SelectItem value="zoom">Zoom</SelectItem>
                <SelectItem value="flip">Flip</SelectItem>
                <SelectItem value="typewriter">Typewriter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Number Format</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs text-gray-400">Prefix</Label>
                <Input
                  value={settings.prefix || ""}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, prefix: e.target.value })
                  }
                  placeholder="$, #, etc."
                  className="bg-[#181818] border-gray-600 text-white text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-400">Suffix</Label>
                <Input
                  value={settings.suffix || ""}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, suffix: e.target.value })
                  }
                  placeholder="%, K, M, etc."
                  className="bg-[#181818] border-gray-600 text-white text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Number Separator</Label>
            <Select
              value={settings.separator || "none"}
              onValueChange={(separator) =>
                onSettingsChange({ ...settings, separator })
              }
            >
              <SelectTrigger className="bg-[#181818] border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (1234567)</SelectItem>
                <SelectItem value="comma">Comma (1,234,567)</SelectItem>
                <SelectItem value="dot">Dot (1.234.567)</SelectItem>
                <SelectItem value="space">Space (1 234 567)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Background</Label>
            <Select
              value={settings.background}
              onValueChange={(background) =>
                onSettingsChange({ ...settings, background })
              }
            >
              <SelectTrigger className="bg-[#181818] border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="transparent">Transparent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Animation Speed: {settings.speed}x</Label>
            <Slider
              value={[settings.speed]}
              onValueChange={([speed]) =>
                onSettingsChange({ ...settings, speed })
              }
              min={0.1}
              max={5}
              step={0.1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControlPanel;