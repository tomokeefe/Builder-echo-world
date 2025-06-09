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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Zap,
  Play,
  Pause,
  Plus,
  Settings,
  Trash2,
  Edit,
  Copy,
  MoreVertical,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Eye,
  Filter,
} from "lucide-react";
import EnhancedChart from "@/components/ui/enhanced-chart";
import { useMobile } from "@/hooks/useMobile";
import MobileNavigation from "@/components/ui/mobile-navigation";
import {
  automationEngine,
  AutomationRule,
  AutomationExecution,
  automationTemplates,
  AutomationTemplate,
  AutomationTrigger,
  AutomationAction,
} from "@/services/automationEngine";
import {
  staggerContainer,
  staggerItem,
  elevateHover,
} from "@/utils/animations";

const Automation: React.FC = () => {
  const mobile = useMobile();
  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0.1,
  });
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [executions, setExecutions] = useState<AutomationExecution[]>([]);
  const [statistics, setStatistics] = useState<any>({});
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isCreatingRule, setIsCreatingRule] = useState(false);

  // Rule builder state
  const [ruleData, setRuleData] = useState<Partial<AutomationRule>>({
    name: "",
    description: "",
    category: "performance",
    triggers: [],
    actions: [],
    status: "draft",
    priority: "medium",
    cooldownPeriod: 60,
    conditions: "all",
  });

  // Performance data for charts
  const performanceData = [
    {
      date: "2024-01-01",
      rules_triggered: 12,
      actions_executed: 34,
      success_rate: 91,
    },
    {
      date: "2024-01-02",
      rules_triggered: 18,
      actions_executed: 47,
      success_rate: 94,
    },
    {
      date: "2024-01-03",
      rules_triggered: 15,
      actions_executed: 41,
      success_rate: 89,
    },
    {
      date: "2024-01-04",
      rules_triggered: 22,
      actions_executed: 58,
      success_rate: 96,
    },
    {
      date: "2024-01-05",
      rules_triggered: 19,
      actions_executed: 52,
      success_rate: 92,
    },
  ];

  useEffect(() => {
    loadData();

    // Set up periodic refresh
    const interval = setInterval(loadData, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setRules(automationEngine.getRules());
    setExecutions(automationEngine.getExecutions());
    setStatistics(automationEngine.getStatistics());
  };

  const handleRuleStatusToggle = (ruleId: string, enabled: boolean) => {
    if (enabled) {
      automationEngine.activateRule(ruleId);
    } else {
      automationEngine.pauseRule(ruleId);
    }
    loadData();
  };

  const handleDeleteRule = (ruleId: string) => {
    automationEngine.deleteRule(ruleId);
    loadData();
  };

  const handleDuplicateRule = (rule: AutomationRule) => {
    const duplicatedRule = {
      ...rule,
      name: `${rule.name} (Copy)`,
      status: "draft" as const,
    };
    delete (duplicatedRule as any).id;
    delete (duplicatedRule as any).created;
    delete (duplicatedRule as any).executionCount;
    delete (duplicatedRule as any).lastTriggered;

    automationEngine.addRule(duplicatedRule);
    loadData();
  };

  const createRuleFromTemplate = (template: AutomationTemplate) => {
    template.rules.forEach((ruleTemplate) => {
      automationEngine.addRule(ruleTemplate);
    });
    loadData();
    setShowTemplates(false);
  };

  const getStatusIcon = (status: AutomationRule["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "paused":
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case "draft":
        return <Edit className="w-4 h-4 text-gray-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: AutomationRule["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const getPriorityColor = (priority: AutomationRule["priority"]) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getExecutionStatusIcon = (status: AutomationExecution["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "running":
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const exportAutomationReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      rules,
      executions,
      statistics,
      summary: {
        totalRules: rules.length,
        activeRules: rules.filter((r) => r.status === "active").length,
        totalExecutions: executions.length,
        successRate:
          executions.length > 0
            ? (executions.filter((e) => e.status === "completed").length /
                executions.length) *
              100
            : 0,
      },
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `automation-report-${Date.now()}.json`;
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
                  Marketing Automation
                </span>
              </h1>
              <p className="text-gray-600 mt-1">
                Automate your marketing workflows and optimize campaign
                performance
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default">
                  {statistics.activeRules || 0} Active Rules
                </Badge>
                <Badge variant="outline">
                  {statistics.totalExecutions || 0} Executions Today
                </Badge>
                <Badge
                  variant={
                    statistics.successfulExecutions >
                    statistics.failedExecutions
                      ? "default"
                      : "destructive"
                  }
                >
                  {statistics.totalExecutions > 0
                    ? Math.round(
                        (statistics.successfulExecutions /
                          statistics.totalExecutions) *
                          100,
                      )
                    : 0}
                  % Success Rate
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size={mobile.isMobile ? "sm" : "default"}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Templates
                  </Button>
                </DialogTrigger>
              </Dialog>

              <Button
                variant="outline"
                size={mobile.isMobile ? "sm" : "default"}
                onClick={exportAutomationReport}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>

              <Dialog open={showRuleBuilder} onOpenChange={setShowRuleBuilder}>
                <DialogTrigger asChild>
                  <Button size={mobile.isMobile ? "sm" : "default"}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Rule
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            <motion.div variants={staggerItem} whileHover={elevateHover.hover}>
              <Card className="transition-all duration-200">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Rules
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {statistics.totalRules || 0}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {statistics.activeRules || 0} active
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem} whileHover={elevateHover.hover}>
              <Card className="transition-all duration-200">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Executions
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {statistics.totalExecutions || 0}
                      </p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                        <span className="text-xs text-green-600">
                          +24% this week
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem} whileHover={elevateHover.hover}>
              <Card className="transition-all duration-200">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Success Rate
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {statistics.totalExecutions > 0
                          ? Math.round(
                              (statistics.successfulExecutions /
                                statistics.totalExecutions) *
                                100,
                            )
                          : 0}
                        %
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {statistics.successfulExecutions || 0} successful
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem} whileHover={elevateHover.hover}>
              <Card className="transition-all duration-200">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Avg per Rule
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {statistics.averageExecutionsPerRule?.toFixed(1) ||
                          "0.0"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">executions</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <Tabs defaultValue="rules" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="rules">Automation Rules</TabsTrigger>
              <TabsTrigger value="executions">Execution History</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            {/* Automation Rules */}
            <TabsContent value="rules" className="space-y-6">
              {rules.length > 0 ? (
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="space-y-4"
                >
                  {rules.map((rule, index) => (
                    <motion.div
                      key={rule.id}
                      variants={staggerItem}
                      whileHover={elevateHover.hover}
                    >
                      <Card className="transition-all duration-200">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Switch
                                checked={rule.status === "active"}
                                onCheckedChange={(checked) =>
                                  handleRuleStatusToggle(rule.id, checked)
                                }
                              />
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold">{rule.name}</h3>
                                  <Badge
                                    className={getStatusColor(rule.status)}
                                  >
                                    {getStatusIcon(rule.status)}
                                    <span className="ml-1 capitalize">
                                      {rule.status}
                                    </span>
                                  </Badge>
                                  <Badge
                                    className={getPriorityColor(rule.priority)}
                                  >
                                    {rule.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {rule.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                  <span>Category: {rule.category}</span>
                                  <span>Executions: {rule.executionCount}</span>
                                  {rule.lastTriggered && (
                                    <span>
                                      Last triggered:{" "}
                                      {new Date(
                                        rule.lastTriggered,
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => setSelectedRule(rule)}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDuplicateRule(rule)}
                                  >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteRule(rule.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium mb-2">
                                Triggers ({rule.triggers.length})
                              </p>
                              <div className="space-y-1">
                                {rule.triggers
                                  .slice(0, 2)
                                  .map((trigger, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-2"
                                    >
                                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                      <span className="text-gray-600">
                                        {trigger.name}
                                      </span>
                                    </div>
                                  ))}
                                {rule.triggers.length > 2 && (
                                  <p className="text-gray-500">
                                    +{rule.triggers.length - 2} more
                                  </p>
                                )}
                              </div>
                            </div>

                            <div>
                              <p className="font-medium mb-2">
                                Actions ({rule.actions.length})
                              </p>
                              <div className="space-y-1">
                                {rule.actions.slice(0, 2).map((action, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2"
                                  >
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    <span className="text-gray-600">
                                      {action.name}
                                    </span>
                                  </div>
                                ))}
                                {rule.actions.length > 2 && (
                                  <p className="text-gray-500">
                                    +{rule.actions.length - 2} more
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No automation rules created yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create your first automation rule to start optimizing your
                    campaigns
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={() => setShowRuleBuilder(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Rule
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowTemplates(true)}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Browse Templates
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Execution History */}
            <TabsContent value="executions" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Executions</CardTitle>
                    <CardDescription>
                      Latest automation rule executions and their results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {executions.length > 0 ? (
                      <div className="space-y-4">
                        {executions.slice(0, 10).map((execution) => (
                          <div
                            key={execution.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex items-center gap-4">
                              {getExecutionStatusIcon(execution.status)}
                              <div>
                                <h4 className="font-medium">
                                  {rules.find((r) => r.id === execution.ruleId)
                                    ?.name || "Unknown Rule"}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Triggered by: {execution.triggeredBy}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(
                                    execution.triggeredAt,
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <Badge
                                className={
                                  execution.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : execution.status === "failed"
                                      ? "bg-red-100 text-red-800"
                                      : execution.status === "running"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                }
                              >
                                {execution.status}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">
                                {execution.actions.length} actions
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No executions yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Performance */}
            <TabsContent value="performance" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <EnhancedChart
                  data={performanceData}
                  type="line"
                  title="Automation Performance Trends"
                  subtitle="Rules triggered and actions executed over time"
                  xKey="date"
                  yKey={["rules_triggered", "actions_executed", "success_rate"]}
                  height={400}
                  interactive={true}
                  animated={true}
                />
              </motion.div>
            </TabsContent>

            {/* Templates */}
            <TabsContent value="templates" className="space-y-6">
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {automationTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    variants={staggerItem}
                    whileHover={elevateHover.hover}
                  >
                    <Card className="transition-all duration-200">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {template.name}
                          </CardTitle>
                          <Badge variant="outline">
                            {template.popularity}% popular
                          </Badge>
                        </div>
                        <CardDescription>
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Rules:</span>
                          <span className="font-medium">
                            {template.rules.length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Effectiveness:</span>
                          <span className="font-medium">
                            {template.effectiveness}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Category:</span>
                          <Badge variant="outline" className="capitalize">
                            {template.category}
                          </Badge>
                        </div>

                        <Button
                          className="w-full"
                          onClick={() => createRuleFromTemplate(template)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>

          {/* Rule Builder Dialog */}
          <Dialog open={showRuleBuilder} onOpenChange={setShowRuleBuilder}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Automation Rule</DialogTitle>
                <DialogDescription>
                  Build a custom automation rule to optimize your campaigns
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ruleName">Rule Name</Label>
                    <Input
                      id="ruleName"
                      placeholder="Enter rule name"
                      value={ruleData.name}
                      onChange={(e) =>
                        setRuleData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="ruleCategory">Category</Label>
                    <Select
                      value={ruleData.category}
                      onValueChange={(value) =>
                        setRuleData((prev) => ({
                          ...prev,
                          category: value as any,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="budget">Budget</SelectItem>
                        <SelectItem value="scheduling">Scheduling</SelectItem>
                        <SelectItem value="optimization">
                          Optimization
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="ruleDescription">Description</Label>
                  <Textarea
                    id="ruleDescription"
                    placeholder="Describe what this rule does"
                    value={ruleData.description}
                    onChange={(e) =>
                      setRuleData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Advanced Rule Builder
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop triggers and actions to build your automation
                    rule
                  </p>
                  <Button disabled>
                    <Settings className="w-4 h-4 mr-2" />
                    Coming Soon
                  </Button>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowRuleBuilder(false)}
                  >
                    Cancel
                  </Button>
                  <Button disabled>Create Rule</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Templates Dialog */}
          <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Automation Templates</DialogTitle>
                <DialogDescription>
                  Choose from pre-built automation templates to get started
                  quickly
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {automationTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {template.name}
                        </CardTitle>
                        <Badge variant="outline">
                          {template.effectiveness}% effective
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rules:</span>
                          <span className="font-medium">
                            {template.rules.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium capitalize">
                            {template.category}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Popularity:</span>
                          <span className="font-medium">
                            {template.popularity}%
                          </span>
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => createRuleFromTemplate(template)}
                      >
                        Use This Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Rule Details Dialog */}
          {selectedRule && (
            <Dialog
              open={!!selectedRule}
              onOpenChange={() => setSelectedRule(null)}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{selectedRule.name}</DialogTitle>
                  <DialogDescription>
                    {selectedRule.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Status:</span>
                      <Badge className={getStatusColor(selectedRule.status)}>
                        {selectedRule.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Priority:</span>
                      <Badge
                        className={getPriorityColor(selectedRule.priority)}
                      >
                        {selectedRule.priority}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Executions:</span>
                      <span className="ml-2">
                        {selectedRule.executionCount}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Cooldown:</span>
                      <span className="ml-2">
                        {selectedRule.cooldownPeriod}min
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Triggers</h4>
                    <div className="space-y-2">
                      {selectedRule.triggers.map((trigger, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-sm">
                            {trigger.name}
                          </h5>
                          <p className="text-xs text-gray-600">
                            {trigger.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Actions</h4>
                    <div className="space-y-2">
                      {selectedRule.actions.map((action, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-sm">{action.name}</h5>
                          <p className="text-xs text-gray-600">
                            {action.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedRule(null)}
                  >
                    Close
                  </Button>
                  <Button onClick={() => handleDuplicateRule(selectedRule)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate Rule
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

export default Automation;
