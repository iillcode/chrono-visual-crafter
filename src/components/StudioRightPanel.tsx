import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Palette, Type, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMobileDetection } from "@/hooks/useMobileDetection";

interface StudioRightPanelProps {
  counterSettings: any;
  onCounterSettingsChange: (settings: any) => void;
  designSettings: any;
  onDesignSettingsChange: (settings: any) => void;
}

const StudioRightPanel: React.FC<StudioRightPanelProps> = ({
  counterSettings,
  onCounterSettingsChange,
  designSettings,
  onDesignSettingsChange,
}) => {
  const mobileDetection = useMobileDetection();

  // Background options with visual cards
  const backgroundOptions = [
    { id: "black", label: "Black", color: "#000000" },
    { id: "white", label: "White", color: "#FFFFFF" },
    { id: "transparent", label: "Transparent", color: "transparent" },
    { id: "gradient", label: "Gradient", color: "gradient" },
    { id: "custom", label: "Custom", color: "custom" },
  ];

  // Font family options
  const fontOptions = [
    { id: "orbitron", label: "Orbitron" },
    { id: "inter", label: "Inter" },
    { id: "roboto", label: "Roboto" },
    { id: "montserrat", label: "Montserrat" },
    { id: "arial", label: "Arial" },
    { id: "custom", label: "Custom Font" },
  ];

  const handleCustomFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a URL for the font file
    const fontUrl = URL.createObjectURL(file);

    // Create a new style element to load the font
    const fontFace = new FontFace(
      `custom-font-${Date.now()}`,
      `url(${fontUrl})`
    );

    fontFace
      .load()
      .then((loadedFace) => {
        document.fonts.add(loadedFace);

        // Update the settings with the custom font
        onCounterSettingsChange({
          ...counterSettings,
          fontFamily: loadedFace.family,
          customFont: fontUrl,
        });
      })
      .catch((err) => {
        console.error("Failed to load font:", err);
      });
  };

  return (
    <div
      className={`${
        mobileDetection.isMobile
          ? "w-full h-full bg-transparent"
          : "w-80 h-full bg-[#0C0C0C]"
      } flex flex-col overflow-hidden`}
    >
      <ScrollArea
        className={`flex-1 ${
          mobileDetection.isMobile ? "p-0" : "p-4"
        } custom-scrollbar`}
      >
        <div
          className={`${mobileDetection.isMobile ? "space-y-4" : "space-y-6"}`}
        >
          {/* Background Settings */}
          <Card className="!bg-[#101010] border-gray-700/50">
            <CardHeader
              className={`${mobileDetection.isMobile ? "pb-1" : "pb-2"}`}
            >
              <CardTitle className="text-white text-base font-medium flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Background
              </CardTitle>
            </CardHeader>
            <CardContent
              className={`${
                mobileDetection.isMobile ? "space-y-3" : "space-y-4"
              }`}
            >
              <div
                className={`grid ${
                  mobileDetection.isMobile ? "grid-cols-2" : "grid-cols-3"
                } gap-3`}
              >
                {backgroundOptions.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() =>
                      onCounterSettingsChange({
                        ...counterSettings,
                        background: bg.id,
                      })
                    }
                    className={`relative p-3 rounded border ${
                      mobileDetection.isMobile ? "h-20 min-h-[44px]" : "h-16"
                    } flex flex-col items-center justify-center transition-all ${
                      counterSettings.background === bg.id
                        ? "border-[#2BA6FF] bg-[#2BA6FF]/10"
                        : "border-gray-600 hover:border-gray-400 hover:bg-gray-700/20"
                    }`}
                  >
                    <div
                      className={`w-full ${
                        mobileDetection.isMobile ? "h-10" : "h-8"
                      } rounded mb-1`}
                      style={{
                        background:
                          bg.color === "transparent"
                            ? "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 10px 10px"
                            : bg.color === "gradient"
                            ? counterSettings.backgroundGradient ||
                              "linear-gradient(45deg, #2193b0, #6dd5ed)"
                            : bg.color === "custom"
                            ? counterSettings.customBackgroundColor || "#333333"
                            : bg.color,
                      }}
                    ></div>
                    <span
                      className={`${
                        mobileDetection.isMobile ? "text-sm" : "text-xs"
                      } text-white font-medium`}
                    >
                      {bg.label}
                    </span>
                    {counterSettings.background === bg.id && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#2BA6FF] rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>

              {counterSettings.background === "gradient" && (
                <div className="space-y-4">
                  {/* Angle Selector */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-white">Angle</Label>
                      <span className="text-sm text-white">
                        {counterSettings.gradientAngle ?? 45}°
                      </span>
                    </div>
                    <Slider
                      value={[counterSettings.gradientAngle ?? 45]}
                      onValueChange={([angle]) => {
                        const updated = {
                          ...counterSettings,
                          gradientAngle: angle,
                          backgroundGradient: `linear-gradient(${angle}deg, ${
                            counterSettings.gradientColor1 || "#2193b0"
                          }, ${counterSettings.gradientColor2 || "#6dd5ed"})`,
                        };
                        onCounterSettingsChange(updated);
                      }}
                      min={0}
                      max={360}
                      step={1}
                      className={`w-full ${
                        mobileDetection.isMobile ? "h-8" : ""
                      }`}
                    />
                  </div>

                  {/* Color Pickers */}
                  <div
                    className={`grid ${
                      mobileDetection.isMobile
                        ? "grid-cols-1 gap-3"
                        : "grid-cols-2 gap-4"
                    }`}
                  >
                    <div className="space-y-2">
                      <Label className="text-white">Color 1</Label>
                      <Input
                        type="color"
                        value={counterSettings.gradientColor1 || "#2193b0"}
                        onChange={(e) => {
                          const color1 = e.target.value;
                          const updated = {
                            ...counterSettings,
                            gradientColor1: color1,
                            backgroundGradient: `linear-gradient(${
                              counterSettings.gradientAngle ?? 45
                            }deg, ${color1}, ${
                              counterSettings.gradientColor2 || "#6dd5ed"
                            })`,
                          };
                          onCounterSettingsChange(updated);
                        }}
                        className={`bg-[#181818] border-gray-600 text-white p-0 w-full ${
                          mobileDetection.isMobile
                            ? "h-12 min-h-[44px]"
                            : "h-10"
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Color 2</Label>
                      <Input
                        type="color"
                        value={counterSettings.gradientColor2 || "#6dd5ed"}
                        onChange={(e) => {
                          const color2 = e.target.value;
                          const updated = {
                            ...counterSettings,
                            gradientColor2: color2,
                            backgroundGradient: `linear-gradient(${
                              counterSettings.gradientAngle ?? 45
                            }deg, ${
                              counterSettings.gradientColor1 || "#2193b0"
                            }, ${color2})`,
                          };
                          onCounterSettingsChange(updated);
                        }}
                        className={`bg-[#181818] border-gray-600 text-white p-0 w-full ${
                          mobileDetection.isMobile
                            ? "h-12 min-h-[44px]"
                            : "h-10"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {counterSettings.background === "custom" && (
                <div className="space-y-2">
                  <Label className="text-white">Select Background Color</Label>
                  <Input
                    type="color"
                    value={counterSettings.customBackgroundColor || "#000000"}
                    onChange={(e) =>
                      onCounterSettingsChange({
                        ...counterSettings,
                        customBackgroundColor: e.target.value,
                      })
                    }
                    className={`bg-[#181818] border-gray-600 text-white p-0 w-full ${
                      mobileDetection.isMobile ? "h-12 min-h-[44px]" : "h-10"
                    }`}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Font Settings - Only show on desktop */}
          {!mobileDetection.isMobile && (
            <Card className="!bg-[#101010] border-gray-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-base font-medium flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Font Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Font Family */}
                <div className="space-y-3">
                  <Label className="text-white">Font Family</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {fontOptions.map((font) => (
                      <button
                        key={font.id}
                        onClick={() =>
                          onCounterSettingsChange({
                            ...counterSettings,
                            fontFamily: font.id,
                          })
                        }
                        className={`p-2 rounded border text-sm h-10 flex items-center justify-center transition-all ${
                          counterSettings.fontFamily === font.id
                            ? "bg-[#2BA6FF]/10 border-[#2BA6FF] text-[#2BA6FF]"
                            : "bg-[#181818] border-gray-600 text-white hover:bg-[#202020]"
                        }`}
                        style={{
                          fontFamily:
                            font.id !== "custom" ? font.id : "inherit",
                        }}
                      >
                        {font.id === "custom" ? (
                          <span className="flex items-center gap-1">
                            <Upload className="w-3 h-3" />
                            Custom
                          </span>
                        ) : (
                          font.label
                        )}
                      </button>
                    ))}
                  </div>

                  {counterSettings.fontFamily === "custom" && (
                    <div className="mt-2">
                      <Label className="text-xs text-gray-400 mb-1 block">
                        Upload Font (.woff, .ttf, .otf)
                      </Label>
                      <Input
                        type="file"
                        accept=".woff,.woff2,.ttf,.otf"
                        onChange={handleCustomFontUpload}
                        className="bg-[#181818] border-gray-600 text-white text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Font Size */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-white">Font Size</Label>
                    <span className="text-sm text-white">
                      {counterSettings.fontSize}px
                    </span>
                  </div>
                  <Slider
                    value={[counterSettings.fontSize]}
                    onValueChange={([fontSize]) =>
                      onCounterSettingsChange({ ...counterSettings, fontSize })
                    }
                    min={40}
                    max={300}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Font Weight */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-white">Font Weight</Label>
                    <span className="text-sm text-white">
                      {counterSettings.fontWeight || 400}
                    </span>
                  </div>
                  <Slider
                    value={[counterSettings.fontWeight || 400]}
                    onValueChange={([fontWeight]) =>
                      onCounterSettingsChange({
                        ...counterSettings,
                        fontWeight,
                      })
                    }
                    min={100}
                    max={900}
                    step={100}
                    className="w-full"
                  />
                </div>

                {/* Character Spacing */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-white">Character Spacing</Label>
                    <span className="text-sm text-white">
                      {counterSettings.letterSpacing || 0}px
                    </span>
                  </div>
                  <Slider
                    value={[counterSettings.letterSpacing || 0]}
                    onValueChange={([letterSpacing]) =>
                      onCounterSettingsChange({
                        ...counterSettings,
                        letterSpacing,
                      })
                    }
                    min={-5}
                    max={20}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Counter Color Settings - Only show on desktop */}
          {!mobileDetection.isMobile && (
            <Card className="!bg-[#101010] border-gray-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-base font-medium">
                  Counter Color
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label className="text-white">Text Color</Label>
                  <Input
                    type="color"
                    value={counterSettings.textColor || "#FFFFFF"}
                    onChange={(e) =>
                      onCounterSettingsChange({
                        ...counterSettings,
                        textColor: e.target.value,
                      })
                    }
                    className="bg-[#181818] border-gray-600 text-white p-0 h-10 w-full"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default StudioRightPanel;
