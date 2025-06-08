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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Zap,
  Plug,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Download,
  Upload,
  RefreshCw,
  Settings,
  MoreVertical,
  Play,
  Pause,
  Database,
  Globe,
  Shield,
  Activity,
  Users,
  BarChart3,
  Smartphone,
  Mail,
  Share2,
  Layers,
} from "lucide-react";
import {
  platformIntegrations,
  SyncOperation,
  PlatformAPI,
} from "@/services/platformIntegrations";
import { useToast } from "@/hooks/use-toast";

interface ConnectedIntegration {
  id: string;
  platform: PlatformAPI;
  status: "connected" | "disconnected" | "error" | "syncing";
  lastSync?: string;
  accountName?: string;
  accountId?: string;
  syncedAudiences: number;
  syncedCampaigns: number;
  dataPoints: number;
  autoSync: boolean;
  syncFrequency: "real-time" | "hourly" | "daily" | "weekly";
}

const EnhancedIntegrations: React.FC = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<ConnectedIntegration[]>([]);
  const [activeOperations, setActiveOperations] = useState<SyncOperation[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(
    null,
  );
  const [connectDialog, setConnectDialog] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Record<string, any>>({});
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    loadIntegrations();
    loadActiveOperations();

    // Poll for operation updates
    const interval = setInterval(() => {
      loadActiveOperations();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const loadIntegrations = () => {
    const platforms = platformIntegrations.getSupportedPlatforms();
    const mockIntegrations: ConnectedIntegration[] = platforms.map(
      (platform, index) => ({
        id: platform.id,
        platform,
        status: index < 2 ? "connected" : "disconnected",
        lastSync:
          index < 2
            ? new Date(
                Date.now() - Math.random() * 60 * 60 * 1000,
              ).toISOString()
            : undefined,
        accountName: index < 2 ? `Demo Account - ${platform.name}` : undefined,
        accountId: index < 2 ? `account_${platform.id}_123` : undefined,
        syncedAudiences: index < 2 ? Math.floor(Math.random() * 50) + 10 : 0,
        syncedCampaigns: index < 2 ? Math.floor(Math.random() * 20) + 5 : 0,
        dataPoints:
          index < 2 ? Math.floor(Math.random() * 1000000) + 100000 : 0,
        autoSync: index < 2,
        syncFrequency: "daily",
      }),
    );

    setIntegrations(mockIntegrations);
  };

  const loadActiveOperations = () => {
    const operations = platformIntegrations.getActiveOperations();
    setActiveOperations(operations);
  };

  const handleConnect = async (platformId: string) => {
    setIsConnecting(true);
    try {
      const result = await platformIntegrations.authenticateConnection(
        platformId,
        credentials,
      );

      if (result.success) {
        // Update integration status
        setIntegrations((prev) =>
          prev.map((integration) =>
            integration.id === platformId
              ? {
                  ...integration,
                  status: "connected",
                  accountName: `Demo Account - ${integration.platform.name}`,
                  accountId: `account_${platformId}_123`,
                  lastSync: new Date().toISOString(),
                }
              : integration,
          ),
        );

        toast({
          title: "Integration Connected",
          description: `Successfully connected to ${platformId}`,
        });
        setConnectDialog(null);
      } else {
        toast({
          title: "Connection Failed",
          description: result.error || "Failed to connect to platform",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSync = async (
    platformId: string,
    direction: "import" | "export",
  ) => {
    try {
      const operation = await platformIntegrations.syncAudiences(
        platformId,
        direction,
      );

      setActiveOperations((prev) => [...prev, operation]);

      toast({
        title: "Sync Started",
        description: `${direction === "import" ? "Importing from" : "Exporting to"} ${platformId}`,
      });
    } catch (error) {
      toast({
        title: "Sync Error",
        description: "Failed to start sync operation",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = (platformId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === platformId
          ? {
              ...integration,
              status: "disconnected",
              accountName: undefined,
              accountId: undefined,
            }
          : integration,
      ),
    );

    toast({
      title: "Integration Disconnected",
      description: `Disconnected from ${platformId}`,
    });
  };

  const handleToggleAutoSync = (platformId: string, enabled: boolean) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === platformId
          ? { ...integration, autoSync: enabled }
          : integration,
      ),
    );
  };

  const getStatusIcon = (status: ConnectedIntegration["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "disconnected":
        return <XCircle className="w-4 h-4 text-gray-400" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "syncing":
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ConnectedIntegration["status"]) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800 border-green-200";
      case "disconnected":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "syncing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPlatformIcon = (platformId: string) => {
    switch (platformId) {
      case "facebook":
        return <Share2 className="w-5 h-5 text-blue-600" />;
      case "google":
        return <Globe className="w-5 h-5 text-red-500" />;
      case "linkedin":
        return <Users className="w-5 h-5 text-blue-700" />;
      case "tiktok":
        return <Smartphone className="w-5 h-5 text-black" />;
      default:
        return <Plug className="w-5 h-5 text-gray-500" />;
    }
  };

  const connectedIntegrations = integrations.filter(
    (i) => i.status === "connected",
  );
  const availableIntegrations = integrations.filter(
    (i) => i.status === "disconnected",
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Zap className="w-8 h-8 text-blue-500" />
              Enhanced Integrations
            </h1>
            <p className="text-gray-600 mt-1">
              Advanced platform connections with real-time sync and data
              management
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {connectedIntegrations.length} Connected
            </Badge>
            <Button onClick={loadActiveOperations}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        </div>

        <Tabs defaultValue="connected" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="connected">
              Connected ({connectedIntegrations.length})
            </TabsTrigger>
            <TabsTrigger value="available">
              Available ({availableIntegrations.length})
            </TabsTrigger>
            <TabsTrigger value="sync">Sync Operations</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>

          {/* Connected Integrations */}
          <TabsContent value="connected" className="space-y-6">
            {connectedIntegrations.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Plug className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Connected Integrations
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Connect to advertising platforms to sync your audiences and
                    campaigns
                  </p>
                  <Button onClick={() => setConnectDialog("facebook")}>
                    <Plug className="w-4 h-4 mr-2" />
                    Connect Your First Platform
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {connectedIntegrations.map((integration) => (
                  <motion.div
                    key={integration.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getPlatformIcon(integration.id)}
                            <div>
                              <CardTitle className="text-lg">
                                {integration.platform.name}
                              </CardTitle>
                              <CardDescription>
                                {integration.accountName}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={getStatusColor(integration.status)}
                            >
                              {getStatusIcon(integration.status)}
                              <span className="ml-1">{integration.status}</span>
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleSync(integration.id, "import")
                                  }
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Import Data
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleSync(integration.id, "export")
                                  }
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  Export Data
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setSelectedIntegration(integration.id)
                                  }
                                >
                                  <Settings className="w-4 h-4 mr-2" />
                                  Configure
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDisconnect(integration.id)
                                  }
                                  className="text-red-600"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Disconnect
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <p className="font-semibold text-blue-600">
                              {integration.syncedAudiences}
                            </p>
                            <p className="text-gray-600">Audiences</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-green-600">
                              {integration.syncedCampaigns}
                            </p>
                            <p className="text-gray-600">Campaigns</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-purple-600">
                              {(integration.dataPoints / 1000).toFixed(0)}K
                            </p>
                            <p className="text-gray-600">Data Points</p>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Auto Sync</Label>
                            <Switch
                              checked={integration.autoSync}
                              onCheckedChange={(checked) =>
                                handleToggleAutoSync(integration.id, checked)
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Sync Frequency</Label>
                            <Select
                              value={integration.syncFrequency}
                              onValueChange={(value) => {
                                setIntegrations((prev) =>
                                  prev.map((int) =>
                                    int.id === integration.id
                                      ? { ...int, syncFrequency: value as any }
                                      : int,
                                  ),
                                );
                              }}
                            >
                              <SelectTrigger className="w-24 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="real-time">
                                  Real-time
                                </SelectItem>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {integration.lastSync && (
                            <div className="text-xs text-gray-500">
                              Last synced:{" "}
                              {new Date(integration.lastSync).toLocaleString()}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleSync(integration.id, "import")}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Import
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleSync(integration.id, "export")}
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            Export
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Available Integrations */}
          <TabsContent value="available" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableIntegrations.map((integration) => (
                <Card
                  key={integration.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {getPlatformIcon(integration.id)}
                      <div>
                        <CardTitle className="text-lg">
                          {integration.platform.name}
                        </CardTitle>
                        <CardDescription>
                          Connect to sync audiences and campaigns
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">
                        Capabilities
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {integration.platform.capabilities
                          .slice(0, 4)
                          .map((capability) => (
                            <Badge
                              key={capability}
                              variant="outline"
                              className="text-xs"
                            >
                              {capability.replace(/_/g, " ")}
                            </Badge>
                          ))}
                        {integration.platform.capabilities.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{integration.platform.capabilities.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">
                        Features
                      </h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          Real-time data sync
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          Bulk operations
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          Advanced analytics
                        </li>
                      </ul>
                    </div>

                    <Dialog
                      open={connectDialog === integration.id}
                      onOpenChange={(open) => !open && setConnectDialog(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          className="w-full"
                          onClick={() => setConnectDialog(integration.id)}
                        >
                          <Plug className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Connect to {integration.platform.name}
                          </DialogTitle>
                          <DialogDescription>
                            Enter your credentials to connect your{" "}
                            {integration.platform.name} account
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="client_id">Client ID</Label>
                            <Input
                              id="client_id"
                              placeholder="Enter your client ID"
                              value={credentials.client_id || ""}
                              onChange={(e) =>
                                setCredentials((prev) => ({
                                  ...prev,
                                  client_id: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="client_secret">Client Secret</Label>
                            <Input
                              id="client_secret"
                              type="password"
                              placeholder="Enter your client secret"
                              value={credentials.client_secret || ""}
                              onChange={(e) =>
                                setCredentials((prev) => ({
                                  ...prev,
                                  client_secret: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setConnectDialog(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => handleConnect(integration.id)}
                              disabled={isConnecting}
                            >
                              {isConnecting ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Plug className="w-4 h-4 mr-2" />
                              )}
                              Connect
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sync Operations */}
          <TabsContent value="sync" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Active Sync Operations
                </CardTitle>
                <CardDescription>
                  Monitor real-time data synchronization across platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeOperations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No active sync operations</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {activeOperations.map((operation) => (
                        <motion.div
                          key={operation.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium">
                                {operation.type} - {operation.integrationId}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Started:{" "}
                                {new Date(
                                  operation.startTime,
                                ).toLocaleTimeString()}
                              </p>
                            </div>
                            <Badge
                              className={getStatusColor(
                                operation.status as any,
                              )}
                            >
                              {operation.status}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progress</span>
                              <span>{operation.progress.toFixed(1)}%</span>
                            </div>
                            <Progress
                              value={operation.progress}
                              className="h-2"
                            />
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>
                                {operation.processedRecords} /{" "}
                                {operation.totalRecords} records
                              </span>
                              {operation.errors.length > 0 && (
                                <span className="text-red-600">
                                  {operation.errors.length} errors
                                </span>
                              )}
                            </div>
                          </div>

                          {operation.summary && (
                            <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Created:</span>
                                <span className="ml-1 font-medium">
                                  {operation.summary.audiencesCreated}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Updated:</span>
                                <span className="ml-1 font-medium">
                                  {operation.summary.audiencesUpdated}
                                </span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Data Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Overall Score</span>
                      <Badge variant="outline">87%</Badge>
                    </div>
                    <Progress value={87} className="h-2" />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Completeness: 89%</div>
                      <div>Accuracy: 92%</div>
                      <div>Consistency: 85%</div>
                      <div>Timeliness: 81%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">GDPR</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">CCPA</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data Retention</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    Data Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Platforms</span>
                      <span className="text-sm font-medium">
                        {connectedIntegrations.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Records</span>
                      <span className="text-sm font-medium">2.4M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Updated</span>
                      <span className="text-sm font-medium">2 min ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedIntegrations;
