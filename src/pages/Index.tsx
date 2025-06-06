import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  Users,
  TrendingUp,
  Target,
  Upload,
  Download,
  Plus,
  Search,
  Filter,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Calendar,
  ChevronRight,
  Eye,
  Edit,
  Copy,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useAudienceStore } from "@/hooks/useAudienceStore";
import { CreateAudienceModal } from "@/components/CreateAudienceModal";
import { AudienceDetailsModal } from "@/components/AudienceDetailsModal";
import { CSVUploadModal } from "@/components/CSVUploadModal";
import { Audience } from "@/types/audience";

const Index = () => {
  const { toast } = useToast();
  const {
    audiences,
    loading,
    filters,
    stats,
    setFilters,
    createAudience,
    updateAudience,
    deleteAudience,
    duplicateAudience,
    getAudience,
  } = useAudienceStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState<Audience | null>(
    null,
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCSVUploadModal, setShowCSVUploadModal] = useState(false);

  const handleCreateAudience = (
    audienceData: Omit<Audience, "id" | "created">,
  ) => {
    const newAudience = createAudience(audienceData);
    toast({
      title: "Audience Created",
      description: `${newAudience.name} has been created successfully.`,
    });
  };

  const handleViewAudience = (id: string) => {
    const audience = getAudience(id);
    if (audience) {
      setSelectedAudience(audience);
      setShowDetailsModal(true);
    }
  };

  const handleUpdateAudience = (id: string, updates: Partial<Audience>) => {
    updateAudience(id, updates);
    // Update the selected audience if it's currently being viewed
    if (selectedAudience && selectedAudience.id === id) {
      setSelectedAudience((prev) => (prev ? { ...prev, ...updates } : null));
    }
    toast({
      title: "Audience Updated",
      description: "Audience has been updated successfully.",
    });
  };

  const handleDuplicateAudience = (id: string) => {
    const duplicated = duplicateAudience(id);
    if (duplicated) {
      toast({
        title: "Audience Duplicated",
        description: `${duplicated.name} has been created as a copy.`,
      });
    }
  };

  const handleDeleteAudience = (id: string) => {
    const audience = getAudience(id);
    deleteAudience(id);
    toast({
      title: "Audience Deleted",
      description: `${audience?.name} has been deleted.`,
      variant: "destructive",
    });
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(audiences, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "lookalike-audiences.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Audience data has been exported to JSON file.",
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  const statsData = [
    {
      title: "Total Audiences",
      value: stats.totalAudiences.toString(),
      change: "+3 this month",
      icon: Users,
      trend: "up",
    },
    {
      title: "Total Reach",
      value: formatNumber(stats.totalReach),
      change: "+15% from last month",
      icon: TrendingUp,
      trend: "up",
    },
    {
      title: "Avg. Similarity",
      value: `${stats.avgSimilarity}%`,
      change: "+2% improvement",
      icon: Target,
      trend: "up",
    },
    {
      title: "Active Campaigns",
      value: stats.activeCampaigns.toString(),
      change: "2 ending soon",
      icon: Activity,
      trend: "neutral",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Lookalike Audiences
                </h1>
              </div>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20"
              >
                Pro Plan
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Audience
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="w-12 h-12 rounded-lg" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : statsData.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {stat.value}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            stat.trend === "up"
                              ? "text-green-600"
                              : stat.trend === "down"
                                ? "text-red-600"
                                : "text-gray-500"
                          }`}
                        >
                          {stat.change}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Lookalike Audiences</CardTitle>
                    <CardDescription>
                      Manage and analyze your custom audience segments
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCSVUploadModal(true)}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportData}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filters */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search audiences..."
                      value={filters.search}
                      onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                      }
                      className="pl-10"
                    />
                  </div>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      setFilters({ ...filters, status: value })
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Paused">Paused</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Audiences List */}
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-6 w-48" />
                              <Skeleton className="h-5 w-16" />
                              <Skeleton className="h-5 w-20" />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <Skeleton className="h-4 w-20" />
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-4 w-28" />
                              <Skeleton className="h-4 w-16" />
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {Array.from({ length: 4 }).map((_, i) => (
                              <Skeleton key={i} className="w-8 h-8" />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : audiences.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No audiences found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {filters.search || filters.status !== "all"
                        ? "Try adjusting your search or filters."
                        : "Create your first lookalike audience to get started."}
                    </p>
                    <Button onClick={() => setShowCreateModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Audience
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {audiences.map((audience) => (
                      <div
                        key={audience.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {audience.name}
                              </h3>
                              <Badge
                                variant={
                                  audience.status === "Active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {audience.status}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={
                                  audience.performance === "High"
                                    ? "border-green-500 text-green-700"
                                    : audience.performance === "Medium"
                                      ? "border-yellow-500 text-yellow-700"
                                      : "border-red-500 text-red-700"
                                }
                              >
                                {audience.performance}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <p className="font-medium">Size</p>
                                <p>{formatNumber(audience.size)} people</p>
                              </div>
                              <div>
                                <p className="font-medium">Similarity</p>
                                <div className="flex items-center gap-2">
                                  <Progress
                                    value={audience.similarity}
                                    className="w-16 h-2"
                                  />
                                  <span>{audience.similarity}%</span>
                                </div>
                              </div>
                              <div>
                                <p className="font-medium">Source</p>
                                <p>{audience.source}</p>
                              </div>
                              <div>
                                <p className="font-medium">Created</p>
                                <p>
                                  {new Date(
                                    audience.created,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewAudience(audience.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDuplicateAudience(audience.id)
                              }
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAudience(audience.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!loading && audiences.length > 0 && (
                  <div className="flex items-center justify-center pt-6">
                    <p className="text-sm text-gray-500">
                      Showing {audiences.length} of {stats.totalAudiences}{" "}
                      audiences
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Audience
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => setShowCSVUploadModal(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Customer Data
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Audience Settings
                </Button>
              </CardContent>
            </Card>

            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="week" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                  </TabsList>
                  <TabsContent value="week" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Reach Rate
                        </span>
                        <span className="text-sm font-medium">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Engagement
                        </span>
                        <span className="text-sm font-medium">62%</span>
                      </div>
                      <Progress value={62} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Conversion
                        </span>
                        <span className="text-sm font-medium">34%</span>
                      </div>
                      <Progress value={34} className="h-2" />
                    </div>
                  </TabsContent>
                  <TabsContent value="month" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Reach Rate
                        </span>
                        <span className="text-sm font-medium">91%</span>
                      </div>
                      <Progress value={91} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Engagement
                        </span>
                        <span className="text-sm font-medium">58%</span>
                      </div>
                      <Progress value={58} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Conversion
                        </span>
                        <span className="text-sm font-medium">29%</span>
                      </div>
                      <Progress value={29} className="h-2" />
                    </div>
                  </TabsContent>
                  <TabsContent value="year" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Reach Rate
                        </span>
                        <span className="text-sm font-medium">84%</span>
                      </div>
                      <Progress value={84} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Engagement
                        </span>
                        <span className="text-sm font-medium">71%</span>
                      </div>
                      <Progress value={71} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Conversion
                        </span>
                        <span className="text-sm font-medium">41%</span>
                      </div>
                      <Progress value={41} className="h-2" />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">
                        High-Value Customers updated
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">
                        New audience created
                      </p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">
                        Campaign performance alert
                      </p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Data sync completed</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateAudienceModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateAudience={handleCreateAudience}
      />

      <CSVUploadModal
        open={showCSVUploadModal}
        onOpenChange={setShowCSVUploadModal}
        onCreateAudience={handleCreateAudience}
      />

      <AudienceDetailsModal
        audience={selectedAudience}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        onUpdateAudience={handleUpdateAudience}
        onDuplicateAudience={handleDuplicateAudience}
        onDeleteAudience={handleDeleteAudience}
      />
    </div>
  );
};

export default Index;
