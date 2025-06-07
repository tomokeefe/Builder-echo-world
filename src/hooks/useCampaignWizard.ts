import { useState, useCallback } from "react";
import {
  CampaignWizardData,
  WizardStep,
  WIZARD_STEPS,
} from "@/types/campaignWizard";

const initialWizardData: CampaignWizardData = {
  name: "",
  description: "",
  type: "awareness",
  objectives: [],
  selectedAudiences: [],
  estimatedReach: 0,
  budget: {
    total: 0,
    daily: 0,
    currency: "USD",
    optimizationGoal: "impressions",
  },
  schedule: {
    startDate: "",
    timezone: "UTC",
    frequency: { impressions: 3, period: "day" },
  },
  channels: [],
  creatives: [],
  targeting: {
    locations: [],
    languages: ["en"],
    devices: ["desktop", "mobile"],
    demographics: {
      ageMin: 18,
      ageMax: 65,
      genders: ["all"],
      incomes: [],
    },
    interests: [],
    behaviors: [],
    exclusions: {
      audiences: [],
      interests: [],
      behaviors: [],
    },
  },
  approvals: [],
};

export const useCampaignWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] =
    useState<CampaignWizardData>(initialWizardData);
  const [steps, setSteps] = useState<WizardStep[]>(WIZARD_STEPS);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateWizardData = useCallback(
    (updates: Partial<CampaignWizardData>) => {
      setWizardData((prev) => ({ ...prev, ...updates }));
    },
    [],
  );

  const updateStepCompletion = useCallback(
    (stepIndex: number, completed: boolean) => {
      setSteps((prev) =>
        prev.map((step, index) =>
          index === stepIndex ? { ...step, completed } : step,
        ),
      );
    },
    [],
  );

  const validateStep = useCallback(
    (stepIndex: number): boolean => {
      const step = steps[stepIndex];
      const newErrors: Record<string, string> = {};

      switch (step.id) {
        case "basic-info":
          if (!wizardData.name.trim()) {
            newErrors.name = "Campaign name is required";
          }
          if (!wizardData.type) {
            newErrors.type = "Campaign type is required";
          }
          break;

        case "objectives":
          if (wizardData.objectives.length === 0) {
            newErrors.objectives = "At least one objective is required";
          }
          break;

        case "audience":
          if (wizardData.selectedAudiences.length === 0) {
            newErrors.audiences = "At least one audience must be selected";
          }
          break;

        case "budget-schedule":
          if (wizardData.budget.total <= 0) {
            newErrors.budget = "Budget must be greater than 0";
          }
          if (!wizardData.schedule.startDate) {
            newErrors.startDate = "Start date is required";
          }
          break;

        case "channels":
          if (wizardData.channels.filter((c) => c.enabled).length === 0) {
            newErrors.channels = "At least one channel must be selected";
          }
          break;

        case "targeting":
          if (wizardData.targeting.locations.length === 0) {
            newErrors.locations = "At least one location must be selected";
          }
          break;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [wizardData, steps],
  );

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      updateStepCompletion(currentStep, true);
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  }, [currentStep, steps.length, validateStep, updateStepCompletion]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= 0 && stepIndex < steps.length) {
        setCurrentStep(stepIndex);
      }
    },
    [steps.length],
  );

  const resetWizard = useCallback(() => {
    setCurrentStep(0);
    setWizardData(initialWizardData);
    setSteps(WIZARD_STEPS);
    setErrors({});
  }, []);

  const canGoNext = useCallback(() => {
    return currentStep < steps.length - 1;
  }, [currentStep, steps.length]);

  const canGoPrevious = useCallback(() => {
    return currentStep > 0;
  }, [currentStep]);

  const isStepValid = useCallback(
    (stepIndex: number) => {
      return steps[stepIndex]?.completed || false;
    },
    [steps],
  );

  const getCompletionPercentage = useCallback(() => {
    const completedSteps = steps.filter((step) => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  }, [steps]);

  const estimateReach = useCallback(() => {
    // Simple reach estimation based on audience selection and targeting
    const baseReach = wizardData.selectedAudiences.length * 500000; // 500k per audience
    const locationMultiplier =
      wizardData.targeting.locations.length > 0
        ? Math.min(wizardData.targeting.locations.length * 0.3, 1)
        : 1;
    const deviceMultiplier = wizardData.targeting.devices.length / 3; // 3 total devices

    const estimatedReach = Math.floor(
      baseReach * locationMultiplier * deviceMultiplier,
    );

    setWizardData((prev) => ({ ...prev, estimatedReach }));
    return estimatedReach;
  }, [wizardData.selectedAudiences, wizardData.targeting]);

  const calculateBudgetSuggestions = useCallback(() => {
    const reach = wizardData.estimatedReach || estimateReach();
    const channelCount =
      wizardData.channels.filter((c) => c.enabled).length || 1;

    // Basic budget suggestions
    const costPerMille =
      wizardData.type === "awareness"
        ? 5
        : wizardData.type === "consideration"
          ? 8
          : 12;

    const suggestedDaily = Math.ceil(((reach / 1000) * costPerMille) / 30);
    const suggestedTotal = suggestedDaily * 30;

    return {
      conservative: {
        daily: Math.floor(suggestedDaily * 0.7),
        total: Math.floor(suggestedTotal * 0.7),
      },
      recommended: {
        daily: suggestedDaily,
        total: suggestedTotal,
      },
      aggressive: {
        daily: Math.ceil(suggestedDaily * 1.5),
        total: Math.ceil(suggestedTotal * 1.5),
      },
    };
  }, [
    wizardData.estimatedReach,
    wizardData.type,
    wizardData.channels,
    estimateReach,
  ]);

  return {
    // State
    currentStep,
    wizardData,
    steps,
    isLoading,
    errors,

    // Actions
    updateWizardData,
    nextStep,
    previousStep,
    goToStep,
    resetWizard,
    setIsLoading,

    // Helpers
    canGoNext,
    canGoPrevious,
    isStepValid,
    validateStep,
    getCompletionPercentage,
    estimateReach,
    calculateBudgetSuggestions,

    // Current step info
    currentStepData: steps[currentStep],
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
  };
};
