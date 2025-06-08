export interface Tenant {
  id: string;
  name: string;
  domain: string;
  subdomain: string;
  plan: "starter" | "professional" | "enterprise" | "agency";
  status: "active" | "suspended" | "trial" | "pending";
  createdAt: string;
  updatedAt: string;
  settings: TenantSettings;
  limits: TenantLimits;
  billing: TenantBilling;
  users: TenantUser[];
  whiteLabel: WhiteLabelConfig;
}

export interface TenantSettings {
  features: {
    aiRecommendations: boolean;
    realTimeAnalytics: boolean;
    advancedIntegrations: boolean;
    customReporting: boolean;
    multiUserAccess: boolean;
    apiAccess: boolean;
    whiteLabeling: boolean;
    ssoIntegration: boolean;
  };
  security: {
    twoFactorRequired: boolean;
    sessionTimeout: number; // minutes
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
    };
    ipWhitelist: string[];
    dataRetention: number; // days
  };
  customization: {
    timezone: string;
    dateFormat: string;
    currency: string;
    language: string;
  };
}

export interface TenantLimits {
  audiences: number;
  campaigns: number;
  integrations: number;
  users: number;
  dataPoints: number; // monthly
  apiCalls: number; // monthly
  storage: number; // GB
}

export interface TenantBilling {
  plan: string;
  amount: number;
  currency: string;
  billingCycle: "monthly" | "annual";
  nextBillingDate: string;
  paymentMethod: string;
  invoices: Invoice[];
  usage: UsageMetrics;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "overdue" | "failed";
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface UsageMetrics {
  currentPeriod: {
    start: string;
    end: string;
  };
  audiences: { used: number; limit: number };
  campaigns: { used: number; limit: number };
  users: { used: number; limit: number };
  dataPoints: { used: number; limit: number };
  apiCalls: { used: number; limit: number };
  storage: { used: number; limit: number };
}

export interface TenantUser {
  id: string;
  email: string;
  name: string;
  role: "owner" | "admin" | "manager" | "analyst" | "viewer";
  status: "active" | "invited" | "suspended";
  lastLogin?: string;
  permissions: Permission[];
  preferences: UserPreferences;
}

export interface Permission {
  resource: string;
  actions: string[]; // 'read', 'write', 'delete', 'manage'
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    frequency: "real-time" | "daily" | "weekly";
  };
  dashboard: {
    defaultView: string;
    widgets: string[];
  };
}

export interface WhiteLabelConfig {
  enabled: boolean;
  branding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    companyName: string;
  };
  domain: {
    custom: boolean;
    url?: string;
    ssl: boolean;
  };
  emailTemplates: {
    header: string;
    footer: string;
    styles: Record<string, string>;
  };
}

export interface TenantInvitation {
  id: string;
  tenantId: string;
  email: string;
  role: TenantUser["role"];
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: "pending" | "accepted" | "expired" | "cancelled";
  token: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

class MultiTenantManager {
  private tenants: Map<string, Tenant> = new Map();
  private invitations: Map<string, TenantInvitation> = new Map();
  private auditLogs: AuditLog[] = [];
  private currentTenantId: string | null = null;

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create demo tenants
    const demoTenant: Tenant = {
      id: "tenant_demo",
      name: "Demo Agency",
      domain: "demo-agency.com",
      subdomain: "demo",
      plan: "professional",
      status: "active",
      createdAt: new Date("2024-01-01").toISOString(),
      updatedAt: new Date().toISOString(),
      settings: {
        features: {
          aiRecommendations: true,
          realTimeAnalytics: true,
          advancedIntegrations: true,
          customReporting: true,
          multiUserAccess: true,
          apiAccess: true,
          whiteLabeling: false,
          ssoIntegration: false,
        },
        security: {
          twoFactorRequired: false,
          sessionTimeout: 480,
          passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireNumbers: true,
            requireSymbols: false,
          },
          ipWhitelist: [],
          dataRetention: 365,
        },
        customization: {
          timezone: "America/New_York",
          dateFormat: "MM/DD/YYYY",
          currency: "USD",
          language: "en",
        },
      },
      limits: {
        audiences: 100,
        campaigns: 50,
        integrations: 5,
        users: 10,
        dataPoints: 1000000,
        apiCalls: 50000,
        storage: 10,
      },
      billing: {
        plan: "Professional",
        amount: 299,
        currency: "USD",
        billingCycle: "monthly",
        nextBillingDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        paymentMethod: "**** 1234",
        invoices: [],
        usage: {
          currentPeriod: {
            start: new Date(
              Date.now() - 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            end: new Date().toISOString(),
          },
          audiences: { used: 23, limit: 100 },
          campaigns: { used: 8, limit: 50 },
          users: { used: 3, limit: 10 },
          dataPoints: { used: 456789, limit: 1000000 },
          apiCalls: { used: 12430, limit: 50000 },
          storage: { used: 2.3, limit: 10 },
        },
      },
      users: [
        {
          id: "user_1",
          email: "admin@demo-agency.com",
          name: "Agency Admin",
          role: "owner",
          status: "active",
          lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          permissions: [
            { resource: "*", actions: ["read", "write", "delete", "manage"] },
          ],
          preferences: {
            notifications: {
              email: true,
              push: true,
              frequency: "daily",
            },
            dashboard: {
              defaultView: "overview",
              widgets: ["metrics", "campaigns", "audiences"],
            },
          },
        },
      ],
      whiteLabel: {
        enabled: false,
        branding: {
          logo: "",
          primaryColor: "#3B82F6",
          secondaryColor: "#1F2937",
          fontFamily: "Inter",
          companyName: "Demo Agency",
        },
        domain: {
          custom: false,
          ssl: true,
        },
        emailTemplates: {
          header: "",
          footer: "",
          styles: {},
        },
      },
    };

