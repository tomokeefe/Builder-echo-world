export interface Integration {
  id: string;
  name: string;
  type: "ads" | "crm" | "email" | "analytics" | "ecommerce";
  platform: IntegrationPlatform;
  status: "connected" | "disconnected" | "error" | "pending";
  credentials: IntegrationCredentials;
  configuration: IntegrationConfig;
  lastSync: string;
  syncFrequency: "realtime" | "hourly" | "daily" | "weekly";
  created: string;
  permissions: string[];
}

export type IntegrationPlatform =
  | "facebook"
  | "google_ads"
  | "google_analytics"
  | "instagram"
  | "twitter"
  | "linkedin"
  | "tiktok"
  | "snapchat"
  | "pinterest"
  | "hubspot"
  | "salesforce"
  | "mailchimp"
  | "sendgrid"
  | "shopify"
  | "woocommerce"
  | "stripe"
  | "segment";

export interface IntegrationCredentials {
  type: "oauth" | "api_key" | "username_password";
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  expiresAt?: string;
  scopes?: string[];
}

export interface IntegrationConfig {
  autoSync: boolean;
  syncFields: string[];
  mapping: FieldMapping[];
  filters: IntegrationFilter[];
  webhooks: WebhookConfig[];
}

export interface FieldMapping {
  source: string;
  target: string;
  transformation?: "lowercase" | "uppercase" | "trim" | "normalize";
}

export interface IntegrationFilter {
  field: string;
  operator: "equals" | "contains" | "greater_than" | "less_than";
  value: any;
}

export interface WebhookConfig {
  url: string;
  events: string[];
  secret?: string;
  retries: number;
}

export interface SyncResult {
  id: string;
  integrationId: string;
  startTime: string;
  endTime: string;
  status: "success" | "error" | "partial";
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsSkipped: number;
  errors: SyncError[];
}

export interface SyncError {
  record: any;
  field?: string;
  message: string;
  code: string;
}

// Platform-specific interfaces
export interface FacebookAdsIntegration extends Integration {
  platform: "facebook";
  adAccounts: FacebookAdAccount[];
  customAudiences: FacebookCustomAudience[];
}

export interface FacebookAdAccount {
  id: string;
  name: string;
  currency: string;
  status: string;
  permissions: string[];
}

export interface FacebookCustomAudience {
  id: string;
  name: string;
  description: string;
  size: number;
  status: string;
  lastUpdated: string;
}

export interface GoogleAdsIntegration extends Integration {
  platform: "google_ads";
  accounts: GoogleAdsAccount[];
  customerLists: GoogleCustomerList[];
}

export interface GoogleAdsAccount {
  id: string;
  name: string;
  currency: string;
  timeZone: string;
  status: string;
}

export interface GoogleCustomerList {
  id: string;
  name: string;
  description: string;
  membershipLifeSpan: number;
  sizeForDisplay: number;
  membershipStatus: string;
}

export interface HubSpotIntegration extends Integration {
  platform: "hubspot";
  portalId: string;
  contacts: HubSpotContactList[];
  properties: HubSpotProperty[];
}

export interface HubSpotContactList {
  id: string;
  name: string;
  size: number;
  filters: any[];
  lastUpdated: string;
}

export interface HubSpotProperty {
  name: string;
  label: string;
  type: string;
  fieldType: string;
  options?: { label: string; value: string }[];
}

export interface MailchimpIntegration extends Integration {
  platform: "mailchimp";
  lists: MailchimpList[];
  segments: MailchimpSegment[];
}

export interface MailchimpList {
  id: string;
  name: string;
  memberCount: number;
  subscribeUrlShort: string;
  dateCreated: string;
}

export interface MailchimpSegment {
  id: string;
  name: string;
  memberCount: number;
  type: "saved" | "static" | "fuzzy";
  options: any;
}
