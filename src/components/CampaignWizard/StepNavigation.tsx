import { WizardStep } from "@/types/campaignWizard";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepNavigationProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
}

export function StepNavigation({
  steps,
  currentStep,
  onStepClick,
}: StepNavigationProps) {
  const canAccessStep = (stepIndex: number) => {
    // Can always access current step and previous steps
    if (stepIndex <= currentStep) return true;

    // Can access next step if current step is completed
    if (stepIndex === currentStep + 1 && steps[currentStep]?.completed)
      return true;

    return false;
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-900 mb-4">Campaign Setup</h4>

      {steps.map((step, index) => {
        const isCurrent = index === currentStep;
        const isCompleted = step.completed;
        const canAccess = canAccessStep(index);
        const isPast = index < currentStep;

        return (
          <div
            key={step.id}
            className={cn(
              "relative flex items-start p-3 rounded-lg transition-all cursor-pointer",
              isCurrent && "bg-primary/5 border border-primary/20",
              !isCurrent && canAccess && "hover:bg-gray-50",
              !canAccess && "opacity-50 cursor-not-allowed",
            )}
            onClick={() => canAccess && onStepClick(index)}
          >
            {/* Step Number/Status Icon */}
            <div className="flex-shrink-0 mr-3 mt-0.5">
              {isCompleted ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : canAccess ? (
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-medium",
                    isCurrent
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 text-gray-500",
                  )}
                >
                  {index + 1}
                </div>
              ) : (
                <Lock className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h5
                  className={cn(
                    "text-sm font-medium truncate",
                    isCurrent ? "text-primary" : "text-gray-900",
                  )}
                >
                  {step.title}
                </h5>
                {step.optional && (
                  <Badge variant="outline" className="text-xs">
                    Optional
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">
                {step.description}
              </p>
            </div>

            {/* Current Step Indicator */}
            {isCurrent && (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
            )}
          </div>
        );
      })}

      {/* Progress Summary */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600">
          <div className="flex justify-between mb-1">
            <span>Completed Steps</span>
            <span>
              {steps.filter((s) => s.completed).length} / {steps.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Required Steps</span>
            <span>{steps.filter((s) => !s.optional).length} required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