    this.tenants.set(demoTenant.id, demoTenant);
    this.currentTenantId = demoTenant.id;
  }

  public async createTenant(
    tenantData: Omit<Tenant, "id" | "createdAt" | "updatedAt">,
  ): Promise<Tenant> {
    const id = `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const tenant: Tenant = {
      id,
      ...tenantData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tenants.set(id, tenant);
    this.logAction("tenant_created", "tenant", id, { name: tenant.name });

    return tenant;
  }

  public async getTenant(tenantId: string): Promise<Tenant | null> {
    return this.tenants.get(tenantId) || null;
  }

  public async updateTenant(
    tenantId: string,
    updates: Partial<Tenant>,
  ): Promise<Tenant | null> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return null;

    const updatedTenant = {
      ...tenant,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.tenants.set(tenantId, updatedTenant);
    this.logAction("tenant_updated", "tenant", tenantId, updates);

    return updatedTenant;
  }

  public async inviteUser(
    tenantId: string,
    email: string,
    role: TenantUser["role"],
    invitedBy: string,
  ): Promise<TenantInvitation> {
    const invitation: TenantInvitation = {
      id: `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      email,
      role,
      invitedBy,
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "pending",
      token: Math.random().toString(36).substr(2, 32),
    };

    this.invitations.set(invitation.id, invitation);
    this.logAction("user_invited", "user", email, { role, invitedBy });

