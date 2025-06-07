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
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { CampaignWizard } from "@/components/CampaignWizard/CampaignWizard";
import {
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  BarChart3,
  Target,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Settings,
  Eye,
  Wand2,
} from "lucide-react";
import { Campaign, CampaignPerformance } from "@/types/campaign";

const Campaigns = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showCampaignWizard, setShowCampaignWizard] = useState(false);

  // Mock campaign data
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Holiday Sale 2024",
      description:
        "Black Friday and Cyber Monday campaign targeting high-value customers",
      status: "active",
      type: "conversion",
      audiences: ["1", "2"],
      channels: [],
      budget: {
        total: 50000,
        daily: 2500,
        spent: 18750,
        remaining: 31250,
        currency: "USD",
        optimizationGoal: "conversions",
      },
      schedule: {
        startDate: "2024-11-20",
        endDate: "2024-12-05",
        timezone: "UTC",
        frequency: { impressions: 3, period: "day" },
      },
      creative: [],
      targeting: {
        locations: ["US", "CA"],
        languages: ["en"],
        devices: ["desktop", "mobile"],
        operatingSystems: [],
        browsers: [],
        interests: ["shopping", "technology"],
        behaviors: ["frequent buyer"],
        demographics: {
          ageMin: 25,
          ageMax: 55,
          genders: ["all"],
          incomes: ["75k+"],
        },
        exclusions: { audiences: [], interests: [], behaviors: [] },
      },
      objectives: [
        {
          type: "sales",
          target: 1000,
          current: 342,
          unit: "conversions",
        },
      ],
      performance: {
        impressions: 2450000,
        reach: 1890000,
        clicks: 78500,
        conversions: 1850,
        spend: 18750,
        revenue: 85000,
        roas: 4.53,
        ctr: 3.2,
        cpm: 7.65,
        cpc: 0.24,
        cpa: 10.14,
        conversionRate: 2.36,
        frequency: 1.3,
        qualityScore: 8.2,
      },
      created: "2024-11-15",
      updated: "2024-11-22",
      createdBy: "user1",
    },
    {
      id: "2",
      name: "Brand Awareness Campaign",
      description: "Increase brand recognition among mobile users",
      status: "paused",
      type: "awareness",
      audiences: ["2", "3"],
      channels: [],
      budget: {
        total: 25000,
        daily: 1000,
        spent: 12400,
        remaining: 12600,
        currency: "USD",
        optimizationGoal: "impressions",
      },
      schedule: {
        startDate: "2024-11-01",
        endDate: "2024-11-30",
        timezone: "UTC",
        frequency: { impressions: 2, period: "day" },
      },
      creative: [],
      targeting: {
        locations: ["US"],
        languages: ["en"],
        devices: ["mobile"],
        operatingSystems: ["iOS", "Android"],
        browsers: [],
        interests: ["technology", "mobile apps"],
        behaviors: ["mobile user"],
        demographics: {
          ageMin: 18,
          ageMax: 45,
          genders: ["all"],
          incomes: [],
        },
        exclusions: { audiences: [], interests: [], behaviors: [] },
      },
      objectives: [
        {
          type: "awareness",
          target: 5000000,
          current: 3200000,
          unit: "impressions",
        },
      ],
      performance: {
        impressions: 3200000,
        reach: 2100000,
        clicks: 45000,
        conversions: 890,
        spend: 12400,
        revenue: 15600,
        roas: 1.26,
        ctr: 1.4,
        cpm: 3.88,
        cpc: 0.28,
        cpa: 13.93,
        conversionRate: 1.98,
        frequency: 1.5,
        qualityScore: 7.8,
      },
      created: "2024-10-25",
      updated: "2024-11-15",
      createdBy: "user2",
    },
  ]);

  const handleCreateCampaign = (
    campaignData: Omit<Campaign, "id" | "created" | "updated" | "createdBy">,
  ) => {
    console.log("Creating campaign with data:", campaignData);

    const newCampaign: Campaign = {
      ...campaignData,
      id: Date.now().toString(),
      created: new Date().toISOString().split("T")[0],
      updated: new Date().toISOString().split("T")[0],
      createdBy: "current-user",
    };

    setCampaigns((prev) => [newCampaign, ...prev]);

    toast({
      title: "Campaign Created Successfully! 🎉",
      description: `${newCampaign.name} has been created and is ready to launch.`,
    });

    console.log("Campaign created successfully:", newCampaign);
  };

  const createTestCampaign = () => {
    const testCampaign: Omit<
      Campaign,
      "id" | "created" | "updated" | "createdBy"
    > = {
      name: "Test Campaign " + Date.now(),
      description: "Test campaign created from quick action",
      status: "draft",
      type: "awareness",
      audiences: [],
      channels: [],
      budget: {
        total: 5000,
        daily: 250,
        spent: 0,
        remaining: 5000,
        currency: "USD",
        optimizationGoal: "impressions",
      },
      schedule: {
        startDate: new Date().toISOString().split("T")[0],
        timezone: "UTC",
        frequency: { impressions: 3, period: "day" },
      },
      creative: [],
      targeting: {
        locations: ["US"],
        languages: ["en"],
        devices: ["desktop", "mobile"],
        operatingSystems: [],
        browsers: [],
        interests: [],
        behaviors: [],
        demographics: {
          ageMin: 18,
          ageMax: 65,
          genders: ["all"],
          incomes: [],
        },
        exclusions: { audiences: [], interests: [], behaviors: [] },
      },
      objectives: [
        {
          type: "awareness",
          target: 100000,
          current: 0,
          unit: "impressions",
        },
      ],
      performance: {
        impressions: 0,
        reach: 0,
        clicks: 0,
        conversions: 0,
        spend: 0,
        revenue: 0,
        roas: 0,
        ctr: 0,
        cpm: 0,
        cpc: 0,
        cpa: 0,
        conversionRate: 0,
        frequency: 0,
        qualityScore: 0,
      },
    };

    handleCreateCampaign(testCampaign);
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    const matchesType = typeFilter === "all" || campaign.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTotalMetrics = () => {
    return filteredCampaigns.reduce(
      (acc, campaign) => ({
        totalSpend: acc.totalSpend + campaign.performance.spend,
        totalRevenue: acc.totalRevenue + campaign.performance.revenue,
        totalImpressions:
          acc.totalImpressions + campaign.performance.impressions,
        totalConversions:
          acc.totalConversions + campaign.performance.conversions,
      }),
      {
        totalSpend: 0,
        totalRevenue: 0,
        totalImpressions: 0,
        totalConversions: 0,
      },
    );
  };

  const totalMetrics = getTotalMetrics();
  const avgROAS =
    totalMetrics.totalSpend > 0
      ? totalMetrics.totalRevenue / totalMetrics.totalSpend
      : 0;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Campaign Management
            </h1>
            <p className="text-gray-600 mt-1">
              Create, manage, and optimize your marketing campaigns
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button variant="outline" onClick={createTestCampaign}>
              <Plus className="w-4 h-4 mr-2" />
              Quick Test
            </Button>
            <Button
              onClick={() => {
                console.log("Opening Campaign Wizard");
                setShowCampaignWizard(true);
              }}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Campaigns
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {campaigns.length}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {campaigns.filter((c) => c.status === "active").length}{" "}
                    active
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Spend
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(totalMetrics.totalSpend)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">This month</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(totalMetrics.totalRevenue)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {avgROAS.toFixed(2)}x ROAS
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Conversions
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatNumber(totalMetrics.totalConversions)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">This month</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Campaigns</CardTitle>
                <CardDescription>
                  Manage your active and past marketing campaigns
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="awareness">Awareness</SelectItem>
                  <SelectItem value="consideration">Consideration</SelectItem>
                  <SelectItem value="conversion">Conversion</SelectItem>
                  <SelectItem value="retention">Retention</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campaigns Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {campaign.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status.charAt(0).toUpperCase() +
                            campaign.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {campaign.type.charAt(0).toUpperCase() +
                            campaign.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {formatCurrency(campaign.budget.spent)} /{" "}
                            {formatCurrency(campaign.budget.total)}
                          </div>
                          <Progress
                            value={
                              (campaign.budget.spent / campaign.budget.total) *
                              100
                            }
                            className="w-20 h-2 mt-1"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            ROAS: {campaign.performance.roas.toFixed(2)}x
                          </div>
                          <div className="text-gray-500">
                            {formatNumber(campaign.performance.conversions)}{" "}
                            conv.
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            {new Date(
                              campaign.schedule.startDate,
                            ).toLocaleDateString()}
                          </div>
                          <div className="text-gray-500">
                            {campaign.schedule.endDate
                              ? new Date(
                                  campaign.schedule.endDate,
                                ).toLocaleDateString()
                              : "Ongoing"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            {campaign.status === "active" ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredCampaigns.length === 0 && (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No campaigns found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your search or filters."
                    : "Create your first campaign to get started."}
                </p>
                <Button
                  onClick={() => {
                    console.log("Opening Campaign Wizard from empty state");
                    setShowCampaignWizard(true);
                  }}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Campaign Wizard */}
      <CampaignWizard
        open={showCampaignWizard}
        onOpenChange={setShowCampaignWizard}
        onCreateCampaign={handleCreateCampaign}
      />
    </div>
  );
};

export default Campaigns;
