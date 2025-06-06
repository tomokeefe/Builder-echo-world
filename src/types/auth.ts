export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  team?: string;
  department?: string;
  lastLogin: string;
  created: string;
  status: "active" | "inactive" | "pending";
  preferences: UserPreferences;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  level: number; // 1 = viewer, 2 = editor, 3 = manager, 4 = admin
  permissions: Permission[];
}

export interface Permission {
  id: string;
  resource:
    | "audiences"
    | "campaigns"
    | "analytics"
    | "users"
    | "settings"
    | "billing";
  actions: ("create" | "read" | "update" | "delete" | "share" | "export")[];
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  field: string;
  operator: "equals" | "contains" | "greater_than" | "less_than";
  value: any;
}

export interface UserPreferences {
  theme: "light" | "dark" | "auto";
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  dashboard: DashboardPreferences;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  channels: {
    campaigns: boolean;
    audiences: boolean;
    alerts: boolean;
    reports: boolean;
  };
}

export interface DashboardPreferences {
  layout: "default" | "compact" | "detailed";
  widgets: DashboardWidget[];
  refreshInterval: number;
}

export interface DashboardWidget {
  id: string;
  type: string;
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  timestamp: string;
  ip: string;
  userAgent: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  members: string[]; // user IDs
  created: string;
  permissions: Permission[];
}

export interface AuthSession {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: Permission[];
  created: string;
  lastUsed?: string;
  expiresAt?: string;
  status: "active" | "revoked";
}
