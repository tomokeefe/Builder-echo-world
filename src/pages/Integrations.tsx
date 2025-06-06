import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Search,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Refresh,
  Trash2,
  Facebook,
  Mail,
  ShoppingCart,
  BarChart,
  Users,
  Globe,
} from "lucide-react";
import { Integration, IntegrationPlatform } from "@/types/integrations";

const Integrations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock integrations data
  const integrations: Integration[] = [
    {
      id: "1",
      name: "Facebook Ads",
      type: "ads",
      platform: "facebook",
      status: "connected",
      credentials: {
        type: "oauth",
        accessToken: "xxx",
        scopes: ["ads_read", "ads_management"],
      },
      configuration: {
        autoSync: true,
        syncFields: ["audiences", "campaigns"],
        mapping: [],
        filters: [],
        webhooks: [],
      },
      lastSync: "2024-01-15T10:30:00Z",
      syncFrequency: "hourly",
      created: "2024-01-01T00:00:00Z",
      permissions: ["read", "write"],
    },
    {
      id: "2",
      name: "Google Ads",
      type: "ads",
      platform: "google_ads",
      status: "connected",
      credentials: { type: "oauth", accessToken: "yyy", scopes: ["adwords"] },
      configuration: {
        autoSync: true,
        syncFields: ["customer_lists"],
        mapping: [],
        filters: [],
        webhooks: [],
      },
      lastSync: "2024-01-15T09:45:00Z",
      syncFrequency: "daily",
      created: "2024-01-05T00:00:00Z",
      permissions: ["read", "write"],
    },
    {
      id: "3",
      name: "HubSpot",
      type: "crm",
      platform: "hubspot",
      status: "error",
      credentials: { type: "api_key", apiKey: "zzz" },
      configuration: {
        autoSync: false,
        syncFields: ["contacts"],
        mapping: [],
        filters: [],
        webhooks: [],
      },
      lastSync: "2024-01-14T08:20:00Z",
      syncFrequency: "daily",
      created: "2024-01-10T00:00:00Z",
      permissions: ["read"],
    },
    {
      id: "4",
      name: "Mailchimp",
      type: "email",
      platform: "mailchimp",
      status: "disconnected",
      credentials: { type: "api_key" },
      configuration: {
        autoSync: false,
        syncFields: [],
        mapping: [],
        filters: [],
        webhooks: [],
      },
      lastSync: "2024-01-12T15:30:00Z",
      syncFrequency: "weekly",
      created: "2024-01-08T00:00:00Z",
      permissions: [],
    },
  ];

  const availableIntegrations = [
    {
      platform: "facebook" as IntegrationPlatform,
      name: "Facebook Ads",
      description: "Sync audiences and campaigns with Facebook Ads Manager",
      category: "ads",
      icon: Facebook,
      color: "bg-blue-500",
      features: [
        "Custom Audiences",
        "Lookalike Audiences",
        "Campaign Management",
        "Real-time Sync",
      ],
    },
    {
      platform: "google_ads" as IntegrationPlatform,
      name: "Google Ads",
      description: "Create customer lists and manage campaigns in Google Ads",
      category: "ads",
      icon: Globe,
      color: "bg-red-500",
      features: [
        "Customer Lists",
        "Similar Audiences",
        "Campaign Optimization",
        "Performance Tracking",
      ],
    },
    {
      platform: "hubspot" as IntegrationPlatform,
      name: "HubSpot",
      description: "Import contacts and sync customer data with HubSpot CRM",
      category: "crm",
      icon: Users,
      color: "bg-orange-500",
      features: [
        "Contact Import",
        "Lead Scoring",
        "Pipeline Management",
        "Custom Properties",
      ],
    },
    {
      platform: "mailchimp" as IntegrationPlatform,
      name: "Mailchimp",
      description: "Sync email lists and create targeted email campaigns",
      category: "email",
      icon: Mail,
      color: "bg-yellow-500",
      features: [
        "List Sync",
        "Segmentation",
        "Campaign Automation",
        "A/B Testing",
      ],
    },
    {
      platform: "shopify" as IntegrationPlatform,
      name: "Shopify",
      description: "Import customer data and order history from Shopify",
      category: "ecommerce",
      icon: ShoppingCart,
      color: "bg-green-500",
      features: [
        "Customer Import",
        "Order History",
        "Product Catalogs",
        "Abandoned Cart Recovery",
      ],
    },
    {
      platform: "google_analytics" as IntegrationPlatform,
      name: "Google Analytics",
      description: "Analyze website behavior and create behavioral audiences",
      category: "analytics",
      icon: BarChart,
      color: "bg-blue-600",
      features: [
        "Behavioral Data",
        "Conversion Tracking",
        "Audience Insights",
        "Custom Dimensions",
      ],
    },
  ];

  const getStatusColor = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800";
      case "disconnected":
        return "bg-gray-100 text-gray-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch = integration.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || integration.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredAvailable = availableIntegrations.filter((integration) => {
    const isConnected = integrations.some(
      (conn) => conn.platform === integration.platform,
    );
    const matchesSearch = integration.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || integration.category === selectedCategory;
    return !isConnected && matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
            <p className="text-gray-600 mt-1">
              Connect your favorite tools to sync data and automate workflows
            </p>
          </div>

          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Browse Integrations
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="ads">Advertising</TabsTrigger>
            <TabsTrigger value="crm">CRM</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-6">
            {/* Connected Integrations */}
            {filteredIntegrations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Connected Integrations</CardTitle>
                  <CardDescription>
                    Manage your active integrations and sync settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredIntegrations.map((integration) => (
                      <Card key={integration.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold">
                                  {integration.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {integration.type.charAt(0).toUpperCase() +
                                    integration.type.slice(1)}
                                </p>
                              </div>
                            </div>
                            {getStatusIcon(integration.status)}
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                Status
                              </span>
                              <Badge
                                className={getStatusColor(integration.status)}
                              >
                                {integration.status.charAt(0).toUpperCase() +
                                  integration.status.slice(1)}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                Auto Sync
                              </span>
                              <Switch
                                checked={integration.configuration.autoSync}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                Frequency
                              </span>
                              <span className="text-sm font-medium">
                                {integration.syncFrequency
                                  .charAt(0)
                                  .toUpperCase() +
                                  integration.syncFrequency.slice(1)}
                              </span>
                            </div>

                            <div>
                              <span className="text-sm text-gray-600">
                                Last Sync
                              </span>
                              <p className="text-sm font-medium">
                                {new Date(
                                  integration.lastSync,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {integration.status === "error" && (
                            <Alert className="mt-4">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription className="text-sm">
                                Connection failed. Please reconnect this
                                integration.
                              </AlertDescription>
                            </Alert>
                          )}

                          <div className="flex items-center gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </Button>
                            <Button variant="outline" size="sm">
                              <Refresh className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Available Integrations */}
            <Card>
              <CardHeader>
                <CardTitle>Available Integrations</CardTitle>
                <CardDescription>
                  Connect new platforms to expand your marketing capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAvailable.map((integration) => (
                    <Card
                      key={integration.platform}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <div
                            className={`w-12 h-12 ${integration.color} rounded-lg flex items-center justify-center`}
                          >
                            <integration.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {integration.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {integration.description}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              Key Features
                            </h4>
                            <div className="space-y-1">
                              {integration.features
                                .slice(0, 3)
                                .map((feature, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span className="text-sm text-gray-600">
                                      {feature}
                                    </span>
                                  </div>
                                ))}
                              {integration.features.length > 3 && (
                                <div className="text-sm text-gray-500">
                                  +{integration.features.length - 3} more
                                  features
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-6">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="flex-1">
                                <Plus className="w-4 h-4 mr-2" />
                                Connect
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Connect {integration.name}
                                </DialogTitle>
                                <DialogDescription>
                                  Set up your {integration.name} integration to
                                  start syncing data.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Alert>
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription>
                                    You'll be redirected to {integration.name}{" "}
                                    to authorize the connection. Make sure you
                                    have admin access to your {integration.name}{" "}
                                    account.
                                  </AlertDescription>
                                </Alert>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline">Cancel</Button>
                                  <Button>
                                    Continue to {integration.name}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="icon">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredAvailable.length === 0 && (
                  <div className="text-center py-12">
                    <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      All integrations connected
                    </h3>
                    <p className="text-gray-500">
                      You've connected all available integrations in this
                      category.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Integrations;
