import React from "react";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position?: "top" | "bottom" | "left" | "right";
  onComplete?: () => void;
}

export interface OnboardingTour {
  id: string;
  name: string;
  steps: OnboardingStep[];
  autoStart?: boolean;
  skippable?: boolean;
}

export interface OnboardingState {
  isActive: boolean;
  activeTour: string | null;
  currentStepIndex: number;
  completedTours: string[];
  skippedTours: string[];
}

// Mock tours data
const tours: Record<string, OnboardingTour> = {
  "dashboard-tour": {
    id: "dashboard-tour",
    name: "Dashboard Overview",
    autoStart: true,
    skippable: true,
    steps: [
      {
        id: "welcome",
        title: "Welcome to Skydeo!",
        description: "Let's take a quick tour of your marketing dashboard.",
        target: '[data-tour="dashboard-header"]',
        position: "bottom",
      },
      {
        id: "metrics",
        title: "Performance Metrics",
        description:
          "Here you can see your key performance indicators at a glance.",
        target: '[data-tour="dashboard-metrics"]',
        position: "bottom",
      },
      {
        id: "charts",
        title: "Analytics Charts",
        description:
          "Interactive charts show your campaign performance over time.",
        target: '[data-tour="dashboard-charts"]',
        position: "top",
      },
      {
        id: "campaigns",
        title: "Recent Campaigns",
        description: "Quick overview of your most recent campaign activities.",
        target: '[data-tour="dashboard-campaigns"]',
        position: "top",
      },
    ],
  },
  "collaboration-tour": {
    id: "collaboration-tour",
    name: "Team Collaboration",
    autoStart: false,
    skippable: true,
    steps: [
      {
        id: "collaboration-intro",
        title: "Team Collaboration Hub",
        description:
          "Communicate and collaborate with your team members effectively.",
        target: '[data-tour="collaboration-header"]',
        position: "bottom",
      },
      {
        id: "collaboration-tabs",
        title: "Workspace Tabs",
        description:
          "Switch between comments and tasks to manage your team workflow.",
        target: '[data-tour="collaboration-tabs"]',
        position: "bottom",
      },
      {
        id: "collaboration-team",
        title: "Team Members",
        description: "See who's online and their current status.",
        target: '[data-tour="collaboration-team"]',
        position: "left",
      },
      {
        id: "collaboration-notifications",
        title: "Stay Updated",
        description:
          "Get notified about mentions, tasks, and important updates.",
        target: '[data-tour="collaboration-notifications"]',
        position: "left",
      },
    ],
  },
  "api-docs-tour": {
    id: "api-docs-tour",
    name: "API Documentation",
    autoStart: false,
    skippable: true,
    steps: [
      {
        id: "api-intro",
        title: "API Documentation",
        description: "Everything you need to integrate with Skydeo APIs.",
        target: '[data-tour="api-header"]',
        position: "bottom",
      },
      {
        id: "api-endpoints",
        title: "Browse Endpoints",
        description:
          "Explore all available API endpoints and their documentation.",
        target: '[data-tour="api-endpoints"]',
        position: "right",
      },
      {
        id: "api-details",
        title: "Detailed Documentation",
        description:
          "View parameters, responses, and code examples for each endpoint.",
        target: '[data-tour="api-details"]',
        position: "left",
      },
    ],
  },
};

export const useOnboarding = () => {
  const [state, setState] = React.useState<OnboardingState>({
    isActive: false,
    activeTour: null,
    currentStepIndex: 0,
    completedTours: JSON.parse(
      localStorage.getItem("skydeo-completed-tours") || "[]",
    ),
    skippedTours: JSON.parse(
      localStorage.getItem("skydeo-skipped-tours") || "[]",
    ),
  });

  // Save state to localStorage
  React.useEffect(() => {
    localStorage.setItem(
      "skydeo-completed-tours",
      JSON.stringify(state.completedTours),
    );
    localStorage.setItem(
      "skydeo-skipped-tours",
      JSON.stringify(state.skippedTours),
    );
  }, [state.completedTours, state.skippedTours]);

  const startTour = React.useCallback(
    (tourId: string) => {
      const tour = tours[tourId];
      if (!tour) {
        console.warn(`Tour with id "${tourId}" not found`);
        return;
      }

      // Don't start if already completed or skipped
      if (
        state.completedTours.includes(tourId) ||
        state.skippedTours.includes(tourId)
      ) {
        return;
      }

      setState((prev) => ({
        ...prev,
        isActive: true,
        activeTour: tourId,
        currentStepIndex: 0,
      }));
    },
    [state.completedTours, state.skippedTours],
  );

  const nextStep = React.useCallback(() => {
    if (!state.activeTour) return;

    const tour = tours[state.activeTour];
    if (!tour) return;

    if (state.currentStepIndex < tour.steps.length - 1) {
      setState((prev) => ({
        ...prev,
        currentStepIndex: prev.currentStepIndex + 1,
      }));
    } else {
      completeTour();
    }
  }, [state.activeTour, state.currentStepIndex]);

  const previousStep = React.useCallback(() => {
    if (state.currentStepIndex > 0) {
      setState((prev) => ({
        ...prev,
        currentStepIndex: prev.currentStepIndex - 1,
      }));
    }
  }, [state.currentStepIndex]);

  const completeTour = useCallback(() => {
    if (!state.activeTour) return;

    setState((prev) => ({
      ...prev,
      isActive: false,
      activeTour: null,
      currentStepIndex: 0,
      completedTours: [...prev.completedTours, prev.activeTour!],
    }));
  }, [state.activeTour]);

  const skipTour = useCallback(() => {
    if (!state.activeTour) return;

    setState((prev) => ({
      ...prev,
      isActive: false,
      activeTour: null,
      currentStepIndex: 0,
      skippedTours: [...prev.skippedTours, prev.activeTour!],
    }));
  }, [state.activeTour]);

  const resetTour = useCallback((tourId: string) => {
    setState((prev) => ({
      ...prev,
      completedTours: prev.completedTours.filter((id) => id !== tourId),
      skippedTours: prev.skippedTours.filter((id) => id !== tourId),
    }));
  }, []);

  const resetAllTours = useCallback(() => {
    setState((prev) => ({
      ...prev,
      completedTours: [],
      skippedTours: [],
    }));
  }, []);

  // Auto-start tours
  useEffect(() => {
    const autoStartTours = Object.values(tours).filter(
      (tour) =>
        tour.autoStart &&
        !state.completedTours.includes(tour.id) &&
        !state.skippedTours.includes(tour.id),
    );

    if (autoStartTours.length > 0 && !state.isActive) {
      const timer = setTimeout(() => {
        startTour(autoStartTours[0].id);
      }, 2000); // Delay to let the page load

      return () => clearTimeout(timer);
    }
  }, [state.completedTours, state.skippedTours, state.isActive, startTour]);

  const currentTour = state.activeTour ? tours[state.activeTour] : null;
  const currentStep = currentTour
    ? currentTour.steps[state.currentStepIndex]
    : null;

  return {
    isActive: state.isActive,
    activeTour: state.activeTour,
    currentTour,
    currentStep,
    currentStepIndex: state.currentStepIndex,
    totalSteps: currentTour?.steps.length || 0,
    completedTours: state.completedTours,
    skippedTours: state.skippedTours,
    startTour,
    nextStep,
    previousStep,
    completeTour,
    skipTour,
    resetTour,
    resetAllTours,
  };
};
