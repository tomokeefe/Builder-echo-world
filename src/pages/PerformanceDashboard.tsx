import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Zap,
  Activity,
  Database,
  Globe,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Settings,
} from "lucide-react";
import EnhancedChart from "@/components/ui/enhanced-chart";
import { useMobile } from "@/hooks/useMobile";
import MobileNavigation from "@/components/ui/mobile-navigation";
import { usePerformanceMonitor } from "@/utils/performance";
import {
  staggerContainer,
  staggerItem,
  elevateHover,
} from "@/utils/animations";

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: "good" | "warning" | "critical";
  target: number;
  change: number;
  lastUpdated: string;
}

interface BundleInfo {
  name: string;
  size: number;
  gzipSize: number;
  loadTime: number;
  status: "optimized" | "warning" | "critical";
}

const PerformanceDashboard: React.FC = () => {
  usePerformanceMonitor();
  const mobile = useMobile();
  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0.1,
  });
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Real-time performance metrics
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    {
      id: "load-time",
      name: "Page Load Time",
      value: 1.2,
      unit: "seconds",
      status: "good",
      target: 2.0,
      change: -15.3,
      lastUpdated: "2 minutes ago",
    },
    {
      id: "bundle-size",
      name: "Bundle Size",
      value: 1.6,
      unit: "MB",
      status: "warning",
      target: 1.0,
      change: 8.2,
      lastUpdated: "5 minutes ago",
    },
    {
      id: "memory-usage",
      name: "Memory Usage",
      value: 45.2,
      unit: "MB",
      status: "good",
      target: 100,
      change: 3.1,
      lastUpdated: "1 minute ago",
    },
    {
      id: "core-web-vitals",
      name: "Core Web Vitals Score",
      value: 92,
      unit: "score",
      status: "good",
      target: 90,
      change: 5.2,
      lastUpdated: "3 minutes ago",
    },
  ]);

  const [bundles, setBundles] = useState<BundleInfo[]>([
    {
      name: "main.js",
      size: 1200,
      gzipSize: 421,
      loadTime: 0.8,
      status: "warning",
    },
    {
      name: "vendors.js",
      size: 400,
      gzipSize: 145,
      loadTime: 0.3,
      status: "optimized",
    },
    {
      name: "analytics.js",
      size: 80,
      gzipSize: 28,
      loadTime: 0.1,
      status: "optimized",
    },
    {
      name: "charts.js",
      size: 150,
      gzipSize: 52,
      loadTime: 0.2,
      status: "optimized",
    },
  ]);

  // Performance timeline data
  const performanceData = [
    { time: "00:00", loadTime: 1.1, memoryUsage: 42, coreVitals: 88 },
    { time: "00:05", loadTime: 1.3, memoryUsage: 44, coreVitals: 90 },
    { time: "00:10", loadTime: 1.2, memoryUsage: 46, coreVitals: 92 },
    { time: "00:15", loadTime: 1.4, memoryUsage: 45, coreVitals: 89 },
    { time: "00:20", loadTime: 1.2, memoryUsage: 45, coreVitals: 92 },
  ];

  // Simulate real-time updates
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: metric.value + (Math.random() - 0.5) * 0.1,
          change: (Math.random() - 0.5) * 10,
          lastUpdated: "Just now",
        })),
      );
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
      case "optimized":
        return "text-green-600 bg-green-100 border-green-200";
      case "warning":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "critical":
        return "text-red-600 bg-red-100 border-red-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
      case "optimized":
        return <CheckCircle className="w-4 h-4" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "critical":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const exportPerformanceReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      metrics,
      bundles,
      performanceData,
      summary: {
        overallScore:
          (metrics.reduce((acc, m) => acc + (m.status === "good" ? 1 : 0), 0) /
            metrics.length) *
          100,
        totalBundleSize: bundles.reduce((acc, b) => acc + b.size, 0),
        averageLoadTime:
          bundles.reduce((acc, b) => acc + b.loadTime, 0) / bundles.length,
      },
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `performance-report-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {mobile.isMobile && <MobileNavigation />}

      <motion.div
        className={`min-h-screen p-4 md:p-6 bg-gray-50 ${mobile.isMobile ? "pt-20 pb-20" : ""}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1
                className={`${mobile.isMobile ? "text-2xl" : "text-3xl"} font-bold text-gray-900`}
              >
                <span style={{ color: "rgb(61, 153, 76)" }}>
                  Performance Dashboard
                </span>
              </h1>
              <p className="text-gray-600 mt-1">
                Real-time application performance monitoring and optimization
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={isMonitoring ? "default" : "secondary"}>
                  {isMonitoring ? (
                    <>
                      <Activity className="w-3 h-3 mr-1 animate-pulse" />
                      Live Monitoring
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 mr-1" />
                      Paused
                    </>
                  )}
                </Badge>
                <span className="text-xs text-gray-500">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size={mobile.isMobile ? "sm" : "default"}
                onClick={() => setIsMonitoring(!isMonitoring)}
              >
                {isMonitoring ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Monitoring
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Start Monitor
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size={mobile.isMobile ? "sm" : "default"}
                onClick={exportPerformanceReport}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                variants={staggerItem}
                whileHover={elevateHover.hover}
              >
                <Card className="transition-all duration-200">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(metric.status)}
                        <h3 className="font-medium text-sm">{metric.name}</h3>
                      </div>
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <motion.span
                            className="text-2xl font-bold"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: index * 0.1 + 0.2,
                              type: "spring",
                            }}
                          >
                            {metric.value.toFixed(
                              metric.unit === "score" ? 0 : 1,
                            )}
                          </motion.span>
                          <span className="text-sm text-gray-500">
                            {metric.unit}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {metric.change > 0 ? (
                            <TrendingUp className="w-3 h-3 text-green-500" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-500" />
                          )}
                          <span
                            className={`text-xs ${metric.change > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {metric.change > 0 ? "+" : ""}
                            {metric.change.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>
                            Target: {metric.target}
                            {metric.unit}
                          </span>
                          <span>{metric.lastUpdated}</span>
                        </div>
                        <Progress
                          value={Math.min(
                            (metric.value / metric.target) * 100,
                            100,
                          )}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <Tabs defaultValue="bundles" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="bundles">Bundle Analysis</TabsTrigger>
              <TabsTrigger value="timeline">Performance Timeline</TabsTrigger>
              <TabsTrigger value="optimization">Optimization Tips</TabsTrigger>
              <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
            </TabsList>

            {/* Bundle Analysis */}
            <TabsContent value="bundles" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Bundle Size Analysis</CardTitle>
                    <CardDescription>
                      Analyze JavaScript bundle sizes and loading performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {bundles.map((bundle, index) => (
                        <motion.div
                          key={bundle.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(bundle.status)}
                              <span className="font-medium">{bundle.name}</span>
                            </div>
                            <Badge className={getStatusColor(bundle.status)}>
                              {bundle.status}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-6 text-sm">
                            <div className="text-center">
                              <p className="font-medium">{bundle.size}KB</p>
                              <p className="text-gray-500">Raw Size</p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium text-green-600">
                                {bundle.gzipSize}KB
                              </p>
                              <p className="text-gray-500">Gzipped</p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium">{bundle.loadTime}s</p>
                              <p className="text-gray-500">Load Time</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-900">
                          Optimization Suggestions
                        </span>
                      </div>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Consider code splitting for the main bundle</li>
                        <li>• Enable tree shaking to remove unused code</li>
                        <li>
                          • Implement dynamic imports for route-based splitting
                        </li>
                        <li>
                          • Use webpack-bundle-analyzer for detailed analysis
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Performance Timeline */}
            <TabsContent value="timeline" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <EnhancedChart
                  data={performanceData}
                  type="line"
                  title="Performance Timeline"
                  subtitle="Real-time performance metrics over time"
                  xKey="time"
                  yKey={["loadTime", "memoryUsage", "coreVitals"]}
                  height={400}
                  interactive={true}
                  realTime={true}
                  animated={true}
                />
              </motion.div>
            </TabsContent>

            {/* Optimization Tips */}
            <TabsContent value="optimization" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        Bundle Optimization
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-1">
                          ✅ Implemented
                        </h4>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• Lazy loading for routes</li>
                          <li>• Tree shaking enabled</li>
                          <li>• Gzip compression</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <h4 className="font-medium text-yellow-900 mb-1">
                          ⚠️ Recommended
                        </h4>
                        <ul className="text-sm text-yellow-800 space-y-1">
                          <li>• Split vendor chunks</li>
                          <li>• Preload critical resources</li>
                          <li>• Implement service worker</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Core Web Vitals
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">
                            Largest Contentful Paint
                          </span>
                          <span className="text-sm text-green-600">1.2s</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">
                            First Input Delay
                          </span>
                          <span className="text-sm text-green-600">45ms</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">
                            Cumulative Layout Shift
                          </span>
                          <span className="text-sm text-green-600">0.1</span>
                        </div>
                        <Progress value={88} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            {/* Real-time Monitoring */}
            <TabsContent value="monitoring" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Live Performance Monitor
                    </CardTitle>
                    <CardDescription>
                      Real-time monitoring of application performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="mb-4"
                      >
                        <Activity className="w-16 h-16 text-primary mx-auto" />
                      </motion.div>
                      <h3 className="text-lg font-medium mb-2">
                        {isMonitoring
                          ? "Monitoring Active"
                          : "Monitoring Paused"}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {isMonitoring
                          ? "Real-time performance data is being collected"
                          : "Click 'Start Monitor' to begin real-time monitoring"}
                      </p>
                      <div className="flex justify-center gap-4">
                        <Button
                          variant={isMonitoring ? "destructive" : "default"}
                          onClick={() => setIsMonitoring(!isMonitoring)}
                        >
                          {isMonitoring
                            ? "Stop Monitoring"
                            : "Start Monitoring"}
                        </Button>
                        <Button variant="outline">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure Alerts
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </>
  );
};

export default PerformanceDashboard;
