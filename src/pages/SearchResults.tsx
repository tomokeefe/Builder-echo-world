import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  X,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Target,
  Users,
  BarChart3,
  Megaphone,
  Settings,
  FileText,
  Zap,
  Download,
  Share2,
  BookOpen,
  Database,
  Globe,
  Puzzle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSearch } from "@/hooks/useSearch";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";
type FilterType =
  | "all"
  | "client"
  | "audience"
  | "campaign"
  | "integration"
  | "feature";

export function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<"relevance" | "date" | "name" | "type">(
    "relevance",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const initialQuery = searchParams.get("q") || "";

  const {
    query,
    results,
    isLoading,
    hasSearched,
    error,
    filters,
    setQuery,
    addFilter,
    removeFilter,
    clearFilters,
    setSorting,
    exportResults,
    getAnalytics,
  } = useSearch({
    context: { currentPage: "/search" },
    maxResults: 50,
  });

  // Initialize search from URL params
  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery);
    }
  }, [initialQuery, query, setQuery]);

  // Update URL when query changes
  useEffect(() => {
    if (query.trim()) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  }, [query, setSearchParams]);

  // Update sorting when changed
  useEffect(() => {
    setSorting(sortBy, sortOrder);
  }, [sortBy, sortOrder, setSorting]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const clearQuery = () => {
    setQuery("");
    navigate("/search");
  };

  const getTypeIcon = (type: string, size = "w-5 h-5") => {
    const iconClass = cn(size);
    switch (type) {
      case "client":
        return <Users className={cn(iconClass, "text-green-500")} />;
      case "audience":
        return <Target className={cn(iconClass, "text-blue-500")} />;
      case "campaign":
        return <Megaphone className={cn(iconClass, "text-purple-500")} />;
      case "integration":
        return <Puzzle className={cn(iconClass, "text-orange-500")} />;
      case "feature":
        return <Zap className={cn(iconClass, "text-yellow-500")} />;
      case "analytics":
        return <BarChart3 className={cn(iconClass, "text-indigo-500")} />;
      case "data":
        return <Database className={cn(iconClass, "text-gray-500")} />;
      case "docs":
        return <BookOpen className={cn(iconClass, "text-red-500")} />;
      default:
        return <FileText className={cn(iconClass, "text-gray-400")} />;
    }
  };

  const getResultTypeColor = (type: string) => {
    switch (type) {
      case "ai":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "recent":
        return "bg-gray-50 text-gray-600 border-gray-200";
      case "popular":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "filter":
        return "bg-orange-50 text-orange-600 border-orange-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const filteredResults = results
    .filter((result) => {
      if (filterType === "all") return true;
      return result.metadata?.type === filterType;
    })
    // Remove duplicates based on id
    .filter(
      (result, index, array) =>
        array.findIndex((item) => item.id === result.id) === index,
    );

  const handleResultClick = (result: any) => {
    if (result.metadata?.url) {
      navigate(result.metadata.url);
    } else {
      // Handle special cases
      switch (result.id) {
        case "ai-create-audience":
          console.log("Open create audience modal");
          break;
        case "ai-view-analytics":
          navigate("/analytics");
          break;
        case "ai-manage-clients":
          navigate("/clients");
          break;
        default:
          console.log("Result clicked:", result);
      }
    }
  };

  const analytics = getAnalytics();

  return (
    <div className="min-h-screen bg-[#F8FBF7] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4 rotate-180" />
              Back to Dashboard
            </Button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          <p className="text-gray-600">
            Find audiences, clients, campaigns, and more across your Skydeo
            workspace
          </p>
        </div>

        {/* Search Input */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={query}
                  onChange={handleQueryChange}
                  placeholder="Search for anything..."
                  className="pl-10 pr-10 h-12 text-base"
                />
                {query && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearQuery}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Filter by Type */}
                <Select
                  value={filterType}
                  onValueChange={(value: FilterType) => setFilterType(value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="client">Clients</SelectItem>
                    <SelectItem value="audience">Audiences</SelectItem>
                    <SelectItem value="campaign">Campaigns</SelectItem>
                    <SelectItem value="integration">Integrations</SelectItem>
                    <SelectItem value="feature">Features</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {sortOrder === "asc" ? (
                        <SortAsc className="w-4 h-4" />
                      ) : (
                        <SortDesc className="w-4 h-4" />
                      )}
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortBy("relevance")}>
                      Relevance
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("name")}>
                      Name
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("type")}>
                      Type
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("date")}>
                      Date
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                      Ascending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                      Descending
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* View Mode */}
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Filters */}
        {filters.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-600">
                  Active filters:
                </span>
                {filters.map((filter) => (
                  <Badge
                    key={filter}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {filter}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFilter(filter)}
                      className="h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Clear all
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Summary */}
        {hasSearched && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                {isLoading ? (
                  "Searching..."
                ) : error ? (
                  `Error: ${error}`
                ) : (
                  <>
                    Found{" "}
                    <span className="font-semibold">
                      {filteredResults.length}
                    </span>{" "}
                    results
                    {query && (
                      <span>
                        {" "}
                        for "<span className="font-semibold">{query}</span>"
                      </span>
                    )}
                  </>
                )}
              </p>
              {analytics.totalSearches > 0 && (
                <Badge variant="outline" className="text-xs">
                  {analytics.totalSearches} total searches
                </Badge>
              )}
            </div>

            {filteredResults.length > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={exportResults}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-2">
                <X className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Search Error
              </h3>
              <p className="text-gray-600">{error}</p>
            </CardContent>
          </Card>
        ) : filteredResults.length > 0 ? (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4",
            )}
          >
            {filteredResults.map((result, index) => {
              // Create a truly unique key using multiple identifiers
              const uniqueKey = `${result.id}-${result.text}-${index}`;
              return (
                <motion.div
                  key={uniqueKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 group",
                      viewMode === "list" && "hover:scale-100",
                    )}
                    onClick={() => handleResultClick(result)}
                  >
                    <CardHeader className={cn(viewMode === "list" && "pb-2")}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(result.metadata?.type || "feature")}
                          <div>
                            <CardTitle className="text-base group-hover:text-primary transition-colors">
                              {result.text}
                            </CardTitle>
                            {result.category && (
                              <p className="text-xs text-gray-500 mt-1">
                                {result.category}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {result.type && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                getResultTypeColor(result.type),
                              )}
                            >
                              {result.type === "ai" && (
                                <Sparkles className="w-3 h-3 mr-1" />
                              )}
                              {result.type === "recent" && (
                                <Clock className="w-3 h-3 mr-1" />
                              )}
                              {result.type === "popular" && (
                                <TrendingUp className="w-3 h-3 mr-1" />
                              )}
                              {result.type}
                            </Badge>
                          )}
                          <ArrowUpRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </CardHeader>
                    {result.description && (
                      <CardContent
                        className={cn(viewMode === "list" && "pt-0")}
                      >
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {result.description}
                        </p>
                        {result.metadata?.score && (
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {Math.round((1 - result.metadata.score) * 100)}%
                              match
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : hasSearched ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 mb-4">
                {query ? (
                  <>
                    We couldn't find anything matching "{query}". Try adjusting
                    your search terms.
                  </>
                ) : (
                  "Enter a search term to find audiences, clients, campaigns, and more."
                )}
              </p>
              <div className="flex items-center justify-center gap-2">
                <Button variant="outline" onClick={clearQuery}>
                  Clear search
                </Button>
                <Button onClick={() => setQuery("analytics")}>
                  Try "analytics"
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Start searching
              </h3>
              <p className="text-gray-600 mb-6">
                Search across your audiences, clients, campaigns, and platform
                features
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
                <Button
                  variant="outline"
                  className="flex flex-col gap-2 h-auto p-4"
                  onClick={() => setQuery("clients")}
                >
                  <Users className="w-5 h-5 text-green-500" />
                  <span className="text-xs">Clients</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col gap-2 h-auto p-4"
                  onClick={() => setQuery("audiences")}
                >
                  <Target className="w-5 h-5 text-blue-500" />
                  <span className="text-xs">Audiences</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col gap-2 h-auto p-4"
                  onClick={() => setQuery("campaigns")}
                >
                  <Megaphone className="w-5 h-5 text-purple-500" />
                  <span className="text-xs">Campaigns</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col gap-2 h-auto p-4"
                  onClick={() => setQuery("analytics")}
                >
                  <BarChart3 className="w-5 h-5 text-indigo-500" />
                  <span className="text-xs">Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
