import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { useCampaignWizard } from "@/hooks/useCampaignWizard";
import { CampaignObjective } from "@/types/campaignWizard";
import {
  Plus,
  Trash2,
  Target,
  TrendingUp,
  Users,
  ShoppingCart,
  Mail,
  Heart,
} from "lucide-react";

export function ObjectivesStep() {
  const { wizardData, updateWizardData, errors } = useCampaignWizard();
  const [showAddObjective, setShowAddObjective] = useState(false);

  const objectiveTypes = [
    {
      type: "awareness",
      label: "Brand Awareness",
      description: "Increase brand recognition",
      icon: TrendingUp,
      units: ["impressions"],
      color: "bg-blue-500",
    },
    {
      type: "traffic",
      label: "Website Traffic",
      description: "Drive visitors to your site",
      icon: Users,
      units: ["clicks"],
      color: "bg-green-500",
    },
    {
      type: "engagement",
      label: "Engagement",
      description: "Increase interactions",
      icon: Heart,
      units: ["clicks", "conversions"],
      color: "bg-pink-500",
    },
    {
      type: "leads",
      label: "Lead Generation",
      description: "Capture potential customers",
      icon: Mail,
      units: ["conversions"],
      color: "bg-purple-500",
    },
    {
      type: "sales",
      label: "Sales & Revenue",
      description: "Drive purchases",
      icon: ShoppingCart,
      units: ["conversions", "revenue"],
      color: "bg-orange-500",
    },
    {
      type: "retention",
      label: "Customer Retention",
      description: "Re-engage customers",
      icon: Target,
      units: ["conversions", "revenue"],
      color: "bg-indigo-500",
    },
  ];

  const addObjective = (objectiveData: Omit<CampaignObjective, "target">) => {
    const newObjective: CampaignObjective = {
      ...objectiveData,
      target: 0,
    };

    updateWizardData({
      objectives: [...wizardData.objectives, newObjective],
    });
    setShowAddObjective(false);
  };

  const updateObjective = (
    index: number,
    updates: Partial<CampaignObjective>,
  ) => {
    const updatedObjectives = wizardData.objectives.map((obj, i) =>
      i === index ? { ...obj, ...updates } : obj,
    );
    updateWizardData({ objectives: updatedObjectives });
  };

  const removeObjective = (index: number) => {
    const updatedObjectives = wizardData.objectives.filter(
      (_, i) => i !== index,
    );
    updateWizardData({ objectives: updatedObjectives });
  };

  const suggestedObjectives = objectiveTypes.filter((obj) => {
    if (wizardData.type === "awareness")
      return ["awareness", "traffic"].includes(obj.type);
    if (wizardData.type === "consideration")
      return ["traffic", "engagement", "leads"].includes(obj.type);
    if (wizardData.type === "conversion")
      return ["leads", "sales"].includes(obj.type);
    if (wizardData.type === "retention")
      return ["retention", "sales", "engagement"].includes(obj.type);
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium mb-2">Campaign Objectives</h3>
        <p className="text-gray-600 text-sm">
          Define what you want to achieve with this campaign. You can add
          multiple objectives with different priorities.
        </p>
        {errors.objectives && (
          <p className="text-sm text-red-600 mt-2">{errors.objectives}</p>
        )}
      </div>

      {/* Current Objectives */}
      {wizardData.objectives.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Your Objectives</h4>
          {wizardData.objectives.map((objective, index) => {
            const objectiveType = objectiveTypes.find(
              (t) => t.type === objective.type,
            );
            return (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 ${objectiveType?.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      {objectiveType?.icon && (
                        <objectiveType.icon className="w-4 h-4 text-white" />
                      )}
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <p className="font-medium text-sm">
                          {objectiveType?.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          {objectiveType?.description}
                        </p>
                      </div>

                      <div>
                        <Label className="text-xs">Target</Label>
                        <Input
                          type="number"
                          value={objective.target}
                          onChange={(e) =>
                            updateObjective(index, {
                              target: Number(e.target.value),
                            })
                          }
                          className="h-8"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Unit</Label>
                        <Select
                          value={objective.unit}
                          onValueChange={(value) =>
                            updateObjective(index, { unit: value as any })
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {objectiveType?.units.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit.charAt(0).toUpperCase() + unit.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2">
                        <Select
                          value={objective.priority}
                          onValueChange={(value) =>
                            updateObjective(index, { priority: value as any })
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="primary">Primary</SelectItem>
                            <SelectItem value="secondary">Secondary</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeObjective(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Objective */}
      {!showAddObjective ? (
        <div>
          <Button
            variant="outline"
            onClick={() => setShowAddObjective(true)}
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Campaign Objective
          </Button>
        </div>
      ) : (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">Add New Objective</CardTitle>
            <CardDescription>
              Choose an objective that aligns with your campaign goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedObjectives.map((objective) => (
                <Card
                  key={objective.type}
                  className="cursor-pointer hover:shadow-md transition-shadow border-gray-200"
                  onClick={() =>
                    addObjective({
                      type: objective.type as any,
                      unit: objective.units[0] as any,
                      priority:
                        wizardData.objectives.length === 0
                          ? "primary"
                          : "secondary",
                    })
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 ${objective.color} rounded-lg flex items-center justify-center`}
                      >
                        <objective.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">
                          {objective.label}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {objective.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddObjective(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggested Objectives */}
      {wizardData.objectives.length === 0 && !showAddObjective && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Suggested Objectives for{" "}
              {wizardData.type?.charAt(0).toUpperCase() +
                wizardData.type?.slice(1)}{" "}
              Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedObjectives.slice(0, 4).map((objective) => (
                <div
                  key={objective.type}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg"
                >
                  <div
                    className={`w-6 h-6 ${objective.color} rounded flex items-center justify-center`}
                  >
                    <objective.icon className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{objective.label}</p>
                    <p className="text-xs text-gray-600">
                      {objective.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
