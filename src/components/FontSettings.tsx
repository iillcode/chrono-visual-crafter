import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FontSettingsProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
}

const FontSettings: React.FC<FontSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  return (
    <div className="space-y-4">
      <Card className="!bg-[#101010] border-gray-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-medium flex items-center gap-2">
            🔤 Font Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="orbitron">Orbitron</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="montserrat">Montserrat</SelectItem>
                <SelectItem value="arial">Arial</SelectItem>
                <SelectItem value="helvetica">Helvetica</SelectItem>
                <SelectItem value="times">Times New Roman</SelectItem>
                <SelectItem value="courier">Courier New</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white flex items-center justify-between">
              <span>Font Size</span>
              <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                {settings.fontSize}px
              </span>
            </Label>
            <Slider
              value={[settings.fontSize]}
              onValueChange={([fontSize]) =>
                onSettingsChange({ ...settings, fontSize })
              }
              min={12}
              max={300}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white flex items-center justify-between">
              <span>Font Weight</span>
              <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                {settings.fontWeight}
              </span>
            </Label>
            <Select
              value={settings.fontWeight?.toString()}
              onValueChange={(weight) =>
                onSettingsChange({ ...settings, fontWeight: parseInt(weight) })
              }
            >
              <SelectTrigger className="bg-[#181818] border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">Thin (100)</SelectItem>
                <SelectItem value="200">Extra Light (200)</SelectItem>
                <SelectItem value="300">Light (300)</SelectItem>
                <SelectItem value="400">Normal (400)</SelectItem>
                <SelectItem value="500">Medium (500)</SelectItem>
                <SelectItem value="600">Semi Bold (600)</SelectItem>
                <SelectItem value="700">Bold (700)</SelectItem>
                <SelectItem value="800">Extra Bold (800)</SelectItem>
                <SelectItem value="900">Black (900)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white flex items-center justify-between">
              <span>Letter Spacing</span>
              <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                {settings.letterSpacing}px
              </span>
            </Label>
            <Slider
              value={[settings.letterSpacing]}
              onValueChange={([letterSpacing]) =>
                onSettingsChange({ ...settings, letterSpacing })
              }
              min={-10}
              max={20}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Tight</span>
              <span>Wide</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Text Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.textColor}
                onChange={(e) =>
                  onSettingsChange({ ...settings, textColor: e.target.value })
                }
                className="w-12 h-10 p-1 bg-[#181818] border-gray-600 cursor-pointer"
              />
              <Input
                value={settings.textColor}
                onChange={(e) =>
                  onSettingsChange({ ...settings, textColor: e.target.value })
                }
                className="bg-[#181818] border-gray-600 text-white"
                placeholder="Hex color value"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Custom Font URL (Optional)</Label>
            <Input
              value={settings.customFont || ""}
              onChange={(e) =>
                onSettingsChange({ ...settings, customFont: e.target.value })
              }
              placeholder="https://fonts.googleapis.com/css2?family=..."
              className="bg-[#181818] border-gray-600 text-white"
            />
            <p className="text-xs text-gray-400">
              Enter a Google Fonts or custom font URL
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Font Preview */}
      <Card className="!bg-[#101010] border-gray-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-medium">
            Font Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="!bg-[#181818]/60 rounded-lg p-6 flex items-center justify-center min-h-[100px]">
            <div
              style={{
                fontFamily: settings.fontFamily,
                fontSize: Math.min(settings.fontSize, 48),
                fontWeight: settings.fontWeight,
                letterSpacing: `${settings.letterSpacing}px`,
                color: settings.textColor,
              }}
            >
              123
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FontSettings;
