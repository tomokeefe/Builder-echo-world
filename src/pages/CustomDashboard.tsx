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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Settings,
  Download,
  Upload,
  Copy,
  Trash2,
  Edit,
  MoreVertical,
  Layout,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Users,
  DollarSign,
  TrendingUp,
  Palette,
  Grid,
  Eye,
  Share2,
} from "lucide-react";
import DashboardBuilder, {
  DashboardTemplate,
  DashboardWidget,
} from "@/components/DashboardBuilder";
import EnhancedChart from "@/components/ui/enhanced-chart";
import { useMobile } from "@/hooks/useMobile";
import MobileNavigation from "@/components/ui/mobile-navigation";
import {
  staggerContainer,
  staggerItem,
  elevateHover,
} from "@/utils/animations";

const CustomDashboard: React.FC = () => {
  const mobile = useMobile();
  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0.1,
  });
  const [activeTab, setActiveTab] = useState("builder");
  const [savedDashboards, setSavedDashboards] = useState<DashboardTemplate[]>(
    [],
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<DashboardTemplate | null>(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);

  // Load saved dashboards from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("customDashboards") || "[]");
    setSavedDashboards(saved);
  }, []);

  // Pre-built dashboard templates
  const templates: DashboardTemplate[] = [
    {
      id: "marketing-overview",
      name: "Marketing Overview",
      description: "Complete marketing performance dashboard",
      category: "marketing",
      layout: "grid",
      theme: "light",
      widgets: [
        {
          id: "total-campaigns",
          type: "metric",
          title: "Total Campaigns",
          position: { x: 0, y: 0 },
          size: { width: 1, height: 1 },
          config: { metric: "campaigns", dataSource: "campaigns" },
          data: [{ value: "24" }],
        },
        {
          id: "revenue-chart",
          type: "chart",
          title: "Revenue Trends",
          position: { x: 1, y: 0 },
          size: { width: 2, height: 1 },
          config: { chartType: "line", dataSource: "analytics" },
          data: [
            { month: "Jan", revenue: 12000 },
            { month: "Feb", revenue: 15000 },
            { month: "Mar", revenue: 18000 },
            { month: "Apr", revenue: 22000 },
            { month: "May", revenue: 25000 },
          ],
        },
        {
          id: "top-campaigns",
          type: "table",
          title: "Top Performing Campaigns",
          position: { x: 0, y: 1 },
          size: { width: 2, height: 1 },
          config: { dataSource: "campaigns" },
          data: [
            { campaign: "Summer Sale", revenue: "$12,450", roas: "4.2" },
            { campaign: "Brand Awareness", revenue: "$8,230", roas: "3.8" },
            { campaign: "Product Launch", revenue: "$15,670", roas: "5.1" },
          ],
        },
        {
          id: "conversion-rate",
          type: "metric",
          title: "Conversion Rate",
          position: { x: 2, y: 1 },
          size: { width: 1, height: 1 },
          config: { metric: "conversion_rate", dataSource: "analytics" },
          data: [{ value: "3.2%" }],
        },
      ],
    },
    {
      id: "sales-analytics",
      name: "Sales Analytics",
      description: "Sales performance and pipeline tracking",
      category: "sales",
      layout: "grid",
      theme: "light",
      widgets: [
        {
          id: "total-revenue",
          type: "metric",
          title: "Total Revenue",
          position: { x: 0, y: 0 },
          size: { width: 1, height: 1 },
          config: { metric: "revenue", dataSource: "sales" },
          data: [{ value: "$127,450" }],
        },
        {
          id: "sales-funnel",
          type: "chart",
          title: "Sales Funnel",
          position: { x: 1, y: 0 },
          size: { width: 1, height: 1 },
          config: { chartType: "pie", dataSource: "sales" },
          data: [
            { stage: "Leads", value: 1000 },
            { stage: "Qualified", value: 500 },
            { stage: "Proposals", value: 200 },
            { stage: "Closed", value: 80 },
          ],
        },
        {
          id: "monthly-sales",
          type: "chart",
          title: "Monthly Sales",
          position: { x: 2, y: 0 },
          size: { width: 1, height: 1 },
          config: { chartType: "bar", dataSource: "sales" },
          data: [
            { month: "Jan", sales: 18000 },
            { month: "Feb", sales: 22000 },
            { month: "Mar", sales: 25000 },
            { month: "Apr", sales: 28000 },
          ],
        },
      ],
    },
    {
      id: "client-overview",
      name: "Client Overview",
      description: "Client relationship and account management",
      category: "analytics",
      layout: "grid",
      theme: "light",
      widgets: [
        {
          id: "total-clients",
          type: "metric",
          title: "Total Clients",
          position: { x: 0, y: 0 },
          size: { width: 1, height: 1 },
          config: { metric: "clients", dataSource: "clients" },
          data: [{ value: "142" }],
        },
        {
          id: "client-growth",
          type: "chart",
          title: "Client Growth",
          position: { x: 1, y: 0 },
          size: { width: 2, height: 1 },
          config: { chartType: "area", dataSource: "clients" },
          data: [
            { month: "Jan", clients: 95 },
            { month: "Feb", clients: 108 },
            { month: "Mar", clients: 125 },
            { month: "Apr", clients: 142 },
          ],
        },
        {
          id: "client-satisfaction",
          type: "metric",
          title: "Satisfaction Score",
          position: { x: 0, y: 1 },
          size: { width: 1, height: 1 },
          config: { metric: "satisfaction", dataSource: "clients" },
          data: [{ value: "4.8/5" }],
        },
      ],
    },
  ];

  const createDashboardFromTemplate = (template: DashboardTemplate) => {
    const newDashboard: DashboardTemplate = {
      ...template,
      id: `dashboard-${Date.now()}`,
      name: `${template.name} (Copy)`,
      widgets: template.widgets.map((widget) => ({
        ...widget,
        id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      })),
    };

    const saved = JSON.parse(localStorage.getItem("customDashboards") || "[]");
    saved.push(newDashboard);
    localStorage.setItem("customDashboards", JSON.stringify(saved));
    setSavedDashboards(saved);
    setShowTemplateDialog(false);
  };

  const deleteDashboard = (id: string) => {
    const updated = savedDashboards.filter((d) => d.id !== id);
    localStorage.setItem("customDashboards", JSON.stringify(updated));
    setSavedDashboards(updated);
  };

  const duplicateDashboard = (dashboard: DashboardTemplate) => {
    const copy: DashboardTemplate = {
      ...dashboard,
      id: `dashboard-${Date.now()}`,
      name: `${dashboard.name} (Copy)`,
      widgets: dashboard.widgets.map((widget) => ({
        ...widget,
        id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      })),
    };

    const saved = [...savedDashboards, copy];
    localStorage.setItem("customDashboards", JSON.stringify(saved));
    setSavedDashboards(saved);
  };

  const exportDashboard = (dashboard: DashboardTemplate) => {
    const blob = new Blob([JSON.stringify(dashboard, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${dashboard.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importDashboard = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dashboard: DashboardTemplate = JSON.parse(
          e.target?.result as string,
        );
        dashboard.id = `dashboard-${Date.now()}`;

        const saved = [...savedDashboards, dashboard];
        localStorage.setItem("customDashboards", JSON.stringify(saved));
        setSavedDashboards(saved);
      } catch (error) {
        alert("Invalid dashboard file");
      }
    };
    reader.readAsText(file);
  };

  const renderDashboardPreview = (dashboard: DashboardTemplate) => (
    <div className="grid grid-cols-3 gap-2 h-32">
      {dashboard.widgets.slice(0, 6).map((widget, index) => (
        <div
          key={widget.id}
          className={`bg-gray-100 rounded p-2 ${
            widget.size.width > 1 ? "col-span-2" : ""
          }`}
        >
          <div className="text-xs font-medium mb-1">{widget.title}</div>
          <div className="bg-white rounded h-8 flex items-center justify-center text-xs text-gray-500">
            {widget.type === "chart" && <BarChart3 className="w-3 h-3" />}
            {widget.type === "metric" && <Target className="w-3 h-3" />}
            {widget.type === "table" && <Grid className="w-3 h-3" />}
          </div>
        </div>
      ))}
    </div>
  );

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
                  Custom Dashboard
                </span>
              </h1>
              <p className="text-gray-600 mt-1">
                Build and customize your own analytics dashboards
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default">
                  {savedDashboards.length} Saved Dashboards
                </Badge>
                <Badge variant="outline">
                  {templates.length} Templates Available
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Dialog
                open={showTemplateDialog}
                onOpenChange={setShowTemplateDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size={mobile.isMobile ? "sm" : "default"}
                  >
                    <Layout className="w-4 h-4 mr-2" />
                    Templates
                  </Button>
                </DialogTrigger>
              </Dialog>

              <input
                type="file"
                accept=".json"
                onChange={importDashboard}
                className="hidden"
                id="import-dashboard"
              />
              <Button
                variant="outline"
                size={mobile.isMobile ? "sm" : "default"}
                onClick={() =>
                  document.getElementById("import-dashboard")?.click()
                }
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>

              <Button
                size={mobile.isMobile ? "sm" : "default"}
                onClick={() => {
                  setIsBuilding(true);
                  setActiveTab("builder");
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Dashboard
              </Button>
            </div>
          </motion.div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="gallery">Dashboard Gallery</TabsTrigger>
              <TabsTrigger value="builder">Dashboard Builder</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            {/* Dashboard Gallery */}
            <TabsContent value="gallery" className="space-y-6">
              {savedDashboards.length > 0 ? (
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {savedDashboards.map((dashboard, index) => (
                    <motion.div
                      key={dashboard.id}
                      variants={staggerItem}
                      whileHover={elevateHover.hover}
                    >
                      <Card className="transition-all duration-200">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                {dashboard.name}
                              </CardTitle>
                              <CardDescription>
                                {dashboard.description}
                              </CardDescription>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setSelectedTemplate(dashboard)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => duplicateDashboard(dashboard)}
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => exportDashboard(dashboard)}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Export
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => deleteDashboard(dashboard.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="capitalize">
                              {dashboard.category}
                            </Badge>
                            <Badge variant="secondary">
                              {dashboard.widgets.length} widgets
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {renderDashboardPreview(dashboard)}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <Layout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No dashboards created yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create your first custom dashboard or use a template
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={() => setActiveTab("builder")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowTemplateDialog(true)}
                    >
                      <Layout className="w-4 h-4 mr-2" />
                      Browse Templates
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Dashboard Builder */}
            <TabsContent value="builder" className="space-y-6">
              <DashboardBuilder />
            </TabsContent>

            {/* Templates */}
            <TabsContent value="templates" className="space-y-6">
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {templates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    variants={staggerItem}
                    whileHover={elevateHover.hover}
                  >
                    <Card className="transition-all duration-200">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {template.name}
                            </CardTitle>
                            <CardDescription>
                              {template.description}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {template.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {renderDashboardPreview(template)}

                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            onClick={() =>
                              createDashboardFromTemplate(template)
                            }
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Use Template
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedTemplate(template)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>

          {/* Template Browser Dialog */}
          <Dialog
            open={showTemplateDialog}
            onOpenChange={setShowTemplateDialog}
          >
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Dashboard Templates</DialogTitle>
                <DialogDescription>
                  Choose from pre-built dashboard templates to get started
                  quickly
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {template.name}
                        </CardTitle>
                        <Badge variant="outline" className="capitalize">
                          {template.category}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="h-20">
                        {renderDashboardPreview(template)}
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => createDashboardFromTemplate(template)}
                      >
                        Use This Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Dashboard Preview Dialog */}
          {selectedTemplate && (
            <Dialog
              open={!!selectedTemplate}
              onOpenChange={() => setSelectedTemplate(null)}
            >
              <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{selectedTemplate.name}</DialogTitle>
                  <DialogDescription>
                    {selectedTemplate.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedTemplate.widgets.map((widget) => (
                    <Card
                      key={widget.id}
                      className={widget.size.width > 1 ? "md:col-span-2" : ""}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">
                          {widget.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {widget.type === "metric" && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary mb-1">
                              {widget.data?.[0]?.value || "N/A"}
                            </div>
                            <div className="text-sm text-gray-600">
                              {widget.title}
                            </div>
                          </div>
                        )}
                        {widget.type === "chart" && widget.data && (
                          <EnhancedChart
                            data={widget.data}
                            type={widget.config.chartType || "line"}
                            title=""
                            xKey={Object.keys(widget.data[0] || {})[0] || "x"}
                            yKey={Object.keys(widget.data[0] || {})[1] || "y"}
                            height={150}
                            animated={false}
                          />
                        )}
                        {widget.type === "table" && widget.data && (
                          <div className="space-y-2">
                            {widget.data
                              .slice(0, 3)
                              .map((row: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex justify-between text-sm"
                                >
                                  <span>{Object.values(row)[0] as string}</span>
                                  <span className="font-medium">
                                    {Object.values(row)[1] as string}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() =>
                      createDashboardFromTemplate(selectedTemplate)
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default CustomDashboard;
