import Fuse from "fuse.js";
import { SearchSuggestion } from "@/components/ui/search-autocomplete";

export interface SearchableItem {
  id: string;
  title: string;
  type: "client" | "audience" | "campaign" | "integration" | "feature";
  category?: string;
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  url?: string;
}

class SearchService {
  private searchableItems: SearchableItem[] = [];
  private fuse: Fuse<SearchableItem>;
  private recentSearches: string[] = [];
  private popularSearches: string[] = [
    "High-value customers",
    "Mobile app users",
    "Email subscribers",
    "Facebook campaign",
    "Analytics dashboard",
    "Export data",
  ];

  constructor() {
    this.initializeSearchableItems();
    this.initializeFuse();
    this.loadRecentSearches();
  }

  private initializeSearchableItems() {
    this.searchableItems = [
      // Clients
      {
        id: "clients-list",
        title: "All Clients",
        type: "client",
        category: "Client Management",
        description: "View and manage all client accounts",
        tags: ["clients", "accounts", "customers"],
        url: "/clients",
      },
      {
        id: "clients-add",
        title: "Add New Client",
        type: "client",
        category: "Client Management",
        description: "Create a new client account",
        tags: ["new", "create", "client", "add"],
        url: "/clients/new",
      },
      {
        id: "acme-corp",
        title: "Acme Corporation",
        type: "client",
        category: "Enterprise Client",
        description: "Fortune 500 technology company focused on B2B solutions",
        tags: ["enterprise", "technology", "b2b", "fortune500"],
        metadata: {
          industry: "Technology",
          tier: "Enterprise",
          status: "Active",
        },
      },
      {
        id: "startup-hub",
        title: "StartupHub Inc",
        type: "client",
        category: "Growth Client",
        description: "Fast-growing startup in the fintech space",
        tags: ["startup", "fintech", "growth", "scaling"],
        metadata: { industry: "Fintech", tier: "Growth", status: "Active" },
      },

      // Audiences
      {
        id: "audiences-list",
        title: "All Audiences",
        type: "audience",
        category: "Audience Management",
        description: "View and manage lookalike audiences",
        tags: ["audiences", "segments", "targeting"],
        url: "/",
      },
      {
        id: "audiences-create",
        title: "Create Audience",
        type: "audience",
        category: "Audience Management",
        description: "Build a new lookalike audience",
        tags: ["create", "new", "audience", "build"],
        url: "/create-audience",
      },
      {
        id: "audiences-upload",
        title: "Upload Customer Data",
        type: "audience",
        category: "Data Import",
        description: "Import customer data from CSV",
        tags: ["upload", "import", "csv", "data"],
      },
      // Sample Audiences
      {
        id: "high-value-customers",
        title: "High-Value Customers",
        type: "audience",
        category: "Lookalike Audience",
        description:
          "Customers with high lifetime value and frequent purchases",
        tags: ["high-value", "premium", "loyal", "revenue"],
        metadata: {
          size: 45000,
          similarity: 92,
          performance: "High",
          status: "Active",
        },
      },
      {
        id: "mobile-app-users",
        title: "Mobile App Power Users",
        type: "audience",
        category: "Behavioral Audience",
        description: "Users who actively engage with our mobile application",
        tags: ["mobile", "app", "engagement", "active"],
        metadata: {
          size: 28000,
          similarity: 88,
          performance: "High",
          status: "Active",
        },
      },
      {
        id: "email-subscribers",
        title: "Newsletter Subscribers",
        type: "audience",
        category: "Engagement Audience",
        description: "Highly engaged email newsletter subscribers",
        tags: ["email", "newsletter", "subscribers", "engaged"],
        metadata: {
          size: 67000,
          similarity: 85,
          performance: "Medium",
          status: "Active",
        },
      },
      {
        id: "cart-abandoners",
        title: "Cart Abandoners",
        type: "audience",
        category: "Retargeting Audience",
        description:
          "Users who added items to cart but didn't complete purchase",
        tags: ["cart", "abandon", "retargeting", "conversion"],
        metadata: {
          size: 15000,
          similarity: 78,
          performance: "Medium",
          status: "Draft",
        },
      },
      {
        id: "social-engagers",
        title: "Social Media Engagers",
        type: "audience",
        category: "Social Audience",
        description: "Users who actively engage with our social media content",
        tags: ["social", "engagement", "content", "followers"],
        metadata: {
          size: 32000,
          similarity: 82,
          performance: "High",
          status: "Active",
        },
      },

      // Campaigns
      {
        id: "campaigns-list",
        title: "All Campaigns",
        type: "campaign",
        category: "Campaign Management",
        description: "View and manage marketing campaigns",
        tags: ["campaigns", "marketing", "ads"],
        url: "/campaigns",
      },
      {
        id: "campaigns-create",
        title: "Create Campaign",
        type: "campaign",
        category: "Campaign Management",
        description: "Launch a new marketing campaign",
        tags: ["create", "new", "campaign", "launch"],
        url: "/campaigns/new",
      },
      // Sample Campaigns
      {
        id: "summer-promotion",
        title: "Summer 2024 Promotion",
        type: "campaign",
        category: "Seasonal Campaign",
        description: "Q3 promotional campaign targeting high-value customers",
        tags: ["summer", "promotion", "seasonal", "q3"],
        metadata: {
          budget: 25000,
          status: "Active",
          platform: "Facebook",
          performance: "High",
        },
      },
      {
        id: "mobile-app-install",
        title: "Mobile App Install Drive",
        type: "campaign",
        category: "App Marketing",
        description: "Campaign focused on driving mobile app installations",
        tags: ["mobile", "app", "install", "acquisition"],
        metadata: {
          budget: 15000,
          status: "Active",
          platform: "Google",
          performance: "Medium",
        },
      },
      {
        id: "retargeting-cart",
        title: "Cart Abandonment Retargeting",
        type: "campaign",
        category: "Retargeting Campaign",
        description: "Re-engage users who abandoned their shopping carts",
        tags: ["retargeting", "cart", "abandonment", "conversion"],
        metadata: {
          budget: 8000,
          status: "Paused",
          platform: "Facebook",
          performance: "High",
        },
      },

      // Analytics
      {
        id: "analytics-dashboard",
        title: "Analytics Dashboard",
        type: "feature",
        category: "Analytics",
        description: "View performance metrics and insights",
        tags: ["analytics", "metrics", "dashboard", "insights"],
        url: "/analytics",
      },
      {
        id: "analytics-realtime",
        title: "Real-time Analytics",
        type: "feature",
        category: "Analytics",
        description: "Live performance monitoring",
        tags: ["realtime", "live", "monitoring"],
        url: "/analytics/realtime",
      },

      // Integrations
      {
        id: "integrations-facebook",
        title: "Facebook Integration",
        type: "integration",
        category: "Platform Integrations",
        description: "Connect with Facebook Ads",
        tags: ["facebook", "social", "ads"],
        url: "/integrations/facebook",
      },
      {
        id: "integrations-google",
        title: "Google Ads Integration",
        type: "integration",
        category: "Platform Integrations",
        description: "Connect with Google Ads",
        tags: ["google", "ads", "search"],
        url: "/integrations/google",
      },

      // Features
      {
        id: "export-data",
        title: "Export Data",
        type: "feature",
        category: "Data Management",
        description: "Export audience or campaign data",
        tags: ["export", "download", "data"],
      },
      {
        id: "api-docs",
        title: "API Documentation",
        type: "feature",
        category: "Developer Tools",
        description: "View API documentation and examples",
        tags: ["api", "docs", "developer"],
        url: "/api-docs",
      },
    ];
  }

