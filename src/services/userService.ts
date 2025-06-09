import React from "react";

// User interfaces
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department: string;
  joinDate: Date;
  phone?: string;
  bio?: string;
  timezone: string;
  language: string;
  notifications: NotificationSettings;
  preferences: UserPreferences;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  marketing: boolean;
  campaigns: boolean;
  reports: boolean;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  sidebarCollapsed: boolean;
  defaultDashboard: string;
  dateFormat: string;
  currency: string;
}

export interface UserStats {
  campaignsCreated: number;
  totalSpent: number;
  conversions: number;
  avgCTR: number;
  lastLogin: Date;
  accountStatus: "active" | "trial" | "suspended";
}

// Mock user data
const mockUser: UserProfile = {
  id: "user_123",
  name: "John Doe",
  email: "john.doe@company.com",
  avatar: "/api/placeholder/40/40",
  role: "Marketing Manager",
  department: "Digital Marketing",
  joinDate: new Date("2023-03-15"),
  phone: "+1 (555) 123-4567",
  bio: "Experienced marketing professional with 8+ years in digital marketing and campaign management.",
  timezone: "America/New_York",
  language: "en",
  notifications: {
    email: true,
    push: true,
    marketing: false,
    campaigns: true,
    reports: true,
  },
  preferences: {
    theme: "light",
    sidebarCollapsed: false,
    defaultDashboard: "analytics",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
  },
};

const mockUserStats: UserStats = {
  campaignsCreated: 47,
  totalSpent: 125480.5,
  conversions: 2847,
  avgCTR: 3.2,
  lastLogin: new Date(),
  accountStatus: "active",
};

class UserService {
  private user: UserProfile | null = null;
  private stats: UserStats | null = null;

  // Get current user
  async getCurrentUser(): Promise<UserProfile> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.user = mockUser;
    return this.user;
  }

  // Get user stats
  async getUserStats(): Promise<UserStats> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    this.stats = mockUserStats;
    return this.stats;
  }

  // Update user profile
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (this.user) {
      this.user = { ...this.user, ...updates };
    }
    return this.user || mockUser;
  }

  // Update notification settings
  async updateNotifications(settings: NotificationSettings): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (this.user) {
      this.user.notifications = settings;
    }
  }

  // Update user preferences
  async updatePreferences(preferences: UserPreferences): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (this.user) {
      this.user.preferences = preferences;
    }
  }

  // Change password
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    // Mock password validation
    return currentPassword === "oldPassword123";
  }

  // Upload avatar
  async uploadAvatar(file: File): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Mock file upload - return a mock URL
    return `/api/placeholder/40/40?t=${Date.now()}`;
  }

  // Sign out
  async signOut(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    this.user = null;
    this.stats = null;
    // In a real app, this would clear tokens, redirect, etc.
    console.log("User signed out");
  }

  // Delete account
  async deleteAccount(password: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Mock password validation
    if (password === "deleteAccount123") {
      this.user = null;
      this.stats = null;
      return true;
    }
    return false;
  }
}

// Singleton instance
export const userService = new UserService();

// React Context for user data
export const UserContext = React.createContext<{
  user: UserProfile | null;
  stats: UserStats | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateNotifications: (settings: NotificationSettings) => Promise<void>;
  updatePreferences: (preferences: UserPreferences) => Promise<void>;
  changePassword: (current: string, newPassword: string) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}>({
  user: null,
  stats: null,
  loading: false,
  updateProfile: async () => {},
  updateNotifications: async () => {},
  updatePreferences: async () => {},
  changePassword: async () => false,
  uploadAvatar: async () => {},
  signOut: async () => {},
  refreshUser: async () => {},
});

// Custom hook for using user context
export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
