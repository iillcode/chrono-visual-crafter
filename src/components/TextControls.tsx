
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface TextControlsProps {
  settings: {
    enabled: boolean;
    text: string;
    position: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    offsetX: number;
    offsetY: number;
    opacity: number;
  };
  onSettingsChange: (settings: any) => void;
}

const TextControls: React.FC<TextControlsProps> = ({ settings, onSettingsChange }) => {
  const updateSetting = (key: string, value: any) => {
    onSettingsChange(prev => ({ ...prev, [key]: value }));
  };

  const fontOptions = [
    { value: 'inter', label: 'Inter' },
    { value: 'mono', label: 'Roboto Mono' },
    { value: 'poppins', label: 'Poppins' },
    { value: 'orbitron', label: 'Orbitron' },
    { value: 'rajdhani', label: 'Rajdhani' },
  ];

  const positionOptions = [
    { value: 'top', label: 'Top' },
    { value: 'bottom', label: 'Bottom' },
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
    { value: 'center', label: 'Center' },
  ];

  return (
    <div className="space-y-4">
      {/* Enable Text */}
      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-medium flex items-center gap-2">
            📝 Text Element
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-gray-300 text-sm">Enable Text</Label>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(value) => updateSetting('enabled', value)}
            />
          </div>

          {settings.enabled && (
            <>
              <div className="space-y-2">
                <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">Text Content</Label>
                <Textarea
                  value={settings.text}
                  onChange={(e) => updateSetting('text', e.target.value)}
                  placeholder="Enter your text..."
                  className="bg-gray-800/80 border-gray-600/50 text-white text-sm resize-none h-20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">Position</Label>
                <Select value={settings.position} onValueChange={(value) => updateSetting('position', value)}>
                  <SelectTrigger className="bg-gray-800/80 border-gray-600/50 text-white text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {positionOptions.map((pos) => (
                      <SelectItem key={pos.value} value={pos.value} className="text-white text-sm">
                        {pos.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {settings.enabled && (
        <>
          {/* Typography */}
          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base font-medium">Typography</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">Font Family</Label>
                <Select value={settings.fontFamily} onValueChange={(value) => updateSetting('fontFamily', value)}>
                  <SelectTrigger className="bg-gray-800/80 border-gray-600/50 text-white text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value} className="text-white text-sm">
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">Font Size</Label>
                  <span className="text-blue-400 text-sm font-medium">{settings.fontSize}px</span>
                </div>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={(value) => updateSetting('fontSize', value[0])}
                  min={12}
                  max={120}
                  step={2}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">Text Color</Label>
                <Input
                  type="color"
                  value={settings.color}
                  onChange={(e) => updateSetting('color', e.target.value)}
                  className="bg-gray-800/80 border-gray-600/50 h-9 w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">Opacity</Label>
                  <span className="text-purple-400 text-sm font-medium">{Math.round(settings.opacity * 100)}%</span>
                </div>
                <Slider
                  value={[settings.opacity]}
                  onValueChange={(value) => updateSetting('opacity', value[0])}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Position Fine-tuning */}
          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base font-medium">Position Offset</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">Horizontal Offset</Label>
                  <span className="text-green-400 text-sm font-medium">{settings.offsetX}px</span>
                </div>
                <Slider
                  value={[settings.offsetX]}
                  onValueChange={(value) => updateSetting('offsetX', value[0])}
                  min={-200}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">Vertical Offset</Label>
                  <span className="text-green-400 text-sm font-medium">{settings.offsetY}px</span>
                </div>
                <Slider
                  value={[settings.offsetY]}
                  onValueChange={(value) => updateSetting('offsetY', value[0])}
                  min={-200}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default TextControls;
