import { PerformanceMetric, CampaignAnalytics } from "@/types/analytics";
import { Audience } from "@/types/audience";

export interface PredictionModel {
  id: string;
  name: string;
  type:
    | "performance"
    | "audience_size"
    | "budget_optimization"
    | "churn_prediction";
  accuracy: number;
  lastTrained: string;
  features: string[];
}

export interface Prediction {
  id: string;
  modelId: string;
  targetDate: string;
  prediction: number;
  confidence: number;
  factors: PredictionFactor[];
  recommendations: string[];
}

export interface PredictionFactor {
  name: string;
  impact: number; // -1 to 1
  importance: number; // 0 to 1
  description: string;
}

export interface AudienceSizePrediction {
  audienceId: string;
  currentSize: number;
  predictedSize: number;
  timeframe: string;
  confidence: number;
  growthRate: number;
  factors: PredictionFactor[];
}

export interface BudgetOptimization {
  campaignId: string;
  currentBudget: number;
  recommendedBudget: number;
  expectedRoas: number;
  confidence: number;
  reasoning: string[];
}

export interface ChurnPrediction {
  audienceId: string;
  churnRate: number;
  highRiskUsers: number;
  timeframe: string;
  preventionStrategies: string[];
}

class PredictiveAnalyticsService {
  private models: PredictionModel[] = [
    {
      id: "model_1",
      name: "Campaign Performance Predictor",
      type: "performance",
      accuracy: 0.87,
      lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      features: [
        "historical_performance",
        "audience_size",
        "seasonality",
        "competition",
      ],
    },
    {
      id: "model_2",
      name: "Audience Growth Model",
      type: "audience_size",
      accuracy: 0.82,
      lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      features: [
        "current_size",
        "engagement_rate",
        "market_trends",
        "targeting_accuracy",
      ],
    },
    {
      id: "model_3",
      name: "Budget Optimization Engine",
      type: "budget_optimization",
      accuracy: 0.91,
      lastTrained: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      features: [
        "historical_roas",
        "market_competition",
        "audience_overlap",
        "creative_performance",
      ],
    },
    {
      id: "model_4",
      name: "Customer Churn Predictor",
      type: "churn_prediction",
      accuracy: 0.79,
      lastTrained: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      features: [
        "engagement_frequency",
        "purchase_history",
        "support_interactions",
        "demographic_shifts",
      ],
    },
  ];

  public async predictCampaignPerformance(
    campaignId: string,
    timeframe: number = 30,
  ): Promise<Prediction> {
    // Simulate ML model prediction
    await this.simulateProcessingTime();

    const prediction = Math.random() * 0.8 + 0.1; // 0.1 to 0.9
    const confidence = Math.random() * 0.3 + 0.7; // 0.7 to 1.0

    const factors: PredictionFactor[] = [
      {
        name: "Historical Performance",
        impact: 0.35,
        importance: 0.9,
        description: "Based on past 90 days of campaign data",
      },
      {
        name: "Audience Quality",
        impact: 0.28,
        importance: 0.8,
        description: "Audience engagement and similarity scores",
      },
      {
        name: "Market Seasonality",
        impact: 0.15,
        importance: 0.6,
        description: "Seasonal trends in your industry",
      },
      {
        name: "Competitive Landscape",
        impact: -0.12,
        importance: 0.7,
        description: "Current market competition levels",
      },
    ];

    const recommendations = [
      "Increase budget allocation during peak hours (2-4 PM)",
      "Test creative variations to improve engagement",
      "Consider expanding to similar audience segments",
      "Monitor competitor activity and adjust bidding strategy",
    ];

    return {
      id: `pred_${Date.now()}`,
      modelId: "model_1",
      targetDate: new Date(
        Date.now() + timeframe * 24 * 60 * 60 * 1000,
      ).toISOString(),
      prediction,
      confidence,
      factors,
      recommendations,
    };
  }

