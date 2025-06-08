import {
  Client,
  ClientActivity,
  ClientContract,
  ClientInvoice,
  ClientOnboarding,
  ClientFilters,
  ClientNote,
} from "@/types/client";

class ClientService {
  private clients: Map<string, Client> = new Map();
  private activities: ClientActivity[] = [];
  private contracts: Map<string, ClientContract[]> = new Map();
  private invoices: Map<string, ClientInvoice[]> = new Map();
  private onboardings: Map<string, ClientOnboarding> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create sample clients
    const sampleClients: Client[] = [
      {
        id: "client_1",
        name: "Sarah Johnson",
        email: "sarah.johnson@techcorp.com",
        phone: "+1 (555) 123-4567",
        company: "TechCorp Solutions",
        industry: "Technology",
        status: "active",
        tier: "enterprise",
        accountManager: "John Smith",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-20T14:30:00Z",
        lastActivity: "2024-01-19T09:15:00Z",
        monthlySpend: 15000,
        totalLifetimeValue: 180000,
        contractValue: 180000,
        contractStartDate: "2024-01-01T00:00:00Z",
        contractEndDate: "2024-12-31T23:59:59Z",
        address: {
          street: "123 Tech Street",
          city: "San Francisco",
          state: "CA",
          zipCode: "94105",
          country: "United States",
        },
        metrics: {
          activeAudiences: 25,
          activeCampaigns: 12,
          totalConversions: 3450,
          averageROAS: 4.2,
        },
        billing: {
          paymentMethod: "Credit Card (**** 1234)",
          billingCycle: "monthly",
          nextBillingDate: "2024-02-01T00:00:00Z",
          pastDue: false,
        },
        teamMembers: [
          {
            id: "tm_1",
            name: "Sarah Johnson",
            email: "sarah.johnson@techcorp.com",
            role: "Admin",
            permissions: ["read", "write", "admin"],
            lastLogin: "2024-01-19T09:15:00Z",
            isActive: true,
          },
          {
            id: "tm_2",
            name: "Mike Chen",
            email: "mike.chen@techcorp.com",
            role: "Marketing Manager",
            permissions: ["read", "write"],
            lastLogin: "2024-01-18T16:20:00Z",
            isActive: true,
          },
        ],
        integrations: ["Google Ads", "Facebook Ads", "HubSpot"],
        tags: ["high-value", "tech", "enterprise"],
        notes: [
          {
            id: "note_1",
            content:
              "Excellent client, very responsive to campaigns. Looking to expand to international markets.",
            authorId: "user_1",
            authorName: "John Smith",
            createdAt: "2024-01-18T11:00:00Z",
            type: "general",
            isImportant: true,
          },
        ],
        supportTickets: 2,
        lastSupportTicket: "2024-01-10T14:30:00Z",
      },
      {
        id: "client_2",
        name: "David Rodriguez",
        email: "david@ecommercehub.com",
        phone: "+1 (555) 987-6543",
        company: "E-commerce Hub",
        industry: "E-commerce",
        status: "active",
        tier: "premium",
        accountManager: "Jane Doe",
        createdAt: "2024-01-10T08:00:00Z",
        updatedAt: "2024-01-18T16:45:00Z",
        lastActivity: "2024-01-18T16:45:00Z",
        monthlySpend: 8500,
        totalLifetimeValue: 85000,
        contractValue: 102000,
        contractStartDate: "2024-01-01T00:00:00Z",
        contractEndDate: "2024-12-31T23:59:59Z",
        address: {
          street: "456 Commerce Ave",
          city: "Austin",
          state: "TX",
          zipCode: "78701",
          country: "United States",
        },
        metrics: {
          activeAudiences: 18,
          activeCampaigns: 8,
          totalConversions: 2100,
          averageROAS: 3.8,
        },
        billing: {
          paymentMethod: "Bank Transfer",
          billingCycle: "monthly",
          nextBillingDate: "2024-02-01T00:00:00Z",
          pastDue: false,
        },
        teamMembers: [
          {
            id: "tm_3",
            name: "David Rodriguez",
            email: "david@ecommercehub.com",
            role: "Owner",
            permissions: ["read", "write", "admin"],
            lastLogin: "2024-01-18T16:45:00Z",
            isActive: true,
          },
        ],
        integrations: ["Shopify", "Google Ads", "Mailchimp"],
        tags: ["e-commerce", "growing", "premium"],
        notes: [],
        supportTickets: 1,
        lastSupportTicket: "2024-01-05T10:15:00Z",
      },
      {
        id: "client_3",
        name: "Emily Watson",
        email: "emily@healthstartup.com",
        phone: "+1 (555) 456-7890",
        company: "HealthStart Inc.",
        industry: "Healthcare",
        status: "onboarding",
        tier: "basic",
        accountManager: "Alex Johnson",
        createdAt: "2024-01-20T14:00:00Z",
        updatedAt: "2024-01-20T14:00:00Z",
        lastActivity: "2024-01-20T14:00:00Z",
        monthlySpend: 2500,
        totalLifetimeValue: 2500,
        contractValue: 30000,
        contractStartDate: "2024-01-20T00:00:00Z",
        contractEndDate: "2024-12-31T23:59:59Z",
        address: {
          street: "789 Health Blvd",
          city: "Boston",
          state: "MA",
          zipCode: "02101",
          country: "United States",
        },
        metrics: {
          activeAudiences: 3,
          activeCampaigns: 1,
          totalConversions: 45,
          averageROAS: 2.1,
        },
        billing: {
          paymentMethod: "Credit Card (**** 5678)",
          billingCycle: "monthly",
          nextBillingDate: "2024-02-20T00:00:00Z",
          pastDue: false,
        },
        teamMembers: [
          {
            id: "tm_4",
            name: "Emily Watson",
            email: "emily@healthstartup.com",
            role: "Admin",
            permissions: ["read", "write", "admin"],
            lastLogin: "2024-01-20T14:00:00Z",
            isActive: true,
          },
        ],
        integrations: ["Google Ads"],
        tags: ["healthcare", "startup", "new"],
        notes: [
          {
            id: "note_2",
            content:
              "New client in onboarding phase. Requires guidance on audience setup.",
            authorId: "user_3",
            authorName: "Alex Johnson",
            createdAt: "2024-01-20T14:05:00Z",
            type: "onboarding",
            isImportant: false,
          },
        ],
        supportTickets: 0,
      },
    ];

