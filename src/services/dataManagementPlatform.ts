import { v4 as uuidv4 } from "uuid";

export interface CustomerProfile {
  id: string;
  externalIds: Record<string, string>; // email, phone, custom_id, etc.
  attributes: {
    demographics: {
      age?: number;
      gender?: string;
      location?: {
        country: string;
        state?: string;
        city?: string;
        zipCode?: string;
      };
      income?: string;
      education?: string;
      occupation?: string;
    };
    behavioral: {
      purchaseHistory: PurchaseEvent[];
      webActivity: WebActivityEvent[];
      emailEngagement: EmailEvent[];
      socialActivity: SocialEvent[];
    };
    preferences: {
      categories: string[];
      brands: string[];
      priceRange: { min: number; max: number };
      communicationChannels: string[];
    };
  };
  segments: string[];
  lifetimeValue: number;
  riskScore: number;
  lastSeen: string;
  firstSeen: string;
  isActive: boolean;
  dataQuality: DataQualityScore;
}

export interface PurchaseEvent {
  id: string;
  timestamp: string;
  amount: number;
  currency: string;
  products: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
  }>;
  channel: "online" | "in-store" | "mobile-app" | "phone";
  paymentMethod: string;
}

export interface WebActivityEvent {
  id: string;
  timestamp: string;
  type: "page_view" | "click" | "form_submission" | "download" | "video_view";
  url: string;
  referrer?: string;
  duration?: number;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  location: string;
}

export interface EmailEvent {
  id: string;
  timestamp: string;
  type: "sent" | "opened" | "clicked" | "unsubscribed" | "bounced";
  campaignId: string;
  subject?: string;
  clickedLinks?: string[];
}

export interface SocialEvent {
  id: string;
  timestamp: string;
  platform: "facebook" | "instagram" | "twitter" | "linkedin" | "tiktok";
  type: "like" | "share" | "comment" | "follow" | "mention";
  content?: string;
  engagement?: number;
}

export interface DataQualityScore {
  overall: number; // 0-100
  completeness: number;
  accuracy: number;
  consistency: number;
  timeliness: number;
  issues: DataQualityIssue[];
}

export interface DataQualityIssue {
  id: string;
  type:
    | "missing_field"
    | "invalid_format"
    | "duplicate"
    | "outdated"
    | "inconsistent";
  field: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  suggestedFix?: string;
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  tags: string[];
  value: {
    averageOrderValue: number;
    conversionRate: number;
    lifetimeValue: number;
    churnRate: number;
  };
}

export interface SegmentCriteria {
  demographics?: Record<string, any>;
  behavioral?: {
    purchaseAmount?: { min?: number; max?: number };
    frequency?: { min?: number; max?: number };
    recency?: { days: number };
    categories?: string[];
  };
  engagement?: {
    emailEngagement?: "high" | "medium" | "low";
    webActivity?: "high" | "medium" | "low";
    socialActivity?: "high" | "medium" | "low";
  };
  custom?: Record<string, any>;
}

export interface DataEnrichmentRule {
  id: string;
  name: string;
  description: string;
  source: "api" | "file" | "manual" | "computed";
  targetField: string;
  logic: string; // SQL-like or custom logic
  isActive: boolean;
  schedule?: "real-time" | "hourly" | "daily" | "weekly";
  lastRun?: string;
  enrichedRecords: number;
}

export interface DataExport {
  id: string;
  name: string;
  format: "csv" | "json" | "xml" | "api";
  destination: string;
  fields: string[];
  filters: Record<string, any>;
  schedule?: "once" | "daily" | "weekly" | "monthly";
  lastExported?: string;
  recordCount?: number;
  status: "pending" | "running" | "completed" | "failed";
}

class DataManagementPlatform {
  private profiles: Map<string, CustomerProfile> = new Map();
  private segments: Map<string, Segment> = new Map();
  private enrichmentRules: Map<string, DataEnrichmentRule> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create sample customer profiles
    for (let i = 0; i < 1000; i++) {
      const profile = this.generateMockProfile();
      this.profiles.set(profile.id, profile);
    }

