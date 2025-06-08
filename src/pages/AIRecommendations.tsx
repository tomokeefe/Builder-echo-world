import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  Target,
  Users,
  TrendingUp,
  Sparkles,
  MessageSquare,
  Lightbulb,
  ChevronRight,
  Star,
  CheckCircle,
  Clock,
  BarChart3,
  Zap,
  Filter,
  Search,
  RefreshCw,
} from "lucide-react";
import { useAudienceStore } from "@/hooks/useAudienceStore";
import {
  aiAudienceEngine,
  AudienceRecommendation,
  NaturalLanguageQuery,
} from "@/services/aiAudienceEngine";
import { useToast } from "@/hooks/use-toast";

const AIRecommendations: React.FC = () => {
  const { toast } = useToast();
  const { audiences, addAudience } = useAudienceStore();
  const [recommendations, setRecommendations] = useState<
    AudienceRecommendation[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nlQuery, setNlQuery] = useState("");
  const [nlResults, setNlResults] = useState<NaturalLanguageQuery | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<
    string | null
  >(null);
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">(
    "all",
  );

  useEffect(() => {
    loadRecommendations();
  }, [audiences]);

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      // Mock campaign data for AI analysis
      const mockCampaignData = [
        {
          campaignId: "camp_1",
          campaignName: "Summer Sale 2024",
          audienceId: audiences[0]?.id || "",
          startDate: "2024-01-01",
          endDate: "2024-01-31",
          impressions: 150000,
          clicks: 4500,
          conversions: 135,
          spend: 6750,
          revenue: 27000,
          roas: 4.0,
          ctr: 3.0,
          conversionRate: 3.0,
        },
      ];

      const recs = await aiAudienceEngine.generateRecommendations(
        audiences,
        mockCampaignData,
      );
      setRecommendations(recs);
    } catch (error) {
      console.error("Failed to load recommendations:", error);
      toast({
        title: "Error",
        description: "Failed to load AI recommendations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNaturalLanguageQuery = async () => {
    if (!nlQuery.trim()) return;

    setIsLoading(true);
    try {
      const results =
        await aiAudienceEngine.analyzeNaturalLanguageQuery(nlQuery);
      setNlResults(results);
    } catch (error) {
      console.error("Failed to process query:", error);
      toast({
        title: "Error",
        description: "Failed to process your query",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImplementRecommendation = async (
    recommendation: AudienceRecommendation,
  ) => {
    try {
      // Create new audience based on recommendation
      const newAudience = {
        id: `audience_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: recommendation.title.replace(/['"]/g, ""),
        size: recommendation.estimatedSize,
        similarity: Math.floor(recommendation.confidence * 100),
        status: "Draft" as const,
        performance: "Medium" as const,
        demographics: recommendation.targetingCriteria.demographics || {},
        targeting: {
          interests: recommendation.targetingCriteria.interests || [],
          behaviors: recommendation.targetingCriteria.behaviors || [],
          locations: recommendation.targetingCriteria.demographics
            ?.locations || ["United States"],
        },
        description: recommendation.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addAudience(newAudience);

      toast({
        title: "Recommendation Implemented",
        description: `Created new audience: ${newAudience.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to implement recommendation",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "expansion":
        return <TrendingUp className="w-4 h-4" />;
      case "similar":
        return <Users className="w-4 h-4" />;
      case "new_segment":
        return <Target className="w-4 h-4" />;
      case "lookalike":
        return <Sparkles className="w-4 h-4" />;
      case "retargeting":
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const filteredRecommendations = recommendations.filter(
    (rec) => filter === "all" || rec.priority === filter,
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-500" />
              AI Recommendations
            </h1>
            <p className="text-gray-600 mt-1">
              Intelligent audience insights and optimization suggestions powered
              by machine learning
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={loadRecommendations}
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recommendations">
              Smart Recommendations
            </TabsTrigger>
            <TabsTrigger value="nlp">Ask AI</TabsTrigger>
            <TabsTrigger value="insights">Audience Insights</TabsTrigger>
            <TabsTrigger value="optimization">
              Campaign Optimization
            </TabsTrigger>
          </TabsList>

          {/* Smart Recommendations */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Label>Filter by priority:</Label>
                <div className="flex gap-2">
                  {["all", "high", "medium", "low"].map((f) => (
                    <Button
                      key={f}
                      variant={filter === f ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter(f as any)}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                {filteredRecommendations.length} recommendations
              </Badge>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecommendations.map((recommendation) => (
                  <motion.div
                    key={recommendation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedRecommendation === recommendation.id
                          ? "ring-2 ring-purple-500"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedRecommendation(
                          selectedRecommendation === recommendation.id
                            ? null
                            : recommendation.id,
                        )
                      }
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(recommendation.type)}
                            <CardTitle className="text-lg">
                              {recommendation.title}
                            </CardTitle>
                          </div>
                          <Badge
                            className={getPriorityColor(
                              recommendation.priority,
                            )}
                          >
                            {recommendation.priority}
                          </Badge>
                        </div>
                        <CardDescription>
                          {recommendation.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Estimated Size</p>
                            <p className="font-semibold">
                              {recommendation.estimatedSize.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Confidence</p>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={recommendation.confidence * 100}
                                className="flex-1 h-2"
                              />
                              <span className="font-semibold">
                                {(recommendation.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Expected CTR</p>
                            <p className="font-semibold text-green-600">
                              {recommendation.expectedPerformance.ctr.toFixed(
                                1,
                              )}
                              %
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Expected ROAS</p>
                            <p className="font-semibold text-green-600">
                              {recommendation.expectedPerformance.roas.toFixed(
                                1,
                              )}
                              x
                            </p>
                          </div>
                        </div>

                        {selectedRecommendation === recommendation.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4 pt-4 border-t"
                          >
                            <div>
                              <h4 className="font-medium text-sm text-gray-700 mb-2">
                                AI Reasoning
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-600">
                                {recommendation.reasoning.map(
                                  (reason, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start gap-2"
                                    >
                                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                      {reason}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-medium text-sm text-gray-700 mb-2">
                                Implementation Steps
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-600">
                                {recommendation.implementationSteps
                                  .slice(0, 3)
                                  .map((step, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start gap-2"
                                    >
                                      <span className="w-4 h-4 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                                        {index + 1}
                                      </span>
                                      {step}
                                    </li>
                                  ))}
                              </ul>
                            </div>

                            <Button
                              className="w-full mt-4"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImplementRecommendation(recommendation);
                              }}
                            >
                              <Zap className="w-4 h-4 mr-2" />
                              Implement Recommendation
                            </Button>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {filteredRecommendations.length === 0 && !isLoading && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No recommendations available
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create some audiences and campaigns to get AI-powered
                    recommendations
                  </p>
                  <Button onClick={loadRecommendations}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate Recommendations
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Natural Language Processing */}
          <TabsContent value="nlp" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Ask AI Assistant
                </CardTitle>
                <CardDescription>
                  Use natural language to query your audience data and get
                  intelligent insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., 'Create an audience of women aged 25-35 interested in fitness'"
                    value={nlQuery}
                    onChange={(e) => setNlQuery(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleNaturalLanguageQuery()
                    }
                    className="flex-1"
                  />
                  <Button
                    onClick={handleNaturalLanguageQuery}
                    disabled={isLoading || !nlQuery.trim()}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Ask AI
                  </Button>
                </div>

                {nlResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        AI Understanding
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Intent:</p>
                          <Badge variant="outline">{nlResults.intent}</Badge>
                        </div>
                        <div>
                          <p className="text-gray-600">Entities Detected:</p>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(nlResults.entities).map(
                              ([key, value]) => (
                                <Badge
                                  key={key}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {key}:{" "}
                                  {typeof value === "object"
                                    ? JSON.stringify(value)
                                    : value}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Suggested Actions
                      </h4>
                      <div className="space-y-2">
                        {nlResults.suggestedActions.map((action, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="text-xs text-gray-500">
                  <h5 className="font-medium mb-1">Example queries:</h5>
                  <ul className="space-y-1">
                    <li>
                      • "Show me my best performing audiences from last month"
                    </li>
                    <li>
                      • "Create a lookalike audience based on high-value
                      customers"
                    </li>
                    <li>• "Which campaigns need optimization?"</li>
                    <li>
                      • "Compare performance between mobile and desktop
                      audiences"
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audience Insights */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {audiences.slice(0, 6).map((audience) => (
                <Card key={audience.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{audience.name}</CardTitle>
                    <CardDescription>
                      {audience.size.toLocaleString()} users •{" "}
                      {audience.performance} performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Engagement Rate</span>
                        <span className="font-medium">8.4%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Growth Rate</span>
                        <span className="font-medium text-green-600">
                          +12.3%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Similarity Score</span>
                        <span className="font-medium">
                          {audience.similarity}%
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">
                        AI Insights
                      </h5>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-start gap-2">
                          <Star className="w-3 h-3 text-yellow-500 mt-0.5" />
                          <span>Peak engagement on weekends</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <TrendingUp className="w-3 h-3 text-green-500 mt-0.5" />
                          <span>Growing 15% faster than similar audiences</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Target className="w-3 h-3 text-blue-500 mt-0.5" />
                          <span>High mobile usage (78%)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Campaign Optimization */}
          <TabsContent value="optimization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  AI Campaign Optimization
                </CardTitle>
                <CardDescription>
                  Intelligent recommendations to improve your campaign
                  performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Coming Soon
                  </h3>
                  <p className="text-gray-600">
                    Advanced AI campaign optimization features are being
                    developed
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIRecommendations;
