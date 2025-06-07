import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Campaign } from "@/types/campaign";
import {
  Rocket,
  ArrowRight,
  ArrowLeft,
  Target,
  DollarSign,
  Calendar,
} from "lucide-react";

interface SimpleCampaignWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCampaign: (
    campaign: Omit<Campaign, "id" | "created" | "updated" | "createdBy">,
  ) => void;
}

export function SimpleCampaignWizard({
  open,
  onOpenChange,
  onCreateCampaign,
}: SimpleCampaignWizardProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "awareness" as const,
    budget: 5000,
    dailyBudget: 250,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    objective: "awareness" as const,
    target: 100000,
  });

  const steps = [
    { title: "Basic Info", description: "Campaign name and type" },
    { title: "Budget & Schedule", description: "Set budget and dates" },
    { title: "Objectives", description: "Define your goals" },
    { title: "Review & Launch", description: "Final review" },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);

    try {
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const campaignData: Omit<
        Campaign,
        "id" | "created" | "updated" | "createdBy"
      > = {
        name: formData.name,
        description: formData.description,
        status: "draft",
        type: formData.type,
        audiences: [],
        channels: [],
        budget: {
          total: formData.budget,
          daily: formData.dailyBudget,
          spent: 0,
          remaining: formData.budget,
          currency: "USD",
          optimizationGoal: "impressions",
        },
        schedule: {
          startDate: formData.startDate,
          endDate: formData.endDate || undefined,
          timezone: "UTC",
          frequency: { impressions: 3, period: "day" },
        },
        creative: [],
        targeting: {
          locations: ["US"],
          languages: ["en"],
          devices: ["desktop", "mobile"],
          operatingSystems: [],
          browsers: [],
          interests: [],
          behaviors: [],
          demographics: {
            ageMin: 18,
            ageMax: 65,
            genders: ["all"],
            incomes: [],
          },
          exclusions: { audiences: [], interests: [], behaviors: [] },
        },
        objectives: [
          {
            type: formData.objective,
            target: formData.target,
            current: 0,
            unit:
              formData.objective === "awareness"
                ? "impressions"
                : "conversions",
          },
        ],
        performance: {
          impressions: 0,
          reach: 0,
          clicks: 0,
          conversions: 0,
          spend: 0,
          revenue: 0,
          roas: 0,
          ctr: 0,
          cpm: 0,
          cpc: 0,
          cpa: 0,
          conversionRate: 0,
          frequency: 0,
          qualityScore: 0,
        },
      };

      onCreateCampaign(campaignData);
      onOpenChange(false);

      // Reset form
      setCurrentStep(0);
      setFormData({
        name: "",
        description: "",
        type: "awareness",
        budget: 5000,
        dailyBudget: 250,
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        objective: "awareness",
        target: 100000,
      });
    } catch (error) {
      toast({
        title: "Error Creating Campaign",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Campaign Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter campaign name"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe your campaign"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Campaign Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="awareness">Brand Awareness</SelectItem>
                  <SelectItem value="consideration">Consideration</SelectItem>
                  <SelectItem value="conversion">Conversion</SelectItem>
                  <SelectItem value="retention">Retention</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Budget *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) =>
                      handleInputChange("budget", Number(e.target.value))
                    }
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Daily Budget</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    type="number"
                    value={formData.dailyBudget}
                    onChange={(e) =>
                      handleInputChange("dailyBudget", Number(e.target.value))
                    }
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  min={formData.startDate}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Campaign Objective *</Label>
              <Select
                value={formData.objective}
                onValueChange={(value) => handleInputChange("objective", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="awareness">Brand Awareness</SelectItem>
                  <SelectItem value="traffic">Website Traffic</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="leads">Lead Generation</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Goal</Label>
              <Input
                type="number"
                value={formData.target}
                onChange={(e) =>
                  handleInputChange("target", Number(e.target.value))
                }
                placeholder="Enter target number"
              />
              <p className="text-sm text-gray-500">
                {formData.objective === "awareness"
                  ? "Target impressions"
                  : "Target conversions"}
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Campaign Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm text-gray-600">Name:</span>
                  <p className="font-medium">{formData.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Type:</span>
                  <Badge variant="outline" className="ml-2">
                    {formData.type.charAt(0).toUpperCase() +
                      formData.type.slice(1)}
                  </Badge>
                </div>
                {formData.description && (
                  <div>
                    <span className="text-sm text-gray-600">Description:</span>
                    <p className="text-sm">{formData.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Budget & Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Budget:</span>
                  <span className="font-medium">
                    ${formData.budget.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Daily Budget:</span>
                  <span className="font-medium">
                    ${formData.dailyBudget.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Start Date:</span>
                  <span className="font-medium">
                    {new Date(formData.startDate).toLocaleDateString()}
                  </span>
                </div>
                {formData.endDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">End Date:</span>
                    <span className="font-medium">
                      {new Date(formData.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim() !== "" && formData.type !== "";
      case 1:
        return formData.budget > 0 && formData.startDate !== "";
      case 2:
        return formData.objective !== "" && formData.target > 0;
      default:
        return true;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Campaign</DialogTitle>
          <DialogDescription>
            Follow the steps to create your marketing campaign
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>
                Step {currentStep + 1} of {steps.length}
              </span>
              <span>
                {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
              </span>
            </div>
            <Progress
              value={((currentStep + 1) / steps.length) * 100}
              className="h-2"
            />
          </div>

          {/* Step Title */}
          <div>
            <h3 className="text-lg font-medium">{steps[currentStep].title}</h3>
            <p className="text-gray-600 text-sm">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">{renderStep()}</div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0 || isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleFinish}
                disabled={!canProceed() || isLoading}
              >
                {isLoading ? (
                  "Creating Campaign..."
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Create Campaign
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={nextStep} disabled={!canProceed() || isLoading}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
