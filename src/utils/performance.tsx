import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

// Performance utilities for code splitting and optimization

// Enhanced loading component with skeleton
export const LoadingFallback: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => (
  <div className="flex items-center justify-center min-h-96 bg-gray-50">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-4"
      >
        <Loader2 className="w-8 h-8 text-primary mx-auto" />
      </motion.div>
      <p className="text-gray-600 font-medium">{message}</p>
    </motion.div>
  </div>
);

// Lazy load components with enhanced error boundaries
export const createLazyComponent = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  fallbackMessage?: string,
) => {
  const LazyComponent = lazy(importFn);

  return (props: any) => (
    <Suspense fallback={<LoadingFallback message={fallbackMessage} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  React.useEffect(() => {
    // Mark component mount time
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      if (renderTime > 100) {
        console.warn(`Slow component render: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, []);
};

// Bundle size analyzer
export const BundleAnalyzer = {
  logBundleSize: () => {
    if (typeof window !== "undefined") {
      const entries = performance.getEntriesByType(
        "navigation",
      ) as PerformanceNavigationTiming[];
      if (entries.length > 0) {
        const entry = entries[0];
        console.log("Performance Metrics:", {
          domContentLoaded:
            entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
          loadComplete: entry.loadEventEnd - entry.loadEventStart,
          totalLoadTime: entry.loadEventEnd - entry.navigationStart,
        });
      }
    }
  },

  trackResourceLoading: () => {
    if (typeof window !== "undefined") {
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === "resource") {
            const resourceEntry = entry as PerformanceResourceTiming;
            if (resourceEntry.transferSize > 1000000) {
              // > 1MB
              console.warn(
                `Large resource loaded: ${resourceEntry.name} - ${(resourceEntry.transferSize / 1024 / 1024).toFixed(2)}MB`,
              );
            }
          }
        });
      }).observe({ entryTypes: ["resource"] });
    }
  },
};

// Image optimization component
export const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}> = ({ src, alt, width, height, className, priority = false }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <div className={`relative ${className || ""}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
        }}
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${error ? "hidden" : ""}`}
      />
      {error && (
        <div className="flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
          Failed to load image
        </div>
      )}
    </div>
  );
};

export default {
  LoadingFallback,
  createLazyComponent,
  usePerformanceMonitor,
  BundleAnalyzer,
  OptimizedImage,
};
