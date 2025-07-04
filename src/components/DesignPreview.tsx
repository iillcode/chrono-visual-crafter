
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface DesignPreviewProps {
  selectedDesign: string;
  onDesignChange: (design: string) => void;
  designSettings?: any;
  onDesignSettingsChange?: (settings: any) => void;
}

const DesignPreview: React.FC<DesignPreviewProps> = ({
  selectedDesign,
  onDesignChange,
  designSettings = {},
  onDesignSettingsChange = () => {},
}) => {
  const designs = [
    {
      id: "classic",
      name: "Classic",
      preview: <div className="text-2xl font-bold text-white">123</div>,
    },
    {
      id: "neon",
      name: "Neon",
      customizable: true,
      preview: (
        <div
          className="text-2xl font-bold"
          style={{
            color: designSettings.neonColor || "#00FFFF",
            textShadow: `0 0 ${designSettings.neonIntensity || 10}px ${designSettings.neonColor || "#00FFFF"}, 0 0 ${(designSettings.neonIntensity || 10) * 2}px ${designSettings.neonColor || "#00FFFF"}, 0 0 ${(designSettings.neonIntensity || 10) * 3}px ${designSettings.neonColor || "#00FFFF"}`,
          }}
        >
          123
        </div>
      ),
    },
    {
      id: "glow",
      name: "Glow",
      customizable: true,
      preview: (
        <div
          className="text-2xl font-bold"
          style={{
            color: designSettings.glowColor || "#FFFFFF",
            textShadow: `0 0 ${designSettings.glowIntensity || 15}px ${designSettings.glowColor || "#FFFFFF"}, 0 0 ${(designSettings.glowIntensity || 15) * 1.5}px ${designSettings.glowColor || "#FFFFFF"}`,
          }}
        >
          123
        </div>
      ),
    },
    {
      id: "gradient",
      name: "Gradient",
      customizable: true,
      preview: (
        <div
          className="text-2xl font-bold"
          style={{
            background: designSettings.gradientColors || "linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          123
        </div>
      ),
    },
    {
      id: "fire",
      name: "Fire",
      customizable: true,
      preview: (
        <div
          className="text-2xl font-bold"
          style={{
            background: designSettings.fireColors || "linear-gradient(45deg, #FF4444, #FF8800, #FFFF00)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textShadow: `0 0 ${designSettings.fireGlow || 10}px #FF4444`,
          }}
        >
          123
        </div>
      ),
    },
    {
      id: "rainbow",
      name: "Rainbow",
      customizable: true,
      preview: (
        <div
          className="text-2xl font-bold"
          style={{
            background: designSettings.rainbowColors || "linear-gradient(45deg, #FF0000, #FF8800, #FFFF00, #00FF00, #0088FF, #8800FF, #FF0088)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          123
        </div>
      ),
    },
    {
      id: "chrome",
      name: "Chrome",
      customizable: true,
      preview: (
        <div
          className="text-2xl font-bold"
          style={{
            background: designSettings.chromeColors || "linear-gradient(45deg, #FFFFFF, #CCCCCC, #999999)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          123
        </div>
      ),
    },
  ];

  const selectedDesignObj = designs.find((d) => d.id === selectedDesign);

  return (
    <div className="space-y-4">
      <Card className="!bg-[#101010] border-gray-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-medium flex items-center gap-2">
            🎨 Design Styles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {designs.map((design) => (
              <button
                key={design.id}
                onClick={() => onDesignChange(design.id)}
                className={`
                  p-4 rounded-lg border transition-all duration-200 hover:scale-105
                  ${
                    selectedDesign === design.id
                      ? "border-gray-600 bg-[#181818]/60"
                      : " border-gray-700/50 bg-[#101010] hover:border-gray-500"
                  }
                `}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className=" rounded p-2 min-h-[50px] flex items-center justify-center w-full">
                    {design.preview}
                  </div>
                  <span className="text-white text-sm font-medium">
                    {design.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customization Controls */}
      {selectedDesignObj?.customizable && (
        <Card className="!bg-[#101010] border-gray-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base font-medium">
              🎛️ Customize {selectedDesignObj.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDesign === "neon" && (
              <>
                <div className="space-y-2">
                  <Label className="text-white">Neon Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={designSettings.neonColor || "#00FFFF"}
                      onChange={(e) =>
                        onDesignSettingsChange({
                          ...designSettings,
                          neonColor: e.target.value
                        })
                      }
                      className="w-12 h-8 bg-[#181818] border-gray-600"
                    />
                    <Input
                      value={designSettings.neonColor || "#00FFFF"}
                      onChange={(e) =>
                        onDesignSettingsChange({
                          ...designSettings,
                          neonColor: e.target.value
                        })
                      }
                      className="bg-[#181818] border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Intensity: {designSettings.neonIntensity || 10}px</Label>
                  <Slider
                    value={[designSettings.neonIntensity || 10]}
                    onValueChange={([intensity]) =>
                      onDesignSettingsChange({
                        ...designSettings,
                        neonIntensity: intensity
                      })
                    }
                    min={5}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>
              </>
            )}

            {selectedDesign === "glow" && (
              <>
                <div className="space-y-2">
                  <Label className="text-white">Glow Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={designSettings.glowColor || "#FFFFFF"}
                      onChange={(e) =>
                        onDesignSettingsChange({
                          ...designSettings,
                          glowColor: e.target.value
                        })
                      }
                      className="w-12 h-8 bg-[#181818] border-gray-600"
                    />
                    <Input
                      value={designSettings.glowColor || "#FFFFFF"}
                      onChange={(e) =>
                        onDesignSettingsChange({
                          ...designSettings,
                          glowColor: e.target.value
                        })
                      }
                      className="bg-[#181818] border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Intensity: {designSettings.glowIntensity || 15}px</Label>
                  <Slider
                    value={[designSettings.glowIntensity || 15]}
                    onValueChange={([intensity]) =>
                      onDesignSettingsChange({
                        ...designSettings,
                        glowIntensity: intensity
                      })
                    }
                    min={5}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>
              </>
            )}

            {(selectedDesign === "gradient" || selectedDesign === "fire" || selectedDesign === "rainbow" || selectedDesign === "chrome") && (
              <div className="space-y-2">
                <Label className="text-white">Custom Gradient</Label>
                <Input
                  value={
                    selectedDesign === "gradient" ? (designSettings.gradientColors || "linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7)") :
                    selectedDesign === "fire" ? (designSettings.fireColors || "linear-gradient(45deg, #FF4444, #FF8800, #FFFF00)") :
                    selectedDesign === "rainbow" ? (designSettings.rainbowColors || "linear-gradient(45deg, #FF0000, #FF8800, #FFFF00, #00FF00, #0088FF, #8800FF, #FF0088)") :
                    (designSettings.chromeColors || "linear-gradient(45deg, #FFFFFF, #CCCCCC, #999999)")
                  }
                  onChange={(e) => {
                    const key = selectedDesign === "gradient" ? "gradientColors" :
                                selectedDesign === "fire" ? "fireColors" :
                                selectedDesign === "rainbow" ? "rainbowColors" : "chromeColors";
                    onDesignSettingsChange({
                      ...designSettings,
                      [key]: e.target.value
                    });
                  }}
                  placeholder="linear-gradient(...)"
                  className="bg-[#181818] border-gray-600 text-white text-xs"
                />
              </div>
            )}

            {selectedDesign === "fire" && (
              <div className="space-y-2">
                <Label className="text-white">Fire Glow: {designSettings.fireGlow || 10}px</Label>
                <Slider
                  value={[designSettings.fireGlow || 10]}
                  onValueChange={([glow]) =>
                    onDesignSettingsChange({
                      ...designSettings,
                      fireGlow: glow
                    })
                  }
                  min={0}
                  max={30}
                  step={1}
                  className="w-full"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Effect Preview */}
      <Card className="!bg-[#101010] border-gray-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-medium">
            Preview: {selectedDesignObj?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="!bg-[#181818]/60 rounded-lg p-6 flex items-center justify-center min-h-[100px]">
            <div className="scale-150">
              {selectedDesignObj?.preview}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignPreview;
