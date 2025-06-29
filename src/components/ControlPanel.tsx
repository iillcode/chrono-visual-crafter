
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    transition: string;
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
    { value: 'black', label: '⚫ Black' },
    { value: 'white', label: '⚪ White' },
    { value: 'transparent', label: '🔳 Transparent' },
  ];

  const transitionOptions = [
    { value: 'none', label: 'None' },
    { value: 'slideUp', label: 'Slide Up' },
    { value: 'slideDown', label: 'Slide Down' },
    { value: 'slideLeft', label: 'Slide Left' },
    { value: 'slideRight', label: 'Slide Right' },
    { value: 'fadeIn', label: 'Fade In' },
    { value: 'scale', label: 'Scale' },
    { value: 'rotate', label: 'Rotate' },
    { value: 'flip', label: 'Flip' },
    { value: 'bounce', label: 'Bounce' },
    { value: 'elastic', label: 'Elastic' },
    { value: 'typewriter', label: 'Typewriter' },
    { value: 'wave', label: 'Wave' },
    { value: 'spiral', label: 'Spiral' },
    { value: 'zoom', label: 'Zoom' },
    { value: 'glitch', label: 'Glitch' },
    { value: 'matrix', label: 'Matrix' },
    { value: 'shake', label: 'Shake' },
    { value: 'pulse', label: 'Pulse' },
    { value: 'morphColor', label: 'Color Morph' },
    { value: 'splitMerge', label: 'Split & Merge' },
    { value: 'rollIn', label: 'Roll In' },
    { value: 'flipCard', label: 'Flip Card' },
    { value: 'liquidFill', label: 'Liquid Fill' },
  ];

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      {/* Counter Configuration */}
      <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-medium flex items-center gap-2">
            🎯 Counter Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">Start Value</Label>
              <Input
                type="number"
                value={settings.startValue}
                onChange={(e) => updateSetting('startValue', parseInt(e.target.value) || 0)}
                className="bg-gray-800/80 border-gray-600/50 text-white text-sm h-9 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">End Value</Label>
              <Input
                type="number"
                value={settings.endValue}
                onChange={(e) => updateSetting('endValue', parseInt(e.target.value) || 100)}
                className="bg-gray-800/80 border-gray-600/50 text-white text-sm h-9 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">Duration</Label>
              <span className="text-blue-400 text-sm font-medium">{settings.duration}s</span>
            </div>
            <Slider
              value={[settings.duration]}
              onValueChange={(value) => updateSetting('duration', value[0])}
              min={1}
              max={30}
              step={0.5}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">Speed</Label>
              <span className="text-green-400 text-sm font-medium">{settings.speed}x</span>
            </div>
            <Slider
              value={[settings.speed]}
              onValueChange={(value) => updateSetting('speed', value[0])}
              min={0.1}
              max={5}
              step={0.1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Animation & Effects */}
      <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-medium flex items-center gap-2">
            ✨ Animation & Effects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">Transition Effect</Label>
            <Select value={settings.transition || 'none'} onValueChange={(value) => updateSetting('transition', value)}>
              <SelectTrigger className="bg-gray-800/80 border-gray-600/50 text-white text-sm h-9 focus:border-purple-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 max-h-60">
                {transitionOptions.map((transition) => (
                  <SelectItem key={transition.value} value={transition.value} className="text-white text-sm">
                    {transition.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">Visual Style</Label>
            <Select value={settings.design} onValueChange={(value) => updateSetting('design', value)}>
              <SelectTrigger className="bg-gray-800/80 border-gray-600/50 text-white text-sm h-9 focus:border-purple-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="classic" className="text-white">Classic</SelectItem>
                <SelectItem value="neon" className="text-white">Neon</SelectItem>
                <SelectItem value="glow" className="text-white">Glow</SelectItem>
                <SelectItem value="gradient" className="text-white">Gradient</SelectItem>
                <SelectItem value="fire" className="text-white">Fire</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-medium flex items-center gap-2">
            🔤 Typography
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">Font Family</Label>
            <Select value={settings.fontFamily} onValueChange={(value) => updateSetting('fontFamily', value)}>
              <SelectTrigger className="bg-gray-800/80 border-gray-600/50 text-white text-sm h-9 focus:border-orange-500">
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

          <div className="space-y-2">
            <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">Custom Google Font</Label>
            <Input
              type="text"
              value={settings.customFont}
              onChange={(e) => updateSetting('customFont', e.target.value)}
              placeholder="e.g., Bebas Neue"
              className="bg-gray-800/80 border-gray-600/50 text-white text-sm h-9 focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">Font Size</Label>
              <span className="text-orange-400 text-sm font-medium">{settings.fontSize}px</span>
            </div>
            <Slider
              value={[settings.fontSize]}
              onValueChange={(value) => updateSetting('fontSize', value[0])}
              min={24}
              max={300}
              step={4}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Background */}
      <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-medium flex items-center gap-2">
            🎨 Background
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="text-gray-300 text-xs font-medium uppercase tracking-wide">Background Color</Label>
            <Select value={settings.background} onValueChange={(value) => updateSetting('background', value)}>
              <SelectTrigger className="bg-gray-800/80 border-gray-600/50 text-white text-sm h-9 focus:border-pink-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {backgroundOptions.map((bg) => (
                  <SelectItem key={bg.value} value={bg.value} className="text-white text-sm">
                    {bg.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControlPanel;
