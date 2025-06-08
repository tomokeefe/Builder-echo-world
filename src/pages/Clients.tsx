import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Client, ClientFilters } from "@/types/client";
import { clientService } from "@/services/clientService";
import { useToast } from "@/hooks/use-toast";

const Clients: React.FC = () => {
  console.log("Clients component rendering");
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ClientFilters>({
    sortBy: "name",
    sortOrder: "asc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadClients();
    loadStats();
  }, [filters]);

  const loadClients = async () => {
    console.log("Loading clients...");
    setIsLoading(true);
    try {
      const clientsData = await clientService.getClients({
        ...filters,
        searchTerm,
      });
      console.log("Clients loaded:", clientsData);
      setClients(clientsData);
    } catch (error) {
      console.error("Error loading clients:", error);
      toast({
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await clientService.getClientStats();
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load client stats:", error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters((prev) => ({ ...prev, searchTerm: value }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status === "all" ? undefined : status,
    }));
  };

  const handleSort = (sortBy: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: sortBy as any,
      sortOrder:
        prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const getStatusIcon = (status: Client["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "onboarding":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "inactive":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Client["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "onboarding":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTierColor = (tier: Client["tier"]) => {
    switch (tier) {
      case "enterprise":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "premium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "basic":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: "rgba(248, 251, 247, 1)" }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              <span style={{ color: "rgb(61, 153, 76)" }}>
                Client Management
              </span>
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your client relationships, contracts, and account
              performance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Clients
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats.total}
                    </p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <span>{stats.active} active</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-blue-600" />
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
                      {formatCurrency(stats.totalRevenue)}
                    </p>
                    <div className="flex items-center mt-2 text-sm text-green-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      <span>+12.5% from last month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Avg Monthly Spend
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(stats.averageMonthlySpend)}
                    </p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <span>per client</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Onboarding
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats.onboarding}
                    </p>
                    <div className="flex items-center mt-2 text-sm text-yellow-600">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>In progress</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="all-clients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all-clients">All Clients</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          </TabsList>

          {/* All Clients Tab */}
          <TabsContent value="all-clients" className="space-y-6">
            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clients Table */}
            <Card>
              <CardHeader>
                <CardTitle>Client Directory</CardTitle>
                <CardDescription>
                  Manage and monitor all your client accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort("name")}
                      >
                        Client
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort("company")}
                      >
                        Company
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort("monthlySpend")}
                      >
                        Monthly Spend
                      </TableHead>
                      <TableHead>Account Manager</TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort("lastActivity")}
                      >
                        Last Activity
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {client.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{client.name}</div>
                              <div className="text-sm text-gray-500">
                                {client.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{client.company}</div>
                            <div className="text-sm text-gray-500">
                              {client.industry}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(client.status)}>
                            {getStatusIcon(client.status)}
                            <span className="ml-1 capitalize">
                              {client.status}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTierColor(client.tier)}>
                            {client.tier === "enterprise" && (
                              <Star className="w-3 h-3 mr-1" />
                            )}
                            {client.tier.charAt(0).toUpperCase() +
                              client.tier.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(client.monthlySpend)}
                        </TableCell>
                        <TableCell>{client.accountManager}</TableCell>
                        <TableCell>
                          {client.lastActivity
                            ? formatDate(client.lastActivity)
                            : "Never"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => setSelectedClient(client)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Client
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="w-4 h-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Industries</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats?.topIndustries.map((industry: any, index: number) => (
                    <div
                      key={industry.name}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="font-medium">{industry.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(industry.count / stats.total) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-500">
                          {industry.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats?.recentActivities
                      .slice(0, 5)
                      .map((activity: any) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3"
                        >
                          <Activity className="w-4 h-4 text-blue-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {activity.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(activity.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing Overview</CardTitle>
                <CardDescription>
                  Monitor client billing and payment status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Billing management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onboarding Tab */}
          <TabsContent value="onboarding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Onboarding</CardTitle>
                <CardDescription>
                  Track new client onboarding progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients
                    .filter((c) => c.status === "onboarding")
                    .map((client) => (
                      <div key={client.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{client.name}</h4>
                            <p className="text-sm text-gray-600">
                              {client.company}
                            </p>
                          </div>
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            Onboarding
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>60%</span>
                          </div>
                          <Progress value={60} className="h-2" />
                          <p className="text-xs text-gray-500">
                            Started {formatDate(client.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Client Details Modal */}
        <Dialog
          open={selectedClient !== null}
          onOpenChange={(open) => !open && setSelectedClient(null)}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Client Details</DialogTitle>
            </DialogHeader>
            {selectedClient && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="text-lg">
                          {selectedClient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {selectedClient.name}
                        </h3>
                        <p className="text-gray-600">
                          {selectedClient.company}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={getStatusColor(selectedClient.status)}
                          >
                            {selectedClient.status}
                          </Badge>
                          <Badge className={getTierColor(selectedClient.tier)}>
                            {selectedClient.tier}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{selectedClient.email}</span>
                      </div>
                      {selectedClient.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            {selectedClient.phone}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {selectedClient.address.city},{" "}
                          {selectedClient.address.country}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {selectedClient.industry}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
                          <p className="text-2xl font-bold">
                            {formatCurrency(selectedClient.monthlySpend)}
                          </p>
                          <p className="text-sm text-gray-600">Monthly Spend</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                          <p className="text-2xl font-bold">
                            {selectedClient.metrics.averageROAS.toFixed(1)}x
                          </p>
                          <p className="text-sm text-gray-600">Average ROAS</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Active Audiences</p>
                        <p className="font-semibold">
                          {selectedClient.metrics.activeAudiences}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Active Campaigns</p>
                        <p className="font-semibold">
                          {selectedClient.metrics.activeCampaigns}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Conversions</p>
                        <p className="font-semibold">
                          {selectedClient.metrics.totalConversions.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Lifetime Value</p>
                        <p className="font-semibold">
                          {formatCurrency(selectedClient.totalLifetimeValue)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Clients;
