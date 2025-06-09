import React, { useState, useMemo } from "react";
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
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Brush,
} from "recharts";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Badge } from "./badge";
import {
  Download,
  Maximize2,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Minus,
  Settings,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export interface ChartDataPoint {
  [key: string]: any;
  name?: string;
  date?: string;
  value?: number;
  x?: number;
  y?: number;
}

export interface ChartConfig {
  type: "line" | "area" | "bar" | "pie";
  data: ChartDataPoint[];
  xKey: string;
  yKey: string | string[];
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  showBrush?: boolean;
  showTooltip?: boolean;
  height?: number;
  animate?: boolean;
  referenceLines?: Array<{
    value: number;
    label?: string;
    color?: string;
  }>;
}

export interface EnhancedChartProps {
  title?: string;
  description?: string;
  config?: ChartConfig;
  loading?: boolean;
  error?: string;
  className?: string;
  showControls?: boolean;
  onExport?: () => void;
  onRefresh?: () => void;
  // Individual props for backward compatibility
  data?: ChartDataPoint[];
  type?: "line" | "area" | "bar" | "pie";
  xKey?: string;
  yKey?: string | string[];
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  showBrush?: boolean;
  showTooltip?: boolean;
  height?: number;
  animate?: boolean;
  interactive?: boolean;
  drillDownEnabled?: boolean;
  animated?: boolean;
  subtitle?: string;
}

const defaultColors = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#ec4899", // pink
];

export const EnhancedChart: React.FC<EnhancedChartProps> = ({
  title,
  description,
  config,
  loading = false,
  error,
  className = "",
  showControls = true,
  onExport,
  onRefresh,
  // Individual props
  data,
  type,
  xKey,
  yKey,
  colors: propColors,
  showGrid = true,
  showLegend = true,
  showBrush = false,
  showTooltip = true,
  height: propHeight,
  animate = true,
}) => {
  // Create config from individual props if config is not provided
  const chartConfig: ChartConfig = config || {
    type: type || "line",
    data: data || [],
    xKey: xKey || "",
    yKey: yKey || "",
    colors: propColors,
    showGrid,
    showLegend,
    showBrush,
    showTooltip,
    height: propHeight,
    animate,
  };

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedDataKeys, setSelectedDataKeys] = useState<string[]>(
    Array.isArray(chartConfig.yKey) ? chartConfig.yKey : [chartConfig.yKey],
  );

  const colors = chartConfig.colors || defaultColors;
  const height = chartConfig.height || 300;

  // Calculate trend for display
  const trend = useMemo(() => {
    if (!chartConfig.data || chartConfig.data.length < 2) return null;

    const yKey = Array.isArray(chartConfig.yKey)
      ? chartConfig.yKey[0]
      : chartConfig.yKey;
    const firstValue = chartConfig.data[0][yKey];
    const lastValue = chartConfig.data[chartConfig.data.length - 1][yKey];

    if (firstValue && lastValue) {
      const change = ((lastValue - firstValue) / firstValue) * 100;
      return {
        direction: change > 0 ? "up" : change < 0 ? "down" : "neutral",
        percentage: Math.abs(change).toFixed(1),
      };
    }
    return null;
  }, [config.data, config.yKey]);

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full text-red-500">
          <div className="text-center">
            <p className="font-medium">Error loading chart</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      );
    }

    if (!config.data || config.data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <p className="font-medium">No data available</p>
            <p className="text-sm">Data will appear here when available</p>
          </div>
        </div>
      );
    }

    const commonProps = {
      data: config.data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (config.type) {
      case "line":
        return (
          <LineChart {...commonProps}>
            {config.showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            )}
            <XAxis
              dataKey={config.xKey}
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
            />
            <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
            {config.showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
            )}
            {config.showLegend && <Legend />}

            {config.referenceLines?.map((refLine, index) => (
              <ReferenceLine
                key={index}
                y={refLine.value}
                stroke={refLine.color || "#ef4444"}
                strokeDasharray="5 5"
                label={refLine.label}
              />
            ))}

            {selectedDataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{
                  fill: colors[index % colors.length],
                  strokeWidth: 0,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  stroke: colors[index % colors.length],
                  strokeWidth: 2,
                }}
                animationDuration={config.animate ? 750 : 0}
              />
            ))}

            {config.showBrush && (
              <Brush dataKey={config.xKey} height={30} stroke={colors[0]} />
            )}
          </LineChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            {config.showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            )}
            <XAxis
              dataKey={config.xKey}
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
            />
            <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
            {config.showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
            )}
            {config.showLegend && <Legend />}

            {selectedDataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.3}
                strokeWidth={2}
                animationDuration={config.animate ? 750 : 0}
              />
            ))}
          </AreaChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            {config.showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            )}
            <XAxis
              dataKey={config.xKey}
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
            />
            <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
            {config.showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
            )}
            {config.showLegend && <Legend />}

            {selectedDataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
                animationDuration={config.animate ? 750 : 0}
              />
            ))}
          </BarChart>
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={config.data}
              cx="50%"
              cy="50%"
              outerRadius={Math.min(height / 3, 100)}
              fill={colors[0]}
              dataKey={
                Array.isArray(config.yKey) ? config.yKey[0] : config.yKey
              }
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              animationDuration={config.animate ? 750 : 0}
            >
              {config.data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            {config.showTooltip && <Tooltip />}
            {config.showLegend && <Legend />}
          </PieChart>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <Card
      className={`${className} ${isFullscreen ? "fixed inset-4 z-50" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              {title && <CardTitle className="text-lg">{title}</CardTitle>}
              {trend && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {trend.direction === "up" && (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  )}
                  {trend.direction === "down" && (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  {trend.direction === "neutral" && (
                    <Minus className="w-3 h-3 text-gray-500" />
                  )}
                  {trend.percentage}%
                </Badge>
              )}
            </div>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>

          {showControls && (
            <div className="flex items-center gap-2">
              {onRefresh && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRefresh}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onExport && (
                    <DropdownMenuItem onClick={onExport}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Chart
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Chart Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div
          style={{
            width: "100%",
            height: isFullscreen ? "calc(100vh - 200px)" : height,
          }}
        >
          <ResponsiveContainer>{renderChart()}</ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedChart;
