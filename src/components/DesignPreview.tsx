import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DesignPreviewProps {
  selectedDesign: string;
  onDesignChange: (design: string) => void;
}

const DesignPreview: React.FC<DesignPreviewProps> = ({
  selectedDesign,
  onDesignChange,
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
      preview: (
        <div
          className="text-2xl font-bold text-cyan-400"
          style={{
            textShadow: "0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF",
          }}
        >
          123
        </div>
      ),
    },
    {
      id: "glow",
      name: "Glow",
      preview: (
        <div
          className="text-2xl font-bold text-white"
          style={{
            textShadow: "0 0 15px #FFFFFF, 0 0 25px #FFFFFF",
          }}
        >
          123
        </div>
      ),
    },
    {
      id: "gradient",
      name: "Gradient",
      preview: (
        <div
          className="text-2xl font-bold"
          style={{
            background:
              "linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7)",
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
      preview: (
        <div
          className="text-2xl font-bold"
          style={{
            background: "linear-gradient(45deg, #FF4444, #FF8800, #FFFF00)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textShadow: "0 0 10px #FF4444",
          }}
        >
          123
        </div>
      ),
    },
    {
      id: "rainbow",
      name: "Rainbow",
      preview: (
        <div
          className="text-2xl font-bold"
          style={{
            background:
              "linear-gradient(45deg, #FF0000, #FF8800, #FFFF00, #00FF00, #0088FF, #8800FF, #FF0088)",
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
      preview: (
        <div
          className="text-2xl font-bold"
          style={{
            background: "linear-gradient(45deg, #FFFFFF, #CCCCCC, #999999)",
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
                  p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105
                  ${
                    selectedDesign === design.id
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-gray-600 bg-gray-800/50 hover:border-gray-500"
                  }
                `}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="!bg-[#181818]/80 rounded p-2 min-h-[50px] flex items-center justify-center w-full">
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

      {/* Effect Previews */}
      <Card className="!bg-[#101010] border-gray-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-medium">
            Selected: {designs.find((d) => d.id === selectedDesign)?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="!bg-[#181818]/60 rounded-lg p-6 flex items-center justify-center min-h-[100px]">
            <div className="scale-150">
              {designs.find((d) => d.id === selectedDesign)?.preview}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignPreview;
