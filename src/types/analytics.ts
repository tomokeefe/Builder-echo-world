export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  unit: "percentage" | "number" | "currency";
  period: "day" | "week" | "month" | "year";
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label: string;
}

export interface ChartData {
  id: string;
  title: string;
  type: "line" | "bar" | "pie" | "area";
  data: TimeSeriesData[];
  metrics: PerformanceMetric[];
}

export interface AudienceOverlap {
  audienceA: string;
  audienceB: string;
  overlapSize: number;
  overlapPercentage: number;
  uniqueToA: number;
  uniqueToB: number;
}

export interface ConversionFunnel {
  stage: string;
  users: number;
  conversionRate: number;
  dropOffRate: number;
}

export interface GeographicData {
  country: string;
  region: string;
  city: string;
  users: number;
  percentage: number;
  performance: "high" | "medium" | "low";
}

export interface CampaignAnalytics {
  campaignId: string;
  campaignName: string;
  audienceId: string;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  roas: number;
  ctr: number;
  conversionRate: number;
}

export interface AnalyticsDashboard {
  overview: PerformanceMetric[];
  charts: ChartData[];
  audienceOverlaps: AudienceOverlap[];
  conversionFunnels: ConversionFunnel[];
  geographicData: GeographicData[];
  campaigns: CampaignAnalytics[];
}
