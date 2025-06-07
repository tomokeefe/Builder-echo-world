import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCampaignWizard } from "@/hooks/useCampaignWizard";
import { useAudienceStore } from "@/hooks/useAudienceStore";
import {
  CheckCircle,
  AlertTriangle,
  Target,
  Users,
  DollarSign,
  Calendar,
  Zap,
  Globe,
  Image,
  Settings,
  ExternalLink,
} from "lucide-react";

export function ReviewStep() {
  const { wizardData } = useCampaignWizard();
  const { getAudience } = useAudienceStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: wizardData.budget.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const getDurationInDays = () => {
    if (!wizardData.schedule.endDate) return "Ongoing";
    const start = new Date(wizardData.schedule.startDate);
    const end = new Date(wizardData.schedule.endDate);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    return `${days} days`;
  };

  const getEstimatedPerformance = () => {
    const reach = wizardData.estimatedReach || 0;
    const budget = wizardData.budget.total;

    // Simple performance estimates
    return {
      impressions: Math.floor(reach * 2.5),
      clicks: Math.floor(reach * 0.03),
      conversions: Math.floor(reach * 0.002),
      cpm: budget > 0 ? Math.floor((budget / reach) * 1000) : 0,
      cpc: budget > 0 ? Math.floor(budget / (reach * 0.03)) : 0,
      estimatedRevenue: budget * 3.2, // Assuming 3.2x ROAS
    };
  };

  const performance = getEstimatedPerformance();

  const validationChecks = [
    {
      key: "basicInfo",
      label: "Campaign Information",
      valid: !!(wizardData.name && wizardData.type),
      message:
        wizardData.name && wizardData.type
          ? "Complete"
          : "Missing name or type",
    },
    {
      key: "objectives",
      label: "Campaign Objectives",
      valid: wizardData.objectives.length > 0,
      message:
        wizardData.objectives.length > 0
          ? `${wizardData.objectives.length} objectives set`
          : "No objectives defined",
    },
    {
      key: "audiences",
      label: "Target Audiences",
      valid: wizardData.selectedAudiences.length > 0,
      message:
        wizardData.selectedAudiences.length > 0
          ? `${wizardData.selectedAudiences.length} audiences selected`
          : "No audiences selected",
    },
    {
      key: "budget",
      label: "Budget & Schedule",
      valid: !!(wizardData.budget.total > 0 && wizardData.schedule.startDate),
      message:
        wizardData.budget.total > 0 && wizardData.schedule.startDate
          ? "Budget and schedule configured"
          : "Missing budget or start date",
    },
    {
      key: "channels",
      label: "Advertising Channels",
      valid: wizardData.channels?.some((c) => c.enabled) || false,
      message: wizardData.channels?.some((c) => c.enabled)
        ? `${wizardData.channels.filter((c) => c.enabled).length} channels selected`
        : "No channels selected",
    },
  ];

  const allValid = validationChecks.every((check) => check.valid);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium mb-2">Review & Launch Campaign</h3>
        <p className="text-gray-600 text-sm">
          Review all campaign settings before launching. You can edit these
          settings after launch.
        </p>
      </div>

      {/* Validation Status */}
      <Card
        className={
          allValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
        }
      >
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            {allValid ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
            Campaign Readiness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {validationChecks.map((check) => (
              <div
                key={check.key}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {check.valid ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="font-medium text-sm">{check.label}</span>
                </div>
                <span
                  className={`text-sm ${check.valid ? "text-green-600" : "text-red-600"}`}
                >
                  {check.message}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-5 h-5" />
              Campaign Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Name:</span>
              <p className="font-medium">
                {wizardData.name || "Untitled Campaign"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Type:</span>
              <Badge variant="outline" className="ml-2">
                {wizardData.type?.charAt(0).toUpperCase() +
                  wizardData.type?.slice(1)}
              </Badge>
            </div>
            {wizardData.description && (
              <div>
                <span className="text-sm text-gray-600">Description:</span>
                <p className="text-sm">{wizardData.description}</p>
              </div>
            )}
            <div>
              <span className="text-sm text-gray-600">Objectives:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {wizardData.objectives.map((obj, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {obj.type}: {obj.target} {obj.unit}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Target Audiences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-5 h-5" />
              Target Audiences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Selected Audiences:</span>
              <div className="space-y-2 mt-2">
                {wizardData.selectedAudiences.map((audienceId) => {
                  const audience = getAudience(audienceId);
                  return audience ? (
                    <div
                      key={audienceId}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="font-medium">{audience.name}</span>
                      <span className="text-gray-600">
                        {formatNumber(audience.size)}
                      </span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">
                Estimated Total Reach:
              </span>
              <p className="font-medium text-lg">
                {formatNumber(wizardData.estimatedReach || 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Budget & Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Budget & Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Total Budget:</span>
                <p className="font-medium">
                  {formatCurrency(wizardData.budget.total)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Daily Budget:</span>
                <p className="font-medium">
                  {formatCurrency(wizardData.budget.daily)}
                </p>
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Duration:</span>
              <p className="font-medium">{getDurationInDays()}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Start Date:</span>
              <p className="font-medium">
                {wizardData.schedule.startDate
                  ? new Date(wizardData.schedule.startDate).toLocaleDateString()
                  : "Not set"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Optimization Goal:</span>
              <Badge variant="outline" className="ml-2">
                {wizardData.budget.optimizationGoal?.charAt(0).toUpperCase() +
                  wizardData.budget.optimizationGoal?.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Channels */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Advertising Channels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {wizardData.channels
              ?.filter((c) => c.enabled)
              .map((channel) => (
                <div
                  key={channel.platform}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    <span className="font-medium text-sm capitalize">
                      {channel.platform}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {channel.budgetAllocation}%
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatCurrency(
                        (wizardData.budget.total * channel.budgetAllocation) /
                          100,
                      )}
                    </p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Performance Estimates */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Performance Estimates
          </CardTitle>
          <CardDescription>
            Projected performance based on your settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">
                {formatNumber(performance.impressions)}
              </div>
              <div className="text-sm text-gray-600">Impressions</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {formatNumber(performance.clicks)}
              </div>
              <div className="text-sm text-gray-600">Clicks</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {formatNumber(performance.conversions)}
              </div>
              <div className="text-sm text-gray-600">Conversions</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(performance.cpm)}
              </div>
              <div className="text-sm text-gray-600">Est. CPM</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(performance.cpc)}
              </div>
              <div className="text-sm text-gray-600">Est. CPC</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(performance.estimatedRevenue)}
              </div>
              <div className="text-sm text-gray-600">Est. Revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Targeting Summary */}
      {(wizardData.targeting.locations.length > 0 ||
        wizardData.targeting.interests.length > 0 ||
        wizardData.targeting.behaviors.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Advanced Targeting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {wizardData.targeting.locations.length > 0 && (
              <div>
                <span className="text-sm text-gray-600">Locations:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {wizardData.targeting.locations.map((location) => (
                    <Badge key={location} variant="outline" className="text-xs">
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {wizardData.targeting.interests.length > 0 && (
              <div>
                <span className="text-sm text-gray-600">Interests:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {wizardData.targeting.interests
                    .slice(0, 5)
                    .map((interest) => (
                      <Badge
                        key={interest}
                        variant="outline"
                        className="text-xs"
                      >
                        {interest}
                      </Badge>
                    ))}
                  {wizardData.targeting.interests.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{wizardData.targeting.interests.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
            {wizardData.targeting.behaviors.length > 0 && (
              <div>
                <span className="text-sm text-gray-600">Behaviors:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {wizardData.targeting.behaviors
                    .slice(0, 5)
                    .map((behavior) => (
                      <Badge
                        key={behavior}
                        variant="outline"
                        className="text-xs"
                      >
                        {behavior}
                      </Badge>
                    ))}
                  {wizardData.targeting.behaviors.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{wizardData.targeting.behaviors.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Creative Assets */}
      {wizardData.creatives && wizardData.creatives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Image className="w-5 h-5" />
              Creative Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {wizardData.creatives.map((creative, index) => (
                <div
                  key={creative.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {creative.name || `Creative ${index + 1}`}
                    </p>
                    <p className="text-xs text-gray-600">
                      {creative.type} • {creative.headline}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {creative.channels.length} channels
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warnings */}
      {!allValid && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please complete all required sections before launching your
            campaign. Missing requirements are highlighted above.
          </AlertDescription>
        </Alert>
      )}

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Ready to launch!</strong> Your campaign will be created in
          draft status. You can make final adjustments before activating it.
        </AlertDescription>
      </Alert>
    </div>
  );
}
