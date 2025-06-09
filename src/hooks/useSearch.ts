import { useState, useEffect, useCallback, useMemo } from "react";
// Simple debounce implementation instead of external library
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue];
};
import searchService, { SearchableItem } from "@/services/searchService";
import { SearchSuggestion } from "@/components/ui/search-autocomplete";
import { useAudienceStore } from "@/hooks/useAudienceStore";

export interface SearchState {
  query: string;
  results: SearchSuggestion[];
  isLoading: boolean;
  hasSearched: boolean;
  error: string | null;
  filters: string[];
  sortBy: "relevance" | "date" | "name" | "type";
  sortOrder: "asc" | "desc";
}

export interface SearchFilters {
  types?: string[];
  categories?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  status?: string[];
}

const initialState: SearchState = {
  query: "",
  results: [],
  isLoading: false,
  hasSearched: false,
  error: null,
  filters: [],
  sortBy: "relevance",
  sortOrder: "desc",
};

export const useSearch = (options?: {
  debounceMs?: number;
  maxResults?: number;
  enableAI?: boolean;
  context?: Record<string, any>;
}) => {
  const {
    debounceMs = 300,
    maxResults = 10,
    enableAI = true,
    context = {},
  } = options || {};

  const [state, setState] = useState<SearchState>(initialState);
  const [debouncedQuery] = useDebounce(state.query, debounceMs);

  // Perform search
  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setState((prev) => ({
          ...prev,
          results: searchService.getDefaultSuggestions(),
          isLoading: false,
          hasSearched: false,
          error: null,
        }));
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // Get basic search results
        const searchResults = searchService.search(query);

        // Get AI suggestions if enabled
        const aiSuggestions = enableAI
          ? searchService.getAISuggestions(query, context)
          : [];

        // Get filter suggestions
        const filterSuggestions = searchService.getFilterSuggestions(
          state.filters,
        );

        // Combine and limit results
        const allResults = [
          ...aiSuggestions,
          ...searchResults,
          ...filterSuggestions.slice(0, 2),
        ].slice(0, maxResults);

        setState((prev) => ({
          ...prev,
          results: allResults,
          isLoading: false,
          hasSearched: true,
        }));

        // Add to recent searches
        searchService.addToRecentSearches(query);
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Search failed",
          isLoading: false,
          results: [],
        }));
      }
    },
    [maxResults, enableAI, context, state.filters],
  );

  // Effect to trigger search when debounced query changes
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  // Set search query
  const setQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, query }));
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setState(initialState);
  }, []);

  // Add filter
  const addFilter = useCallback((filterId: string) => {
    setState((prev) => ({
      ...prev,
      filters: [...prev.filters, filterId],
    }));
  }, []);

  // Remove filter
  const removeFilter = useCallback((filterId: string) => {
    setState((prev) => ({
      ...prev,
      filters: prev.filters.filter((id) => id !== filterId),
    }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setState((prev) => ({ ...prev, filters: [] }));
  }, []);

  // Set sorting
  const setSorting = useCallback(
    (sortBy: SearchState["sortBy"], sortOrder: SearchState["sortOrder"]) => {
      setState((prev) => ({ ...prev, sortBy, sortOrder }));
    },
    [],
  );

  // Get recent searches
  const recentSearches = useMemo(() => {
    return searchService.getRecentSearches();
  }, [state.query]); // Re-compute when query changes

  // Get popular searches
  const popularSearches = useMemo(() => {
    return searchService.getPopularSearches();
  }, []);

  // Get suggestions based on current query
  const suggestions = useMemo(() => {
    if (!state.query.trim()) {
      return searchService.getDefaultSuggestions();
    }
    return state.results;
  }, [state.query, state.results]);

  // Search shortcuts
  const searchShortcuts = useMemo(
    () => [
      {
        id: "create-audience",
        title: "Create Audience",
        description: "Build a new lookalike audience",
        shortcut: "Ctrl+N",
        action: () => console.log("Navigate to create audience"),
      },
      {
        id: "view-analytics",
        title: "View Analytics",
        description: "Open analytics dashboard",
        shortcut: "Ctrl+A",
        action: () => console.log("Navigate to analytics"),
      },
      {
        id: "add-client",
        title: "Add Client",
        description: "Create a new client account",
        shortcut: "Ctrl+Shift+C",
        action: () => console.log("Open add client modal"),
      },
    ],
    [],
  );

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback(
    (suggestion: SearchSuggestion) => {
      // Add to recent searches if it's a search suggestion
      if (suggestion.type !== "filter" && suggestion.type !== "shortcut") {
        searchService.addToRecentSearches(suggestion.text);
      }

      // Handle different suggestion types
      switch (suggestion.type) {
        case "filter":
          addFilter(suggestion.id);
          break;
        case "shortcut":
          suggestion.action?.();
          break;
        default:
          // Navigate to URL if available
          if (suggestion.metadata?.url) {
            window.location.href = suggestion.metadata.url;
          }
          break;
      }
    },
    [addFilter],
  );

  // Advanced search with filters
  const advancedSearch = useCallback(
    async (query: string, filters: SearchFilters) => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        // This would integrate with a more sophisticated search API
        const results = searchService.search(query);

        // Apply filters (mock implementation)
        let filteredResults = results;

        if (filters.types?.length) {
          filteredResults = filteredResults.filter((result) =>
            filters.types!.includes(result.metadata?.type),
          );
        }

        if (filters.categories?.length) {
          filteredResults = filteredResults.filter((result) =>
            filters.categories!.includes(result.category || ""),
          );
        }

        setState((prev) => ({
          ...prev,
          results: filteredResults,
          isLoading: false,
          hasSearched: true,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error ? error.message : "Advanced search failed",
          isLoading: false,
        }));
      }
    },
    [],
  );

  // Export search results
  const exportResults = useCallback(() => {
    const data = {
      query: state.query,
      results: state.results,
      timestamp: new Date().toISOString(),
      filters: state.filters,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `search-results-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [state]);

  // Get search analytics
  const getAnalytics = useCallback(() => {
    return {
      totalSearches: recentSearches.length,
      topQueries: popularSearches.slice(0, 5),
      averageResultsPerSearch: state.results.length,
      successRate: state.hasSearched && state.results.length > 0 ? 100 : 0,
    };
  }, [recentSearches, popularSearches, state.results, state.hasSearched]);

  return {
    // Current state
    query: state.query,
    results: state.results,
    isLoading: state.isLoading,
    hasSearched: state.hasSearched,
    error: state.error,
    filters: state.filters,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,

    // Suggestions and shortcuts
    suggestions,
    recentSearches,
    popularSearches,
    searchShortcuts,

    // Actions
    setQuery,
    clearSearch,
    addFilter,
    removeFilter,
    clearFilters,
    setSorting,
    handleSuggestionSelect,
    advancedSearch,
    exportResults,

    // Analytics
    getAnalytics,

    // Direct access to search service
    searchService,
  };
};

export default useSearch;
