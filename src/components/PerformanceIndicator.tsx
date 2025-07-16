import React from "react";
import { Activity, AlertTriangle, CheckCircle, Zap } from "lucide-react";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PerformanceIndicatorProps {
  className?: string;
  showDetails?: boolean;
  autoStart?: boolean;
}

export function PerformanceIndicator({
  className = "",
  showDetails = false,
  autoStart = true,
}: PerformanceIndicatorProps) {
  const {
    metrics,
    isMonitoring,
    optimizations,
    shouldOptimize,
    startMonitoring,
    stopMonitoring,
    applyOptimization,
  } = usePerformanceMonitor({ autoStart });

  const getPerformanceStatus = () => {
    if (!metrics) return { status: "unknown", color: "gray", icon: Activity };

    if (metrics.averageFps >= 55) {
      return { status: "excellent", color: "green", icon: CheckCircle };
    } else if (metrics.averageFps >= 45) {
      return { status: "good", color: "blue", icon: Activity };
    } else if (metrics.averageFps >= 30) {
      return { status: "fair", color: "yellow", icon: AlertTriangle };
    } else {
      return { status: "poor", color: "red", icon: AlertTriangle };
    }
  };

  const { status, color, icon: StatusIcon } = getPerformanceStatus();

  const formatMemoryUsage = (bytes: number) => {
    if (bytes === 0) return "N/A";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  if (!showDetails) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center gap-2 ${className}`}>
              <StatusIcon className={`h-4 w-4 text-${color}-500`} />
              {metrics && (
                <span className="text-sm font-mono">
                  {Math.round(metrics.fps)} FPS
                </span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p>Performance: {status}</p>
              {metrics && (
                <>
                  <p>
                    FPS: {Math.round(metrics.fps)} /{" "}
                    {Math.round(metrics.averageFps)} avg
                  </p>
                  <p>Render: {metrics.renderTime.toFixed(1)}ms</p>
                  <p>Memory: {metrics.memoryUsage.percentage.toFixed(1)}%</p>
                </>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Performance Monitor</h3>
        <div className="flex items-center gap-2">
          <Badge variant={color === "green" ? "default" : "secondary"}>
            {status.toUpperCase()}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
          >
            {isMonitoring ? "Stop" : "Start"}
          </Button>
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">Frame Rate</span>
            </div>
            <div className="text-2xl font-mono">
              {Math.round(metrics.fps)} FPS
            </div>
            <div className="text-sm text-muted-foreground">
              Avg: {Math.round(metrics.averageFps)} FPS
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">Render Time</span>
            </div>
            <div className="text-2xl font-mono">
              {metrics.renderTime.toFixed(1)}ms
            </div>
            <div className="text-sm text-muted-foreground">
              Target: &lt;16.7ms
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">Memory Usage</span>
            </div>
            <div className="text-2xl font-mono">
              {metrics.memoryUsage.percentage.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">
              {formatMemoryUsage(metrics.memoryUsage.used)} /{" "}
              {formatMemoryUsage(metrics.memoryUsage.total)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Frame Drops</span>
            </div>
            <div className="text-2xl font-mono">{metrics.frameDrops}</div>
            <div className="text-sm text-muted-foreground">Last 60 frames</div>
          </div>
        </div>
      )}

      {optimizations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            Performance Suggestions
          </h4>
          <div className="space-y-2">
            {optimizations.map((optimization, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted rounded-md"
              >
                <div className="flex-1">
                  <p className="text-sm">{optimization.suggestion}</p>
                  <p className="text-xs text-muted-foreground">
                    Impact: {optimization.impact} • Type: {optimization.type}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyOptimization(optimization)}
                >
                  {optimization.autoApply ? "Auto-Apply" : "Apply"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {shouldOptimize && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Performance optimization recommended
            </span>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            Your system is experiencing performance issues. Consider applying
            the suggested optimizations above.
          </p>
        </div>
      )}
    </div>
  );
}
