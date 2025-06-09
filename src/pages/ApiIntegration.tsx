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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Plus,
  Link,
  Database,
  Globe,
  Code,
  Zap,
  AlertTriangle,
  Copy,
  Download,
  Play,
} from "lucide-react";
import EnhancedChart from "@/components/ui/enhanced-chart";
import { useMobile } from "@/hooks/useMobile";
import MobileNavigation from "@/components/ui/mobile-navigation";
import {
  apiIntegrationManager,
  ApiCredentials,
  CampaignData,
  AudienceData,
  ApiResponse,
} from "@/services/realApiIntegration";
import {
  staggerContainer,
  staggerItem,
  elevateHover,
} from "@/utils/animations";

interface PlatformConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  lastSync?: string;
  campaigns?: number;
  audiences?: number;
  status: "connected" | "disconnected" | "error" | "syncing";
  features: string[];
}

const ApiIntegration: React.FC = () => {
  const mobile = useMobile();
  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0.1,
  });
  const [platforms, setPlatforms] = useState<PlatformConfig[]>([
    {
      id: "facebook",
      name: "Facebook Ads",
      icon: "📘",
      color: "blue",
      connected: false,
      status: "disconnected",
      features: ["Campaigns", "Audiences", "Insights", "Creative", "Pixels"],
    },
    {
      id: "google",
      name: "Google Ads",
      icon: "🔍",
      color: "green",
      connected: false,
      status: "disconnected",
      features: [
        "Search Campaigns",
        "Display",
        "YouTube",
        "Shopping",
        "Analytics",
      ],
    },
    {
      id: "linkedin",
      name: "LinkedIn Ads",
      icon: "💼",
      color: "blue",
      connected: false,
      status: "disconnected",
      features: ["Sponsored Content", "Lead Gen", "Message Ads", "Dynamic Ads"],
    },
    {
      id: "tiktok",
      name: "TikTok Ads",
      icon: "🎵",
      color: "black",
      connected: false,
      status: "disconnected",
      features: ["Video Ads", "Spark Ads", "Collection Ads", "Live Shopping"],
    },
  ]);

  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const [credentials, setCredentials] = useState<Partial<ApiCredentials>>({});
  const [campaignData, setCampaignData] = useState<
    Record<string, CampaignData[]>
  >({});
  const [audienceData, setAudienceData] = useState<
    Record<string, AudienceData[]>
  >({});

  // API Usage data for charts
  const apiUsageData = [
    {
      date: "2024-01-01",
      facebook: 1200,
      google: 800,
      linkedin: 300,
      tiktok: 150,
    },
    {
      date: "2024-01-02",
      facebook: 1100,
      google: 850,
      linkedin: 320,
      tiktok: 180,
    },
    {
      date: "2024-01-03",
      facebook: 1300,
      google: 900,
      linkedin: 280,
      tiktok: 200,
    },
    {
      date: "2024-01-04",
      facebook: 1150,
      google: 750,
      linkedin: 350,
      tiktok: 160,
    },
    {
      date: "2024-01-05",
      facebook: 1250,
      google: 820,
      linkedin: 300,
      tiktok: 190,
    },
  ];

  const syncAllPlatforms = async () => {
    setIsConnecting(true);

    // Update platforms to syncing status
    setPlatforms((prev) =>
      prev.map((p) => (p.connected ? { ...p, status: "syncing" as const } : p)),
    );

    try {
      // Sync campaigns and audiences
      const [campaigns, audiences] = await Promise.all([
        apiIntegrationManager.getAllCampaigns(),
        apiIntegrationManager.getAllAudiences(),
      ]);

      setCampaignData(
        Object.fromEntries(
          Object.entries(campaigns).map(([platform, response]) => [
            platform,
            response.success ? response.data || [] : [],
          ]),
        ),
      );

      setAudienceData(
        Object.fromEntries(
          Object.entries(audiences).map(([platform, response]) => [
            platform,
            response.success ? response.data || [] : [],
          ]),
        ),
      );

      // Update platform stats
      setPlatforms((prev) =>
        prev.map((platform) => {
          const platformCampaigns = campaigns[platform.id];
          const platformAudiences = audiences[platform.id];

          return {
            ...platform,
            status: platform.connected
              ? ("connected" as const)
              : ("disconnected" as const),
            campaigns: platformCampaigns?.success
              ? platformCampaigns.data?.length || 0
              : 0,
            audiences: platformAudiences?.success
              ? platformAudiences.data?.length || 0
              : 0,
            lastSync: platform.connected ? "Just now" : undefined,
          };
        }),
      );
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const connectPlatform = async () => {
    if (!selectedPlatform || !credentials.accessToken) return;

    setIsConnecting(true);

    try {
      // Set credentials in the manager
      apiIntegrationManager.setCredentials(
        selectedPlatform,
        credentials as ApiCredentials,
      );

      // Test connection
      const testResult =
        await apiIntegrationManager.testConnection(selectedPlatform);

      if (testResult.success) {
        setPlatforms((prev) =>
          prev.map((p) =>
            p.id === selectedPlatform
              ? {
                  ...p,
                  connected: true,
                  status: "connected",
                  lastSync: "Just now",
                }
              : p,
          ),
        );
        setShowConnectionDialog(false);
        setCredentials({});

        // Trigger initial sync
        await syncAllPlatforms();
      } else {
        alert(`Connection failed: ${testResult.error}`);
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Connection failed. Please check your credentials.");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectPlatform = (platformId: string) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === platformId
          ? {
              ...p,
              connected: false,
              status: "disconnected",
              lastSync: undefined,
              campaigns: 0,
              audiences: 0,
            }
          : p,
      ),
    );
  };

  const getStatusIcon = (status: PlatformConfig["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "syncing":
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: PlatformConfig["status"]) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800 border-green-200";
      case "syncing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const exportApiReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      platforms: platforms.map((p) => ({
        ...p,
        campaigns: campaignData[p.id]?.length || 0,
        audiences: audienceData[p.id]?.length || 0,
      })),
      campaignData,
      audienceData,
      summary: {
        connectedPlatforms: platforms.filter((p) => p.connected).length,
        totalCampaigns: Object.values(campaignData).flat().length,
        totalAudiences: Object.values(audienceData).flat().length,
        lastSync: new Date().toISOString(),
      },
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `api-integration-report-${Date.now()}.json`;
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
                  API Integration
                </span>
              </h1>
              <p className="text-gray-600 mt-1">
                Connect and manage your marketing platform APIs in real-time
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default">
                  {platforms.filter((p) => p.connected).length} Connected
                </Badge>
                <Badge variant="outline">
                  {Object.values(campaignData).flat().length} Campaigns Synced
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size={mobile.isMobile ? "sm" : "default"}
                onClick={exportApiReport}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button
                size={mobile.isMobile ? "sm" : "default"}
                onClick={syncAllPlatforms}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync All
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Platform Connections */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.id}
                variants={staggerItem}
                whileHover={elevateHover.hover}
              >
                <Card className="transition-all duration-200">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{platform.icon}</span>
                        <div>
                          <h3 className="font-medium text-sm">
                            {platform.name}
                          </h3>
                          <Badge className={getStatusColor(platform.status)}>
                            {getStatusIcon(platform.status)}
                            <span className="ml-1 capitalize">
                              {platform.status}
                            </span>
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {platform.connected ? (
                        <>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium">
                                {platform.campaigns || 0}
                              </p>
                              <p className="text-gray-500">Campaigns</p>
                            </div>
                            <div>
                              <p className="font-medium">
                                {platform.audiences || 0}
                              </p>
                              <p className="text-gray-500">Audiences</p>
                            </div>
                          </div>

                          {platform.lastSync && (
                            <p className="text-xs text-gray-500">
                              Last sync: {platform.lastSync}
                            </p>
                          )}

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => disconnectPlatform(platform.id)}
                            >
                              Disconnect
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">Features:</p>
                            <div className="flex flex-wrap gap-1">
                              {platform.features.slice(0, 3).map((feature) => (
                                <Badge
                                  key={feature}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {feature}
                                </Badge>
                              ))}
                              {platform.features.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{platform.features.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Dialog
                            open={
                              showConnectionDialog &&
                              selectedPlatform === platform.id
                            }
                            onOpenChange={setShowConnectionDialog}
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                className="w-full"
                                onClick={() => setSelectedPlatform(platform.id)}
                              >
                                <Link className="w-4 h-4 mr-2" />
                                Connect
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Connect {platform.name}
                                </DialogTitle>
                                <DialogDescription>
                                  Enter your API credentials to connect{" "}
                                  {platform.name}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="accessToken">
                                    Access Token
                                  </Label>
                                  <Input
                                    id="accessToken"
                                    type="password"
                                    placeholder="Enter your access token"
                                    value={credentials.accessToken || ""}
                                    onChange={(e) =>
                                      setCredentials((prev) => ({
                                        ...prev,
                                        accessToken: e.target.value,
                                      }))
                                    }
                                  />
                                </div>

                                {platform.id === "google" && (
                                  <div>
                                    <Label htmlFor="apiKey">API Key</Label>
                                    <Input
                                      id="apiKey"
                                      type="password"
                                      placeholder="Enter your API key"
                                      value={credentials.apiKey || ""}
                                      onChange={(e) =>
                                        setCredentials((prev) => ({
                                          ...prev,
                                          apiKey: e.target.value,
                                        }))
                                      }
                                    />
                                  </div>
                                )}

                                <div>
                                  <Label htmlFor="accountId">
                                    Account ID (Optional)
                                  </Label>
                                  <Input
                                    id="accountId"
                                    placeholder="Enter your account ID"
                                    value={credentials.accountId || ""}
                                    onChange={(e) =>
                                      setCredentials((prev) => ({
                                        ...prev,
                                        accountId: e.target.value,
                                      }))
                                    }
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    onClick={connectPlatform}
                                    disabled={
                                      isConnecting || !credentials.accessToken
                                    }
                                    className="flex-1"
                                  >
                                    {isConnecting ? (
                                      <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Connecting...
                                      </>
                                    ) : (
                                      "Connect"
                                    )}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      setShowConnectionDialog(false)
                                    }
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="audiences">Audiences</TabsTrigger>
              <TabsTrigger value="usage">API Usage</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Integration Status</CardTitle>
                    <CardDescription>
                      Overview of your connected marketing platforms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Database className="w-16 h-16 text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        {platforms.filter((p) => p.connected).length} of{" "}
                        {platforms.length} Platforms Connected
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Connect more platforms to consolidate your marketing
                        data
                      </p>
                      <div className="flex justify-center gap-4">
                        <Button
                          onClick={syncAllPlatforms}
                          disabled={isConnecting}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Sync All Data
                        </Button>
                        <Button variant="outline">
                          <Settings className="w-4 h-4 mr-2" />
                          Manage Connections
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Campaigns */}
            <TabsContent value="campaigns" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Synced Campaigns</CardTitle>
                    <CardDescription>
                      All campaigns from connected platforms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {Object.entries(campaignData).length > 0 ? (
                      <div className="space-y-6">
                        {Object.entries(campaignData).map(
                          ([platform, campaigns]) => (
                            <div key={platform}>
                              <h4 className="font-medium mb-3 capitalize">
                                {platform} Campaigns
                              </h4>
                              <div className="space-y-3">
                                {campaigns.map((campaign) => (
                                  <div
                                    key={campaign.id}
                                    className="p-4 border rounded-lg"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <h5 className="font-medium">
                                        {campaign.name}
                                      </h5>
                                      <Badge
                                        className={getStatusColor(
                                          campaign.status,
                                        )}
                                      >
                                        {campaign.status}
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                      <div>
                                        <p className="text-gray-600">Budget</p>
                                        <p className="font-medium">
                                          ${campaign.budget.toLocaleString()}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-600">Spend</p>
                                        <p className="font-medium">
                                          ${campaign.spend.toLocaleString()}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-600">
                                          Impressions
                                        </p>
                                        <p className="font-medium">
                                          {campaign.impressions.toLocaleString()}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-600">ROAS</p>
                                        <p className="font-medium">
                                          {campaign.roas.toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No campaigns synced yet</p>
                        <Button className="mt-4" onClick={syncAllPlatforms}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Sync Campaigns
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Audiences */}
            <TabsContent value="audiences" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Synced Audiences</CardTitle>
                    <CardDescription>
                      All audiences from connected platforms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {Object.entries(audienceData).length > 0 ? (
                      <div className="space-y-6">
                        {Object.entries(audienceData).map(
                          ([platform, audiences]) => (
                            <div key={platform}>
                              <h4 className="font-medium mb-3 capitalize">
                                {platform} Audiences
                              </h4>
                              <div className="space-y-3">
                                {audiences.map((audience) => (
                                  <div
                                    key={audience.id}
                                    className="p-4 border rounded-lg"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <h5 className="font-medium">
                                        {audience.name}
                                      </h5>
                                      <Badge
                                        variant="outline"
                                        className="capitalize"
                                      >
                                        {audience.type}
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                      <div>
                                        <p className="text-gray-600">Size</p>
                                        <p className="font-medium">
                                          {audience.size.toLocaleString()}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-600">Status</p>
                                        <p className="font-medium capitalize">
                                          {audience.status}
                                        </p>
                                      </div>
                                      {audience.similarity && (
                                        <div>
                                          <p className="text-gray-600">
                                            Similarity
                                          </p>
                                          <p className="font-medium">
                                            {audience.similarity}%
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                    {audience.description && (
                                      <p className="text-sm text-gray-600 mt-2">
                                        {audience.description}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No audiences synced yet</p>
                        <Button className="mt-4" onClick={syncAllPlatforms}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Sync Audiences
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* API Usage */}
            <TabsContent value="usage" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <EnhancedChart
                  data={apiUsageData}
                  type="line"
                  title="API Usage Trends"
                  subtitle="Daily API calls by platform"
                  xKey="date"
                  yKey={["facebook", "google", "linkedin", "tiktok"]}
                  height={400}
                  interactive={true}
                  animated={true}
                />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </>
  );
};

export default ApiIntegration;