    // Create sample segments
    this.createPredefinedSegments();
  }

  private generateMockProfile(): CustomerProfile {
    const id = uuidv4();
    const genders = ["male", "female", "other"];
    const countries = [
      "United States",
      "Canada",
      "United Kingdom",
      "Germany",
      "France",
    ];
    const occupations = [
      "Engineer",
      "Manager",
      "Designer",
      "Sales",
      "Marketing",
      "Teacher",
      "Doctor",
    ];

    return {
      id,
      externalIds: {
        email: `user${id.substr(0, 8)}@example.com`,
        phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        custom_id: `cust_${id.substr(0, 12)}`,
      },
      attributes: {
        demographics: {
          age: Math.floor(Math.random() * 50) + 18,
          gender: genders[Math.floor(Math.random() * genders.length)],
          location: {
            country: countries[Math.floor(Math.random() * countries.length)],
            state: "CA",
            city: "San Francisco",
            zipCode: "94102",
          },
          income: Math.random() > 0.5 ? "$50k-$75k" : "$75k-$100k",
          occupation:
            occupations[Math.floor(Math.random() * occupations.length)],
        },
        behavioral: {
          purchaseHistory: this.generatePurchaseHistory(),
          webActivity: this.generateWebActivity(),
          emailEngagement: this.generateEmailEvents(),
          socialActivity: this.generateSocialEvents(),
        },
        preferences: {
          categories: ["Electronics", "Fashion", "Home"].slice(
            0,
            Math.floor(Math.random() * 3) + 1,
          ),
          brands: ["Apple", "Nike", "Amazon"].slice(
            0,
            Math.floor(Math.random() * 3) + 1,
          ),
          priceRange: { min: 10, max: 500 },
          communicationChannels: ["email", "sms", "push"],
        },
      },
      segments: [],
      lifetimeValue: Math.floor(Math.random() * 5000) + 100,
      riskScore: Math.floor(Math.random() * 100),
      lastSeen: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      firstSeen: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      isActive: Math.random() > 0.2,
      dataQuality: this.calculateDataQuality(),
    };
  }

  private generatePurchaseHistory(): PurchaseEvent[] {
    const events: PurchaseEvent[] = [];
    const eventCount = Math.floor(Math.random() * 10) + 1;

    for (let i = 0; i < eventCount; i++) {
      events.push({
        id: uuidv4(),
        timestamp: new Date(
          Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        amount: parseFloat((Math.random() * 500 + 20).toFixed(2)),
        currency: "USD",
        products: [
          {
            id: `prod_${Math.floor(Math.random() * 1000)}`,
            name: "Product Name",
            category: "Electronics",
            price: parseFloat((Math.random() * 200 + 10).toFixed(2)),
            quantity: Math.floor(Math.random() * 3) + 1,
          },
        ],
        channel: ["online", "in-store", "mobile-app"][
          Math.floor(Math.random() * 3)
        ] as any,
        paymentMethod: "credit_card",
      });
    }

    return events;
  }

  private generateWebActivity(): WebActivityEvent[] {
    const events: WebActivityEvent[] = [];
    const eventCount = Math.floor(Math.random() * 50) + 10;

    for (let i = 0; i < eventCount; i++) {
      events.push({
        id: uuidv4(),
        timestamp: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        type: ["page_view", "click", "form_submission"][
          Math.floor(Math.random() * 3)
        ] as any,
        url: `https://example.com/page${Math.floor(Math.random() * 100)}`,
        duration: Math.floor(Math.random() * 300) + 30,
        deviceType: ["desktop", "mobile", "tablet"][
          Math.floor(Math.random() * 3)
        ] as any,
        browser: "Chrome",
        location: "San Francisco, CA",
      });
    }

    return events;
  }

  private generateEmailEvents(): EmailEvent[] {
    const events: EmailEvent[] = [];
    const eventCount = Math.floor(Math.random() * 20) + 5;

    for (let i = 0; i < eventCount; i++) {
      events.push({
        id: uuidv4(),
        timestamp: new Date(
          Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        type: ["sent", "opened", "clicked"][
          Math.floor(Math.random() * 3)
        ] as any,
        campaignId: `campaign_${Math.floor(Math.random() * 10)}`,
        subject: "Marketing Email Subject",
      });
    }

    return events;
  }

  private generateSocialEvents(): SocialEvent[] {
    const events: SocialEvent[] = [];
    const eventCount = Math.floor(Math.random() * 15) + 2;

    for (let i = 0; i < eventCount; i++) {
      events.push({
        id: uuidv4(),
        timestamp: new Date(
          Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        platform: ["facebook", "instagram", "twitter"][
          Math.floor(Math.random() * 3)
        ] as any,
        type: ["like", "share", "comment"][
          Math.floor(Math.random() * 3)
        ] as any,
        engagement: Math.floor(Math.random() * 100),
      });
    }

    return events;
  }

  private calculateDataQuality(): DataQualityScore {
    const completeness = Math.floor(Math.random() * 30) + 70;
    const accuracy = Math.floor(Math.random() * 20) + 80;
    const consistency = Math.floor(Math.random() * 25) + 75;
    const timeliness = Math.floor(Math.random() * 40) + 60;

    const overall = Math.floor(
      (completeness + accuracy + consistency + timeliness) / 4,
    );

    const issues: DataQualityIssue[] = [];

    if (completeness < 80) {
      issues.push({
        id: uuidv4(),
        type: "missing_field",
        field: "phone",
        severity: "medium",
        description: "Phone number is missing",
        suggestedFix: "Collect during next interaction",
      });
    }

    return {
      overall,
      completeness,
      accuracy,
      consistency,
      timeliness,
      issues,
    };
  }

  private createPredefinedSegments() {
    const segments = [
      {
        name: "High Value Customers",
        description:
          "Customers with high lifetime value and frequent purchases",
        criteria: {
          behavioral: {
            purchaseAmount: { min: 1000 },
            frequency: { min: 5 },
          },
        },
      },
      {
        name: "Young Professionals",
        description: "Age 25-35, working professionals with good income",
        criteria: {
          demographics: {
            ageRange: "25-35",
            occupation: ["Engineer", "Manager", "Designer"],
          },
        },
      },
      {
        name: "Mobile Users",
        description: "Customers who primarily use mobile devices",
        criteria: {
          behavioral: {
            devicePreference: "mobile",
          },
        },
      },
      {
        name: "Email Engaged",
        description: "High email engagement customers",
        criteria: {
          engagement: {
            emailEngagement: "high",
          },
        },
      },
    ];

    segments.forEach((seg, index) => {
      const segment: Segment = {
        id: `segment_${index + 1}`,
        name: seg.name,
        description: seg.description,
        criteria: seg.criteria,
        memberCount: Math.floor(Math.random() * 500) + 100,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        tags: ["automated", "behavioral"],
        value: {
          averageOrderValue: Math.floor(Math.random() * 200) + 100,
          conversionRate: parseFloat((Math.random() * 5 + 2).toFixed(2)),
          lifetimeValue: Math.floor(Math.random() * 2000) + 500,
          churnRate: parseFloat((Math.random() * 15 + 5).toFixed(2)),
        },
      };
      this.segments.set(segment.id, segment);
    });
  }

  public async ingestCustomerData(
    source: "api" | "file" | "webhook",
    data: Partial<CustomerProfile>[],
  ): Promise<{ processed: number; errors: string[] }> {
    const processed = 0;
    const errors: string[] = [];

    for (const customerData of data) {
      try {
        if (!customerData.externalIds?.email) {
          errors.push("Missing required email identifier");
          continue;
        }

        // Find existing profile or create new
        let profile = Array.from(this.profiles.values()).find(
          (p) => p.externalIds.email === customerData.externalIds?.email,
        );

        if (profile) {
          // Update existing profile
          profile = {
            ...profile,
            ...customerData,
            updatedAt: new Date().toISOString(),
          };
        } else {
          // Create new profile
          profile = {
            id: uuidv4(),
            ...customerData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as CustomerProfile;
        }

        this.profiles.set(profile.id, profile);
      } catch (error) {
        errors.push(`Error processing customer: ${(error as Error).message}`);
      }
    }

    return { processed: data.length - errors.length, errors };
  }

  public async createSegment(
    segmentData: Omit<
      Segment,
      "id" | "createdAt" | "updatedAt" | "memberCount"
    >,
  ): Promise<Segment> {
    const segment: Segment = {
      id: uuidv4(),
      ...segmentData,
      memberCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Calculate member count based on criteria
    segment.memberCount = this.calculateSegmentMemberCount(segment.criteria);

    this.segments.set(segment.id, segment);
    return segment;
  }

  private calculateSegmentMemberCount(criteria: SegmentCriteria): number {
    // Mock calculation - in real implementation, this would query the database
    return Math.floor(Math.random() * 1000) + 50;
  }

  public async getSegmentMembers(
    segmentId: string,
    limit: number = 100,
  ): Promise<CustomerProfile[]> {
    const segment = this.segments.get(segmentId);
    if (!segment) {
      throw new Error("Segment not found");
    }

    // Mock implementation - return random profiles
    const allProfiles = Array.from(this.profiles.values());
    return allProfiles.slice(0, Math.min(limit, segment.memberCount));
  }

  public async enrichCustomerData(
    profileId: string,
    enrichmentType: "demographic" | "behavioral" | "social",
  ): Promise<CustomerProfile> {
    const profile = this.profiles.get(profileId);
    if (!profile) {
      throw new Error("Profile not found");
    }

    // Mock enrichment
    switch (enrichmentType) {
      case "demographic":
        profile.attributes.demographics.income = "$100k+";
        profile.attributes.demographics.education = "Bachelor's Degree";
        break;
      case "behavioral":
        profile.attributes.behavioral.purchaseHistory.push({
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          amount: 150,
          currency: "USD",
          products: [
            {
              id: "enriched_product",
              name: "Enriched Product",
              category: "Premium",
              price: 150,
              quantity: 1,
            },
          ],
          channel: "online",
          paymentMethod: "credit_card",
        });
        break;
      case "social":
        profile.attributes.behavioral.socialActivity.push({
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          platform: "linkedin",
          type: "follow",
          engagement: 85,
        });
        break;
    }

    profile.dataQuality = this.calculateDataQuality();
    this.profiles.set(profileId, profile);

    return profile;
  }

  public async exportSegment(
    segmentId: string,
    format: "csv" | "json",
  ): Promise<DataExport> {
    const segment = this.segments.get(segmentId);
    if (!segment) {
      throw new Error("Segment not found");
    }

    const exportJob: DataExport = {
      id: uuidv4(),
      name: `Export ${segment.name}`,
      format,
      destination: `/exports/segment_${segmentId}.${format}`,
      fields: ["id", "email", "name", "lastPurchase", "lifetimeValue"],
      filters: { segmentId },
      status: "pending",
      recordCount: segment.memberCount,
    };

    // Simulate export process
    setTimeout(() => {
      exportJob.status = "completed";
      exportJob.lastExported = new Date().toISOString();
    }, 2000);

    return exportJob;
  }

  public getCustomerProfile(profileId: string): CustomerProfile | undefined {
    return this.profiles.get(profileId);
  }

  public getAllSegments(): Segment[] {
    return Array.from(this.segments.values());
  }

  public getDataQualityReport(): {
    overview: { total: number; highQuality: number; needsAttention: number };
    issuesSummary: Record<string, number>;
    recommendations: string[];
  } {
    const profiles = Array.from(this.profiles.values());
    const total = profiles.length;
    const highQuality = profiles.filter(
      (p) => p.dataQuality.overall >= 80,
    ).length;
    const needsAttention = profiles.filter(
      (p) => p.dataQuality.overall < 60,
    ).length;

    const issuesSummary: Record<string, number> = {};
    profiles.forEach((profile) => {
      profile.dataQuality.issues.forEach((issue) => {
        issuesSummary[issue.type] = (issuesSummary[issue.type] || 0) + 1;
      });
    });

    const recommendations = [
      "Implement progressive profiling to collect missing data",
      "Set up automated data validation rules",
      "Create data collection campaigns for incomplete profiles",
      "Establish data retention and cleanup policies",
    ];

    return {
      overview: { total, highQuality, needsAttention },
      issuesSummary,
      recommendations,
    };
  }

  public async searchProfiles(query: {
    email?: string;
    segment?: string;
    minLifetimeValue?: number;
    location?: string;
    lastSeenDays?: number;
  }): Promise<CustomerProfile[]> {
    let results = Array.from(this.profiles.values());

    if (query.email) {
      results = results.filter((p) =>
        p.externalIds.email?.includes(query.email!),
      );
    }

    if (query.minLifetimeValue) {
      results = results.filter(
        (p) => p.lifetimeValue >= query.minLifetimeValue!,
      );
    }

    if (query.location) {
      results = results.filter(
        (p) =>
          p.attributes.demographics.location?.country.includes(
            query.location!,
          ) ||
          p.attributes.demographics.location?.city?.includes(query.location!),
      );
    }

    if (query.lastSeenDays) {
      const cutoffDate = new Date(
        Date.now() - query.lastSeenDays * 24 * 60 * 60 * 1000,
      );
      results = results.filter((p) => new Date(p.lastSeen) >= cutoffDate);
    }

    return results.slice(0, 100); // Limit results
  }
}

export const dataManagementPlatform = new DataManagementPlatform();