  private initializeFuse() {
    const fuseOptions = {
      keys: [
        { name: "title", weight: 0.4 },
        { name: "description", weight: 0.3 },
        { name: "tags", weight: 0.2 },
        { name: "category", weight: 0.1 },
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
    };

    this.fuse = new Fuse(this.searchableItems, fuseOptions);
  }

  private loadRecentSearches() {
    try {
      const stored = localStorage.getItem("skydeo_recent_searches");
      if (stored) {
        this.recentSearches = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load recent searches:", error);
    }
  }

  private saveRecentSearches() {
    try {
      localStorage.setItem(
        "skydeo_recent_searches",
        JSON.stringify(this.recentSearches),
      );
    } catch (error) {
      console.error("Failed to save recent searches:", error);
    }
  }

  // Search functionality
  search(query: string): SearchSuggestion[] {
    if (!query.trim()) {
      return this.getDefaultSuggestions();
    }

    const results = this.fuse.search(query).slice(0, 8);

    return results.map((result) => ({
      id: result.item.id,
      type: "ai",
      text: result.item.title,
      description: result.item.description,
      category: result.item.category,
      metadata: {
        score: result.score,
        url: result.item.url,
        type: result.item.type,
      },
    }));
  }

  // Get AI-powered suggestions based on context
  getAISuggestions(
    query: string,
    context?: Record<string, any>,
  ): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];

    // Intent detection
    const intent = this.detectIntent(query);

    switch (intent) {
      case "create":
        suggestions.push(
          {
            id: "ai-create-audience",
            type: "ai",
            text: "Create a new audience",
            description: "Build a lookalike audience from your data",
          },
          {
            id: "ai-create-campaign",
            type: "ai",
            text: "Launch a new campaign",
            description: "Start a marketing campaign",
          },
        );
        break;

      case "analyze":
        suggestions.push(
          {
            id: "ai-view-analytics",
            type: "ai",
            text: "View analytics dashboard",
            description: "See performance metrics and insights",
          },
          {
            id: "ai-performance-report",
            type: "ai",
            text: "Generate performance report",
            description: "Create detailed performance analysis",
          },
        );
        break;

      case "manage":
        suggestions.push(
          {
            id: "ai-manage-clients",
            type: "ai",
            text: "Manage client accounts",
            description: "View and update client information",
          },
          {
            id: "ai-manage-audiences",
            type: "ai",
            text: "Manage audiences",
            description: "Edit and optimize your audiences",
          },
        );
        break;

      default:
        // Contextual suggestions based on current page
        if (context?.currentPage) {
          suggestions.push(
            ...this.getContextualSuggestions(context.currentPage),
          );
        }
    }

    return suggestions.slice(0, 3);
  }

