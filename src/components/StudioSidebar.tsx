import React, { useState } from "react";
import { Type, Hash, Palette, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import ControlPanel from "./ControlPanel";
import DesignPreview from "./DesignPreview";
import TextControls from "./TextControls";

interface StudioSidebarProps {
  counterSettings: any;
  onCounterSettingsChange: (settings: any) => void;
  textSettings: any;
  onTextSettingsChange: (settings: any) => void;
  designSettings?: any;
  onDesignSettingsChange?: (settings: any) => void;
  // Mobile-specific props
  isMobileView?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const StudioSidebar: React.FC<StudioSidebarProps> = ({
  counterSettings,
  onCounterSettingsChange,
  textSettings,
  onTextSettingsChange,
  designSettings = {},
  onDesignSettingsChange = () => {},
  isMobileView = false,
  activeTab: externalActiveTab,
  onTabChange,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState("counter");
  const { isMobile } = useMobileDetection();

  // Use external tab state for mobile, internal for desktop
  const activeTab =
    isMobileView && externalActiveTab ? externalActiveTab : internalActiveTab;
  const handleTabChange =
    isMobileView && onTabChange ? onTabChange : setInternalActiveTab;

  return (
    <div
      className={`
        ${isMobileView ? "w-full h-full bg-transparent" : "w-80 bg-[#171717]"}
      `}
      role="region"
      aria-label="Studio Controls Sidebar"
    >
      <div className="flex flex-col h-full">
        {/* Tabs */}
        <div className="flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="h-full flex flex-col"
          >
            {/* Hide tab list in mobile view since tabs are handled by MobileTabNavigation */}
            {!isMobileView && (
              <TabsList
                className="grid grid-cols-3 gap-x-2 m-4 bg-[#101010] border border-gray-700/50"
                aria-label="Editor Sections"
              >
                <TabsTrigger
                  value="counter"
                  className="flex items-center gap-1 text-xs border data-[state=active]:border-[#2BA6FF] border-transparent data-[state=active]:bg-[#2BA6FF]/10 data-[state=active]:text-[#2BA6FF] "
                  aria-label="Counter settings tab"
                >
                  <Hash className="w-3 h-3" aria-hidden="true" />
                  Counter
                </TabsTrigger>
                <TabsTrigger
                  value="text"
                  className="flex items-center gap-1 text-xs border data-[state=active]:border-[#2BA6FF] border-transparent data-[state=active]:bg-[#2BA6FF]/10 data-[state=active]:text-[#2BA6FF] "
                  aria-label="Text settings tab"
                >
                  <Type className="w-3 h-3" aria-hidden="true" />
                  Text
                </TabsTrigger>
                <TabsTrigger
                  value="design"
                  className="flex items-center gap-1 text-xs border data-[state=active]:border-[#2BA6FF] border-transparent data-[state=active]:bg-[#2BA6FF]/10 data-[state=active]:text-[#2BA6FF] "
                  aria-label="Design settings tab"
                >
                  <Palette className="w-3 h-3" aria-hidden="true" />
                  Design
                </TabsTrigger>
              </TabsList>
            )}

            <div
              className={`flex-1 ${
                isMobileView ? "px-0 pb-0" : "overflow-hidden px-4 pb-4"
              }`}
            >
              {isMobileView ? (
                // Mobile view: Conditional rendering based on active tab
                <div>
                  {activeTab === "counter" && (
                    <div
                      className="mt-0 space-y-4"
                      role="tabpanel"
                      aria-label="Counter settings"
                    >
                      <ControlPanel
                        settings={counterSettings}
                        onSettingsChange={onCounterSettingsChange}
                      />
                    </div>
                  )}

                  {activeTab === "text" && (
                    <div
                      className="mt-0 space-y-4"
                      role="tabpanel"
                      aria-label="Text settings"
                    >
                      <TextControls
                        settings={textSettings}
                        onSettingsChange={onTextSettingsChange}
                      />
                    </div>
                  )}

                  {activeTab === "design" && (
                    <div
                      className="mt-0 space-y-4"
                      role="tabpanel"
                      aria-label="Design settings"
                    >
                      <DesignPreview
                        selectedDesign={counterSettings.design}
                        onDesignChange={(design) =>
                          onCounterSettingsChange({
                            ...counterSettings,
                            design,
                          })
                        }
                        designSettings={designSettings}
                        onDesignSettingsChange={onDesignSettingsChange}
                      />
                    </div>
                  )}
                </div>
              ) : (
                // Desktop view: Use ScrollArea as before
                <ScrollArea className="h-full custom-scrollbar">
                  <TabsContent
                    value="counter"
                    className="mt-0"
                    role="tabpanel"
                    aria-label="Counter settings"
                  >
                    <ControlPanel
                      settings={counterSettings}
                      onSettingsChange={onCounterSettingsChange}
                    />
                  </TabsContent>

                  <TabsContent
                    value="text"
                    className="mt-0"
                    role="tabpanel"
                    aria-label="Text settings"
                  >
                    <TextControls
                      settings={textSettings}
                      onSettingsChange={onTextSettingsChange}
                    />
                  </TabsContent>

                  <TabsContent
                    value="design"
                    className="mt-0"
                    role="tabpanel"
                    aria-label="Design settings"
                  >
                    <DesignPreview
                      selectedDesign={counterSettings.design}
                      onDesignChange={(design) =>
                        onCounterSettingsChange({
                          ...counterSettings,
                          design,
                        })
                      }
                      designSettings={designSettings}
                      onDesignSettingsChange={onDesignSettingsChange}
                    />
                  </TabsContent>
                </ScrollArea>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudioSidebar;
