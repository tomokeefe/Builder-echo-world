import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCampaignWizard } from "@/hooks/useCampaignWizard";
import { Badge } from "@/components/ui/badge";
import { Target, Users, TrendingUp, Heart } from "lucide-react";

export function BasicInfoStep() {
  const { wizardData, updateWizardData, errors } = useCampaignWizard();

  const campaignTypes = [
    {
      value: "awareness",
      label: "Brand Awareness",
      description: "Increase brand recognition and reach new audiences",
      icon: TrendingUp,
      color: "bg-blue-500",
    },
    {
      value: "consideration",
      label: "Consideration",
      description: "Drive interest and consideration for your products",
      icon: Users,
      color: "bg-green-500",
    },
    {
      value: "conversion",
      label: "Conversion",
      description: "Drive purchases, sign-ups, or other valuable actions",
      icon: Target,
      color: "bg-purple-500",
    },
    {
      value: "retention",
      label: "Customer Retention",
      description: "Re-engage existing customers and increase loyalty",
      icon: Heart,
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Campaign Name */}
      <div className="space-y-2">
        <Label htmlFor="campaign-name">Campaign Name *</Label>
        <Input
          id="campaign-name"
          placeholder="Enter campaign name"
          value={wizardData.name}
          onChange={(e) => updateWizardData({ name: e.target.value })}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Campaign Description */}
      <div className="space-y-2">
        <Label htmlFor="campaign-description">Campaign Description</Label>
        <Textarea
          id="campaign-description"
          placeholder="Describe your campaign goals and target audience..."
          value={wizardData.description}
          onChange={(e) => updateWizardData({ description: e.target.value })}
          className="resize-none"
          rows={3}
        />
        <p className="text-sm text-gray-500">
          Optional but helpful for team collaboration and future reference
        </p>
      </div>

      {/* Campaign Type */}
      <div className="space-y-3">
        <Label>Campaign Type *</Label>
        {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {campaignTypes.map((type) => (
            <Card
              key={type.value}
              className={`cursor-pointer transition-all hover:shadow-md ${
                wizardData.type === type.value
                  ? "ring-2 ring-primary border-primary"
                  : "border-gray-200"
              }`}
              onClick={() => updateWizardData({ type: type.value as any })}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 ${type.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <type.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{type.label}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                  {wizardData.type === type.value && (
                    <Badge className="bg-primary text-white">Selected</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Campaign Type Benefits */}
      {wizardData.type && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">
              {campaignTypes.find((t) => t.value === wizardData.type)?.label}{" "}
              Campaign Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {wizardData.type === "awareness" && (
                <>
                  <p>• Maximize reach and brand visibility</p>
                  <p>• Build brand recognition in new markets</p>
                  <p>• Optimize for impressions and reach metrics</p>
                </>
              )}
              {wizardData.type === "consideration" && (
                <>
                  <p>• Drive traffic to your website or landing pages</p>
                  <p>• Increase engagement with your content</p>
                  <p>• Build interest in your products or services</p>
                </>
              )}
              {wizardData.type === "conversion" && (
                <>
                  <p>• Drive purchases, sign-ups, or downloads</p>
                  <p>• Optimize for cost-per-acquisition</p>
                  <p>• Track and measure ROI effectively</p>
                </>
              )}
              {wizardData.type === "retention" && (
                <>
                  <p>• Re-engage existing customers</p>
                  <p>• Increase customer lifetime value</p>
                  <p>• Build long-term customer relationships</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
