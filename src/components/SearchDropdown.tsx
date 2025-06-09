import React from "react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Clock,
  TrendingUp,
  Zap,
  ChevronRight,
  FileText,
  Users,
  BarChart3,
  Target,
  Settings,
  X,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSearch } from "@/hooks/useSearch";
import { cn } from "@/lib/utils";

export function SearchDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Memoize the context to prevent infinite re-renders
  const searchContext = useMemo(
    () => ({
      currentPage: location.pathname,
    }),
    [location.pathname],
  );

  const {
    query,
    results,
    isLoading,
    suggestions,
    recentSearches,
    popularSearches,
    setQuery,
    clearSearch,
    handleSuggestionSelect,
  } = useSearch({
    context: searchContext,
    maxResults: 8,
  });

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setIsFocused(false);
      inputRef.current?.blur();
    }
    if (e.key === "Enter" && results.length > 0) {
      handleResultClick(results[0]);
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
  };

  const handleResultClick = (result: any) => {
    handleSuggestionSelect(result);

    // Navigate based on result metadata
    if (result.metadata?.url) {
      navigate(result.metadata.url);
    } else {
      // Handle different result types
      switch (result.id) {
        case "ai-create-audience":
          // Open create audience modal
          console.log("Open create audience modal");
          break;
        case "ai-view-analytics":
          navigate("/analytics");
          break;
        case "ai-manage-clients":
          navigate("/clients");
          break;
        default:
          // Try to navigate based on text content
          if (result.text.toLowerCase().includes("client")) {
            navigate("/clients");
          } else if (result.text.toLowerCase().includes("analytic")) {
            navigate("/analytics");
          }
      }
    }

    setIsOpen(false);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const clearInput = () => {
    setQuery("");
    clearSearch();
    inputRef.current?.focus();
  };

  const getResultIcon = (type: string, category?: string) => {
    switch (type) {
      case "ai":
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      case "recent":
        return <Clock className="w-4 h-4 text-gray-400" />;
      case "popular":
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case "filter":
        return <Settings className="w-4 h-4 text-orange-500" />;
      default:
        // Category-based icons
        if (category?.includes("Client")) {
          return <Users className="w-4 h-4 text-green-500" />;
        }
        if (category?.includes("Audience")) {
          return <Target className="w-4 h-4 text-blue-500" />;
        }
        if (category?.includes("Analytics")) {
          return <BarChart3 className="w-4 h-4 text-purple-500" />;
        }
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getResultCategory = (result: any) => {
    if (result.type === "ai") return "AI Suggestion";
    if (result.type === "recent") return "Recent Search";
    if (result.type === "popular") return "Popular";
    return result.category || "Result";
  };

  const displayResults = useMemo(() => {
    return query.trim()
      ? results
      : [
          ...recentSearches.slice(0, 3).map((search) => ({
            id: `recent-${search}`,
            type: "recent",
            text: search,
          })),
          ...popularSearches.slice(0, 3).map((search) => ({
            id: `popular-${search}`,
            type: "popular",
            text: search,
          })),
        ];
  }, [query, results, recentSearches, popularSearches]);

  return (
    <div ref={searchRef} className="relative" data-tour="search">
      {/* Search Input */}
      <div
        className={cn(
          "relative transition-all duration-200",
          isFocused && "ring-2 ring-primary/20 rounded-md",
        )}
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search audiences, clients, campaigns..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          data-tour="search-input"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearInput}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-200"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 border border-gray-200 shadow-lg z-50 max-h-96 overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                Searching...
              </div>
            ) : displayResults.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {/* Header */}
                {query.trim() && (
                  <div className="p-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Search Results for "{query}"
                    </p>
                  </div>
                )}

                {/* Results */}
                <div className="divide-y divide-gray-100">
                  {displayResults.map((result, index) => (
                    <div
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 group"
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {getResultIcon(result.type, result.category)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {result.text}
                            </h4>
                            {result.type === "ai" && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-purple-50 text-purple-600 border-purple-200"
                              >
                                AI
                              </Badge>
                            )}
                          </div>

                          {result.description && (
                            <p className="text-xs text-gray-500 line-clamp-2 mb-1">
                              {result.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                              {getResultCategory(result)}
                            </span>
                            {result.metadata?.score && (
                              <span className="text-xs text-gray-400">
                                •{" "}
                                {Math.round((1 - result.metadata.score) * 100)}%
                                match
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                {query.trim() && results.length > 0 && (
                  <div className="p-3 border-t border-gray-100 bg-gray-50">
                    <button
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(query)}`);
                        setIsOpen(false);
                      }}
                      className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                    >
                      View all results
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ) : query.trim() ? (
              <div className="p-6 text-center">
                <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-2">No results found</p>
                <p className="text-xs text-gray-400">
                  Try searching for audiences, clients, or campaigns
                </p>
              </div>
            ) : (
              <div className="p-4">
                <div className="space-y-3">
                  {/* Quick Actions */}
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
                      Quick Actions
                    </p>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          navigate("/");
                          setIsOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-md hover:bg-gray-50 transition-colors duration-150 group"
                      >
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-700">
                            Create Audience
                          </span>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          navigate("/analytics");
                          setIsOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-md hover:bg-gray-50 transition-colors duration-150 group"
                      >
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-purple-500" />
                          <span className="text-sm text-gray-700">
                            View Analytics
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Recent/Popular Searches */}
                  {(recentSearches.length > 0 ||
                    popularSearches.length > 0) && (
                    <>
                      <Separator />
                      {recentSearches.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
                            Recent Searches
                          </p>
                          <div className="space-y-1">
                            {recentSearches.slice(0, 3).map((search) => (
                              <button
                                key={search}
                                onClick={() => {
                                  setQuery(search);
                                  setIsOpen(true);
                                }}
                                className="w-full text-left p-2 rounded-md hover:bg-gray-50 transition-colors duration-150"
                              >
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-700">
                                    {search}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
