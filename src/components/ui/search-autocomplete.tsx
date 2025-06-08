import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Filter,
  ArrowRight,
  Command as CommandIcon,
  Star,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchSuggestion {
  id: string;
  type: "recent" | "popular" | "ai" | "filter" | "shortcut";
  text: string;
  description?: string;
  category?: string;
  icon?: React.ReactNode;
  metadata?: Record<string, any>;
  action?: () => void;
}

export interface SearchAutocompleteProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  popularSearches?: string[];
  aiSuggestions?: SearchSuggestion[];
  filters?: Array<{
    id: string;
    label: string;
    value: string;
    count?: number;
  }>;
  showFilters?: boolean;
  showShortcuts?: boolean;
  maxSuggestions?: number;
  debounceMs?: number;
  className?: string;
  variant?: "default" | "command" | "inline";
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  placeholder = "Search anything...",
  onSearch,
  onSuggestionSelect,
  suggestions = [],
  recentSearches = [],
  popularSearches = [],
  aiSuggestions = [],
  filters = [],
  showFilters = true,
  showShortcuts = true,
  maxSuggestions = 10,
  debounceMs = 300,
  className,
  variant = "default",
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        onSearch(query);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, onSearch]);

  // Generate all suggestions
  const allSuggestions = useMemo(() => {
    const results: SearchSuggestion[] = [];

    // Add AI-powered suggestions first
    if (query.length > 2 && aiSuggestions.length > 0) {
      results.push(...aiSuggestions.slice(0, 3));
    }

    // Add matching custom suggestions
    const matchingSuggestions = suggestions.filter((s) =>
      s.text.toLowerCase().includes(query.toLowerCase()),
    );
    results.push(...matchingSuggestions.slice(0, 3));

    // Add recent searches if no query or query matches
    if (
      query.length === 0 ||
      recentSearches.some((r) => r.toLowerCase().includes(query.toLowerCase()))
    ) {
      const matchingRecent = recentSearches
        .filter(
          (search) =>
            query.length === 0 ||
            search.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 3)
        .map((search) => ({
          id: `recent-${search}`,
          type: "recent" as const,
          text: search,
          icon: <Clock className="w-4 h-4" />,
        }));
      results.push(...matchingRecent);
    }

    // Add popular searches
    if (query.length === 0) {
      const popularSuggestions = popularSearches.slice(0, 3).map((search) => ({
        id: `popular-${search}`,
        type: "popular" as const,
        text: search,
        icon: <TrendingUp className="w-4 h-4" />,
      }));
      results.push(...popularSuggestions);
    }

    // Add filters if enabled
    if (showFilters && filters.length > 0) {
      const matchingFilters = filters
        .filter(
          (filter) =>
            query.length === 0 ||
            filter.label.toLowerCase().includes(query.toLowerCase()) ||
            filter.value.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 2)
        .map((filter) => ({
          id: `filter-${filter.id}`,
          type: "filter" as const,
          text: filter.label,
          description: `${filter.count || 0} results`,
          icon: <Filter className="w-4 h-4" />,
          metadata: { filter },
        }));
      results.push(...matchingFilters);
    }

    // Add shortcuts if enabled and no query
    if (showShortcuts && query.length === 0) {
      const shortcuts = [
        {
          id: "shortcut-create",
          type: "shortcut" as const,
          text: "Create new audience",
          description: "Ctrl+N",
          icon: <Zap className="w-4 h-4" />,
        },
        {
          id: "shortcut-analytics",
          type: "shortcut" as const,
          text: "Open analytics",
          description: "Ctrl+A",
          icon: <TrendingUp className="w-4 h-4" />,
        },
      ];
      results.push(...shortcuts);
    }

    return results.slice(0, maxSuggestions);
  }, [
    query,
    suggestions,
    recentSearches,
    popularSearches,
    aiSuggestions,
    filters,
    showFilters,
    showShortcuts,
    maxSuggestions,
  ]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          Math.min(prev + 1, allSuggestions.length - 1),
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (allSuggestions[selectedIndex]) {
          handleSuggestionSelect(allSuggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "Tab":
        if (allSuggestions[selectedIndex]) {
          e.preventDefault();
          setQuery(allSuggestions[selectedIndex].text);
        }
        break;
    }
  };

  // Handle search submission
  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      setIsOpen(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    if (suggestion.type === "filter") {
      const filterId = suggestion.metadata?.filter?.id;
      if (filterId) {
        setActiveFilters((prev) =>
          prev.includes(filterId)
            ? prev.filter((id) => id !== filterId)
            : [...prev, filterId],
        );
      }
    } else if (suggestion.action) {
      suggestion.action();
    } else {
      setQuery(suggestion.text);
      onSearch(suggestion.text);
    }

    onSuggestionSelect?.(suggestion);
    setIsOpen(false);
  };

  // Clear filters
  const clearFilter = (filterId: string) => {
    setActiveFilters((prev) => prev.filter((id) => id !== filterId));
  };

  const renderSuggestionIcon = (suggestion: SearchSuggestion) => {
    const iconMap = {
      recent: <Clock className="w-4 h-4 text-gray-400" />,
      popular: <TrendingUp className="w-4 h-4 text-green-500" />,
      ai: <Star className="w-4 h-4 text-purple-500" />,
      filter: <Filter className="w-4 h-4 text-blue-500" />,
      shortcut: <CommandIcon className="w-4 h-4 text-orange-500" />,
    };

    return suggestion.icon || iconMap[suggestion.type];
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Active Filters */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-2"
          >
            {activeFilters.map((filterId) => {
              const filter = filters.find((f) => f.id === filterId);
              return filter ? (
                <Badge
                  key={filterId}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {filter.label}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearFilter(filterId)}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ) : null;
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder}
          className="pl-10 pr-16"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuery("")}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Badge variant="outline" className="text-xs px-1 py-0 hidden md:flex">
            <CommandIcon className="w-3 h-3 mr-1" />K
          </Badge>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            {allSuggestions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No suggestions found</p>
                {query.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSearch}
                    className="mt-2"
                  >
                    Search for "{query}"
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="py-2">
                {allSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors",
                      selectedIndex === index && "bg-gray-50",
                    )}
                  >
                    {renderSuggestionIcon(suggestion)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {suggestion.text}
                      </p>
                      {suggestion.description && (
                        <p className="text-xs text-gray-500 truncate">
                          {suggestion.description}
                        </p>
                      )}
                    </div>
                    {suggestion.type === "shortcut" &&
                      suggestion.description && (
                        <Badge variant="outline" className="text-xs">
                          {suggestion.description}
                        </Badge>
                      )}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchAutocomplete;