    // Add clients to the store
    sampleClients.forEach((client) => {
      this.clients.set(client.id, client);
    });

    // Generate sample activities
    this.generateSampleActivities();
  }

  private generateSampleActivities() {
    const sampleActivities: ClientActivity[] = [
      {
        id: "activity_1",
        clientId: "client_1",
        type: "campaign_created",
        description: 'Created new campaign "Holiday Sale 2024"',
        timestamp: "2024-01-19T10:30:00Z",
        details: { campaignId: "camp_1", campaignName: "Holiday Sale 2024" },
      },
      {
        id: "activity_2",
        clientId: "client_1",
        type: "login",
        description: "User logged into dashboard",
        timestamp: "2024-01-19T09:15:00Z",
      },
      {
        id: "activity_3",
        clientId: "client_2",
        type: "audience_created",
        description: 'Created new audience "Returning Customers"',
        timestamp: "2024-01-18T14:20:00Z",
        details: { audienceId: "aud_1", audienceName: "Returning Customers" },
      },
      {
        id: "activity_4",
        clientId: "client_3",
        type: "contract_signed",
        description: "Signed annual contract",
        timestamp: "2024-01-20T14:00:00Z",
        details: { contractValue: 30000, duration: "12 months" },
      },
    ];

    this.activities = sampleActivities;
  }

  // Client CRUD operations
  public async getClients(filters?: ClientFilters): Promise<Client[]> {
    let clients = Array.from(this.clients.values());

    if (filters) {
      if (filters.status && filters.status !== "all") {
        clients = clients.filter((client) => client.status === filters.status);
      }

      if (filters.tier) {
        clients = clients.filter((client) => client.tier === filters.tier);
      }

      if (filters.industry) {
        clients = clients.filter(
          (client) => client.industry === filters.industry,
        );
      }

      if (filters.accountManager) {
        clients = clients.filter(
          (client) => client.accountManager === filters.accountManager,
        );
      }

      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        clients = clients.filter(
          (client) =>
            client.name.toLowerCase().includes(term) ||
            client.company.toLowerCase().includes(term) ||
            client.email.toLowerCase().includes(term),
        );
      }

      if (filters.sortBy) {
        clients.sort((a, b) => {
          const aValue = a[filters.sortBy as keyof Client];
          const bValue = b[filters.sortBy as keyof Client];

          if (typeof aValue === "string" && typeof bValue === "string") {
            return filters.sortOrder === "desc"
              ? bValue.localeCompare(aValue)
              : aValue.localeCompare(bValue);
          }

          if (typeof aValue === "number" && typeof bValue === "number") {
            return filters.sortOrder === "desc"
              ? bValue - aValue
              : aValue - bValue;
          }

          return 0;
        });
      }
    }

    // Default sort by name
    if (!filters?.sortBy) {
      clients.sort((a, b) => a.name.localeCompare(b.name));
    }

    return clients;
  }

  public async getClient(id: string): Promise<Client | null> {
    return this.clients.get(id) || null;
  }

  public async createClient(
    clientData: Omit<Client, "id" | "createdAt" | "updatedAt">,
  ): Promise<Client> {
    const id = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const client: Client = {
      id,
      ...clientData,
      createdAt: now,
      updatedAt: now,
    };

    this.clients.set(id, client);
    return client;
  }

  public async updateClient(
    id: string,
    updates: Partial<Client>,
  ): Promise<Client | null> {
    const client = this.clients.get(id);
    if (!client) return null;

    const updatedClient = {
      ...client,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  public async deleteClient(id: string): Promise<boolean> {
    return this.clients.delete(id);
  }

  // Activity tracking
  public async getClientActivities(
    clientId: string,
    limit: number = 50,
  ): Promise<ClientActivity[]> {
    return this.activities
      .filter((activity) => activity.clientId === clientId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, limit);
  }

  public async addClientActivity(
    activity: Omit<ClientActivity, "id">,
  ): Promise<ClientActivity> {
    const id = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newActivity: ClientActivity = { id, ...activity };

    this.activities.unshift(newActivity);
    return newActivity;
  }

  // Notes management
  public async addClientNote(
    clientId: string,
    note: Omit<ClientNote, "id" | "createdAt">,
  ): Promise<ClientNote | null> {
    const client = this.clients.get(clientId);
    if (!client) return null;

    const newNote: ClientNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...note,
      createdAt: new Date().toISOString(),
    };

    client.notes.push(newNote);
    client.updatedAt = new Date().toISOString();

    this.clients.set(clientId, client);
    return newNote;
  }

  // Statistics and analytics
  public async getClientStats(): Promise<{
    total: number;
    active: number;
    onboarding: number;
    inactive: number;
    totalRevenue: number;
    averageMonthlySpend: number;
    topIndustries: Array<{ name: string; count: number }>;
    recentActivities: ClientActivity[];
  }> {
    const clients = Array.from(this.clients.values());

    const stats = {
      total: clients.length,
      active: clients.filter((c) => c.status === "active").length,
      onboarding: clients.filter((c) => c.status === "onboarding").length,
      inactive: clients.filter((c) => c.status === "inactive").length,
      totalRevenue: clients.reduce((sum, c) => sum + c.totalLifetimeValue, 0),
      averageMonthlySpend:
        clients.reduce((sum, c) => sum + c.monthlySpend, 0) / clients.length,
      topIndustries: this.getTopIndustries(clients),
      recentActivities: this.activities
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )
        .slice(0, 10),
    };

    return stats;
  }

  private getTopIndustries(
    clients: Client[],
  ): Array<{ name: string; count: number }> {
    const industryCount = clients.reduce(
      (acc, client) => {
        acc[client.industry] = (acc[client.industry] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(industryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  public async searchClients(query: string): Promise<Client[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.clients.values()).filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm) ||
        client.company.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        client.industry.toLowerCase().includes(searchTerm),
    );
  }
}

export const clientService = new ClientService();
