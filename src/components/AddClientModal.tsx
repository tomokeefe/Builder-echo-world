import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Search,
  Building,
  Loader2,
  Check,
  AlertCircle,
  Globe,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { Client } from "@/types/client";
import { brandfetchService, BrandData } from "@/services/brandfetchService";
import { clientService } from "@/services/clientService";
import { useToast } from "@/hooks/use-toast";

const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  industry: z.string().min(2, "Please select an industry"),
  tier: z.enum(["basic", "premium", "enterprise"]),
  accountManager: z.string().min(2, "Please assign an account manager"),
  monthlySpend: z.number().min(0, "Monthly spend must be positive"),
  contractValue: z.number().min(0, "Contract value must be positive"),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientAdded: (client: Client) => void;
}

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "E-commerce",
  "Education",
  "Manufacturing",
  "Real Estate",
  "Retail",
  "Consulting",
  "Marketing",
  "Media",
  "Non-profit",
  "Other",
];

const accountManagers = [
  "John Smith",
  "Jane Doe",
  "Alex Johnson",
  "Sarah Wilson",
  "Mike Chen",
  "Emily Davis",
];

const AddClientModal: React.FC<AddClientModalProps> = ({
  open,
  onOpenChange,
  onClientAdded,
}) => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("basic");
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [isLoadingBrand, setIsLoadingBrand] = useState(false);
  const [domainSearch, setDomainSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      website: "",
      industry: "",
      tier: "basic",
      accountManager: "",
      monthlySpend: 0,
      contractValue: 0,
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      notes: "",
    },
  });

  const handleDomainLookup = async (domain: string) => {
    if (!domain.trim()) return;

    setIsLoadingBrand(true);
    try {
      const data = await brandfetchService.fetchBrandData(domain);
      if (data) {
        setBrandData(data);

        // Auto-populate form fields with brand data
        form.setValue("company", data.name);
        form.setValue("website", `https://${data.domain}`);

        if (data.company?.industry) {
          form.setValue("industry", data.company.industry);
        }

        toast({
          title: "Brand Data Found",
          description: `Successfully fetched information for ${data.name}`,
        });
      } else {
        toast({
          title: "Brand Not Found",
          description: "No brand information found for this domain",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch brand information",
        variant: "destructive",
      });
    } finally {
      setIsLoadingBrand(false);
    }
  };

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    try {
      const newClient: Omit<Client, "id" | "createdAt" | "updatedAt"> = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        industry: data.industry,
        status: "onboarding",
        tier: data.tier,
        accountManager: data.accountManager,
        monthlySpend: data.monthlySpend,
        totalLifetimeValue: data.contractValue,
        contractValue: data.contractValue,
        contractStartDate: new Date().toISOString(),
        contractEndDate: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
        metrics: {
          activeAudiences: 0,
          activeCampaigns: 0,
          totalConversions: 0,
          averageROAS: 0,
        },
        billing: {
          paymentMethod: "Pending",
          billingCycle: "monthly",
          nextBillingDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          pastDue: false,
        },
        teamMembers: [
          {
            id: "tm_new_1",
            name: data.name,
            email: data.email,
            role: "Admin",
            permissions: ["read", "write", "admin"],
            isActive: true,
          },
        ],
        integrations: [],
        tags: ["new-client"],
        notes: data.notes
          ? [
              {
                id: "note_initial",
                content: data.notes,
                authorId: "current_user",
                authorName: "System",
                createdAt: new Date().toISOString(),
                type: "general",
                isImportant: false,
              },
            ]
          : [],
        supportTickets: 0,
      };

      const createdClient = await clientService.createClient(newClient);
      onClientAdded(createdClient);

      toast({
        title: "Client Added",
        description: `${data.company} has been successfully added to your client list`,
      });

      // Reset form and close modal
      form.reset();
      setBrandData(null);
      setCurrentTab("basic");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextTab = () => {
    if (currentTab === "basic") setCurrentTab("details");
    else if (currentTab === "details") setCurrentTab("billing");
  };

  const prevTab = () => {
    if (currentTab === "billing") setCurrentTab("details");
    else if (currentTab === "details") setCurrentTab("basic");
  };

  const canProceed = () => {
    if (currentTab === "basic") {
      const basicFields = ["name", "email", "company"] as const;
      return basicFields.every((field) => {
        const value = form.getValues(field);
        return value && value.trim().length > 0;
      });
    }
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Add New Client
          </DialogTitle>
          <DialogDescription>
            Create a new client profile with automatic brand information lookup
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
                {/* Brand Lookup Section */}
                <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">
                      Auto-fill with Brand Data
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Enter company domain (e.g., apple.com)"
                        value={domainSearch}
                        onChange={(e) => setDomainSearch(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleDomainLookup(domainSearch)
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleDomainLookup(domainSearch)}
                      disabled={isLoadingBrand || !domainSearch.trim()}
                    >
                      {isLoadingBrand ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {brandData && (
                    <div className="mt-4 p-3 bg-white rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={brandData.logo}
                            alt={brandData.name}
                          />
                          <AvatarFallback>
                            <Building className="w-6 h-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{brandData.name}</h4>
                          <p className="text-sm text-gray-600">
                            {brandData.domain}
                          </p>
                          {brandData.company?.industry && (
                            <Badge variant="outline" className="mt-1">
                              {brandData.company.industry}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="john@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Company Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {industries.map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Tier</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="enterprise">
                              Enterprise
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountManager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Manager</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Assign account manager" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accountManagers.map((manager) => (
                              <SelectItem key={manager} value={manager}>
                                {manager}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4" />
                    Address Information
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="San Francisco" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input placeholder="CA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP/Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="94102" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="United States" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional notes about this client..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Any additional information about the client
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="monthlySpend"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Monthly Spend</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              type="number"
                              placeholder="5000"
                              className="pl-10"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Estimated monthly advertising spend
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contractValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Contract Value</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              type="number"
                              placeholder="60000"
                              className="pl-10"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Total annual contract value
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {brandData?.company && (
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Company Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {brandData.company.industry && (
                        <div>
                          <span className="text-gray-600">Industry:</span>
                          <span className="ml-2 font-medium">
                            {brandData.company.industry}
                          </span>
                        </div>
                      )}
                      {brandData.company.location && (
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <span className="ml-2 font-medium">
                            {brandData.company.location}
                          </span>
                        </div>
                      )}
                      {brandData.company.founded && (
                        <div>
                          <span className="text-gray-600">Founded:</span>
                          <span className="ml-2 font-medium">
                            {brandData.company.founded}
                          </span>
                        </div>
                      )}
                      {brandData.company.employees && (
                        <div>
                          <span className="text-gray-600">Employees:</span>
                          <span className="ml-2 font-medium">
                            {brandData.company.employees}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevTab}
                disabled={currentTab === "basic"}
              >
                Previous
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>

                {currentTab === "billing" ? (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Add Client
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextTab}
                    disabled={!canProceed()}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientModal;