  private detectIntent(query: string): string {
    const createKeywords = [
      "create",
      "new",
      "add",
      "build",
      "make",
      "start",
      "launch",
    ];
    const analyzeKeywords = [
      "analyze",
      "view",
      "see",
      "show",
      "report",
      "metrics",
      "analytics",
    ];
    const manageKeywords = ["manage", "edit", "update", "change", "modify"];

    const lowerQuery = query.toLowerCase();

    if (createKeywords.some((keyword) => lowerQuery.includes(keyword))) {
      return "create";
    }
    if (analyzeKeywords.some((keyword) => lowerQuery.includes(keyword))) {
      return "analyze";
    }
    if (manageKeywords.some((keyword) => lowerQuery.includes(keyword))) {
      return "manage";
    }

    return "general";
  }

  private getContextualSuggestions(currentPage: string): SearchSuggestion[] {
    const contextualMap: Record<string, SearchSuggestion[]> = {
      "/clients": [
        {
          id: "ctx-add-client",
          type: "ai",
          text: "Add new client",
          description: "Create a new client account",
        },
        {
          id: "ctx-client-analytics",
          type: "ai",
          text: "View client performance",
          description: "Analyze client metrics and ROI",
        },
      ],
      "/": [
        {
          id: "ctx-create-audience",
          type: "ai",
          text: "Create audience",
          description: "Build a new lookalike audience",
        },
        {
          id: "ctx-upload-data",
          type: "ai",
          text: "Upload customer data",
          description: "Import CSV file for audience creation",
        },
      ],
      "/analytics": [
        {
          id: "ctx-export-report",
          type: "ai",
          text: "Export analytics report",
          description: "Download performance data",
        },
        {
          id: "ctx-realtime-data",
          type: "ai",
          text: "View real-time data",
          description: "See live performance metrics",
        },
      ],
    };

    return contextualMap[currentPage] || [];
  }

  // Get default suggestions when no query
  getDefaultSuggestions(): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];

    // Add recent searches
    this.recentSearches.slice(0, 3).forEach((search) => {
      suggestions.push({
        id: `recent-${search}`,
        type: "recent",
        text: search,
      });
    });

    // Add popular searches
    this.popularSearches.slice(0, 3).forEach((search) => {
      suggestions.push({
        id: `popular-${search}`,
        type: "popular",
        text: search,
      });
    });

    return suggestions;
  }

  // Add search to recent searches
  addToRecentSearches(query: string) {
    if (!query.trim()) return;

    // Remove if already exists
    this.recentSearches = this.recentSearches.filter(
      (search) => search !== query,
    );

    // Add to beginning
    this.recentSearches.unshift(query);

    // Keep only last 10
    this.recentSearches = this.recentSearches.slice(0, 10);

    // Save to localStorage
    this.saveRecentSearches();
  }

  // Get suggestions for filters
  getFilterSuggestions(currentFilters: string[] = []): SearchSuggestion[] {
    const availableFilters = [
      { id: "status-active", label: "Active", value: "active", count: 24 },
      { id: "status-paused", label: "Paused", value: "paused", count: 5 },
      {
        id: "type-enterprise",
        label: "Enterprise",
        value: "enterprise",
        count: 8,
      },
      { id: "type-premium", label: "Premium", value: "premium", count: 12 },
      {
        id: "industry-tech",
        label: "Technology",
        value: "technology",
        count: 15,
      },
      { id: "industry-retail", label: "Retail", value: "retail", count: 9 },
    ];

    return availableFilters
      .filter((filter) => !currentFilters.includes(filter.id))
      .map((filter) => ({
        id: filter.id,
        type: "filter",
        text: filter.label,
        description: `${filter.count} results`,
        metadata: { filter },
      }));
  }

  // Get popular searches
  getPopularSearches(): string[] {
    return [...this.popularSearches];
  }

  // Get recent searches
  getRecentSearches(): string[] {
    return [...this.recentSearches];
  }

  // Clear recent searches
  clearRecentSearches() {
    this.recentSearches = [];
    this.saveRecentSearches();
  }

  // Add searchable item dynamically
  addSearchableItem(item: SearchableItem) {
    this.searchableItems.push(item);
    this.initializeFuse(); // Reinitialize Fuse with new data
  }

  // Remove searchable item
  removeSearchableItem(id: string) {
    this.searchableItems = this.searchableItems.filter(
      (item) => item.id !== id,
    );
    this.initializeFuse();
  }

  // Update searchable item
  updateSearchableItem(id: string, updates: Partial<SearchableItem>) {
    const index = this.searchableItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.searchableItems[index] = {
        ...this.searchableItems[index],
        ...updates,
      };
      this.initializeFuse();
    }
  }

  // Bulk update searchable items (useful for dynamic data)
  updateSearchableItems(items: SearchableItem[]) {
    this.searchableItems = items;
    this.initializeFuse();
  }
}

export const searchService = new SearchService();
export default searchService;
