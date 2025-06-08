export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  industry: string;
  status: "active" | "onboarding" | "inactive" | "churned";
  tier: "basic" | "premium" | "enterprise";
  accountManager: string;
  createdAt: string;
  updatedAt: string;
  lastActivity?: string;

  // Financial data
  monthlySpend: number;
  totalLifetimeValue: number;
  contractValue: number;
  contractStartDate: string;
  contractEndDate: string;

  // Contact information
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country: string;
  };

  // Business metrics
  metrics: {
    activeAudiences: number;
    activeCampaigns: number;
    totalConversions: number;
    averageROAS: number;
  };

  // Billing information
  billing: {
    paymentMethod: string;
    billingCycle: "monthly" | "quarterly" | "annual";
    nextBillingDate: string;
    pastDue: boolean;
    pastDueAmount?: number;
  };

  // Team and access
  teamMembers: ClientTeamMember[];
  integrations: string[];
  tags: string[];

  // Support and notes
  notes: ClientNote[];
  supportTickets: number;
  lastSupportTicket?: string;
}

export interface ClientTeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  lastLogin?: string;
  isActive: boolean;
}

export interface ClientNote {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  type: "general" | "billing" | "support" | "onboarding";
  isImportant: boolean;
}

export interface ClientActivity {
  id: string;
  clientId: string;
  type:
    | "login"
    | "campaign_created"
    | "audience_created"
    | "payment"
    | "support_ticket"
    | "contract_signed";
  description: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface ClientContract {
  id: string;
  clientId: string;
  type: "monthly" | "annual" | "custom";
  value: number;
  currency: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  terms: string;
  signedDate: string;
  status: "active" | "expired" | "pending" | "cancelled";
}

export interface ClientInvoice {
  id: string;
  clientId: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "overdue" | "cancelled";
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
  taxAmount: number;
  totalAmount: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: number;
}

export interface ClientOnboarding {
  id: string;
  clientId: string;
  status: "not_started" | "in_progress" | "completed" | "stalled";
  currentStep: number;
  totalSteps: number;
  steps: OnboardingStep[];
  assignedTo: string;
  startDate: string;
  targetCompletionDate: string;
  actualCompletionDate?: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "skipped";
  completedAt?: string;
  completedBy?: string;
  order: number;
  estimatedDuration: number; // in hours
  required: boolean;
}

export interface ClientFilters {
  status?: string;
  tier?: string;
  industry?: string;
  accountManager?: string;
  searchTerm?: string;
  sortBy?: "name" | "company" | "monthlySpend" | "createdAt" | "lastActivity";
  sortOrder?: "asc" | "desc";
  dateRange?: {
    start: string;
    end: string;
  };
}
