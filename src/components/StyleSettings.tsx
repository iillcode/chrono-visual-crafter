import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StyleSettingsProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
}

const StyleSettings: React.FC<StyleSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  return (
    <div className="space-y-4">
      <Card className="!bg-[#101010] border-gray-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-medium flex items-center gap-2">
            🎨 Style Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Background Style</Label>
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
                <SelectItem value="gradient">Gradient</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {settings.background === "gradient" && (
            <div className="space-y-2">
              <Label className="text-white">Background Gradient</Label>
              <Input
                value={settings.backgroundGradient}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    backgroundGradient: e.target.value,
                  })
                }
                placeholder="linear-gradient(45deg, #2193b0, #6dd5ed)"
                className="bg-[#181818] border-gray-600 text-white"
              />
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  {
                    name: "Ocean",
                    value: "linear-gradient(45deg, #2193b0, #6dd5ed)",
                  },
                  {
                    name: "Sunset",
                    value: "linear-gradient(45deg, #ff7e5f, #feb47b)",
                  },
                  {
                    name: "Purple",
                    value: "linear-gradient(45deg, #667eea, #764ba2)",
                  },
                  {
                    name: "Green",
                    value: "linear-gradient(45deg, #56ab2f, #a8e6cf)",
                  },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() =>
                      onSettingsChange({
                        ...settings,
                        backgroundGradient: preset.value,
                      })
                    }
                    className="flex flex-col items-center p-2 border border-gray-800 rounded-md hover:border-gray-600"
                  >
                    <div
                      className="w-full h-6 rounded-sm mb-1"
                      style={{ background: preset.value }}
                    />
                    <span className="text-xs text-white">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-white">Number Separator</Label>
            <Select
              value={settings.separator}
              onValueChange={(separator) =>
                onSettingsChange({ ...settings, separator })
              }
            >
              <SelectTrigger className="bg-[#181818] border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="comma">Comma (1,000)</SelectItem>
                <SelectItem value="dot">Dot (1.000)</SelectItem>
                <SelectItem value="space">Space (1 000)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Prefix</Label>
            <Input
              value={settings.prefix || ""}
              onChange={(e) =>
                onSettingsChange({ ...settings, prefix: e.target.value })
              }
              placeholder="e.g., $, #, @"
              className="bg-[#181818] border-gray-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Suffix</Label>
            <Input
              value={settings.suffix || ""}
              onChange={(e) =>
                onSettingsChange({ ...settings, suffix: e.target.value })
              }
              placeholder="e.g., %, K, M"
              className="bg-[#181818] border-gray-600 text-white"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-white">Use Float Values</Label>
            <Switch
              checked={settings.useFloatValues}
              onCheckedChange={(useFloatValues) =>
                onSettingsChange({ ...settings, useFloatValues })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Animation Easing</Label>
            <Select
              value={settings.easing}
              onValueChange={(easing) =>
                onSettingsChange({ ...settings, easing })
              }
            >
              <SelectTrigger className="bg-[#181818] border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="easeIn">Ease In</SelectItem>
                <SelectItem value="easeOut">Ease Out</SelectItem>
                <SelectItem value="bounce">Bounce</SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="fade">Fade</SelectItem>
                <SelectItem value="slide">Slide</SelectItem>
                <SelectItem value="scale">Scale</SelectItem>
                <SelectItem value="flip">Flip</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Style Preview */}
      <Card className="!bg-[#101010] border-gray-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-medium">
            Style Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="rounded-lg p-6 flex items-center justify-center min-h-[100px]"
            style={{
              background:
                settings.background === "gradient"
                  ? settings.backgroundGradient
                  : settings.background === "white"
                  ? "#FFFFFF"
                  : settings.background === "transparent"
                  ? "transparent"
                  : "#000000",
            }}
          >
            <div
              className="text-2xl font-bold"
              style={{
                color: settings.background === "white" ? "#000000" : "#FFFFFF",
              }}
            >
              {settings.prefix || ""}123{settings.suffix || ""}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StyleSettings;
