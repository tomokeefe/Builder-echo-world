export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: "draft" | "active" | "paused" | "completed" | "cancelled";
  type: "awareness" | "consideration" | "conversion" | "retention";
  audiences: string[]; // audience IDs
  channels: CampaignChannel[];
  budget: CampaignBudget;
  schedule: CampaignSchedule;
  creative: CampaignCreative[];
  targeting: CampaignTargeting;
  objectives: CampaignObjective[];
  performance: CampaignPerformance;
  created: string;
  updated: string;
  createdBy: string;
}

export interface CampaignChannel {
  id: string;
  platform:
    | "facebook"
    | "google"
    | "instagram"
    | "twitter"
    | "linkedin"
    | "email"
    | "display";
  enabled: boolean;
  budget: number;
  budgetType: "daily" | "total";
  bidStrategy: string;
  targeting: ChannelTargeting;
}

export interface CampaignBudget {
  total: number;
  daily: number;
  spent: number;
  remaining: number;
  currency: string;
  optimizationGoal: "impressions" | "clicks" | "conversions" | "revenue";
}

export interface CampaignSchedule {
  startDate: string;
  endDate?: string;
  timezone: string;
  dayParting?: DayParting[];
  frequency: FrequencyCap;
}

export interface DayParting {
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  startTime: string;
  endTime: string;
  budgetMultiplier: number;
}

export interface FrequencyCap {
  impressions: number;
  period: "day" | "week" | "month";
}

export interface CampaignCreative {
  id: string;
  type: "image" | "video" | "carousel" | "text" | "html";
  name: string;
  headline: string;
  description: string;
  callToAction: string;
  url: string;
  assets: CreativeAsset[];
  performance: CreativePerformance;
}

export interface CreativeAsset {
  id: string;
  type: "image" | "video";
  url: string;
  size: string;
  format: string;
}

export interface CreativePerformance {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
  cost: number;
}

export interface CampaignTargeting {
  locations: string[];
  languages: string[];
  devices: ("desktop" | "mobile" | "tablet")[];
  operatingSystems: string[];
  browsers: string[];
  interests: string[];
  behaviors: string[];
  demographics: {
    ageMin: number;
    ageMax: number;
    genders: ("male" | "female" | "all")[];
    incomes: string[];
  };
  exclusions: {
    audiences: string[];
    interests: string[];
    behaviors: string[];
  };
}

export interface ChannelTargeting {
  platformSpecific: Record<string, any>;
  customAudiences: string[];
  lookalikePools: string[];
}

export interface CampaignObjective {
  type:
    | "awareness"
    | "traffic"
    | "engagement"
    | "leads"
    | "sales"
    | "retention";
  target: number;
  current: number;
  unit: "impressions" | "clicks" | "conversions" | "revenue";
}

export interface CampaignPerformance {
  impressions: number;
  reach: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  roas: number;
  ctr: number;
  cpm: number;
  cpc: number;
  cpa: number;
  conversionRate: number;
  frequency: number;
  qualityScore: number;
}

export interface ABTest {
  id: string;
  campaignId: string;
  name: string;
  type: "creative" | "audience" | "bidding" | "targeting";
  variants: ABTestVariant[];
  status: "running" | "completed" | "paused";
  startDate: string;
  endDate?: string;
  trafficSplit: number[];
  winner?: string;
  confidence: number;
  results: ABTestResults;
}

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  configuration: Record<string, any>;
  performance: CampaignPerformance;
}

export interface ABTestResults {
  primaryMetric: string;
  significance: number;
  improvement: number;
  recommendation: "continue_testing" | "declare_winner" | "inconclusive";
}
