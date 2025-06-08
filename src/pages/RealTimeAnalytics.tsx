import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
  Bell,
  BellOff,
  RefreshCw,
  Zap,
  BarChart3,
} from "lucide-react";
import {
  realTimeAnalytics,
  RealTimeData,
  AlertData,
} from "@/services/realTimeAnalytics";
import { predictiveAnalytics } from "@/services/predictiveAnalytics";
import { PerformanceMetric } from "@/types/analytics";
import { useToast } from "@/hooks/use-toast";

interface LiveDataPoint {
  timestamp: string;
  reach: number;
  conversions: number;
  spend: number;
  ctr: number;
}

const RealTimeAnalytics: React.FC = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [liveChart, setLiveChart] = useState<LiveDataPoint[]>([]);
  const [notifications, setNotifications] = useState(true);
  const [refreshRate, setRefreshRate] = useState("5");
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribeData = realTimeAnalytics.subscribe(
      "data",
      (data: RealTimeData) => {
        setRealTimeData(data);

        // Update live chart
        const newDataPoint: LiveDataPoint = {
          timestamp: new Date().toLocaleTimeString(),
          reach: data.metrics.find((m) => m.name === "Total Reach")?.value || 0,
          conversions:
            data.metrics.find((m) => m.name === "Conversion Rate")?.value || 0,
          spend:
            data.metrics.find((m) => m.name === "Cost Per Acquisition")
              ?.value || 0,
          ctr: Math.random() * 5 + 1, // Mock CTR data
        };

        setLiveChart((prev) => {
          const updated = [...prev, newDataPoint];
          return updated.slice(-20); // Keep last 20 data points
        });
      },
    );

    const unsubscribeAlerts = realTimeAnalytics.subscribe(
      "alert",
      (alert: AlertData) => {
        setAlerts((prev) => [alert, ...prev].slice(0, 10)); // Keep last 10 alerts

        if (notifications) {
          toast({
            title: alert.title,
            description: alert.message,
            variant:
              alert.severity === "critical" || alert.severity === "high"
                ? "destructive"
                : "default",
          });
        }
      },
    );

    const unsubscribeConnection = realTimeAnalytics.subscribe(
      "connected",
      (connected: boolean) => {
        setIsConnected(connected);
      },
    );

    // Load predictions
    loadPredictions();

    return () => {
      unsubscribeData();
      unsubscribeAlerts();
      unsubscribeConnection();
    };
  }, [notifications, toast]);

  const loadPredictions = async () => {
    try {
      const campaignPrediction =
        await predictiveAnalytics.predictCampaignPerformance("campaign_1");
      setPredictions([campaignPrediction]);
    } catch (error) {
      console.error("Failed to load predictions:", error);
    }
  };

  const formatValue = (value: number, unit: PerformanceMetric["unit"]) => {
    switch (unit) {
      case "currency":
        return `$${value.toFixed(2)}`;
      case "percentage":
        return `${value.toFixed(1)}%`;
      case "number":
        return value >= 1000000
          ? `${(value / 1000000).toFixed(1)}M`
          : value >= 1000
            ? `${(value / 1000).toFixed(0)}K`
            : value.toString();
      default:
        return value.toString();
    }
  };

  const getAlertIcon = (severity: AlertData["severity"]) => {
    switch (severity) {
      case "critical":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "high":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "medium":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "low":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: AlertData["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-500" />
              Real-Time Analytics
            </h1>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              Live performance monitoring and intelligent insights
              <div className="flex items-center gap-1">
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-500" />{" "}
                    <span className="text-green-600 text-sm">Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-red-500" />{" "}
                    <span className="text-red-600 text-sm">Disconnected</span>
                  </>
                )}
              </div>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={refreshRate} onValueChange={setRefreshRate}>
              <SelectTrigger className="w-32">
                <RefreshCw className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 second</SelectItem>
                <SelectItem value="5">5 seconds</SelectItem>
                <SelectItem value="10">10 seconds</SelectItem>
                <SelectItem value="30">30 seconds</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setNotifications(!notifications)}
            >
              {notifications ? (
                <>
                  <Bell className="w-4 h-4 mr-2" /> Notifications On
                </>
              ) : (
                <>
                  <BellOff className="w-4 h-4 mr-2" /> Notifications Off
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Connection Status Alert */}
        {!isConnected && (
          <Alert className="border-red-200 bg-red-50">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              Real-time connection lost. Attempting to reconnect...
            </AlertDescription>
          </Alert>
        )}

        {/* Real-Time Metrics */}
        {realTimeData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {realTimeData.metrics.map((metric) => (
              <motion.div
                key={metric.id}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {metric.name}
                        </p>
                        <motion.p
                          className="text-2xl font-bold text-gray-900 mt-1"
                          key={metric.value}
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {formatValue(metric.value, metric.unit)}
                        </motion.p>
                        <div className="flex items-center mt-2">
                          {metric.changeType === "increase" ? (
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          ) : metric.changeType === "decrease" ? (
                            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                          ) : (
                            <Activity className="w-4 h-4 text-gray-500 mr-1" />
                          )}
                          <span
                            className={`text-sm ${
                              metric.changeType === "increase"
                                ? "text-green-600"
                                : metric.changeType === "decrease"
                                  ? "text-red-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {metric.change > 0 ? "+" : ""}
                            {metric.change.toFixed(1)}%
                          </span>
                          <span className="text-sm text-gray-500 ml-1">
                            vs last {metric.period}
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        {metric.name.includes("Reach") && (
                          <Users className="w-6 h-6 text-primary" />
                        )}
                        {metric.name.includes("Conversion") && (
                          <Target className="w-6 h-6 text-primary" />
                        )}
                        {metric.name.includes("Cost") && (
                          <DollarSign className="w-6 h-6 text-primary" />
                        )}
                        {metric.name.includes("Return") && (
                          <TrendingUp className="w-6 h-6 text-primary" />
                        )}
                      </div>
                    </div>

                    {/* Live indicator */}
                    <motion.div
                      className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Live Performance Trend
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full ml-2"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </CardTitle>
              <CardDescription>
                Real-time metrics over the last few minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={liveChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="reach"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="conversions"
                    stackId="2"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* AI Predictions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                AI Predictions
              </CardTitle>
              <CardDescription>
                Machine learning insights for the next 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {predictions.length > 0 ? (
                <div className="space-y-4">
                  {predictions.map((prediction, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Performance Forecast</h4>
                        <Badge variant="outline">
                          {(prediction.confidence * 100).toFixed(1)}% confidence
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Predicted improvement:</span>
                          <span className="font-medium text-green-600">
                            +{(prediction.prediction * 100).toFixed(1)}%
                          </span>
                        </div>
                        {prediction.recommendations
                          .slice(0, 2)
                          .map((rec: string, idx: number) => (
                            <div
                              key={idx}
                              className="text-sm text-gray-600 bg-gray-50 rounded p-2"
                            >
                              💡 {rec}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Loading AI predictions...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Real-Time Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Live Alerts & Notifications
            </CardTitle>
            <CardDescription>
              Real-time monitoring alerts and system notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <AnimatePresence>
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
                  >
                    {getAlertIcon(alert.severity)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{alert.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {alert.severity}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm mt-1">{alert.message}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {alerts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No alerts at this time. All systems running smoothly!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeAnalytics;
