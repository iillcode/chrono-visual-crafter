
import React, { useState } from 'react';
import { X, Type, Hash, Palette, Play, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ControlPanel from './ControlPanel';
import DesignSelector from './DesignSelector';
import TextControls from './TextControls';

interface StudioSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  counterSettings: any;
  onCounterSettingsChange: (settings: any) => void;
  textSettings: any;
  onTextSettingsChange: (settings: any) => void;
}

const StudioSidebar: React.FC<StudioSidebarProps> = ({
  isOpen,
  onToggle,
  counterSettings,
  onCounterSettingsChange,
  textSettings,
  onTextSettingsChange
}) => {
  const [activeTab, setActiveTab] = useState('counter');

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed right-0 top-0 h-full w-80 bg-gray-950 border-l border-gray-800 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:relative lg:translate-x-0 lg:z-auto
        ${!isOpen && 'lg:w-0 lg:border-l-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-white font-semibold">Studio Controls</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid grid-cols-3 m-4 bg-gray-900">
                <TabsTrigger value="counter" className="flex items-center gap-1 text-xs">
                  <Hash className="w-3 h-3" />
                  Counter
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-1 text-xs">
                  <Type className="w-3 h-3" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="design" className="flex items-center gap-1 text-xs">
                  <Palette className="w-3 h-3" />
                  Design
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <TabsContent value="counter" className="mt-0">
                  <ControlPanel 
                    settings={counterSettings}
                    onSettingsChange={onCounterSettingsChange}
                  />
                </TabsContent>

                <TabsContent value="text" className="mt-0">
                  <TextControls
                    settings={textSettings}
                    onSettingsChange={onTextSettingsChange}
                  />
                </TabsContent>

                <TabsContent value="design" className="mt-0">
                  <DesignSelector
                    selectedDesign={counterSettings.design}
                    onDesignChange={(design) => onCounterSettingsChange(prev => ({ ...prev, design }))}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Toggle Button (when sidebar is closed) */}
      {!isOpen && (
        <Button
          onClick={onToggle}
          className="fixed right-4 top-20 z-30 bg-gray-900 hover:bg-gray-800 border border-gray-700"
          size="sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="ml-1 text-xs">Studio</span>
        </Button>
      )}
    </>
  );
};

export default StudioSidebar;
