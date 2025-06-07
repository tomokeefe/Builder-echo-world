import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { useCampaignWizard } from "@/hooks/useCampaignWizard";
import { WizardCreative } from "@/types/campaignWizard";
import { Plus, Upload, Image, Video, FileText, X } from "lucide-react";

export function CreativeStep() {
  const { wizardData, updateWizardData } = useCampaignWizard();
  const [showAddCreative, setShowAddCreative] = useState(false);

  const addCreative = () => {
    const newCreative: WizardCreative = {
      id: Date.now().toString(),
      type: "image",
      name: "",
      headline: "",
      description: "",
      callToAction: "",
      url: "",
      assets: [],
      channels:
        wizardData.channels?.filter((c) => c.enabled).map((c) => c.platform) ||
        [],
    };

    updateWizardData({
      creatives: [...(wizardData.creatives || []), newCreative],
    });
    setShowAddCreative(false);
  };

  const updateCreative = (index: number, updates: Partial<WizardCreative>) => {
    const updatedCreatives = wizardData.creatives.map((creative, i) =>
      i === index ? { ...creative, ...updates } : creative,
    );
    updateWizardData({ creatives: updatedCreatives });
  };

  const removeCreative = (index: number) => {
    const updatedCreatives = wizardData.creatives.filter((_, i) => i !== index);
    updateWizardData({ creatives: updatedCreatives });
  };

  const creativeTypes = [
    {
      value: "image",
      label: "Image Ad",
      icon: Image,
      description: "Static image with text",
    },
    {
      value: "video",
      label: "Video Ad",
      icon: Video,
      description: "Video content",
    },
    {
      value: "text",
      label: "Text Ad",
      icon: FileText,
      description: "Text-only ad",
    },
  ];

  const ctaOptions = [
    "Learn More",
    "Shop Now",
    "Sign Up",
    "Download",
    "Get Quote",
    "Book Now",
    "Contact Us",
    "Subscribe",
    "Try Free",
    "Buy Now",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium mb-2">Creative Assets</h3>
        <p className="text-gray-600 text-sm">
          Add images, videos, and copy for your campaign. This step is optional
          - you can add creatives later.
        </p>
      </div>

      {/* Existing Creatives */}
      {wizardData.creatives && wizardData.creatives.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Your Creatives</h4>
          {wizardData.creatives.map((creative, index) => {
            const typeInfo = creativeTypes.find(
              (t) => t.type === creative.type,
            );

            return (
              <Card key={creative.id} className="border border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {typeInfo?.icon && <typeInfo.icon className="w-5 h-5" />}
                      <CardTitle className="text-base">
                        {creative.name || `${typeInfo?.label} ${index + 1}`}
                      </CardTitle>
                      <Badge variant="outline">{typeInfo?.label}</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCreative(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Creative Name</Label>
                      <Input
                        value={creative.name}
                        onChange={(e) =>
                          updateCreative(index, { name: e.target.value })
                        }
                        placeholder="Enter creative name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Creative Type</Label>
                      <Select
                        value={creative.type}
                        onValueChange={(value) =>
                          updateCreative(index, { type: value as any })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {creativeTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Headline</Label>
                    <Input
                      value={creative.headline}
                      onChange={(e) =>
                        updateCreative(index, { headline: e.target.value })
                      }
                      placeholder="Enter headline"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={creative.description}
                      onChange={(e) =>
                        updateCreative(index, { description: e.target.value })
                      }
                      placeholder="Enter description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Call to Action</Label>
                      <Select
                        value={creative.callToAction}
                        onValueChange={(value) =>
                          updateCreative(index, { callToAction: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select CTA" />
                        </SelectTrigger>
                        <SelectContent>
                          {ctaOptions.map((cta) => (
                            <SelectItem key={cta} value={cta}>
                              {cta}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Landing Page URL</Label>
                      <Input
                        value={creative.url}
                        onChange={(e) =>
                          updateCreative(index, { url: e.target.value })
                        }
                        placeholder="https://example.com"
                        type="url"
                      />
                    </div>
                  </div>

                  {/* Asset Upload */}
                  <div className="space-y-2">
                    <Label>Upload Assets</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Drag & drop your{" "}
                        {creative.type === "video" ? "video" : "image"} files
                        here
                      </p>
                      <Button variant="outline" size="sm">
                        Choose Files
                      </Button>
                    </div>
                  </div>

                  {/* Channel Assignment */}
                  <div className="space-y-2">
                    <Label>Assign to Channels</Label>
                    <div className="flex flex-wrap gap-2">
                      {wizardData.channels
                        ?.filter((c) => c.enabled)
                        .map((channel) => (
                          <Badge
                            key={channel.platform}
                            variant={
                              creative.channels.includes(channel.platform)
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => {
                              const isAssigned = creative.channels.includes(
                                channel.platform,
                              );
                              const newChannels = isAssigned
                                ? creative.channels.filter(
                                    (c) => c !== channel.platform,
                                  )
                                : [...creative.channels, channel.platform];
                              updateCreative(index, { channels: newChannels });
                            }}
                          >
                            {channel.platform.charAt(0).toUpperCase() +
                              channel.platform.slice(1)}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Creative */}
      {!showAddCreative ? (
        <div>
          <Button
            variant="outline"
            onClick={() => setShowAddCreative(true)}
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Creative Asset
          </Button>
        </div>
      ) : (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">Choose Creative Type</CardTitle>
            <CardDescription>
              Select the type of creative you want to add
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {creativeTypes.map((type) => (
                <Card
                  key={type.value}
                  className="cursor-pointer hover:shadow-md transition-shadow border-gray-200"
                  onClick={addCreative}
                >
                  <CardContent className="p-6 text-center">
                    <type.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h4 className="font-medium mb-1">{type.label}</h4>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddCreative(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Creative Templates */}
      {(wizardData.creatives?.length || 0) === 0 && !showAddCreative && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base">Creative Best Practices</CardTitle>
            <CardDescription>Tips for creating effective ads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <p>
                  Use high-quality images that are relevant to your audience
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <p>
                  Keep your headlines short and compelling (under 40 characters)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <p>
                  Include a clear call-to-action that matches your campaign goal
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <p>Test multiple creative variations to optimize performance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skip Notice */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <p className="text-sm text-gray-600 text-center">
            💡 <strong>Pro Tip:</strong> You can skip this step and add
            creatives later through the campaign editor. Many advertisers prefer
            to set up the campaign structure first, then add creatives.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
