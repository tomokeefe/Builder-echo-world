import React, { useState, useEffect, useCallback } from "react";
import {
  UserContext,
  UserProfile,
  UserStats,
  NotificationSettings,
  UserPreferences,
  userService,
} from "@/services/userService";

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const [userData, statsData] = await Promise.all([
          userService.getCurrentUser(),
          userService.getUserStats(),
        ]);
        setUser(userData);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      const updatedUser = await userService.updateProfile(updates);
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  }, []);

  const updateNotifications = useCallback(
    async (settings: NotificationSettings) => {
      try {
        await userService.updateNotifications(settings);
        if (user) {
          setUser({ ...user, notifications: settings });
        }
      } catch (error) {
        console.error("Failed to update notifications:", error);
        throw error;
      }
    },
    [user],
  );

  const updatePreferences = useCallback(
    async (preferences: UserPreferences) => {
      try {
        await userService.updatePreferences(preferences);
        if (user) {
          setUser({ ...user, preferences });
        }
      } catch (error) {
        console.error("Failed to update preferences:", error);
        throw error;
      }
    },
    [user],
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<boolean> => {
      try {
        return await userService.changePassword(currentPassword, newPassword);
      } catch (error) {
        console.error("Failed to change password:", error);
        throw error;
      }
    },
    [],
  );

  const uploadAvatar = useCallback(
    async (file: File) => {
      try {
        const avatarUrl = await userService.uploadAvatar(file);
        if (user) {
          setUser({ ...user, avatar: avatarUrl });
        }
      } catch (error) {
        console.error("Failed to upload avatar:", error);
        throw error;
      }
    },
    [user],
  );

  const signOut = useCallback(async () => {
    try {
      await userService.signOut();
      setUser(null);
      setStats(null);
      // In a real app, this would handle routing to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Failed to sign out:", error);
      throw error;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const [userData, statsData] = await Promise.all([
        userService.getCurrentUser(),
        userService.getUserStats(),
      ]);
      setUser(userData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    stats,
    loading,
    updateProfile,
    updateNotifications,
    updatePreferences,
    changePassword,
    uploadAvatar,
    signOut,
    refreshUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
