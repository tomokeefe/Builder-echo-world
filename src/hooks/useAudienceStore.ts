import { useState, useEffect } from "react";
import { Audience, AudienceFilters, AudienceStats } from "@/types/audience";

// Initial mock data
const initialAudiences: Audience[] = [
  {
    id: "1",
    name: "High-Value Customers",
    description:
      "Customers who have made purchases over $500 in the last 6 months",
    size: 2300000,
    similarity: 92,
    status: "Active",
    created: "2024-01-15",
    performance: "High",
    source: "Customer Database",
    targetingCriteria: {
      demographics: ["Age 25-45", "Income $75k+", "Urban areas"],
      interests: ["Luxury goods", "Technology", "Travel"],
      behaviors: ["Frequent purchaser", "Brand loyal", "Early adopter"],
    },
    campaignData: {
      reach: 2100000,
      engagement: 87,
      conversion: 34,
      clicks: 45000,
      impressions: 890000,
    },
  },
  {
    id: "2",
    name: "Mobile App Users",
    description: "Active users who engage with our mobile application daily",
    size: 1800000,
    similarity: 88,
    status: "Active",
    created: "2024-01-10",
    performance: "Medium",
    source: "App Analytics",
    targetingCriteria: {
      demographics: ["Age 18-35", "Tech-savvy", "Mobile-first"],
      interests: ["Gaming", "Social media", "Mobile apps"],
      behaviors: ["Daily app usage", "In-app purchases", "Social sharing"],
    },
    campaignData: {
      reach: 1650000,
      engagement: 62,
      conversion: 28,
      clicks: 32000,
      impressions: 720000,
    },
  },
  {
    id: "3",
    name: "Newsletter Subscribers",
    description: "Engaged email subscribers with high open rates",
    size: 945000,
    similarity: 85,
    status: "Paused",
    created: "2024-01-05",
    performance: "Low",
    source: "Email Platform",
    targetingCriteria: {
      demographics: ["Age 30-55", "Professional", "Suburban"],
      interests: ["Industry news", "Professional development", "Networking"],
      behaviors: ["Email engagement", "Content sharing", "Event attendance"],
    },
    campaignData: {
      reach: 820000,
      engagement: 45,
      conversion: 18,
      clicks: 18000,
      impressions: 450000,
    },
  },
];

const STORAGE_KEY = "lookalike-audiences";

export const useAudienceStore = () => {
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AudienceFilters>({
    status: "all",
    performance: "all",
    source: "all",
    search: "",
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setAudiences(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading audiences from storage:", error);
        setAudiences(initialAudiences);
      }
    } else {
      setAudiences(initialAudiences);
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever audiences change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(audiences));
    }
  }, [audiences, loading]);

  // Filter audiences based on current filters
  const filteredAudiences = audiences.filter((audience) => {
    const matchesStatus =
      filters.status === "all" || audience.status === filters.status;
    const matchesPerformance =
      filters.performance === "all" ||
      audience.performance === filters.performance;
    const matchesSource =
      filters.source === "all" || audience.source === filters.source;
    const matchesSearch =
      filters.search === "" ||
      audience.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      audience.description
        ?.toLowerCase()
        .includes(filters.search.toLowerCase());

    return (
      matchesStatus && matchesPerformance && matchesSource && matchesSearch
    );
  });

  // Calculate stats
  const stats: AudienceStats = {
    totalAudiences: audiences.length,
    totalReach: audiences.reduce((sum, audience) => sum + audience.size, 0),
    avgSimilarity:
      audiences.length > 0
        ? Math.round(
            audiences.reduce((sum, audience) => sum + audience.similarity, 0) /
              audiences.length,
          )
        : 0,
    activeCampaigns: audiences.filter(
      (audience) => audience.status === "Active",
    ).length,
  };

  // CRUD operations
  const createAudience = (audienceData: Omit<Audience, "id" | "created">) => {
    const newAudience: Audience = {
      ...audienceData,
      id: Date.now().toString(),
      created: new Date().toISOString().split("T")[0],
    };
    setAudiences((prev) => [...prev, newAudience]);
    return newAudience;
  };

  const updateAudience = (id: string, updates: Partial<Audience>) => {
    setAudiences((prev) =>
      prev.map((audience) =>
        audience.id === id ? { ...audience, ...updates } : audience,
      ),
    );
  };

  const deleteAudience = (id: string) => {
    setAudiences((prev) => prev.filter((audience) => audience.id !== id));
  };

  const duplicateAudience = (id: string) => {
    const audience = audiences.find((a) => a.id === id);
    if (audience) {
      const duplicated = {
        ...audience,
        id: Date.now().toString(),
        name: `${audience.name} (Copy)`,
        created: new Date().toISOString().split("T")[0],
        status: "Draft" as const,
      };
      setAudiences((prev) => [...prev, duplicated]);
      return duplicated;
    }
  };

  const getAudience = (id: string) => {
    return audiences.find((audience) => audience.id === id);
  };

  return {
    audiences: filteredAudiences,
    allAudiences: audiences,
    loading,
    filters,
    stats,
    setFilters,
    createAudience,
    updateAudience,
    deleteAudience,
    duplicateAudience,
    getAudience,
  };
};
