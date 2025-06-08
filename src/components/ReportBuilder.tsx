import React, { useState, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Minus,
  Download,
  Save,
  Eye,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Table,
  FileText,
  Mail,
  Clock,
  Settings,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface ReportWidget {
  id: string;
  type: "metric" | "chart" | "table" | "text";
  title: string;
  description?: string;
  config: {
    metrics?: string[];
    chartType?: "line" | "bar" | "pie" | "area";
    timeRange?: string;
    filters?: Record<string, any>;
    columns?: string[];
    content?: string;
  };
  position: { x: number; y: number; w: number; h: number };
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  widgets: ReportWidget[];
  schedule?: {
    frequency: "daily" | "weekly" | "monthly";
    recipients: string[];
    format: "pdf" | "excel" | "email";
  };
  createdAt: string;
  updatedAt: string;
}

const availableMetrics = [
  { id: "reach", name: "Total Reach", category: "audience" },
  { id: "impressions", name: "Impressions", category: "performance" },
  { id: "clicks", name: "Clicks", category: "performance" },
  { id: "conversions", name: "Conversions", category: "performance" },
  { id: "ctr", name: "Click-Through Rate", category: "performance" },
  { id: "cpa", name: "Cost Per Acquisition", category: "cost" },
  { id: "roas", name: "Return on Ad Spend", category: "cost" },
  { id: "spend", name: "Total Spend", category: "cost" },
  { id: "revenue", name: "Revenue", category: "revenue" },
];

const widgetTemplates = [
  {
    type: "metric",
    title: "Performance Metric",
    description: "Single metric with trend",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    type: "chart",
    title: "Performance Chart",
    description: "Visualization of metrics over time",
    icon: <LineChart className="w-4 h-4" />,
  },
  {
    type: "table",
    title: "Data Table",
    description: "Detailed tabular data",
    icon: <Table className="w-4 h-4" />,
  },
  {
    type: "text",
    title: "Text Block",
    description: "Custom text content",
    icon: <FileText className="w-4 h-4" />,
  },
];

const ReportBuilder: React.FC = () => {
  const { toast } = useToast();
  const [reportName, setReportName] = useState("New Report");
  const [reportDescription, setReportDescription] = useState("");
  const [widgets, setWidgets] = useState<ReportWidget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("design");

  const handleAddWidget = useCallback(
    (type: string) => {
      const newWidget: ReportWidget = {
        id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: type as any,
        title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        config: {
          metrics: type === "metric" ? ["reach"] : undefined,
          chartType: type === "chart" ? "line" : undefined,
          timeRange: "30d",
          filters: {},
          columns:
            type === "table"
              ? ["campaign", "impressions", "clicks"]
              : undefined,
          content:
            type === "text" ? "Enter your text content here..." : undefined,
        },
        position: { x: 0, y: widgets.length * 2, w: 6, h: 4 },
      };

      setWidgets((prev) => [...prev, newWidget]);
      setSelectedWidget(newWidget.id);
    },
    [widgets.length],
  );

  const handleUpdateWidget = useCallback(
    (widgetId: string, updates: Partial<ReportWidget>) => {
      setWidgets((prev) =>
        prev.map((widget) =>
          widget.id === widgetId ? { ...widget, ...updates } : widget,
        ),
      );
    },
    [],
  );

  const handleDeleteWidget = useCallback(
    (widgetId: string) => {
      setWidgets((prev) => prev.filter((widget) => widget.id !== widgetId));
      if (selectedWidget === widgetId) {
        setSelectedWidget(null);
      }
    },
    [selectedWidget],
  );

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const items = Array.from(widgets);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      setWidgets(items);
    },
    [widgets],
  );

  const handleSaveReport = useCallback(async () => {
    if (!reportName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a report name",
        variant: "destructive",
      });
      return;
    }

    const report: ReportTemplate = {
      id: `report_${Date.now()}`,
      name: reportName,
      description: reportDescription,
      widgets,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to localStorage for demo
    const savedReports = JSON.parse(
      localStorage.getItem("customReports") || "[]",
    );
    savedReports.push(report);
    localStorage.setItem("customReports", JSON.stringify(savedReports));

    toast({
      title: "Report Saved",
      description: `Report "${reportName}" has been saved successfully`,
    });
  }, [reportName, reportDescription, widgets, toast]);

  const handleExportReport = useCallback(
    (format: "pdf" | "excel") => {
      toast({
        title: "Export Started",
        description: `Generating ${format.toUpperCase()} report...`,
      });

      // Simulate export process
      setTimeout(() => {
        toast({
          title: "Export Complete",
          description: `Report exported as ${format.toUpperCase()}`,
        });
      }, 2000);
    },
    [toast],
  );

  const selectedWidgetData = widgets.find((w) => w.id === selectedWidget);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Widget Library */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Report Builder
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Drag widgets to build your report
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 m-4">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="px-4 pb-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Widget Library
                </Label>
                <div className="grid gap-2 mt-2">
                  {widgetTemplates.map((template) => (
                    <Card
                      key={template.type}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleAddWidget(template.type)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          {template.icon}
                          <div>
                            <h4 className="text-sm font-medium">
                              {template.title}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {template.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Current Widgets
                </Label>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="widgets">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="mt-2 space-y-2"
                      >
                        {widgets.map((widget, index) => (
                          <Draggable
                            key={widget.id}
                            draggableId={widget.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Card
                                  className={`cursor-pointer transition-colors ${
                                    selectedWidget === widget.id
                                      ? "ring-2 ring-primary"
                                      : "hover:bg-gray-50"
                                  }`}
                                  onClick={() => setSelectedWidget(widget.id)}
                                >
                                  <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h4 className="text-sm font-medium">
                                          {widget.title}
                                        </h4>
                                        <Badge
                                          variant="outline"
                                          className="text-xs mt-1"
                                        >
                                          {widget.type}
                                        </Badge>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteWidget(widget.id);
                                        }}
                                      >
                                        <Minus className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data" className="px-4 pb-4">
            {selectedWidgetData ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="widget-title">Widget Title</Label>
                  <Input
                    id="widget-title"
                    value={selectedWidgetData.title}
                    onChange={(e) =>
                      handleUpdateWidget(selectedWidgetData.id, {
                        title: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>

                {selectedWidgetData.type === "metric" && (
                  <div>
                    <Label>Metrics</Label>
                    <div className="mt-2 space-y-2">
                      {availableMetrics.map((metric) => (
                        <div
                          key={metric.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={metric.id}
                            checked={selectedWidgetData.config.metrics?.includes(
                              metric.id,
                            )}
                            onCheckedChange={(checked) => {
                              const currentMetrics =
                                selectedWidgetData.config.metrics || [];
                              const newMetrics = checked
                                ? [...currentMetrics, metric.id]
                                : currentMetrics.filter((m) => m !== metric.id);

                              handleUpdateWidget(selectedWidgetData.id, {
                                config: {
                                  ...selectedWidgetData.config,
                                  metrics: newMetrics,
                                },
                              });
                            }}
                          />
                          <Label htmlFor={metric.id} className="text-sm">
                            {metric.name}
                          </Label>
                          <Badge variant="outline" className="text-xs">
                            {metric.category}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedWidgetData.type === "chart" && (
                  <div>
                    <Label>Chart Type</Label>
                    <Select
                      value={selectedWidgetData.config.chartType}
                      onValueChange={(value) =>
                        handleUpdateWidget(selectedWidgetData.id, {
                          config: {
                            ...selectedWidgetData.config,
                            chartType: value as any,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                        <SelectItem value="area">Area Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label>Time Range</Label>
                  <Select
                    value={selectedWidgetData.config.timeRange}
                    onValueChange={(value) =>
                      handleUpdateWidget(selectedWidgetData.id, {
                        config: {
                          ...selectedWidgetData.config,
                          timeRange: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="1y">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Select a widget to configure its data settings</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="px-4 pb-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="report-name">Report Name</Label>
                <Input
                  id="report-name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="report-description">Description</Label>
                <Input
                  id="report-description"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="mt-1"
                  placeholder="Optional description..."
                />
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Export Options
                </h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleExportReport("pdf")}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export as PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleExportReport("excel")}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export as Excel
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Schedule Delivery
                </h4>
                <div className="space-y-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Email recipients (comma separated)" />
                  <Button variant="outline" className="w-full">
                    <Clock className="w-4 h-4 mr-2" />
                    Set Schedule
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {reportName}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {widgets.length} widget{widgets.length !== 1 ? "s" : ""} • Last
                saved: Never
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSaveReport} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Report
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-6 overflow-auto">
          {widgets.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">
                  Start Building Your Report
                </h3>
                <p className="text-sm">
                  Add widgets from the left panel to create your custom report
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4">
              {widgets.map((widget) => (
                <Card
                  key={widget.id}
                  className={`col-span-6 cursor-pointer transition-all ${
                    selectedWidget === widget.id
                      ? "ring-2 ring-primary shadow-lg"
                      : ""
                  }`}
                  onClick={() => setSelectedWidget(widget.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{widget.title}</CardTitle>
                    <Badge variant="outline" className="w-fit text-xs">
                      {widget.type}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-gray-50 rounded flex items-center justify-center text-gray-500">
                      {widget.type === "metric" && (
                        <BarChart3 className="w-8 h-8" />
                      )}
                      {widget.type === "chart" && (
                        <LineChart className="w-8 h-8" />
                      )}
                      {widget.type === "table" && <Table className="w-8 h-8" />}
                      {widget.type === "text" && (
                        <FileText className="w-8 h-8" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;
