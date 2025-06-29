
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface ControlPanelProps {
  settings: {
    startValue: number;
    endValue: number;
    duration: number;
    fontFamily: string;
    fontSize: number;
    design: string;
    background: string;
    speed: number;
    customFont: string;
  };
  onSettingsChange: (settings: any) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ settings, onSettingsChange }) => {
  const updateSetting = (key: string, value: any) => {
    onSettingsChange(prev => ({ ...prev, [key]: value }));
  };

  const fontOptions = [
    { value: 'inter', label: 'Inter' },
    { value: 'mono', label: 'Roboto Mono' },
    { value: 'poppins', label: 'Poppins' },
    { value: 'orbitron', label: 'Orbitron' },
    { value: 'rajdhani', label: 'Rajdhani' },
    { value: 'exo', label: 'Exo 2' },
    { value: 'play', label: 'Play' },
    { value: 'russo', label: 'Russo One' },
    { value: 'audiowide', label: 'Audiowide' },
    { value: 'michroma', label: 'Michroma' },
  ];

  const backgroundOptions = [
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
    { value: 'transparent', label: 'Transparent' },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Counter Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Start Value</Label>
              <Input
                type="number"
                value={settings.startValue}
                onChange={(e) => updateSetting('startValue', parseInt(e.target.value) || 0)}
                className="bg-gray-800 border-gray-600 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">End Value</Label>
              <Input
                type="number"
                value={settings.endValue}
                onChange={(e) => updateSetting('endValue', parseInt(e.target.value) || 100)}
                className="bg-gray-800 border-gray-600 text-white mt-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Duration (seconds)</Label>
            <Slider
              value={[settings.duration]}
              onValueChange={(value) => updateSetting('duration', value[0])}
              min={1}
              max={30}
              step={0.5}
              className="mt-2"
            />
            <div className="text-xs text-gray-400 mt-1">{settings.duration}s</div>
          </div>

          <div>
            <Label className="text-gray-300">Speed Multiplier</Label>
            <Slider
              value={[settings.speed]}
              onValueChange={(value) => updateSetting('speed', value[0])}
              min={0.1}
              max={5}
              step={0.1}
              className="mt-2"
            />
            <div className="text-xs text-gray-400 mt-1">{settings.speed}x</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Font Family</Label>
            <Select value={settings.fontFamily} onValueChange={(value) => updateSetting('fontFamily', value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value} className="text-white">
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-300">Custom Google Font</Label>
            <Input
              type="text"
              value={settings.customFont}
              onChange={(e) => updateSetting('customFont', e.target.value)}
              placeholder="e.g., Bebas Neue"
              className="bg-gray-800 border-gray-600 text-white mt-1"
            />
            <div className="text-xs text-gray-400 mt-1">Leave empty to use selected font</div>
          </div>

          <div>
            <Label className="text-gray-300">Font Size</Label>
            <Slider
              value={[settings.fontSize]}
              onValueChange={(value) => updateSetting('fontSize', value[0])}
              min={24}
              max={300}
              step={4}
              className="mt-2"
            />
            <div className="text-xs text-gray-400 mt-1">{settings.fontSize}px</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Background</CardTitle>
        </CardHeader>
        <CardContent>
          <Label className="text-gray-300">Background Color</Label>
          <Select value={settings.background} onValueChange={(value) => updateSetting('background', value)}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {backgroundOptions.map((bg) => (
                <SelectItem key={bg.value} value={bg.value} className="text-white">
                  {bg.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControlPanel;
