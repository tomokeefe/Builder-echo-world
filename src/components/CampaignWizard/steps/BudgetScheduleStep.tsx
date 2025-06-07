import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useCampaignWizard } from "@/hooks/useCampaignWizard";
import { DollarSign, Calendar, Target, TrendingUp, Clock } from "lucide-react";

export function BudgetScheduleStep() {
  const { wizardData, updateWizardData, errors, calculateBudgetSuggestions } =
    useCampaignWizard();
  const [budgetSuggestions, setBudgetSuggestions] = useState<any>(null);

  useEffect(() => {
    if (wizardData.selectedAudiences.length > 0) {
      setBudgetSuggestions(calculateBudgetSuggestions());
    }
  }, [wizardData.selectedAudiences, calculateBudgetSuggestions]);

  const handleBudgetChange = (field: string, value: number) => {
    const newBudget = { ...wizardData.budget, [field]: value };

    // Auto-calculate daily budget from total or vice versa
    if (field === "total" && wizardData.schedule.endDate) {
      const startDate = new Date(wizardData.schedule.startDate);
      const endDate = new Date(wizardData.schedule.endDate);
      const days = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      newBudget.daily = Math.floor(value / days);
    } else if (field === "daily" && wizardData.schedule.endDate) {
      const startDate = new Date(wizardData.schedule.startDate);
      const endDate = new Date(wizardData.schedule.endDate);
      const days = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      newBudget.total = value * days;
    }

    updateWizardData({ budget: newBudget });
  };

  const handleDateChange = (field: string, value: string) => {
    const newSchedule = { ...wizardData.schedule, [field]: value };
    updateWizardData({ schedule: newSchedule });
  };

  const applySuggestion = (suggestion: any) => {
    updateWizardData({
      budget: {
        ...wizardData.budget,
        daily: suggestion.daily,
        total: suggestion.total,
      },
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: wizardData.budget.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Budget Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium">Campaign Budget</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="total-budget">Total Budget *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="total-budget"
                  type="number"
                  placeholder="0"
                  value={wizardData.budget.total || ""}
                  onChange={(e) =>
                    handleBudgetChange("total", Number(e.target.value))
                  }
                  className={`pl-8 ${errors.budget ? "border-red-500" : ""}`}
                />
              </div>
              {errors.budget && (
                <p className="text-sm text-red-600">{errors.budget}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="daily-budget">Daily Budget</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="daily-budget"
                  type="number"
                  placeholder="0"
                  value={wizardData.budget.daily || ""}
                  onChange={(e) =>
                    handleBudgetChange("daily", Number(e.target.value))
                  }
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={wizardData.budget.currency}
                onValueChange={(value) =>
                  updateWizardData({
                    budget: { ...wizardData.budget, currency: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="optimization-goal">Optimization Goal</Label>
              <Select
                value={wizardData.budget.optimizationGoal}
                onValueChange={(value) =>
                  updateWizardData({
                    budget: {
                      ...wizardData.budget,
                      optimizationGoal: value as any,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="impressions">Impressions</SelectItem>
                  <SelectItem value="clicks">Clicks</SelectItem>
                  <SelectItem value="conversions">Conversions</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Budget Suggestions */}
          {budgetSuggestions && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Budget Recommendations
                </CardTitle>
                <CardDescription>
                  Based on your audience size and campaign type
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(budgetSuggestions).map(
                  ([key, suggestion]: [string, any]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => applySuggestion(suggestion)}
                    >
                      <div>
                        <p className="font-medium text-sm capitalize">{key}</p>
                        <p className="text-xs text-gray-600">
                          {formatCurrency(suggestion.daily)}/day •{" "}
                          {formatCurrency(suggestion.total)} total
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Apply
                      </Button>
                    </div>
                  ),
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Schedule Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium">Campaign Schedule</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date *</Label>
              <Input
                id="start-date"
                type="date"
                value={wizardData.schedule.startDate}
                onChange={(e) => handleDateChange("startDate", e.target.value)}
                className={errors.startDate ? "border-red-500" : ""}
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.startDate && (
                <p className="text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={wizardData.schedule.endDate || ""}
                onChange={(e) => handleDateChange("endDate", e.target.value)}
                min={wizardData.schedule.startDate}
              />
              <p className="text-sm text-gray-500">
                Leave empty for ongoing campaign
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={wizardData.schedule.timezone}
                onValueChange={(value) =>
                  updateWizardData({
                    schedule: { ...wizardData.schedule, timezone: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">
                    Eastern Time (ET)
                  </SelectItem>
                  <SelectItem value="America/Chicago">
                    Central Time (CT)
                  </SelectItem>
                  <SelectItem value="America/Denver">
                    Mountain Time (MT)
                  </SelectItem>
                  <SelectItem value="America/Los_Angeles">
                    Pacific Time (PT)
                  </SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Schedule Summary */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Schedule Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium">
                    {wizardData.schedule.startDate
                      ? new Date(
                          wizardData.schedule.startDate,
                        ).toLocaleDateString()
                      : "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date:</span>
                  <span className="font-medium">
                    {wizardData.schedule.endDate
                      ? new Date(
                          wizardData.schedule.endDate,
                        ).toLocaleDateString()
                      : "Ongoing"}
                  </span>
                </div>
                {wizardData.schedule.startDate &&
                  wizardData.schedule.endDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">
                        {Math.ceil(
                          (new Date(wizardData.schedule.endDate).getTime() -
                            new Date(wizardData.schedule.startDate).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}{" "}
                        days
                      </span>
                    </div>
                  )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Timezone:</span>
                  <span className="font-medium">
                    {wizardData.schedule.timezone}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Frequency Capping */}
      <div className="space-y-4">
        <h4 className="font-medium">Frequency Capping</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="frequency-impressions">Max Impressions</Label>
            <Input
              id="frequency-impressions"
              type="number"
              value={wizardData.schedule.frequency.impressions}
              onChange={(e) =>
                updateWizardData({
                  schedule: {
                    ...wizardData.schedule,
                    frequency: {
                      ...wizardData.schedule.frequency,
                      impressions: Number(e.target.value),
                    },
                  },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="frequency-period">Per</Label>
            <Select
              value={wizardData.schedule.frequency.period}
              onValueChange={(value) =>
                updateWizardData({
                  schedule: {
                    ...wizardData.schedule,
                    frequency: {
                      ...wizardData.schedule.frequency,
                      period: value as any,
                    },
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <p className="text-sm text-gray-600">
              Limit ad exposure to prevent fatigue
            </p>
          </div>
        </div>
      </div>

      {/* Budget Estimation */}
      {wizardData.budget.total > 0 && wizardData.estimatedReach > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Performance Estimates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(
                    (wizardData.budget.total / wizardData.estimatedReach) *
                      1000,
                  )}
                </div>
                <div className="text-gray-600">Est. CPM</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {Math.floor(wizardData.estimatedReach * 0.03)}
                </div>
                <div className="text-gray-600">Est. Clicks</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {Math.floor(wizardData.estimatedReach * 0.002)}
                </div>
                <div className="text-gray-600">Est. Conversions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(wizardData.budget.total * 3)}
                </div>
                <div className="text-gray-600">Est. Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
