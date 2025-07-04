
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import { useClerkAuth } from "@/hooks/useClerkAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PositionJoystick from "./PositionJoystick";

interface TextControlsProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
}

const TextControls: React.FC<TextControlsProps> = ({
  settings,
  onSettingsChange,
}) => {
  const { user, profile } = useClerkAuth();
  const { toast } = useToast();
  const [savedPresets, setSavedPresets] = useState<any[]>([]);
  const [presetName, setPresetName] = useState("");
  const [loadingPresets, setLoadingPresets] = useState(false);

  const isPaidUser = profile?.subscription_status === 'active' && profile?.subscription_plan !== 'free';

  React.useEffect(() => {
    if (isPaidUser) {
      loadSavedPresets();
    }
  }, [isPaidUser]);

  const loadSavedPresets = async () => {
    if (!user) return;
    
    setLoadingPresets(true);
    try {
      const { data, error } = await supabase
        .from('saved_text_settings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedPresets(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading presets",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoadingPresets(false);
    }
  };

  const savePreset = async () => {
    if (!user || !presetName.trim()) return;

    try {
      const { error } = await supabase
        .from('saved_text_settings')
        .insert({
          user_id: user.id,
          name: presetName.trim(),
          settings: settings
        });

      if (error) throw error;

      toast({
        title: "Preset saved",
        description: `"${presetName}" has been saved successfully.`
      });
      
      setPresetName("");
      loadSavedPresets();
    } catch (error: any) {
      toast({
        title: "Error saving preset",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const loadPreset = (preset: any) => {
    onSettingsChange(preset.settings);
    toast({
      title: "Preset loaded",
      description: `"${preset.name}" has been applied.`
    });
  };

  const deletePreset = async (presetId: string, presetName: string) => {
    try {
      const { error } = await supabase
        .from('saved_text_settings')
        .delete()
        .eq('id', presetId);

      if (error) throw error;

      toast({
        title: "Preset deleted",
        description: `"${presetName}" has been removed.`
      });
      
      loadSavedPresets();
    } catch (error: any) {
      toast({
        title: "Error deleting preset",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handlePositionChange = (x: number, y: number) => {
    onSettingsChange({
      ...settings,
      offsetX: x,
      offsetY: y
    });
  };

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
                <Label className="text-white">Font Size: {settings.fontSize}px</Label>
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
                <PositionJoystick
                  x={settings.offsetX}
                  y={settings.offsetY}
                  onChange={handlePositionChange}
                  className="mx-auto"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Opacity: {Math.round(settings.opacity * 100)}%</Label>
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

      {/* Save/Load Presets for Paid Users */}
      {isPaidUser && (
        <Card className="!bg-[#101010] border-gray-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base font-medium flex items-center gap-2">
              💾 Text Presets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Preset name"
                className="bg-[#181818] border-gray-600 text-white"
              />
              <Button
                onClick={savePreset}
                disabled={!presetName.trim()}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>

            {savedPresets.length > 0 && (
              <div className="space-y-2">
                <Label className="text-white">Saved Presets</Label>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {savedPresets.map((preset) => (
                    <div key={preset.id} className="flex items-center justify-between p-2 bg-[#181818] rounded">
                      <button
                        onClick={() => loadPreset(preset)}
                        className="text-white text-sm hover:text-blue-400 flex-1 text-left"
                      >
                        {preset.name}
                      </button>
                      <Button
                        onClick={() => deletePreset(preset.id, preset.name)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TextControls;