    return invitation;
  }

  public async acceptInvitation(
    invitationId: string,
    userData: {
      name: string;
      password: string;
    },
  ): Promise<{ success: boolean; user?: TenantUser; error?: string }> {
    const invitation = this.invitations.get(invitationId);

    if (!invitation) {
      return { success: false, error: "Invitation not found" };
    }

    if (invitation.status !== "pending") {
      return { success: false, error: "Invitation is no longer valid" };
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      invitation.status = "expired";
      return { success: false, error: "Invitation has expired" };
    }

    const tenant = this.tenants.get(invitation.tenantId);
    if (!tenant) {
      return { success: false, error: "Tenant not found" };
    }

    const newUser: TenantUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: invitation.email,
      name: userData.name,
      role: invitation.role,
      status: "active",
      permissions: this.getDefaultPermissions(invitation.role),
      preferences: {
        notifications: {
          email: true,
          push: true,
          frequency: "daily",
        },
        dashboard: {
          defaultView: "overview",
          widgets: ["metrics"],
        },
      },
    };

    tenant.users.push(newUser);
    invitation.status = "accepted";

    this.tenants.set(tenant.id, tenant);
    this.logAction("user_accepted_invitation", "user", newUser.id, {
      email: newUser.email,
    });

    return { success: true, user: newUser };
  }

  private getDefaultPermissions(role: TenantUser["role"]): Permission[] {
    const permissions: Record<TenantUser["role"], Permission[]> = {
      owner: [
        { resource: "*", actions: ["read", "write", "delete", "manage"] },
      ],
      admin: [
        { resource: "audiences", actions: ["read", "write", "delete"] },
        { resource: "campaigns", actions: ["read", "write", "delete"] },
        { resource: "integrations", actions: ["read", "write"] },
        { resource: "users", actions: ["read", "write"] },
        { resource: "analytics", actions: ["read"] },
      ],
      manager: [
        { resource: "audiences", actions: ["read", "write"] },
        { resource: "campaigns", actions: ["read", "write"] },
        { resource: "analytics", actions: ["read"] },
      ],
      analyst: [
        { resource: "audiences", actions: ["read"] },
        { resource: "campaigns", actions: ["read"] },
        { resource: "analytics", actions: ["read"] },
      ],
      viewer: [
        { resource: "audiences", actions: ["read"] },
        { resource: "campaigns", actions: ["read"] },
        { resource: "analytics", actions: ["read"] },
      ],
    };

    return permissions[role];
  }

  public async updateUserRole(
    tenantId: string,
    userId: string,
    newRole: TenantUser["role"],
  ): Promise<{ success: boolean; error?: string }> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return { success: false, error: "Tenant not found" };

    const userIndex = tenant.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return { success: false, error: "User not found" };

    tenant.users[userIndex].role = newRole;
    tenant.users[userIndex].permissions = this.getDefaultPermissions(newRole);

    this.tenants.set(tenantId, tenant);
    this.logAction("user_role_updated", "user", userId, { newRole });

    return { success: true };
  }

  public async removeUser(
    tenantId: string,
    userId: string,
  ): Promise<{ success: boolean; error?: string }> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return { success: false, error: "Tenant not found" };

    const userIndex = tenant.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return { success: false, error: "User not found" };

    // Cannot remove the last owner
    const user = tenant.users[userIndex];
    if (
      user.role === "owner" &&
      tenant.users.filter((u) => u.role === "owner").length === 1
    ) {
      return { success: false, error: "Cannot remove the last owner" };
    }

    tenant.users.splice(userIndex, 1);
    this.tenants.set(tenantId, tenant);
    this.logAction("user_removed", "user", userId, { email: user.email });

    return { success: true };
  }

  public async configureWhiteLabel(
    tenantId: string,
    config: WhiteLabelConfig,
  ): Promise<{ success: boolean; error?: string }> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return { success: false, error: "Tenant not found" };

    if (!tenant.settings.features.whiteLabeling) {
      return {
        success: false,
        error: "White labeling not available in current plan",
      };
    }

    tenant.whiteLabel = config;
    tenant.updatedAt = new Date().toISOString();

    this.tenants.set(tenantId, tenant);
    this.logAction("white_label_configured", "tenant", tenantId, {
      enabled: config.enabled,
    });

    return { success: true };
  }

  public async getUsageMetrics(tenantId: string): Promise<UsageMetrics | null> {
    const tenant = this.tenants.get(tenantId);
    return tenant?.billing.usage || null;
  }

  public async updateUsage(
    tenantId: string,
    resource: keyof UsageMetrics,
    amount: number,
  ): Promise<void> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant || resource === "currentPeriod") return;

    const usage = tenant.billing.usage[resource] as {
      used: number;
      limit: number;
    };
    if (usage) {
      usage.used = Math.min(usage.used + amount, usage.limit);
      this.tenants.set(tenantId, tenant);
    }
  }

  public checkResourceLimit(
    tenantId: string,
    resource: keyof TenantLimits,
    requestedAmount: number = 1,
  ): { allowed: boolean; current: number; limit: number; remaining: number } {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) {
      return { allowed: false, current: 0, limit: 0, remaining: 0 };
    }

    const limit = tenant.limits[resource];
    const current =
      tenant.billing.usage[resource as keyof UsageMetrics]?.used || 0;
    const remaining = limit - current;
    const allowed = remaining >= requestedAmount;

    return { allowed, current, limit, remaining };
  }

  public getAuditLogs(
    tenantId: string,
    filters?: {
      userId?: string;
      action?: string;
      resource?: string;
      startDate?: string;
      endDate?: string;
    },
  ): AuditLog[] {
    let logs = this.auditLogs.filter((log) => log.tenantId === tenantId);

    if (filters) {
      if (filters.userId)
        logs = logs.filter((log) => log.userId === filters.userId);
      if (filters.action)
        logs = logs.filter((log) => log.action.includes(filters.action!));
      if (filters.resource)
        logs = logs.filter((log) => log.resource === filters.resource);
      if (filters.startDate)
        logs = logs.filter((log) => log.timestamp >= filters.startDate!);
      if (filters.endDate)
        logs = logs.filter((log) => log.timestamp <= filters.endDate!);
    }

    return logs.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }

  private logAction(
    action: string,
    resource: string,
    resourceId: string,
    details: Record<string, any> = {},
  ): void {
    if (!this.currentTenantId) return;

    const log: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId: this.currentTenantId,
      userId: "current_user", // In real implementation, get from auth context
      action,
      resource,
      resourceId,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: "192.168.1.1", // In real implementation, get from request
      userAgent: "Mozilla/5.0...", // In real implementation, get from request
    };

    this.auditLogs.push(log);
  }

  public setCurrentTenant(tenantId: string): void {
    this.currentTenantId = tenantId;
  }

  public getCurrentTenant(): Tenant | null {
    return this.currentTenantId
      ? this.tenants.get(this.currentTenantId) || null
      : null;
  }

  public getAllTenants(): Tenant[] {
    return Array.from(this.tenants.values());
  }

  public async suspendTenant(
    tenantId: string,
    reason: string,
  ): Promise<{ success: boolean; error?: string }> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return { success: false, error: "Tenant not found" };

    tenant.status = "suspended";
    tenant.updatedAt = new Date().toISOString();

    this.tenants.set(tenantId, tenant);
    this.logAction("tenant_suspended", "tenant", tenantId, { reason });

    return { success: true };
  }

  public async reactivateTenant(
    tenantId: string,
  ): Promise<{ success: boolean; error?: string }> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return { success: false, error: "Tenant not found" };

    tenant.status = "active";
    tenant.updatedAt = new Date().toISOString();

    this.tenants.set(tenantId, tenant);
    this.logAction("tenant_reactivated", "tenant", tenantId, {});

    return { success: true };
  }
}

export const multiTenantManager = new MultiTenantManager();
