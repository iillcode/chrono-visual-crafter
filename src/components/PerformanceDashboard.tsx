import React, { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Settings,
  Zap,
  MemoryStick,
  TrendingUp,
  TrendingDown,
  Pause,
  Play,
} from "lucide-react";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import {
  performanceOptimizer,
  OptimizationSettings,
  QualitySettings,
} from "@/utils/performanceOptimizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface PerformanceDashboardProps {
  className?: string;
}

export function PerformanceDashboard({
  className = "",
}: PerformanceDashboardProps) {
  const {
    metrics,
    isMonitoring,
    optimizations,
    shouldOptimize,
    startMonitoring,
    stopMonitoring,
    applyOptimization,
  } = usePerformanceMonitor({ autoStart: true });

  const [optimizationSettings, setOptimizationSettings] =
    useState<OptimizationSettings>({
      autoOptimize: true,
      qualityReduction: true,
      effectsDisabling: true,
      resolutionScaling: true,
      complexityReduction: true,
    });

  const [qualitySettings, setQualitySettings] = useState<QualitySettings>({
    renderQuality: 1.0,
    enableAntiAliasing: true,
    enableSubPixelRendering: true,
    maxParticles: 1000,
    effectComplexity: "high",
    canvasScale: 1.0,
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [optimizationStatus, setOptimizationStatus] = useState({
    isOptimizing: false,
    level: 0,
    appliedOptimizations: [] as string[],
  });

  useEffect(() => {
    // Configure performance optimizer
    performanceOptimizer.configure(optimizationSettings);
    performanceOptimizer.setOriginalQuality(qualitySettings);

    // Subscribe to quality changes
    const unsubscribe = performanceOptimizer.subscribe((newQuality) => {
      setQualitySettings(newQuality);
    });

    // Start optimization if enabled
    if (optimizationSettings.autoOptimize) {
      performanceOptimizer.startOptimization();
    }

    return () => {
      unsubscribe();
      performanceOptimizer.stopOptimization();
    };
  }, [optimizationSettings]);

  useEffect(() => {
    // Update optimization status
    const status = performanceOptimizer.getOptimizationStatus();
    setOptimizationStatus(status);
  }, [qualitySettings]);

  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return "text-green-500";
    if (fps >= 45) return "text-blue-500";
    if (fps >= 30) return "text-yellow-500";
    return "text-red-500";
  };

  const getMemoryColor = (percentage: number) => {
    if (percentage < 50) return "text-green-500";
    if (percentage < 75) return "text-yellow-500";
    return "text-red-500";
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Performance Monitor</h2>
          {shouldOptimize && (
            <Badge variant="destructive" className="animate-pulse">
              Optimization Needed
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button
            variant={isMonitoring ? "destructive" : "default"}
            size="sm"
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
          >
            {isMonitoring ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frame Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                metrics ? getPerformanceColor(metrics.fps) : ""
              }`}
            >
              {metrics ? Math.round(metrics.fps) : "--"} FPS
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: {metrics ? Math.round(metrics.averageFps) : "--"} FPS
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Render Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? metrics.renderTime.toFixed(1) : "--"}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Target: &lt;16.7ms (60fps)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                metrics ? getMemoryColor(metrics.memoryUsage.percentage) : ""
              }`}
            >
              {metrics ? metrics.memoryUsage.percentage.toFixed(1) : "--"}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics ? formatBytes(metrics.memoryUsage.used) : "--"} used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frame Drops</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? metrics.frameDrops : "--"}
            </div>
            <p className="text-xs text-muted-foreground">Last 60 frames</p>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Status */}
      {optimizationStatus.isOptimizing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Active Optimizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Optimization Level</span>
                <Badge variant="outline">
                  Level {optimizationStatus.level}/3
                </Badge>
              </div>
              {optimizationStatus.appliedOptimizations.length > 0 && (
                <div className="space-y-1">
                  <span className="text-sm font-medium">
                    Applied Optimizations:
                  </span>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {optimizationStatus.appliedOptimizations.map(
                      (opt, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {opt}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => performanceOptimizer.resetQuality()}
              >
                Reset to Original Quality
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Suggestions */}
      {optimizations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Performance Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {optimizations.map((optimization, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {optimization.suggestion}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {optimization.type}
                      </Badge>
                      <Badge
                        variant={
                          optimization.impact === "high"
                            ? "destructive"
                            : optimization.impact === "medium"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {optimization.impact} impact
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyOptimization(optimization)}
                  >
                    Apply
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Panel */}
      <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <CollapsibleContent>
          <Card>
            <CardHeader>
              <CardTitle>Performance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto Optimization */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Auto Optimization</h4>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-optimize">
                    Enable automatic optimization
                  </Label>
                  <Switch
                    id="auto-optimize"
                    checked={optimizationSettings.autoOptimize}
                    onCheckedChange={(checked) =>
                      setOptimizationSettings((prev) => ({
                        ...prev,
                        autoOptimize: checked,
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="quality-reduction">Quality reduction</Label>
                    <Switch
                      id="quality-reduction"
                      checked={optimizationSettings.qualityReduction}
                      onCheckedChange={(checked) =>
                        setOptimizationSettings((prev) => ({
                          ...prev,
                          qualityReduction: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="effects-disabling">Effects disabling</Label>
                    <Switch
                      id="effects-disabling"
                      checked={optimizationSettings.effectsDisabling}
                      onCheckedChange={(checked) =>
                        setOptimizationSettings((prev) => ({
                          ...prev,
                          effectsDisabling: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="resolution-scaling">
                      Resolution scaling
                    </Label>
                    <Switch
                      id="resolution-scaling"
                      checked={optimizationSettings.resolutionScaling}
                      onCheckedChange={(checked) =>
                        setOptimizationSettings((prev) => ({
                          ...prev,
                          resolutionScaling: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="complexity-reduction">
                      Complexity reduction
                    </Label>
                    <Switch
                      id="complexity-reduction"
                      checked={optimizationSettings.complexityReduction}
                      onCheckedChange={(checked) =>
                        setOptimizationSettings((prev) => ({
                          ...prev,
                          complexityReduction: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Quality Settings */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Quality Settings</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>
                      Render Quality:{" "}
                      {Math.round(qualitySettings.renderQuality * 100)}%
                    </Label>
                    <Slider
                      value={[qualitySettings.renderQuality]}
                      onValueChange={([value]) =>
                        setQualitySettings((prev) => ({
                          ...prev,
                          renderQuality: value,
                        }))
                      }
                      max={1}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Canvas Scale:{" "}
                      {Math.round(qualitySettings.canvasScale * 100)}%
                    </Label>
                    <Slider
                      value={[qualitySettings.canvasScale]}
                      onValueChange={([value]) =>
                        setQualitySettings((prev) => ({
                          ...prev,
                          canvasScale: value,
                        }))
                      }
                      max={1}
                      min={0.5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Particles: {qualitySettings.maxParticles}</Label>
                    <Slider
                      value={[qualitySettings.maxParticles]}
                      onValueChange={([value]) =>
                        setQualitySettings((prev) => ({
                          ...prev,
                          maxParticles: value,
                        }))
                      }
                      max={2000}
                      min={100}
                      step={100}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
