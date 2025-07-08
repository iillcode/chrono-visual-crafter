import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface TextControlsProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
}

const TextControls: React.FC<TextControlsProps> = ({
  settings,
  onSettingsChange,
}) => {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <Card className="!bg-[#101010] border-gray-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-medium flex items-center gap-2">
            📝 Text Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white">Enable Text</Label>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(enabled) =>
                onSettingsChange({ ...settings, enabled })
              }
            />
          </div>

          {settings.enabled && (
            <>
              <div className="space-y-2">
                <Label className="text-white">Text Content</Label>
                <Input
                  value={settings.text}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, text: e.target.value })
                  }
                  placeholder="Enter your text"
                  className="bg-[#181818] border-gray-600 text-white"
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
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="orbitron">Orbitron</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="montserrat">Montserrat</SelectItem>
                    <SelectItem value="arial">Arial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">
                  Font Size: {settings.fontSize}px
                </Label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={([fontSize]) =>
                    onSettingsChange({ ...settings, fontSize })
                  }
                  min={12}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={settings.color}
                    onChange={(e) =>
                      onSettingsChange({ ...settings, color: e.target.value })
                    }
                    className="w-12 h-8 bg-[#181818] border-gray-600"
                  />
                  <Input
                    value={settings.color}
                    onChange={(e) =>
                      onSettingsChange({ ...settings, color: e.target.value })
                    }
                    className="bg-[#181818] border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Position Control</Label>
                <div className="bg-[#191919] rounded-lg p-3 border border-gray-700/50">
                  {/* Position toggle buttons */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="col-start-2">
                      <button
                        type="button"
                        onClick={() =>
                          onSettingsChange({
                            ...settings,
                            position: "top",
                            offsetX: 0,
                            offsetY: -80,
                          })
                        }
                        className={`w-full py-1 px-2 text-xs rounded-md flex items-center justify-center ${
                          settings.position === "top"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        Top
                      </button>
                    </div>

                    <div className="col-start-1 col-end-2 row-start-2">
                      <button
                        type="button"
                        onClick={() =>
                          onSettingsChange({
                            ...settings,
                            position: "left",
                            offsetX: -120,
                            offsetY: 0,
                          })
                        }
                        className={`w-full py-1 px-2 text-xs rounded-md flex items-center justify-center ${
                          settings.position === "left"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        Left
                      </button>
                    </div>

                    <div className="col-start-2 row-start-2">
                      <div className="bg-gray-700/30 rounded-md p-2 text-center">
                        <div className="text-[10px] text-gray-400">Counter</div>
                      </div>
                    </div>

                    <div className="col-start-3 col-end-4 row-start-2">
                      <button
                        type="button"
                        onClick={() =>
                          onSettingsChange({
                            ...settings,
                            position: "right",
                            offsetX: 120,
                            offsetY: 0,
                          })
                        }
                        className={`w-full py-1 px-2 text-xs rounded-md flex items-center justify-center ${
                          settings.position === "right"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        Right
                      </button>
                    </div>

                    <div className="col-start-2 row-start-3">
                      <button
                        type="button"
                        onClick={() =>
                          onSettingsChange({
                            ...settings,
                            position: "bottom",
                            offsetX: 0,
                            offsetY: 80,
                          })
                        }
                        className={`w-full py-1 px-2 text-xs rounded-md flex items-center justify-center ${
                          settings.position === "bottom"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        Bottom
                      </button>
                    </div>
                  </div>

                  {/* Visual preview */}
                  <div className="relative w-full h-36 bg-[#121212] rounded-md border border-gray-800 overflow-hidden mb-3">
                    {/* Counter representation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-blue-500/20 border border-blue-500 rounded-md px-4 py-2 text-sm text-center text-white">
                        123
                      </div>
                    </div>

                    {/* Text position preview */}
                    <div
                      className="absolute bg-green-500/20 border border-green-500 rounded-md px-3 py-1 text-xs text-center text-white whitespace-nowrap"
                      style={{
                        left: `calc(50% + ${settings.offsetX}px)`,
                        top: `calc(50% + ${settings.offsetY}px)`,
                        transform: "translate(-50%, -50%)",
                        transition: "all 0.2s ease",
                        opacity: settings.text ? 1 : 0.5,
                      }}
                    >
                      {settings.text || "Text"}
                    </div>
                  </div>

                  <div className="flex gap-3 mb-2">
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <Label className="text-xs text-gray-400">
                          X Offset
                        </Label>
                        <span className="text-xs text-gray-400">
                          {settings.offsetX}px
                        </span>
                      </div>
                      <Slider
                        value={[settings.offsetX]}
                        onValueChange={([offsetX]) =>
                          onSettingsChange({ ...settings, offsetX })
                        }
                        min={-300}
                        max={300}
                        step={5}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <Label className="text-xs text-gray-400">
                          Y Offset
                        </Label>
                        <span className="text-xs text-gray-400">
                          {settings.offsetY}px
                        </span>
                      </div>
                      <Slider
                        value={[settings.offsetY]}
                        onValueChange={([offsetY]) =>
                          onSettingsChange({ ...settings, offsetY })
                        }
                        min={-300}
                        max={300}
                        step={5}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-800 text-xs text-gray-400">
                    <p className="mb-1">
                      Tip: Adjust position using the buttons and fine-tune with
                      sliders
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">
                  Opacity: {Math.round(settings.opacity * 100)}%
                </Label>
                <Slider
                  value={[settings.opacity]}
                  onValueChange={([opacity]) =>
                    onSettingsChange({ ...settings, opacity })
                  }
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TextControls;
