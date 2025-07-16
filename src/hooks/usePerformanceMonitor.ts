import { useState, useEffect, useCallback } from "react";
import {
  performanceMonitor,
  PerformanceMetrics,
  PerformanceOptimization,
} from "@/utils/performanceMonitor";

export interface UsePerformanceMonitorOptions {
  autoStart?: boolean;
  updateInterval?: number;
}

export interface PerformanceMonitorHook {
  metrics: PerformanceMetrics | null;
  isMonitoring: boolean;
  optimizations: PerformanceOptimization[];
  shouldOptimize: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  recordRenderTime: (startTime: number) => void;
  applyOptimization: (optimization: PerformanceOptimization) => void;
}

export function usePerformanceMonitor(
  options: UsePerformanceMonitorOptions = {}
): PerformanceMonitorHook {
  const { autoStart = false } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [optimizations, setOptimizations] = useState<PerformanceOptimization[]>(
    []
  );
  const [shouldOptimize, setShouldOptimize] = useState(false);

  const startMonitoring = useCallback(() => {
    performanceMonitor.startMonitoring();
    setIsMonitoring(true);
  }, []);

  const stopMonitoring = useCallback(() => {
    performanceMonitor.stopMonitoring();
    setIsMonitoring(false);
    setMetrics(null);
  }, []);

  const recordRenderTime = useCallback((startTime: number) => {
    performanceMonitor.recordRenderTime(startTime);
  }, []);

  const applyOptimization = useCallback(
    (optimization: PerformanceOptimization) => {
      // This would be implemented based on the specific optimization type
      // For now, we'll just remove it from the suggestions
      setOptimizations((prev) => prev.filter((opt) => opt !== optimization));
    },
    []
  );

  useEffect(() => {
    if (autoStart) {
      startMonitoring();
    }

    return () => {
      if (isMonitoring) {
        stopMonitoring();
      }
    };
  }, [autoStart, startMonitoring, stopMonitoring, isMonitoring]);

  useEffect(() => {
    if (!isMonitoring) return;

    const unsubscribe = performanceMonitor.subscribe((newMetrics) => {
      setMetrics(newMetrics);

      // Update optimizations and shouldOptimize flag
      const newOptimizations = performanceMonitor.getOptimizationSuggestions();
      setOptimizations(newOptimizations);
      setShouldOptimize(performanceMonitor.shouldOptimize());
    });

    return unsubscribe;
  }, [isMonitoring]);

  return {
    metrics,
    isMonitoring,
    optimizations,
    shouldOptimize,
    startMonitoring,
    stopMonitoring,
    recordRenderTime,
    applyOptimization,
  };
}
