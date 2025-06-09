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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Book,
  Code,
  Play,
  Copy,
  Search,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Terminal,
  Download,
  Shield,
  Key,
  Zap,
} from "lucide-react";
import { useMobile } from "@/hooks/useMobile";
import MobileNavigation from "@/components/ui/mobile-navigation";
import { useOnboarding } from "@/hooks/useOnboarding";

// Mock API documentation data
const apiData = {
  endpoints: [
    {
      id: "1",
      method: "GET",
      path: "/api/campaigns",
      description: "Retrieve all marketing campaigns",
      parameters: [
        {
          name: "limit",
          type: "integer",
          required: false,
          description: "Number of campaigns to return (default: 10)",
        },
        {
          name: "offset",
          type: "integer",
          required: false,
          description: "Pagination offset (default: 0)",
        },
        {
          name: "status",
          type: "string",
          required: false,
          description: "Filter by campaign status (active, paused, completed)",
        },
      ],
      response: {
        "200": {
          description: "Successful response",
          example: {
            campaigns: [
              {
                id: "camp_123",
                name: "Summer Sale Campaign",
                status: "active",
                budget: 5000,
                spent: 2341.23,
                impressions: 45632,
                clicks: 1234,
                conversions: 89,
              },
            ],
            total: 25,
            limit: 10,
            offset: 0,
          },
        },
      },
    },
    {
      id: "2",
      method: "POST",
      path: "/api/campaigns",
      description: "Create a new marketing campaign",
      parameters: [
        {
          name: "name",
          type: "string",
          required: true,
          description: "Campaign name",
        },
        {
          name: "budget",
          type: "number",
          required: true,
          description: "Total campaign budget",
        },
        {
          name: "target_audience",
          type: "object",
          required: true,
          description: "Audience targeting parameters",
        },
      ],
      response: {
        "201": {
          description: "Campaign created successfully",
          example: {
            id: "camp_456",
            name: "New Campaign",
            status: "draft",
            created_at: "2024-01-15T10:30:00Z",
          },
        },
      },
    },
    {
      id: "3",
      method: "GET",
      path: "/api/analytics/performance",
      description: "Get campaign performance analytics",
      parameters: [
        {
          name: "campaign_id",
          type: "string",
          required: true,
          description: "Campaign identifier",
        },
        {
          name: "date_from",
          type: "string",
          required: false,
          description: "Start date (YYYY-MM-DD)",
        },
        {
          name: "date_to",
          type: "string",
          required: false,
          description: "End date (YYYY-MM-DD)",
        },
        {
          name: "metrics",
          type: "array",
          required: false,
          description: "Specific metrics to return",
        },
      ],
      response: {
        "200": {
          description: "Performance data",
          example: {
            campaign_id: "camp_123",
            metrics: {
              impressions: 45632,
              clicks: 1234,
              ctr: 2.7,
              conversions: 89,
              cpa: 26.31,
              roas: 3.8,
            },
            daily_breakdown: [
              {
                date: "2024-01-01",
                impressions: 1520,
                clicks: 41,
                conversions: 3,
              },
              {
                date: "2024-01-02",
                impressions: 1789,
                clicks: 52,
                conversions: 4,
              },
            ],
          },
        },
      },
    },
    {
      id: "4",
      method: "PUT",
      path: "/api/campaigns/{id}",
      description: "Update an existing campaign",
      parameters: [
        {
          name: "id",
          type: "string",
          required: true,
          description: "Campaign ID in URL path",
        },
        {
          name: "name",
          type: "string",
          required: false,
          description: "Updated campaign name",
        },
        {
          name: "budget",
          type: "number",
          required: false,
          description: "Updated budget",
        },
        {
          name: "status",
          type: "string",
          required: false,
          description: "Campaign status (active, paused, completed)",
        },
      ],
      response: {
        "200": {
          description: "Campaign updated successfully",
          example: {
            id: "camp_123",
            name: "Updated Campaign Name",
            status: "active",
            updated_at: "2024-01-15T11:45:00Z",
          },
        },
      },
    },
  ],
  sdks: [
    {
      language: "JavaScript",
      package: "@skydeo/api-client",
      version: "1.2.3",
      installation: "npm install @skydeo/api-client",
      example: `
import { SkydeoClient } from '@skydeo/api-client';

const client = new SkydeoClient({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Get campaigns
const campaigns = await client.campaigns.list({
  limit: 10,
  status: 'active'
});

// Create a new campaign
const newCampaign = await client.campaigns.create({
  name: 'My New Campaign',
  budget: 5000,
  target_audience: {
    age_range: [25, 45],
    interests: ['technology', 'marketing']
  }
});`,
    },
    {
      language: "Python",
      package: "skydeo-api",
      version: "1.1.8",
      installation: "pip install skydeo-api",
      example: `
from skydeo_api import SkydeoClient

client = SkydeoClient(
    api_key='your-api-key',
    environment='production'
)

# Get campaigns
campaigns = client.campaigns.list(
    limit=10,
    status='active'
)

# Create a new campaign
new_campaign = client.campaigns.create(
    name='My New Campaign',
    budget=5000,
    target_audience={
        'age_range': [25, 45],
        'interests': ['technology', 'marketing']
    }
)`,
    },
    {
      language: "cURL",
      package: "Direct HTTP",
      version: "N/A",
      installation: "Built into most systems",
      example: `
# Get campaigns
curl -H "Authorization: Bearer your-api-key" \\
     -H "Content-Type: application/json" \\
     "https://api.skydeo.com/v1/campaigns?limit=10&status=active"

# Create a new campaign
curl -X POST \\
     -H "Authorization: Bearer your-api-key" \\
     -H "Content-Type: application/json" \\
     -d '{
       "name": "My New Campaign",
       "budget": 5000,
       "target_audience": {
         "age_range": [25, 45],
         "interests": ["technology", "marketing"]
       }
     }' \\
     "https://api.skydeo.com/v1/campaigns"`,
    },
  ],
};

