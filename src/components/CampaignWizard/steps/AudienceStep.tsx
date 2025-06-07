import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useCampaignWizard } from "@/hooks/useCampaignWizard";
import { useAudienceStore } from "@/hooks/useAudienceStore";
import { Search, Users, Target, TrendingUp, Plus } from "lucide-react";

export function AudienceStep() {
  const { wizardData, updateWizardData, errors, estimateReach } =
    useCampaignWizard();
  const { audiences, loading } = useAudienceStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter audiences based on search
  const filteredAudiences = audiences.filter(
    (audience) =>
      audience.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audience.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Update estimated reach when audiences change
  useEffect(() => {
    if (wizardData.selectedAudiences.length > 0) {
      estimateReach();
    }
  }, [wizardData.selectedAudiences, estimateReach]);

  const toggleAudience = (audienceId: string) => {
    const currentSelected = wizardData.selectedAudiences;
    const isSelected = currentSelected.includes(audienceId);

    let newSelected;
    if (isSelected) {
      newSelected = currentSelected.filter((id) => id !== audienceId);
    } else {
      newSelected = [...currentSelected, audienceId];
    }

    updateWizardData({ selectedAudiences: newSelected });
  };

  const selectAllAudiences = () => {
    const allIds = filteredAudiences.map((audience) => audience.id);
    updateWizardData({ selectedAudiences: allIds });
  };

  const deselectAllAudiences = () => {
    updateWizardData({ selectedAudiences: [] });
  };

  const getAudienceOverlap = () => {
    if (wizardData.selectedAudiences.length < 2) return 0;
    // Simplified overlap calculation - in real app this would be more sophisticated
    return Math.floor(Math.random() * 20) + 5; // 5-25% overlap
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium mb-2">Select Target Audiences</h3>
        <p className="text-gray-600 text-sm">
          Choose one or more audiences to target with your campaign. You can
          combine multiple audiences for broader reach.
        </p>
        {errors.audiences && (
          <p className="text-sm text-red-600 mt-2">{errors.audiences}</p>
        )}
      </div>

      {/* Search and Actions */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search audiences..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={selectAllAudiences}
            disabled={filteredAudiences.length === 0}
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={deselectAllAudiences}
            disabled={wizardData.selectedAudiences.length === 0}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Audience Selection */}
      <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-200 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredAudiences.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="font-medium text-gray-900 mb-2">
                No audiences found
              </h4>
              <p className="text-gray-500 text-sm mb-4">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : "Create your first audience to get started."}
              </p>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create New Audience
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredAudiences.map((audience) => {
            const isSelected = wizardData.selectedAudiences.includes(
              audience.id,
            );

            return (
              <Card
                key={audience.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected
                    ? "ring-2 ring-primary border-primary"
                    : "border-gray-200"
                }`}
                onClick={() => toggleAudience(audience.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleAudience(audience.id)}
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{audience.name}</h4>
                        <Badge
                          variant={
                            audience.status === "Active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {audience.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            audience.performance === "High"
                              ? "border-green-500 text-green-700"
                              : audience.performance === "Medium"
                                ? "border-yellow-500 text-yellow-700"
                                : "border-red-500 text-red-700"
                          }
                        >
                          {audience.performance}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <p className="font-medium">Size</p>
                          <p>{formatNumber(audience.size)} people</p>
                        </div>
                        <div>
                          <p className="font-medium">Similarity</p>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={audience.similarity}
                              className="w-12 h-2"
                            />
                            <span>{audience.similarity}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">Source</p>
                          <p>{audience.source}</p>
                        </div>
                      </div>

                      {audience.description && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {audience.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Selection Summary */}
      {wizardData.selectedAudiences.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Audience Selection Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {wizardData.selectedAudiences.length}
                </div>
                <div className="text-sm text-gray-600">Selected Audiences</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {formatNumber(wizardData.estimatedReach || 0)}
                </div>
                <div className="text-sm text-gray-600">Estimated Reach</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {getAudienceOverlap()}%
                </div>
                <div className="text-sm text-gray-600">Audience Overlap</div>
              </div>
            </div>

            {wizardData.selectedAudiences.length > 1 && (
              <div className="mt-4 p-3 bg-white rounded-lg">
                <h5 className="font-medium text-sm mb-2">
                  Selected Audiences:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {wizardData.selectedAudiences.map((audienceId) => {
                    const audience = audiences.find((a) => a.id === audienceId);
                    return audience ? (
                      <Badge key={audienceId} variant="secondary">
                        {audience.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {wizardData.selectedAudiences.length === 0 &&
        !loading &&
        filteredAudiences.length > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Audience Recommendations
              </CardTitle>
              <CardDescription>
                Based on your campaign type, we recommend these audiences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredAudiences
                  .filter(
                    (audience) =>
                      (wizardData.type === "awareness" &&
                        audience.performance === "High") ||
                      (wizardData.type === "conversion" &&
                        audience.status === "Active") ||
                      (wizardData.type === "retention" &&
                        audience.source === "Customer Database"),
                  )
                  .slice(0, 3)
                  .map((audience) => (
                    <div
                      key={audience.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:shadow-sm"
                      onClick={() => toggleAudience(audience.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Target className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm">{audience.name}</p>
                          <p className="text-xs text-gray-600">
                            {formatNumber(audience.size)} people •{" "}
                            {audience.similarity}% similarity
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Select
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
