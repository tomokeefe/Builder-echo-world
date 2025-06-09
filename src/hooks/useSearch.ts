import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import searchService, { SearchableItem } from "@/services/searchService";
import { SearchSuggestion } from "@/components/ui/search-autocomplete";
import { useAudienceStore } from "@/hooks/useAudienceStore";

// Simple stable debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
};

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

const DEFAULT_CONTEXT = {};

export const useSearch = (options?: {
  debounceMs?: number;
  maxResults?: number;
  enableAI?: boolean;
  context?: Record<string, any>;
}) => {
  // Stable options with defaults
  const debounceMs = options?.debounceMs ?? 300;
  const maxResults = options?.maxResults ?? 10;
  const enableAI = options?.enableAI ?? true;
  const context = options?.context ?? DEFAULT_CONTEXT;

  const [state, setState] = useState<SearchState>({
    query: "",
    results: [],
    isLoading: false,
    hasSearched: false,
    error: null,
    filters: [],
    sortBy: "relevance",
    sortOrder: "desc",
  });

  const debouncedQuery = useDebounce(state.query, debounceMs);
  const { audiences } = useAudienceStore();
  const syncedAudienceIdsRef = useRef<Set<string>>(new Set());

  // Sync audiences with search service (stable implementation)
  const audienceStableKey = useMemo(() => {
    return audiences.map((a) => `${a.id}-${a.name}-${a.status}`).join("|");
  }, [audiences]);

  useEffect(() => {
    // Create a map of current audience IDs
    const currentAudienceIds = new Set(audiences.map((a) => a.id));

    // Remove audiences that no longer exist
    for (const syncedId of syncedAudienceIdsRef.current) {
      if (!currentAudienceIds.has(syncedId)) {
        searchService.removeSearchableItem(`audience-${syncedId}`);
        syncedAudienceIdsRef.current.delete(syncedId);
      }
    }

    // Add or update audiences
    audiences.forEach((audience) => {
      const audienceItem: SearchableItem = {
        id: `audience-${audience.id}`,
        title: audience.name,
        type: "audience",
        category: "Lookalike Audience",
        description: audience.description,
        tags: [
          "audience",
          "segment",
          audience.performance.toLowerCase(),
          audience.status.toLowerCase(),
          ...audience.targetingCriteria.demographics.map((d) =>
            d.toLowerCase(),
          ),
          ...audience.targetingCriteria.interests.map((i) => i.toLowerCase()),
        ],
        metadata: {
          size: audience.size,
          similarity: audience.similarity,
          performance: audience.performance,
          status: audience.status,
          url: "/",
          type: "audience",
        },
      };

      if (!syncedAudienceIdsRef.current.has(audience.id)) {
        searchService.addSearchableItem(audienceItem);
        syncedAudienceIdsRef.current.add(audience.id);
      } else {
        searchService.updateSearchableItem(
          `audience-${audience.id}`,
          audienceItem,
        );
      }
    });
  }, [audienceStableKey]);

  // Search effect - separate from the function to avoid dependency issues
  useEffect(() => {
    if (!debouncedQuery.trim()) {
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

    // Use setTimeout to make this async and prevent blocking
    const timeoutId = setTimeout(() => {
      try {
        // Get basic search results
        const searchResults = searchService.search(debouncedQuery);

        // Get AI suggestions if enabled
        const aiSuggestions = enableAI
          ? searchService.getAISuggestions(debouncedQuery, context)
          : [];

        // Combine and limit results
        const allResults = [...aiSuggestions, ...searchResults].slice(
          0,
          maxResults,
        );

        setState((prev) => ({
          ...prev,
          results: allResults,
          isLoading: false,
          hasSearched: true,
        }));

        // Add to recent searches
        searchService.addToRecentSearches(debouncedQuery);
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Search failed",
          isLoading: false,
          results: [],
        }));
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [debouncedQuery, maxResults, enableAI, context]);

  // Stable action functions
  const setQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, query }));
  }, []);

  const clearSearch = useCallback(() => {
    setState({
      query: "",
      results: [],
      isLoading: false,
      hasSearched: false,
      error: null,
    });
  }, []);

  // Stable suggestions and searches
  const recentSearches = useMemo(() => {
    return searchService.getRecentSearches();
  }, []);

  const popularSearches = useMemo(() => {
    return searchService.getPopularSearches();
  }, []);

  const suggestions = useMemo(() => {
    if (!state.query.trim()) {
      return searchService.getDefaultSuggestions();
    }
    return state.results;
  }, [state.query, state.results]);

  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
    // Add to recent searches if it's a search suggestion
    if (suggestion.type !== "filter" && suggestion.type !== "shortcut") {
      searchService.addToRecentSearches(suggestion.text);
    }

    // Handle different suggestion types
    switch (suggestion.type) {
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
  }, []);

  return {
    // Current state
    query: state.query,
    results: state.results,
    isLoading: state.isLoading,
    hasSearched: state.hasSearched,
    error: state.error,

    // Suggestions and shortcuts
    suggestions,
    recentSearches,
    popularSearches,

    // Actions
    setQuery,
    clearSearch,
    handleSuggestionSelect,

    // Direct access to search service
    searchService,
  };
};

export default useSearch;