const ApiDocs: React.FC = () => {
  const mobile = useMobile();
  const {
    isActive: tourActive,
    startTour,
    completeTour,
    skipTour,
  } = useOnboarding();
  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0.1,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEndpoint, setSelectedEndpoint] = useState(
    apiData.endpoints[0],
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedCode, setCopiedCode] = useState<string>("");

  useEffect(() => {
    if (!tourActive) {
      const timer = setTimeout(() => {
        startTour("api-docs-tour");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [tourActive, startTour]);

  const filteredEndpoints = apiData.endpoints.filter(
    (endpoint) =>
      endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800";
      case "POST":
        return "bg-blue-100 text-blue-800";
      case "PUT":
        return "bg-yellow-100 text-yellow-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {mobile.isMobile && <MobileNavigation />}
      <motion.div
        className={`min-h-screen p-4 md:p-6 ${mobile.isMobile ? "pt-20 pb-20" : ""}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          data-tour="api-header"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                API Documentation
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive guide for integrating with Skydeo APIs
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download SDK
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Playground
              </Button>
            </div>
          </div>
        </motion.div>

        {/* API Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Endpoints</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {apiData.endpoints.length}
                  </p>
                </div>
                <Book className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">SDKs Available</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {apiData.sdks.length}
                  </p>
                </div>
                <Code className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">API Version</p>
                  <p className="text-2xl font-bold text-gray-900">v1.2</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Uptime</p>
                  <p className="text-2xl font-bold text-gray-900">99.9%</p>
                </div>
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Endpoints List */}
          <div className="lg:col-span-1">
            <Card data-tour="api-endpoints">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="w-5 h-5" />
                  API Endpoints
                </CardTitle>
                <div className="pt-2">
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search endpoints..."
                    className="w-full"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {filteredEndpoints.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      onClick={() => setSelectedEndpoint(endpoint)}
                      className={`w-full text-left p-3 hover:bg-gray-50 transition-colors border-l-4 ${
                        selectedEndpoint.id === endpoint.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          className={getMethodColor(endpoint.method)}
                          variant="secondary"
                        >
                          {endpoint.method}
                        </Badge>
                      </div>
                      <div className="font-medium text-sm">{endpoint.path}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {endpoint.description}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card data-tour="api-details">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge
                      className={getMethodColor(selectedEndpoint.method)}
                      variant="secondary"
                    >
                      {selectedEndpoint.method}
                    </Badge>
                    <CardTitle className="font-mono text-lg">
                      {selectedEndpoint.path}
                    </CardTitle>
                  </div>
                  <Button size="sm" variant="outline">
                    <Play className="w-4 h-4 mr-2" />
                    Try It
                  </Button>
                </div>
                <CardDescription>
                  {selectedEndpoint.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="parameters">Parameters</TabsTrigger>
                    <TabsTrigger value="response">Response</TabsTrigger>
                    <TabsTrigger value="examples">Code Examples</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-gray-600">
                          {selectedEndpoint.description}
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-semibold mb-2">Authentication</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Shield className="w-4 h-4" />
                          <span>Bearer Token required</span>
                        </div>
                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Key className="w-4 h-4 text-yellow-600 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium text-yellow-800">
                                API Key Required
                              </p>
                              <p className="text-yellow-700">
                                Include your API key in the Authorization header
                                as a Bearer token.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-semibold mb-2">Rate Limits</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>• 1,000 requests per hour per API key</p>
                          <p>• 10 requests per second burst limit</p>
                          <p>• Rate limit headers included in response</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="parameters" className="mt-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Parameters</h3>
                      <div className="space-y-3">
                        {selectedEndpoint.parameters.map((param, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-sm font-medium">
                                {param.name}
                              </span>
                              <Badge
                                variant={
                                  param.required ? "destructive" : "secondary"
                                }
                              >
                                {param.required ? "Required" : "Optional"}
                              </Badge>
                              <Badge variant="outline">{param.type}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {param.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="response" className="mt-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Response Format</h3>
                      {Object.entries(selectedEndpoint.response).map(
                        ([status, details]) => (
                          <div key={status} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge
                                className={
                                  status === "200" || status === "201"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                {status}
                              </Badge>
                              <span className="text-sm">
                                {details.description}
                              </span>
                            </div>
                            <div className="relative">
                              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                                <code>
                                  {JSON.stringify(details.example, null, 2)}
                                </code>
                              </pre>
                              <button
                                onClick={() =>
                                  handleCopyCode(
                                    JSON.stringify(details.example, null, 2),
                                    `response-${status}`,
                                  )
                                }
                                className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded"
                              >
                                {copiedCode === `response-${status}` ? (
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Copy className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="examples" className="mt-6">
                    <div className="space-y-6">
                      <h3 className="font-semibold">Code Examples</h3>
                      {apiData.sdks.map((sdk) => (
                        <div key={sdk.language} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{sdk.language}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Terminal className="w-4 h-4" />
                              {sdk.installation}
                            </div>
                          </div>
                          <div className="relative">
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                              <code>{sdk.example}</code>
                            </pre>
                            <button
                              onClick={() =>
                                handleCopyCode(
                                  sdk.example,
                                  `sdk-${sdk.language}`,
                                )
                              }
                              className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded"
                            >
                              {copiedCode === `sdk-${sdk.language}` ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Resources */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                New to our API? Start with our quick setup guide and make your
                first API call in minutes.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Guide
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Status Page
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Check API status, uptime, and any ongoing maintenance or
                incidents.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Check Status
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Need help? Our support team is available 24/7 to assist with
                integration questions.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ApiDocs;
