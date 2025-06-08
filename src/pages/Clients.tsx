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
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ClientFilters>({
    sortBy: "name",
    sortOrder: "asc",
  });

  useEffect(() => {
    loadClients();
  }, [filters]);

  const loadClients = async () => {
    console.log("Loading clients...");
    setIsLoading(true);
    try {
      const clientsData = await clientService.getClients(filters);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Clients
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {clients.length}
                  </p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <span>
                      {clients.filter((c) => c.status === "active").length}{" "}
                      active
                    </span>
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
                    $267,500
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
                    $8,667
                  </p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <span>per client</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
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
                    {clients.filter((c) => c.status === "onboarding").length}
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

        {/* Clients List */}
        <Card>
          <CardHeader>
            <CardTitle>Client Directory</CardTitle>
            <CardDescription>
              Manage and monitor all your client accounts ({clients.length}{" "}
              total clients)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p>Loading clients...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clients.map((client) => (
                  <Card
                    key={client.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">
                            {client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{client.name}</h4>
                          <p className="text-sm text-gray-600">
                            {client.company}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          <Badge className={getStatusColor(client.status)}>
                            {getStatusIcon(client.status)}
                            <span className="ml-1 capitalize">
                              {client.status}
                            </span>
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Monthly Spend
                          </span>
                          <span className="font-semibold">
                            ${client.monthlySpend.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Industry
                          </span>
                          <span className="text-sm">{client.industry}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Account Manager
                          </span>
                          <span className="text-sm">
                            {client.accountManager}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Tier</span>
                          <Badge variant="outline" className="capitalize">
                            {client.tier}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Client Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Building className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg font-semibold mb-2">Client Profiles</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive client information including contact details,
                billing, and performance metrics.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold mb-2">
                Performance Tracking
              </h3>
              <p className="text-gray-600 text-sm">
                Monitor client ROI, campaign performance, and revenue growth
                over time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <h3 className="text-lg font-semibold mb-2">Team Management</h3>
              <p className="text-gray-600 text-sm">
                Manage client team members, roles, and permissions for each
                account.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Clients;
