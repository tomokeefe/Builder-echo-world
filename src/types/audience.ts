export interface Audience {
  id: string;
  name: string;
  description?: string;
  size: number;
  similarity: number;
  status: "Active" | "Paused" | "Draft";
  created: string;
  performance: "High" | "Medium" | "Low";
  source: string;
  targetingCriteria: {
    demographics: string[];
    interests: string[];
    behaviors: string[];
  };
  campaignData: {
    reach: number;
    engagement: number;
    conversion: number;
    clicks: number;
    impressions: number;
  };
}

export interface AudienceFilters {
  status: string;
  performance: string;
  source: string;
  search: string;
}

export interface AudienceStats {
  totalAudiences: number;
  totalReach: number;
  avgSimilarity: number;
  activeCampaigns: number;
}
