import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCampaignWizard } from "@/hooks/useCampaignWizard";
import { WizardChannel } from "@/types/campaignWizard";
import {
  ExternalLink,
  Globe,
  Mail,
  Smartphone,
  Linkedin,
  Twitter,
  Instagram,
  Settings,
  TrendingUp,
} from "lucide-react";

export function ChannelsStep() {
  const { wizardData, updateWizardData, errors } = useCampaignWizard();

  const availableChannels = [
    {
      platform: "facebook" as const,
      name: "Facebook Ads",
      description: "Reach billions of users on Facebook and Instagram",
      icon: ExternalLink,
      color: "bg-blue-600",
      strengths: ["Detailed targeting", "Large audience", "Visual content"],
      recommended: ["awareness", "consideration", "conversion"],
      avgCPC: "$0.50 - $2.00",
      audienceSize: "2.8B+",
    },
    {
      platform: "google" as const,
      name: "Google Ads",
      description: "Target users searching for your products",
      icon: Globe,
      color: "bg-red-500",
      strengths: ["High intent", "Search targeting", "Shopping ads"],
      recommended: ["consideration", "conversion"],
      avgCPC: "$1.00 - $5.00",
      audienceSize: "4B+",
    },
    {
      platform: "instagram" as const,
      name: "Instagram Ads",
      description: "Engage with visual content on Instagram",
      icon: Instagram,
      color: "bg-pink-500",
      strengths: ["Visual appeal", "Young demographics", "Stories"],
      recommended: ["awareness", "consideration"],
      avgCPC: "$0.40 - $1.50",
      audienceSize: "1.4B+",
    },
    {
      platform: "linkedin" as const,
      name: "LinkedIn Ads",
      description: "Target professionals and B2B audiences",
      icon: Linkedin,
      color: "bg-blue-700",
      strengths: ["B2B targeting", "Professional context", "High value"],
      recommended: ["consideration", "conversion"],
      avgCPC: "$2.00 - $8.00",
      audienceSize: "900M+",
    },
    {
      platform: "twitter" as const,
      name: "Twitter Ads",
      description: "Engage in real-time conversations",
      icon: Twitter,
      color: "bg-sky-500",
      strengths: ["Real-time", "Trending topics", "Engagement"],
      recommended: ["awareness", "consideration"],
      avgCPC: "$0.30 - $1.20",
      audienceSize: "450M+",
    },
    {
      platform: "email" as const,
      name: "Email Marketing",
      description: "Direct communication with your audience",
      icon: Mail,
      color: "bg-green-600",
      strengths: ["Direct reach", "Personalization", "High ROI"],
      recommended: ["retention", "conversion"],
      avgCPC: "$0.10 - $0.50",
      audienceSize: "Your list",
    },
  ];

  const toggleChannel = (platform: WizardChannel["platform"]) => {
    const existingChannels = wizardData.channels || [];
    const existingChannel = existingChannels.find(
      (c) => c.platform === platform,
    );

    if (existingChannel) {
      // Toggle existing channel
      const updatedChannels = existingChannels.map((c) =>
        c.platform === platform ? { ...c, enabled: !c.enabled } : c,
      );
      updateWizardData({ channels: updatedChannels });
    } else {
      // Add new channel
      const newChannel: WizardChannel = {
        platform,
        enabled: true,
        budgetAllocation: calculateDefaultBudgetAllocation(),
        bidStrategy: "automatic",
        targeting: {
          platformSpecific: {},
          customAudiences: [],
          lookalikePools: [],
        },
      };
      updateWizardData({ channels: [...existingChannels, newChannel] });
    }
  };

  const calculateDefaultBudgetAllocation = () => {
    const enabledChannels =
      wizardData.channels?.filter((c) => c.enabled).length || 0;
    return Math.floor(100 / (enabledChannels + 1));
  };

  const updateBudgetAllocation = (
    platform: WizardChannel["platform"],
    allocation: number,
  ) => {
    const updatedChannels = wizardData.channels.map((c) =>
      c.platform === platform ? { ...c, budgetAllocation: allocation } : c,
    );
    updateWizardData({ channels: updatedChannels });
  };

  const getTotalAllocation = () => {
    return (
      wizardData.channels?.reduce(
        (sum, channel) =>
          channel.enabled ? sum + channel.budgetAllocation : sum,
        0,
      ) || 0
    );
  };

  const getChannelBudget = (channel: WizardChannel) => {
    return (wizardData.budget.total * channel.budgetAllocation) / 100;
  };

  const isChannelEnabled = (platform: WizardChannel["platform"]) => {
    return (
      wizardData.channels?.find((c) => c.platform === platform)?.enabled ||
      false
    );
  };

  const getChannelConfig = (platform: WizardChannel["platform"]) => {
    return wizardData.channels?.find((c) => c.platform === platform);
  };

  const recommendedChannels = availableChannels.filter((channel) =>
    channel.recommended.includes(wizardData.type),
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: wizardData.budget.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium mb-2">
          Select Advertising Channels
        </h3>
        <p className="text-gray-600 text-sm">
          Choose the platforms where you want to run your campaign. You can
          distribute your budget across multiple channels.
        </p>
        {errors.channels && (
          <p className="text-sm text-red-600 mt-2">{errors.channels}</p>
        )}
      </div>

      {/* Recommended Channels */}
      {recommendedChannels.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recommended for{" "}
              {wizardData.type?.charAt(0).toUpperCase() +
                wizardData.type?.slice(1)}{" "}
              Campaigns
            </CardTitle>
            <CardDescription>
              These channels perform well for your campaign type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendedChannels.map((channel) => (
                <div
                  key={channel.platform}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:shadow-sm"
                  onClick={() => toggleChannel(channel.platform)}
                >
                  <div
                    className={`w-8 h-8 ${channel.color} rounded-lg flex items-center justify-center`}
                  >
                    <channel.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{channel.name}</p>
                    <p className="text-xs text-gray-600">
                      {channel.avgCPC} CPC
                    </p>
                  </div>
                  {isChannelEnabled(channel.platform) && (
                    <Badge className="bg-primary text-white">Selected</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableChannels.map((channel) => {
          const isEnabled = isChannelEnabled(channel.platform);
          const channelConfig = getChannelConfig(channel.platform);

          return (
            <Card
              key={channel.platform}
              className={`transition-all ${
                isEnabled
                  ? "ring-2 ring-primary border-primary"
                  : "border-gray-200"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 ${channel.color} rounded-lg flex items-center justify-center`}
                    >
                      <channel.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {channel.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {channel.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => toggleChannel(channel.platform)}
                  />
                </div>
              </CardHeader>

              {isEnabled && (
                <CardContent className="space-y-4">
                  {/* Budget Allocation */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Budget Allocation</Label>
                      <span className="text-sm font-medium">
                        {channelConfig?.budgetAllocation || 0}% (
                        {formatCurrency(getChannelBudget(channelConfig!))})
                      </span>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={channelConfig?.budgetAllocation || 0}
                      onChange={(e) =>
                        updateBudgetAllocation(
                          channel.platform,
                          Number(e.target.value),
                        )
                      }
                      className="w-full"
                    />
                    <Progress
                      value={channelConfig?.budgetAllocation || 0}
                      className="h-2"
                    />
                  </div>

                  {/* Channel Details */}
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-sm mb-2">Strengths</h5>
                      <div className="flex flex-wrap gap-1">
                        {channel.strengths.map((strength, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Avg. CPC:</span>
                        <span className="font-medium ml-1">
                          {channel.avgCPC}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Audience:</span>
                        <span className="font-medium ml-1">
                          {channel.audienceSize}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Platform Settings */}
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure {channel.name}
                  </Button>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Budget Distribution Summary */}
      {wizardData.channels?.some((c) => c.enabled) && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base">Budget Distribution</CardTitle>
            <CardDescription>
              Total allocation: {getTotalAllocation()}%
              {getTotalAllocation() !== 100 && (
                <span className="text-red-600 ml-2">
                  (Adjust to reach 100%)
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {wizardData.channels
                ?.filter((c) => c.enabled)
                .map((channel) => {
                  const channelInfo = availableChannels.find(
                    (c) => c.platform === channel.platform,
                  );
                  return (
                    <div
                      key={channel.platform}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 ${channelInfo?.color} rounded`}
                        />
                        <span className="font-medium text-sm">
                          {channelInfo?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {channel.budgetAllocation}%
                        </span>
                        <span className="text-sm font-medium">
                          {formatCurrency(getChannelBudget(channel))}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
