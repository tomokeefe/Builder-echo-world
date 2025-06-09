import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Grip,
  Trash2,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Save,
  Download,
  Eye,
} from "lucide-react";
import EnhancedChart from "@/components/ui/enhanced-chart";
import { cn } from "@/lib/utils";

export interface DashboardWidget {
  id: string;
  type: "metric" | "chart" | "table" | "text";
  title: string;
  description?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: {
    dataSource?: string;
    chartType?: "line" | "bar" | "pie" | "area";
    metric?: string;
    dateRange?: string;
    filters?: Record<string, any>;
    style?: Record<string, any>;
  };
  data?: any[];
}

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  category: "marketing" | "sales" | "analytics" | "custom";
  widgets: DashboardWidget[];
  layout: "grid" | "freeform";
  theme: "light" | "dark";
}

interface SortableWidgetProps {
  widget: DashboardWidget;
  onEdit: (widget: DashboardWidget) => void;
  onDelete: (id: string) => void;
}

const SortableWidget: React.FC<SortableWidgetProps> = ({
  widget,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderWidgetContent = () => {
    switch (widget.type) {
      case "metric":
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-primary">
              {widget.data?.[0]?.value || "123"}
            </h3>
            <p className="text-sm text-gray-600">{widget.title}</p>
          </div>
        );
      case "chart":
        return (
          <EnhancedChart
            data={
              widget.data || [
                { name: "Jan", value: 400 },
                { name: "Feb", value: 300 },
                { name: "Mar", value: 500 },
              ]
            }
            type={widget.config.chartType || "line"}
            title=""
            xKey="name"
            yKey="value"
            height={150}
            animated={false}
          />
        );
      case "table":
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-600">
              <span>Item</span>
              <span>Value</span>
              <span>Change</span>
            </div>
            {(
              widget.data || [
                { item: "Revenue", value: "$12,345", change: "+5%" },
                { item: "Users", value: "1,234", change: "+12%" },
              ]
            )
              .slice(0, 3)
              .map((row: any, index: number) => (
                <div key={index} className="grid grid-cols-3 gap-2 text-xs">
                  <span>{row.item}</span>
                  <span className="font-medium">{row.value}</span>
                  <span className="text-green-600">{row.change}</span>
                </div>
              ))}
          </div>
        );
      case "text":
        return (
          <div className="text-sm">
            <p>{widget.description || "Custom text widget"}</p>
          </div>
        );
      default:
        return <div>Unknown widget type</div>;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <Card className="h-full transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {widget.title}
            </CardTitle>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onEdit(widget)}
              >
                <Settings className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onDelete(widget.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1"
              >
                <Grip className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">{renderWidgetContent()}</CardContent>
      </Card>
    </div>
  );
};

