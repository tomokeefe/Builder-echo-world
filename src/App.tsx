import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "@/components/Sidebar";
import {
  createLazyComponent,
  BundleAnalyzer,
  LoadingFallback,
} from "@/utils/performance";
import { ErrorBoundary } from "react-error-boundary";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Lazy load pages for better performance
const IndexPage = createLazyComponent(
  () => import("@/pages/Index"),
  "Loading dashboard...",
);

const ClientsPage = createLazyComponent(
  () => import("@/pages/Clients"),
  "Loading clients...",
);

const AnalyticsPage = createLazyComponent(
  () => import("@/pages/Analytics"),
  "Loading analytics...",
);

const CampaignsPage = createLazyComponent(
  () => import("@/pages/Campaigns"),
  "Loading campaigns...",
);

const RealTimeAnalyticsPage = createLazyComponent(
  () => import("@/pages/RealTimeAnalytics"),
  "Loading real-time analytics...",
);

const AIRecommendationsPage = createLazyComponent(
  () => import("@/pages/AIRecommendations"),
  "Loading AI recommendations...",
);

const EnhancedIntegrationsPage = createLazyComponent(
  () => import("@/pages/EnhancedIntegrations"),
  "Loading integrations...",
);

const TeamManagementPage = createLazyComponent(
  () => import("@/pages/TeamManagement"),
  "Loading team management...",
);

const ApiDocsPage = createLazyComponent(
  () => import("@/pages/ApiDocs"),
  "Loading API documentation...",
);

// New enhanced pages (will be created next)
const PerformanceDashboardPage = createLazyComponent(
  () => import("@/pages/PerformanceDashboard"),
  "Loading performance dashboard...",
);

const AutomationPage = createLazyComponent(
  () => import("@/pages/Automation"),
  "Loading automation...",
);

const TestingDashboardPage = createLazyComponent(
  () => import("@/pages/TestingDashboard"),
  "Loading testing dashboard...",
);

const ApiIntegrationPage = createLazyComponent(
  () => import("@/pages/ApiIntegration"),
  "Loading API integration...",
);

const CustomDashboardPage = createLazyComponent(
  () => import("@/pages/CustomDashboard"),
  "Loading custom dashboard...",
);

const CollaborationPage = createLazyComponent(
  () => import("@/pages/Collaboration"),
  "Loading collaboration...",
);

const OrdersPage = createLazyComponent(
  () => import("@/pages/Orders"),
  "Loading orders...",
);

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Error fallback component
const ErrorFallback: React.FC<{
  error: Error;
  resetErrorBoundary: () => void;
}> = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="text-center max-w-md">
      <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  </div>
);

const App: React.FC = () => {
  useEffect(() => {
    // Initialize performance monitoring
    BundleAnalyzer.logBundleSize();
    BundleAnalyzer.trackResourceLoading();
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="flex bg-gray-100 min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-hidden">
              <Suspense
                fallback={<LoadingFallback message="Loading page..." />}
              >
                <Routes>
                  <Route path="/" element={<IndexPage />} />
                  <Route path="/clients" element={<ClientsPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/campaigns" element={<CampaignsPage />} />
                  <Route
                    path="/realtime-analytics"
                    element={<RealTimeAnalyticsPage />}
                  />
                  <Route
                    path="/ai-recommendations"
                    element={<AIRecommendationsPage />}
                  />
                  <Route
                    path="/integrations"
                    element={<EnhancedIntegrationsPage />}
                  />
                  <Route path="/team" element={<TeamManagementPage />} />
                  <Route path="/api-docs" element={<ApiDocsPage />} />

                  {/* New enhanced features */}
                  <Route
                    path="/performance"
                    element={<PerformanceDashboardPage />}
                  />
                  <Route path="/automation" element={<AutomationPage />} />
                  <Route path="/testing" element={<TestingDashboardPage />} />
                  <Route
                    path="/api-integration"
                    element={<ApiIntegrationPage />}
                  />
                  <Route
                    path="/custom-dashboard"
                    element={<CustomDashboardPage />}
                  />
                  <Route
                    path="/collaboration"
                    element={<CollaborationPage />}
                  />
                  <Route path="/orders" element={<OrdersPage />} />
                </Routes>
              </Suspense>
            </main>
          </div>
          <Toaster />
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
