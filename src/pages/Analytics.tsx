import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  Activity,
  Globe,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
} from "lucide-react";
import {
  PerformanceMetric,
  ChartData,
  AudienceOverlap,
} from "@/types/analytics";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Mock analytics data
  const performanceMetrics: PerformanceMetric[] = [
    {
      id: "1",
      name: "Total Reach",
      value: 2450000,
      previousValue: 2100000,
      change: 16.7,
      changeType: "increase",
      unit: "number",
      period: "month",
    },
    {
      id: "2",
      name: "Conversion Rate",
      value: 3.2,
      previousValue: 2.8,
      change: 14.3,
      changeType: "increase",
      unit: "percentage",
      period: "month",
    },
    {
      id: "3",
      name: "Cost Per Acquisition",
      value: 45.2,
      previousValue: 52.1,
      change: -13.3,
      changeType: "decrease",
      unit: "currency",
      period: "month",
    },
    {
      id: "4",
      name: "Return on Ad Spend",
      value: 4.8,
      previousValue: 4.2,
      change: 14.3,
      changeType: "increase",
      unit: "number",
      period: "month",
    },
  ];

  const chartData = [
    { date: "2024-01-01", reach: 180000, conversions: 2400, spend: 12000 },
    { date: "2024-01-02", reach: 195000, conversions: 2800, spend: 13500 },
    { date: "2024-01-03", reach: 220000, conversions: 3200, spend: 15000 },
    { date: "2024-01-04", reach: 205000, conversions: 2900, spend: 14200 },
    { date: "2024-01-05", reach: 240000, conversions: 3600, spend: 16800 },
    { date: "2024-01-06", reach: 260000, conversions: 4100, spend: 18500 },
    { date: "2024-01-07", reach: 285000, conversions: 4500, spend: 20000 },
  ];

  const audienceOverlap: AudienceOverlap[] = [
    {
      audienceA: "High-Value Customers",
      audienceB: "Mobile App Users",
      overlapSize: 120000,
      overlapPercentage: 15.2,
      uniqueToA: 180000,
      uniqueToB: 95000,
    },
    {
      audienceA: "High-Value Customers",
      audienceB: "Newsletter Subscribers",
      overlapSize: 85000,
      overlapPercentage: 12.8,
      uniqueToA: 215000,
      uniqueToB: 60000,
    },
  ];

  const conversionFunnelData = [
    { stage: "Awareness", users: 1000000, conversionRate: 100, dropOffRate: 0 },
    { stage: "Interest", users: 750000, conversionRate: 75, dropOffRate: 25 },
    {
      stage: "Consideration",
      users: 400000,
      conversionRate: 40,
      dropOffRate: 35,
    },
    { stage: "Intent", users: 180000, conversionRate: 18, dropOffRate: 22 },
    { stage: "Purchase", users: 85000, conversionRate: 8.5, dropOffRate: 9.5 },
  ];

  const geographicData = [
    { name: "United States", value: 42, color: "#8884d8" },
    { name: "Canada", value: 18, color: "#82ca9d" },
    { name: "United Kingdom", value: 15, color: "#ffc658" },
    { name: "Germany", value: 12, color: "#ff7300" },
    { name: "Others", value: 13, color: "#0088fe" },
  ];

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

  const handleRefreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive insights into your audience performance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={handleRefreshData}
              disabled={isLoading}
            >
              <Refresh
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>

            <Button
              variant="outline"
              onClick={handleRefreshData}
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceMetrics.map((metric) => (
            <Card key={metric.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {metric.name}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatValue(metric.value, metric.unit)}
                    </p>
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
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="audiences">Audience Overlap</TabsTrigger>
            <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
            <TabsTrigger value="geographic">Geographic</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          {/* Performance Charts */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChartIcon className="w-5 h-5" />
                    Reach & Conversions Trend
                  </CardTitle>
                  <CardDescription>
                    Daily performance over the selected time period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString()
                        }
                      />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="reach"
                        stroke="#3B82F6"
                        strokeWidth={2}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="conversions"
                        stroke="#10B981"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Spend Analysis
                  </CardTitle>
                  <CardDescription>
                    Daily advertising spend breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString()
                        }
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="spend" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Audience Overlap */}
          <TabsContent value="audiences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audience Overlap Analysis</CardTitle>
                <CardDescription>
                  Understanding the overlap between your different audience
                  segments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {audienceOverlap.map((overlap, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">
                            {overlap.audienceA} ↔ {overlap.audienceB}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {overlap.overlapSize.toLocaleString()} overlapping
                            users ({overlap.overlapPercentage}%)
                          </p>
                        </div>
                        <Badge variant="outline">
                          {overlap.overlapPercentage.toFixed(1)}% Overlap
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-medium text-blue-600">
                            {overlap.uniqueToA.toLocaleString()}
                          </p>
                          <p className="text-gray-600">
                            Unique to {overlap.audienceA}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-purple-600">
                            {overlap.overlapSize.toLocaleString()}
                          </p>
                          <p className="text-gray-600">Overlap</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-green-600">
                            {overlap.uniqueToB.toLocaleString()}
                          </p>
                          <p className="text-gray-600">
                            Unique to {overlap.audienceB}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex h-4 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-500"
                            style={{
                              width: `${(overlap.uniqueToA / (overlap.uniqueToA + overlap.overlapSize + overlap.uniqueToB)) * 100}%`,
                            }}
                          />
                          <div
                            className="bg-purple-500"
                            style={{
                              width: `${(overlap.overlapSize / (overlap.uniqueToA + overlap.overlapSize + overlap.uniqueToB)) * 100}%`,
                            }}
                          />
                          <div
                            className="bg-green-500"
                            style={{
                              width: `${(overlap.uniqueToB / (overlap.uniqueToA + overlap.overlapSize + overlap.uniqueToB)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversion Funnel */}
          <TabsContent value="funnel" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel Analysis</CardTitle>
                <CardDescription>
                  Track user journey from awareness to conversion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversionFunnelData.map((stage, index) => (
                    <div key={stage.stage} className="relative">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{stage.stage}</h4>
                            <p className="text-sm text-gray-600">
                              {stage.users.toLocaleString()} users (
                              {stage.conversionRate}%)
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {stage.conversionRate}%
                          </p>
                          {index > 0 && (
                            <p className="text-sm text-red-600">
                              -{stage.dropOffRate}% drop-off
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress
                          value={stage.conversionRate}
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Geographic Analysis */}
          <TabsContent value="geographic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5" />
                    Geographic Distribution
                  </CardTitle>
                  <CardDescription>
                    Audience distribution by country
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={geographicData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {geographicData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Regional Performance
                  </CardTitle>
                  <CardDescription>
                    Performance metrics by geographic region
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {geographicData.map((region) => (
                      <div
                        key={region.name}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: region.color }}
                          />
                          <span className="font-medium">{region.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{region.value}%</p>
                          <Badge variant="outline" className="text-xs">
                            High Performance
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>
                  Long-term performance analysis and forecasting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString()
                      }
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