  public async predictAudienceSize(
    audience: Audience,
  ): Promise<AudienceSizePrediction> {
    await this.simulateProcessingTime();

    const growthRate = (Math.random() - 0.3) * 0.4; // -0.12 to 0.28
    const predictedSize = Math.floor(audience.size * (1 + growthRate));
    const confidence = Math.random() * 0.25 + 0.75;

    const factors: PredictionFactor[] = [
      {
        name: "Current Engagement Rate",
        impact: 0.42,
        importance: 0.85,
        description: "High engagement indicates growing interest",
      },
      {
        name: "Market Expansion",
        impact: 0.28,
        importance: 0.7,
        description: "New market opportunities in target demographics",
      },
      {
        name: "Competitive Pressure",
        impact: -0.15,
        importance: 0.6,
        description: "Increased competition may slow growth",
      },
    ];

    return {
      audienceId: audience.id,
      currentSize: audience.size,
      predictedSize,
      timeframe: "30 days",
      confidence,
      growthRate,
      factors,
    };
  }

  public async optimizeBudget(
    campaigns: CampaignAnalytics[],
  ): Promise<BudgetOptimization[]> {
    await this.simulateProcessingTime();

    return campaigns.map((campaign) => {
      const optimizationFactor = Math.random() * 0.4 + 0.8; // 0.8 to 1.2
      const recommendedBudget = campaign.spend * optimizationFactor;
      const expectedRoas = campaign.roas * (optimizationFactor > 1 ? 1.1 : 1.2);

      const reasoning = [];
      if (optimizationFactor > 1) {
        reasoning.push(
          "Increase budget to capture more high-converting traffic",
        );
        reasoning.push("Campaign showing strong ROAS potential");
      } else {
        reasoning.push("Reduce budget to improve efficiency");
        reasoning.push("Reallocate to better-performing campaigns");
      }

      return {
        campaignId: campaign.campaignId,
        currentBudget: campaign.spend,
        recommendedBudget,
        expectedRoas,
        confidence: Math.random() * 0.2 + 0.8,
        reasoning,
      };
    });
  }

  public async predictChurn(audienceId: string): Promise<ChurnPrediction> {
    await this.simulateProcessingTime();

    const churnRate = Math.random() * 0.3 + 0.05; // 5% to 35%
    const highRiskUsers = Math.floor(Math.random() * 10000 + 1000);

    const preventionStrategies = [
      "Implement re-engagement email campaign",
      "Offer personalized incentives to at-risk users",
      "Improve onboarding experience for new users",
      "Create loyalty program for high-value customers",
      "Conduct user feedback surveys to identify pain points",
    ];

    return {
      audienceId,
      churnRate,
      highRiskUsers,
      timeframe: "90 days",
      preventionStrategies: preventionStrategies.slice(0, 3),
    };
  }

  public getModels(): PredictionModel[] {
    return this.models;
  }

  public async retrainModel(modelId: string): Promise<PredictionModel> {
    await this.simulateProcessingTime(2000);

    const model = this.models.find((m) => m.id === modelId);
    if (!model) {
      throw new Error("Model not found");
    }

    // Simulate retraining by updating accuracy and last trained date
    model.accuracy = Math.min(
      0.95,
      model.accuracy + (Math.random() * 0.1 - 0.05),
    );
    model.lastTrained = new Date().toISOString();

    return model;
  }

  private simulateProcessingTime(ms: number = 1500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public getRecommendations(data: {
    metrics: PerformanceMetric[];
    campaigns: CampaignAnalytics[];
    audiences: Audience[];
  }): string[] {
    const recommendations = [];

    // Analyze performance metrics
    const lowPerformingMetrics = data.metrics.filter(
      (m) => m.changeType === "decrease" && Math.abs(m.change) > 10,
    );

    if (lowPerformingMetrics.length > 0) {
      recommendations.push(
        "Review underperforming campaigns and consider budget reallocation",
      );
    }

    // Analyze campaigns
    const lowRoasCampaigns = data.campaigns.filter((c) => c.roas < 2);
    if (lowRoasCampaigns.length > 0) {
      recommendations.push("Optimize or pause campaigns with ROAS below 2.0");
    }

    // Analyze audiences
    const smallAudiences = data.audiences.filter((a) => a.size < 10000);
    if (smallAudiences.length > 0) {
      recommendations.push(
        "Consider expanding small audience segments for better reach",
      );
    }

    return recommendations;
  }
}

export const predictiveAnalytics = new PredictiveAnalyticsService();