const DashboardBuilder: React.FC = () => {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    {
      id: "widget-1",
      type: "metric",
      title: "Total Revenue",
      position: { x: 0, y: 0 },
      size: { width: 1, height: 1 },
      config: { metric: "revenue", dataSource: "analytics" },
      data: [{ value: "$45,231" }],
    },
    {
      id: "widget-2",
      type: "chart",
      title: "Monthly Trends",
      position: { x: 1, y: 0 },
      size: { width: 2, height: 1 },
      config: { chartType: "line", dataSource: "campaigns" },
    },
    {
      id: "widget-3",
      type: "table",
      title: "Top Campaigns",
      position: { x: 0, y: 1 },
      size: { width: 1, height: 1 },
      config: { dataSource: "campaigns" },
    },
  ]);

  const [activeWidget, setActiveWidget] = useState<DashboardWidget | null>(
    null,
  );
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [showWidgetEditor, setShowWidgetEditor] = useState(false);
  const [editingWidget, setEditingWidget] = useState<DashboardWidget | null>(
    null,
  );
  const [dashboardName, setDashboardName] = useState("My Custom Dashboard");

  const sensors = useSensors(useSensor(PointerSensor));

  const widgetTypes = [
    {
      type: "metric",
      name: "Metric Card",
      description: "Display a single key metric",
      icon: Target,
    },
    {
      type: "chart",
      name: "Chart",
      description: "Various chart types for data visualization",
      icon: BarChart3,
    },
    {
      type: "table",
      name: "Data Table",
      description: "Tabular data display",
      icon: Activity,
    },
    {
      type: "text",
      name: "Text Widget",
      description: "Custom text or markdown content",
      icon: Users,
    },
  ];

  const dataSources = [
    { id: "analytics", name: "Analytics Data" },
    { id: "campaigns", name: "Campaign Data" },
    { id: "audiences", name: "Audience Data" },
    { id: "clients", name: "Client Data" },
    { id: "api", name: "External API" },
  ];

  const chartTypes = [
    { id: "line", name: "Line Chart" },
    { id: "bar", name: "Bar Chart" },
    { id: "pie", name: "Pie Chart" },
    { id: "area", name: "Area Chart" },
  ];

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const widget = widgets.find((w) => w.id === active.id);
    setActiveWidget(widget || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveWidget(null);
  };

  const addWidget = (type: DashboardWidget["type"]) => {
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      position: { x: 0, y: widgets.length },
      size: { width: 1, height: 1 },
      config: {
        dataSource: "analytics",
        chartType: type === "chart" ? "line" : undefined,
      },
    };

    setWidgets((prev) => [...prev, newWidget]);
    setShowAddWidget(false);
  };

  const editWidget = (widget: DashboardWidget) => {
    setEditingWidget({ ...widget });
    setShowWidgetEditor(true);
  };

  const saveWidget = () => {
    if (!editingWidget) return;

    setWidgets((prev) =>
      prev.map((w) => (w.id === editingWidget.id ? editingWidget : w)),
    );
    setShowWidgetEditor(false);
    setEditingWidget(null);
  };

  const deleteWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  };

  const saveDashboard = () => {
    const dashboard: DashboardTemplate = {
      id: `dashboard-${Date.now()}`,
      name: dashboardName,
      description: "Custom dashboard created with dashboard builder",
      category: "custom",
      widgets,
      layout: "grid",
      theme: "light",
    };

    // Save to localStorage (in real app, this would be saved to backend)
    const savedDashboards = JSON.parse(
      localStorage.getItem("customDashboards") || "[]",
    );
    savedDashboards.push(dashboard);
    localStorage.setItem("customDashboards", JSON.stringify(savedDashboards));

    alert("Dashboard saved successfully!");
  };

  const exportDashboard = () => {
    const dashboard: DashboardTemplate = {
      id: `dashboard-${Date.now()}`,
      name: dashboardName,
      description: "Custom dashboard export",
      category: "custom",
      widgets,
      layout: "grid",
      theme: "light",
    };

    const blob = new Blob([JSON.stringify(dashboard, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${dashboardName.toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <Input
            value={dashboardName}
            onChange={(e) => setDashboardName(e.target.value)}
            className="text-xl font-bold border-none p-0 h-auto bg-transparent"
          />
          <p className="text-gray-600 text-sm">
            Drag and drop widgets to customize your dashboard
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={showAddWidget} onOpenChange={setShowAddWidget}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Widget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Widget</DialogTitle>
                <DialogDescription>
                  Choose a widget type to add to your dashboard
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                {widgetTypes.map((widgetType) => (
                  <Card
                    key={widgetType.type}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() =>
                      addWidget(widgetType.type as DashboardWidget["type"])
                    }
                  >
                    <CardContent className="p-4 text-center">
                      <widgetType.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium mb-1">{widgetType.name}</h3>
                      <p className="text-xs text-gray-600">
                        {widgetType.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={saveDashboard}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>

          <Button variant="outline" onClick={exportDashboard}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={widgets.map((w) => w.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {widgets.map((widget) => (
              <SortableWidget
                key={widget.id}
                widget={widget}
                onEdit={editWidget}
                onDelete={deleteWidget}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeWidget ? (
            <Card className="opacity-80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{activeWidget.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-100 rounded" />
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Widget Editor Dialog */}
      <Dialog open={showWidgetEditor} onOpenChange={setShowWidgetEditor}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Widget</DialogTitle>
            <DialogDescription>
              Configure your widget settings
            </DialogDescription>
          </DialogHeader>

          {editingWidget && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="widgetTitle">Title</Label>
                <Input
                  id="widgetTitle"
                  value={editingWidget.title}
                  onChange={(e) =>
                    setEditingWidget((prev) =>
                      prev ? { ...prev, title: e.target.value } : null,
                    )
                  }
                />
              </div>

              <div>
                <Label htmlFor="widgetDescription">Description</Label>
                <Input
                  id="widgetDescription"
                  value={editingWidget.description || ""}
                  onChange={(e) =>
                    setEditingWidget((prev) =>
                      prev ? { ...prev, description: e.target.value } : null,
                    )
                  }
                />
              </div>

              <div>
                <Label htmlFor="dataSource">Data Source</Label>
                <Select
                  value={editingWidget.config.dataSource}
                  onValueChange={(value) =>
                    setEditingWidget((prev) =>
                      prev
                        ? {
                            ...prev,
                            config: { ...prev.config, dataSource: value },
                          }
                        : null,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSources.map((source) => (
                      <SelectItem key={source.id} value={source.id}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {editingWidget.type === "chart" && (
                <div>
                  <Label htmlFor="chartType">Chart Type</Label>
                  <Select
                    value={editingWidget.config.chartType}
                    onValueChange={(value) =>
                      setEditingWidget((prev) =>
                        prev
                          ? {
                              ...prev,
                              config: {
                                ...prev.config,
                                chartType: value as any,
                              },
                            }
                          : null,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {chartTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowWidgetEditor(false)}
                >
                  Cancel
                </Button>
                <Button onClick={saveWidget}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {widgets.length === 0 && (
        <div className="text-center py-12">
          <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No widgets added yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start building your custom dashboard by adding widgets
          </p>
          <Button onClick={() => setShowAddWidget(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Widget
          </Button>
        </div>
      )}
    </div>
  );
};

export default DashboardBuilder;
