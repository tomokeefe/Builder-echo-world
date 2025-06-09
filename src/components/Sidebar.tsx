import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Target,
  BarChart3,
  Megaphone,
  Settings,
  Users,
  Zap,
  ChevronDown,
  ChevronRight,
  Plus,
  HelpCircle,
  LogOut,
  Bell,
  Search,
  Circle,
  Building,
  Check,
  X,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  Trash2,
} from "lucide-react";

// Notification types and interfaces
interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// Mock notification data
const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Campaign Performance Alert",
    message:
      'Your "Summer Sale" campaign CTR dropped below 2%. Consider optimizing your ad creative.',
    type: "warning",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
    actionUrl: "/campaigns",
  },
  {
    id: "2",
    title: "New Client Added",
    message:
      "TechCorp Inc. has been successfully added to your client portfolio.",
    type: "success",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    read: false,
    actionUrl: "/clients",
  },
  {
    id: "3",
    title: "Budget Threshold Reached",
    message:
      'Facebook campaign "Q4 Holiday" has reached 90% of allocated budget.',
    type: "info",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    actionUrl: "/campaigns",
  },
  {
    id: "4",
    title: "Integration Successful",
    message:
      "Google Ads integration has been successfully configured and is now active.",
    type: "success",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: true,
    actionUrl: "/integrations",
  },
  {
    id: "5",
    title: "API Rate Limit Warning",
    message:
      "You're approaching your API rate limit. Consider upgrading your plan.",
    type: "warning",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: true,
    actionUrl: "/settings",
  },
];

const Sidebar = () => {
  const location = useLocation();
  const [isAudiencesOpen, setIsAudiencesOpen] = useState(true);
  const [isCampaignsOpen, setIsCampaignsOpen] = useState(false);
  const [isClientsOpen, setIsClientsOpen] = useState(false);

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: BarChart3,
      badge: null,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      badge: null,
    },
  ];

  const audienceItems = [
    { title: "All Audiences", href: "/", count: 12 },
    { title: "Active", href: "/?status=active", count: 8 },
    { title: "Paused", href: "/?status=paused", count: 3 },
    { title: "Draft", href: "/?status=draft", count: 1 },
  ];

  const campaignItems = [
    { title: "All Campaigns", href: "/campaigns", count: 15 },
    { title: "Active", href: "/campaigns?status=active", count: 7 },
    { title: "Scheduled", href: "/campaigns?status=scheduled", count: 3 },
    { title: "Completed", href: "/campaigns?status=completed", count: 5 },
  ];

  const clientItems = [
    { title: "All Clients", href: "/clients", count: 24 },
    { title: "Active", href: "/clients?status=active", count: 20 },
    { title: "Onboarding", href: "/clients?status=onboarding", count: 3 },
    { title: "Inactive", href: "/clients?status=inactive", count: 1 },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/" && !location.search;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div
      className="w-64 bg-white border-r border-gray-200 flex flex-col h-full hidden md:flex"
      data-tour="sidebar"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Circle className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Skydeo</h1>
          </div>

          {/* Notification Bell */}
          <button
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Notifications"
            data-tour="notifications"
          >
            <Bell className="w-5 h-5" />
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative" data-tour="search">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            data-tour="search-input"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {/* Main Navigation */}
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              data-tour={
                item.title === "Dashboard" ? "create-audience" : undefined
              }
            >
              <item.icon className="w-4 h-4" />
              {item.title}
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}

          {/* Audiences Section */}
          <Collapsible open={isAudiencesOpen} onOpenChange={setIsAudiencesOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                Audiences
              </div>
              {isAudiencesOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-7 mt-2 space-y-1">
              {audienceItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.title}
                  <span className="text-xs text-gray-500">{item.count}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Campaigns Section */}
          <Collapsible open={isCampaignsOpen} onOpenChange={setIsCampaignsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
              <div className="flex items-center gap-3">
                <Megaphone className="w-4 h-4" />
                Campaigns
              </div>
              {isCampaignsOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-7 mt-2 space-y-1">
              {campaignItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.title}
                  <span className="text-xs text-gray-500">{item.count}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Clients Section */}
          <Collapsible open={isClientsOpen} onOpenChange={setIsClientsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4" />
                Clients
              </div>
              {isClientsOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-7 mt-2 space-y-1">
              {clientItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.title}
                  <span className="text-xs text-gray-500">{item.count}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Other Navigation Items */}
          <Link
            to="/integrations"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/integrations")
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Zap className="w-4 h-4" />
            Integrations
            <Badge variant="outline" className="ml-auto">
              4
            </Badge>
          </Link>
        </div>

        {/* Upgrade Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white">
            <h3 className="font-semibold text-sm mb-1">Upgrade to Pro</h3>
            <p className="text-xs opacity-90 mb-3">
              Unlock advanced features and unlimited audiences
            </p>
            <Button
              size="sm"
              variant="secondary"
              className="w-full text-purple-600"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start h-auto p-2">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-500">john@company.com</p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="w-4 h-4 mr-2" />
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;
