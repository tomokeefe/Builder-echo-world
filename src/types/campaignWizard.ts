export interface WizardStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  optional?: boolean;
}

export interface CampaignWizardData {
  // Step 1: Basic Info
  name: string;
  description: string;
  type: "awareness" | "consideration" | "conversion" | "retention";

  // Step 2: Objectives
  objectives: CampaignObjective[];

  // Step 3: Audience Selection
  selectedAudiences: string[];
  estimatedReach: number;

  // Step 4: Budget & Schedule
  budget: {
    total: number;
    daily: number;
    currency: string;
    optimizationGoal: "impressions" | "clicks" | "conversions" | "revenue";
  };
  schedule: {
    startDate: string;
    endDate?: string;
    timezone: string;
    dayParting?: DayParting[];
    frequency: FrequencyCap;
  };

  // Step 5: Channels & Platforms
  channels: WizardChannel[];

  // Step 6: Creative Assets
  creatives: WizardCreative[];

  // Step 7: Targeting
  targeting: WizardTargeting;

  // Step 8: Review & Launch
  approvals: CampaignApproval[];
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
  unit: "impressions" | "clicks" | "conversions" | "revenue";
  priority: "primary" | "secondary";
}

export interface WizardChannel {
  platform:
    | "facebook"
    | "google"
    | "instagram"
    | "twitter"
    | "linkedin"
    | "email"
    | "display";
  enabled: boolean;
  budgetAllocation: number; // percentage
  bidStrategy: string;
  targeting: ChannelTargeting;
}

export interface WizardCreative {
  id: string;
  type: "image" | "video" | "carousel" | "text" | "html";
  name: string;
  headline: string;
  description: string;
  callToAction: string;
  url: string;
  assets: CreativeAsset[];
  channels: string[]; // which channels this creative is for
}

export interface CreativeAsset {
  id: string;
  type: "image" | "video";
  url: string;
  size: string;
  format: string;
  file?: File;
}

export interface WizardTargeting {
  locations: string[];
  languages: string[];
  devices: ("desktop" | "mobile" | "tablet")[];
  demographics: {
    ageMin: number;
    ageMax: number;
    genders: ("male" | "female" | "all")[];
    incomes: string[];
  };
  interests: string[];
  behaviors: string[];
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

export interface CampaignApproval {
  type: "legal" | "brand" | "budget" | "creative";
  status: "pending" | "approved" | "rejected";
  approver?: string;
  comments?: string;
  date?: string;
}

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: "basic-info",
    title: "Basic Information",
    description: "Campaign name, type, and description",
    completed: false,
  },
  {
    id: "objectives",
    title: "Campaign Objectives",
    description: "Set your goals and KPIs",
    completed: false,
  },
  {
    id: "audience",
    title: "Audience Selection",
    description: "Choose your target audiences",
    completed: false,
  },
  {
    id: "budget-schedule",
    title: "Budget & Schedule",
    description: "Set budget and timing",
    completed: false,
  },
  {
    id: "channels",
    title: "Channels & Platforms",
    description: "Select advertising platforms",
    completed: false,
  },
  {
    id: "creative",
    title: "Creative Assets",
    description: "Upload and manage creatives",
    completed: false,
    optional: true,
  },
  {
    id: "targeting",
    title: "Advanced Targeting",
    description: "Fine-tune your targeting",
    completed: false,
    optional: true,
  },
  {
    id: "review",
    title: "Review & Launch",
    description: "Final review and launch",
    completed: false,
  },
];
