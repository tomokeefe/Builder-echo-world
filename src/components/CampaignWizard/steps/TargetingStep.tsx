import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCampaignWizard } from "@/hooks/useCampaignWizard";
import { Globe, Users, Smartphone, Target, Plus, X } from "lucide-react";

export function TargetingStep() {
  const { wizardData, updateWizardData, errors } = useCampaignWizard();
  const [newInterest, setNewInterest] = useState("");
  const [newBehavior, setNewBehavior] = useState("");

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Australia",
    "Japan",
    "Brazil",
    "India",
    "Mexico",
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ja", name: "Japanese" },
  ];

  const devices = [
    { value: "desktop", label: "Desktop", icon: "💻" },
    { value: "mobile", label: "Mobile", icon: "📱" },
    { value: "tablet", label: "Tablet", icon: "📱" },
  ];

  const incomeRanges = [
    "Under $25k",
    "$25k - $50k",
    "$50k - $75k",
    "$75k - $100k",
    "$100k - $150k",
    "$150k+",
    "Top 10%",
    "Top 25%",
  ];

  const suggestedInterests = [
    "Technology",
    "Travel",
    "Fashion",
    "Food & Dining",
    "Fitness",
    "Business",
    "Education",
    "Entertainment",
    "Sports",
    "Shopping",
  ];

  const suggestedBehaviors = [
    "Frequent online shoppers",
    "Business travelers",
    "Tech early adopters",
    "Luxury shoppers",
    "Deal seekers",
    "Mobile users",
    "Social media users",
  ];

  const updateTargeting = (field: string, value: any) => {
    updateWizardData({
      targeting: { ...wizardData.targeting, [field]: value },
    });
  };

  const updateDemographics = (field: string, value: any) => {
    updateWizardData({
      targeting: {
        ...wizardData.targeting,
        demographics: { ...wizardData.targeting.demographics, [field]: value },
      },
    });
  };

  const toggleLocation = (location: string) => {
    const current = wizardData.targeting.locations || [];
    const updated = current.includes(location)
      ? current.filter((l) => l !== location)
      : [...current, location];
    updateTargeting("locations", updated);
  };

  const toggleLanguage = (languageCode: string) => {
    const current = wizardData.targeting.languages || [];
    const updated = current.includes(languageCode)
      ? current.filter((l) => l !== languageCode)
      : [...current, languageCode];
    updateTargeting("languages", updated);
  };

  const toggleDevice = (device: string) => {
    const current = wizardData.targeting.devices || [];
    const updated = current.includes(device as any)
      ? current.filter((d) => d !== device)
      : [...current, device];
    updateTargeting("devices", updated);
  };

  const addInterest = (interest: string) => {
    if (interest && !wizardData.targeting.interests.includes(interest)) {
      updateTargeting("interests", [
        ...wizardData.targeting.interests,
        interest,
      ]);
    }
    setNewInterest("");
  };

  const removeInterest = (interest: string) => {
    updateTargeting(
      "interests",
      wizardData.targeting.interests.filter((i) => i !== interest),
    );
  };

  const addBehavior = (behavior: string) => {
    if (behavior && !wizardData.targeting.behaviors.includes(behavior)) {
      updateTargeting("behaviors", [
        ...wizardData.targeting.behaviors,
        behavior,
      ]);
    }
    setNewBehavior("");
  };

  const removeBehavior = (behavior: string) => {
    updateTargeting(
      "behaviors",
      wizardData.targeting.behaviors.filter((b) => b !== behavior),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium mb-2">Advanced Targeting</h3>
        <p className="text-gray-600 text-sm">
          Fine-tune your targeting beyond audiences. These settings are optional
          and will be applied across all selected channels.
        </p>
        {errors.locations && (
          <p className="text-sm text-red-600 mt-2">{errors.locations}</p>
        )}
      </div>

      {/* Geographic Targeting */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Geographic Targeting
          </CardTitle>
          <CardDescription>
            Select countries and regions to target
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Selected Locations
            </Label>
            <div className="flex flex-wrap gap-2 mb-4">
              {wizardData.targeting.locations.map((location) => (
                <Badge key={location} variant="secondary" className="gap-1">
                  {location}
                  <button
                    onClick={() => toggleLocation(location)}
                    className="ml-1 hover:bg-red-500 hover:text-white rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {wizardData.targeting.locations.length === 0 && (
                <span className="text-sm text-gray-500">
                  No locations selected
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {countries.map((country) => (
                <div key={country} className="flex items-center space-x-2">
                  <Checkbox
                    id={`country-${country}`}
                    checked={wizardData.targeting.locations.includes(country)}
                    onCheckedChange={() => toggleLocation(country)}
                  />
                  <label
                    htmlFor={`country-${country}`}
                    className="text-sm cursor-pointer"
                  >
                    {country}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language & Device Targeting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Languages</CardTitle>
            <CardDescription>
              Target users who speak these languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {languages.map((language) => (
                <div
                  key={language.code}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`lang-${language.code}`}
                    checked={wizardData.targeting.languages.includes(
                      language.code,
                    )}
                    onCheckedChange={() => toggleLanguage(language.code)}
                  />
                  <label
                    htmlFor={`lang-${language.code}`}
                    className="text-sm cursor-pointer"
                  >
                    {language.name}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Device Targeting
            </CardTitle>
            <CardDescription>Select device types to target</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {devices.map((device) => (
                <div key={device.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`device-${device.value}`}
                    checked={wizardData.targeting.devices.includes(
                      device.value as any,
                    )}
                    onCheckedChange={() => toggleDevice(device.value)}
                  />
                  <label
                    htmlFor={`device-${device.value}`}
                    className="text-sm cursor-pointer flex items-center gap-2"
                  >
                    <span>{device.icon}</span>
                    {device.label}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demographics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-5 h-5" />
            Demographics
          </CardTitle>
          <CardDescription>
            Target specific demographic segments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Age Range</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Min"
                  value={wizardData.targeting.demographics.ageMin}
                  onChange={(e) =>
                    updateDemographics("ageMin", Number(e.target.value))
                  }
                  className="w-24"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={wizardData.targeting.demographics.ageMax}
                  onChange={(e) =>
                    updateDemographics("ageMax", Number(e.target.value))
                  }
                  className="w-24"
                />
                <span className="text-sm text-gray-500">years old</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <div className="flex gap-4">
                {["all", "male", "female"].map((gender) => (
                  <div key={gender} className="flex items-center space-x-2">
                    <Checkbox
                      id={`gender-${gender}`}
                      checked={wizardData.targeting.demographics.genders.includes(
                        gender as any,
                      )}
                      onCheckedChange={(checked) => {
                        const current =
                          wizardData.targeting.demographics.genders;
                        const updated = checked
                          ? [...current, gender]
                          : current.filter((g) => g !== gender);
                        updateDemographics("genders", updated);
                      }}
                    />
                    <label
                      htmlFor={`gender-${gender}`}
                      className="text-sm cursor-pointer capitalize"
                    >
                      {gender}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Income Level</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {incomeRanges.map((income) => (
                <div key={income} className="flex items-center space-x-2">
                  <Checkbox
                    id={`income-${income}`}
                    checked={wizardData.targeting.demographics.incomes.includes(
                      income,
                    )}
                    onCheckedChange={(checked) => {
                      const current = wizardData.targeting.demographics.incomes;
                      const updated = checked
                        ? [...current, income]
                        : current.filter((i) => i !== income);
                      updateDemographics("incomes", updated);
                    }}
                  />
                  <label
                    htmlFor={`income-${income}`}
                    className="text-sm cursor-pointer"
                  >
                    {income}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interests & Behaviors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Interests</CardTitle>
            <CardDescription>
              Target users based on their interests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {wizardData.targeting.interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="gap-1">
                    {interest}
                    <button
                      onClick={() => removeInterest(interest)}
                      className="ml-1 hover:bg-red-500 hover:text-white rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add custom interest"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && addInterest(newInterest)
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addInterest(newInterest)}
                  disabled={!newInterest}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-1 mt-3">
                {suggestedInterests.map((interest) => (
                  <Badge
                    key={interest}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-white"
                    onClick={() => addInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Behaviors</CardTitle>
            <CardDescription>
              Target users based on their behaviors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {wizardData.targeting.behaviors.map((behavior) => (
                  <Badge key={behavior} variant="secondary" className="gap-1">
                    {behavior}
                    <button
                      onClick={() => removeBehavior(behavior)}
                      className="ml-1 hover:bg-red-500 hover:text-white rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add custom behavior"
                  value={newBehavior}
                  onChange={(e) => setNewBehavior(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && addBehavior(newBehavior)
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addBehavior(newBehavior)}
                  disabled={!newBehavior}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-1 mt-3">
                {suggestedBehaviors.map((behavior) => (
                  <Badge
                    key={behavior}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-white"
                    onClick={() => addBehavior(behavior)}
                  >
                    {behavior}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Targeting Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Targeting Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Locations:</span>
              <p className="font-medium">
                {wizardData.targeting.locations.length || "All"}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Languages:</span>
              <p className="font-medium">
                {wizardData.targeting.languages.length || "All"}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Age Range:</span>
              <p className="font-medium">
                {wizardData.targeting.demographics.ageMin}-
                {wizardData.targeting.demographics.ageMax}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Devices:</span>
              <p className="font-medium">
                {wizardData.targeting.devices.length || "All"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
