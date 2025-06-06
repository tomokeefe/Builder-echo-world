import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Audience } from "@/types/audience";
import { X } from "lucide-react";

const audienceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  source: z.string().min(1, "Please select a data source"),
  status: z.enum(["Active", "Paused", "Draft"]),
  demographics: z.array(z.string()).min(1, "Select at least one demographic"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  behaviors: z.array(z.string()).min(1, "Select at least one behavior"),
});

type AudienceFormData = z.infer<typeof audienceSchema>;

interface CreateAudienceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAudience: (audience: Omit<Audience, "id" | "created">) => void;
}

const demographicOptions = [
  "Age 18-24",
  "Age 25-34",
  "Age 35-44",
  "Age 45-54",
  "Age 55+",
  "Male",
  "Female",
  "Urban areas",
  "Suburban",
  "Rural",
  "Income $30k-50k",
  "Income $50k-75k",
  "Income $75k+",
  "College educated",
  "Graduate degree",
  "Homeowner",
];

const interestOptions = [
  "Technology",
  "Travel",
  "Fashion",
  "Sports",
  "Gaming",
  "Food & Dining",
  "Health & Fitness",
  "Music",
  "Movies",
  "Books & Reading",
  "Art & Culture",
  "Luxury goods",
  "Automotive",
  "Home & Garden",
  "Business & Finance",
];

const behaviorOptions = [
  "Frequent purchaser",
  "Brand loyal",
  "Early adopter",
  "Price sensitive",
  "Online shopper",
  "Mobile user",
  "Social media active",
  "Email engaged",
  "Event attendee",
  "Content creator",
  "Influencer",
  "Deal seeker",
];

const sourceOptions = [
  "Customer Database",
  "Website Analytics",
  "App Analytics",
  "Email Platform",
  "Social Media",
  "CRM System",
  "Survey Data",
  "Third-party Data",
];

export function CreateAudienceModal({
  open,
  onOpenChange,
  onCreateAudience,
}: CreateAudienceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AudienceFormData>({
    resolver: zodResolver(audienceSchema),
    defaultValues: {
      name: "",
      description: "",
      source: "",
      status: "Draft",
      demographics: [],
      interests: [],
      behaviors: [],
    },
  });

  const onSubmit = async (data: AudienceFormData) => {
    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Calculate estimated size based on targeting criteria
    const baseSize = 1000000;
    const demographicMultiplier = 1 - data.demographics.length * 0.1;
    const interestMultiplier = 1 - data.interests.length * 0.05;
    const behaviorMultiplier = 1 - data.behaviors.length * 0.15;

    const estimatedSize = Math.floor(
      baseSize *
        demographicMultiplier *
        interestMultiplier *
        behaviorMultiplier *
        (0.8 + Math.random() * 0.4),
    );

    const newAudience: Omit<Audience, "id" | "created"> = {
      name: data.name,
      description: data.description,
      size: estimatedSize,
      similarity: Math.floor(75 + Math.random() * 20), // Random similarity between 75-95%
      status: data.status,
      performance: "Medium", // Default for new audiences
      source: data.source,
      targetingCriteria: {
        demographics: data.demographics,
        interests: data.interests,
        behaviors: data.behaviors,
      },
      campaignData: {
        reach: 0,
        engagement: 0,
        conversion: 0,
        clicks: 0,
        impressions: 0,
      },
    };

    onCreateAudience(newAudience);
    onOpenChange(false);
    form.reset();
    setIsSubmitting(false);
  };

  const addOption = (
    field: "demographics" | "interests" | "behaviors",
    value: string,
  ) => {
    const currentValues = form.getValues(field);
    if (!currentValues.includes(value)) {
      form.setValue(field, [...currentValues, value]);
    }
  };

  const removeOption = (
    field: "demographics" | "interests" | "behaviors",
    value: string,
  ) => {
    const currentValues = form.getValues(field);
    form.setValue(
      field,
      currentValues.filter((item) => item !== value),
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Lookalike Audience</DialogTitle>
          <DialogDescription>
            Define your target audience by selecting demographics, interests,
            and behaviors.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audience Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter audience name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Source *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select data source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sourceOptions.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your audience..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description to help identify this audience
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Tabs defaultValue="demographics" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
                <TabsTrigger value="interests">Interests</TabsTrigger>
                <TabsTrigger value="behaviors">Behaviors</TabsTrigger>
              </TabsList>

              <TabsContent value="demographics" className="space-y-4">
                <FormField
                  control={form.control}
                  name="demographics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selected Demographics</FormLabel>
                      <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border rounded-md">
                        {field.value.map((demo) => (
                          <Badge
                            key={demo}
                            variant="secondary"
                            className="gap-1"
                          >
                            {demo}
                            <button
                              type="button"
                              onClick={() => removeOption("demographics", demo)}
                              className="ml-1 hover:bg-red-500 hover:text-white rounded-full w-4 h-4 flex items-center justify-center"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                        {field.value.length === 0 && (
                          <span className="text-muted-foreground text-sm">
                            No demographics selected
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {demographicOptions.map((option) => (
                          <div
                            key={option}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`demo-${option}`}
                              checked={field.value.includes(option)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  addOption("demographics", option);
                                } else {
                                  removeOption("demographics", option);
                                }
                              }}
                            />
                            <label
                              htmlFor={`demo-${option}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="interests" className="space-y-4">
                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selected Interests</FormLabel>
                      <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border rounded-md">
                        {field.value.map((interest) => (
                          <Badge
                            key={interest}
                            variant="secondary"
                            className="gap-1"
                          >
                            {interest}
                            <button
                              type="button"
                              onClick={() =>
                                removeOption("interests", interest)
                              }
                              className="ml-1 hover:bg-red-500 hover:text-white rounded-full w-4 h-4 flex items-center justify-center"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                        {field.value.length === 0 && (
                          <span className="text-muted-foreground text-sm">
                            No interests selected
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {interestOptions.map((option) => (
                          <div
                            key={option}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`interest-${option}`}
                              checked={field.value.includes(option)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  addOption("interests", option);
                                } else {
                                  removeOption("interests", option);
                                }
                              }}
                            />
                            <label
                              htmlFor={`interest-${option}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="behaviors" className="space-y-4">
                <FormField
                  control={form.control}
                  name="behaviors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selected Behaviors</FormLabel>
                      <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border rounded-md">
                        {field.value.map((behavior) => (
                          <Badge
                            key={behavior}
                            variant="secondary"
                            className="gap-1"
                          >
                            {behavior}
                            <button
                              type="button"
                              onClick={() =>
                                removeOption("behaviors", behavior)
                              }
                              className="ml-1 hover:bg-red-500 hover:text-white rounded-full w-4 h-4 flex items-center justify-center"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                        {field.value.length === 0 && (
                          <span className="text-muted-foreground text-sm">
                            No behaviors selected
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {behaviorOptions.map((option) => (
                          <div
                            key={option}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`behavior-${option}`}
                              checked={field.value.includes(option)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  addOption("behaviors", option);
                                } else {
                                  removeOption("behaviors", option);
                                }
                              }}
                            />
                            <label
                              htmlFor={`behavior-${option}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Audience"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
