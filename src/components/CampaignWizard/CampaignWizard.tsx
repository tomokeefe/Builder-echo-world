import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCampaignWizard } from "@/hooks/useCampaignWizard";
import { StepNavigation } from "./StepNavigation";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { ObjectivesStep } from "./steps/ObjectivesStep";
import { AudienceStep } from "./steps/AudienceStep";
import { BudgetScheduleStep } from "./steps/BudgetScheduleStep";
import { ChannelsStep } from "./steps/ChannelsStep";
import { CreativeStep } from "./steps/CreativeStep";
import { TargetingStep } from "./steps/TargetingStep";
import { ReviewStep } from "./steps/ReviewStep";
import { Campaign } from "@/types/campaign";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Rocket,
} from "lucide-react";

interface CampaignWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCampaign: (
    campaign: Omit<Campaign, "id" | "created" | "updated" | "createdBy">,
  ) => void;
}

export function CampaignWizard({
  open,
  onOpenChange,
  onCreateCampaign,
}: CampaignWizardProps) {
  const {
    currentStep,
    wizardData,
    steps,
    errors,
    isLoading,
    nextStep,
    previousStep,
    goToStep,
    resetWizard,
    canGoNext,
    canGoPrevious,
    isLastStep,
    getCompletionPercentage,
    setIsLoading,
  } = useCampaignWizard();

  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const handleClose = () => {
    if (getCompletionPercentage() > 0) {
      setShowConfirmClose(true);
    } else {
      onOpenChange(false);
      resetWizard();
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmClose(false);
    onOpenChange(false);
    resetWizard();
  };

  const handleFinish = async () => {
    console.log("Starting campaign creation with data:", wizardData);
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Convert wizard data to campaign format
      const campaignData: Omit<
        Campaign,
        "id" | "created" | "updated" | "createdBy"
      > = {
        name: wizardData.name,
        description: wizardData.description,
        status: "draft",
        type: wizardData.type,
        audiences: wizardData.selectedAudiences,
        channels: wizardData.channels.map((channel) => ({
          id: channel.platform,
          platform: channel.platform,
          enabled: channel.enabled,
          budget: wizardData.budget.total * (channel.budgetAllocation / 100),
          budgetType: "total" as const,
          bidStrategy: channel.bidStrategy,
          targeting: channel.targeting,
        })),
        budget: wizardData.budget,
        schedule: wizardData.schedule,
        creative: wizardData.creatives.map((creative) => ({
          id: creative.id,
          type: creative.type,
          name: creative.name,
          headline: creative.headline,
          description: creative.description,
          callToAction: creative.callToAction,
          url: creative.url,
          assets: creative.assets,
          performance: {
            impressions: 0,
            clicks: 0,
            conversions: 0,
            ctr: 0,
            conversionRate: 0,
            cost: 0,
          },
        })),
        targeting: wizardData.targeting,
        objectives: wizardData.objectives,
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
      resetWizard();
    } catch (error) {
      console.error("Failed to create campaign:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (steps[currentStep]?.id) {
      case "basic-info":
        return <BasicInfoStep />;
      case "objectives":
        return <ObjectivesStep />;
      case "audience":
        return <AudienceStep />;
      case "budget-schedule":
        return <BudgetScheduleStep />;
      case "channels":
        return <ChannelsStep />;
      case "creative":
        return <CreativeStep />;
      case "targeting":
        return <TargetingStep />;
      case "review":
        return <ReviewStep />;
      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl">
                  Create New Campaign
                </DialogTitle>
                <DialogDescription>
                  Follow the guided steps to create your marketing campaign
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  Step {currentStep + 1} of {steps.length}
                </Badge>
                <Badge variant="secondary">
                  {getCompletionPercentage()}% Complete
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={getCompletionPercentage()} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Progress</span>
                <span>{getCompletionPercentage()}% complete</span>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px]">
              {/* Step Navigation */}
              <div className="lg:col-span-1">
                <StepNavigation
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={goToStep}
                />
              </div>

              {/* Step Content */}
              <div className="lg:col-span-3">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Step Header */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold">
                            {steps[currentStep]?.title}
                          </h3>
                          {steps[currentStep]?.optional && (
                            <Badge variant="outline">Optional</Badge>
                          )}
                        </div>
                        <p className="text-gray-600">
                          {steps[currentStep]?.description}
                        </p>
                      </div>

                      {/* Step Content */}
                      <div className="min-h-[350px]">{renderCurrentStep()}</div>

                      {/* Step Navigation Buttons */}
                      <div className="flex items-center justify-between pt-6 border-t">
                        <Button
                          variant="outline"
                          onClick={previousStep}
                          disabled={!canGoPrevious() || isLoading}
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Previous
                        </Button>

                        <div className="flex items-center gap-2">
                          {Object.keys(errors).length > 0 && (
                            <div className="flex items-center gap-1 text-red-600 text-sm">
                              <AlertCircle className="w-4 h-4" />
                              Please fix errors before continuing
                            </div>
                          )}
                        </div>

                        {isLastStep ? (
                          <Button
                            onClick={handleFinish}
                            disabled={
                              isLoading || Object.keys(errors).length > 0
                            }
                          >
                            {isLoading ? (
                              <>
                                <Clock className="w-4 h-4 mr-2 animate-spin" />
                                Creating Campaign...
                              </>
                            ) : (
                              <>
                                <Rocket className="w-4 h-4 mr-2" />
                                Launch Campaign
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            onClick={nextStep}
                            disabled={!canGoNext() || isLoading}
                          >
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Close Dialog */}
      <Dialog open={showConfirmClose} onOpenChange={setShowConfirmClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes in your campaign. Are you sure you want
              to close the wizard? All progress will be lost.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmClose(false)}
            >
              Continue Editing
            </Button>
            <Button variant="destructive" onClick={handleConfirmClose}>
              Discard Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
