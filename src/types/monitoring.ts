export interface RealTimeMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  unit: "currency" | "percentage" | "number";
  threshold?: {
    warning: number;
    critical: number;
  };
  lastUpdated: string;
}

export interface CampaignHealth {
  campaignId: string;
  status: "healthy" | "warning" | "critical" | "paused";
  score: number; // 0-100
  issues: HealthIssue[];
  recommendations: string[];
  lastCheck: string;
}

export interface HealthIssue {
  type: "budget" | "performance" | "audience" | "creative" | "targeting";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  impact: string;
  suggestedAction: string;
  estimatedFix: string;
}

export interface BudgetAlert {
  id: string;
  campaignId: string;
  type: "burn_rate" | "threshold" | "depletion" | "overspend";
  severity: "info" | "warning" | "critical";
  message: string;
  currentSpend: number;
  budgetRemaining: number;
  projectedDepletion: string;
  recommendedAction: string;
  createdAt: string;
}

export interface PerformanceAnomaly {
  id: string;
  campaignId: string;
  metric: string;
  type: "spike" | "drop" | "trend_change";
  severity: "low" | "medium" | "high";
  description: string;
  detectedAt: string;
  expectedValue: number;
  actualValue: number;
  deviation: number;
  possibleCauses: string[];
  suggestedActions: string[];
}

export interface LiveDashboardData {
  overview: RealTimeMetric[];
  campaigns: CampaignHealth[];
  alerts: BudgetAlert[];
  anomalies: PerformanceAnomaly[];
  systemStatus: SystemStatus;
  lastUpdate: string;
}

export interface SystemStatus {
  integrations: IntegrationStatus[];
  dataSync: DataSyncStatus;
  apiHealth: ApiHealthStatus;
  uptime: number;
}

export interface IntegrationStatus {
  platform: string;
  status: "connected" | "error" | "syncing" | "disconnected";
  lastSync: string;
  errorCount: number;
  latency: number;
}

export interface DataSyncStatus {
  status: "active" | "delayed" | "error";
  lastSync: string;
  recordsProcessed: number;
  pendingRecords: number;
  errorRate: number;
}

export interface ApiHealthStatus {
  status: "operational" | "degraded" | "down";
  responseTime: number;
  successRate: number;
  errorRate: number;
}
