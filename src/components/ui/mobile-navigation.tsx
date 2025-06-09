import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import {
  Home,
  Users,
  BarChart3,
  Megaphone,
  Settings,
  Plus,
  Menu,
  X,
  Search,
  Bell,
  User,
} from "lucide-react";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
    color: "text-blue-500",
  },
  {
    name: "Clients",
    href: "/clients",
    icon: Users,
    color: "text-green-500",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    color: "text-purple-500",
  },
  {
    name: "Campaigns",
    href: "/campaigns",
    icon: Megaphone,
    color: "text-orange-500",
  },
  {
    name: "More",
    href: "#",
    icon: Menu,
    color: "text-gray-500",
  },
];

const moreItems = [
  { name: "Real-time Analytics", href: "/realtime-analytics" },
  { name: "AI Recommendations", href: "/ai-recommendations" },
  { name: "Integrations", href: "/integrations" },
  { name: "Team Management", href: "/team" },
  { name: "API Docs", href: "/api-docs" },
  { name: "Performance", href: "/performance" },
  { name: "Automation", href: "/automation" },
  { name: "Testing", href: "/testing" },
  { name: "API Integration", href: "/api-integration" },
  { name: "Custom Dashboard", href: "/custom-dashboard" },
  { name: "Collaboration", href: "/collaboration" },
];

const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const handleMoreClick = () => {
    setShowMoreMenu(!showMoreMenu);
  };

  return (
    <>
      {/* Top Header for Mobile */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between md:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-gray-900">Skydeo</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
          </Button>
          <Button variant="ghost" size="sm">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-2 md:hidden">
        <div className="flex items-center justify-around">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = item.name === "More" ? false : isActive(item.href);

            if (item.name === "More") {
              return (
                <button
                  key={item.name}
                  onClick={handleMoreClick}
                  className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                    showMoreMenu ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${showMoreMenu ? "text-blue-500" : item.color}`}
                  />
                  <span
                    className={`text-xs mt-1 ${
                      showMoreMenu
                        ? "text-blue-500 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  active ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${active ? "text-blue-500" : item.color}`}
                />
                <span
                  className={`text-xs mt-1 ${
                    active ? "text-blue-500 font-medium" : "text-gray-600"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* More Menu Overlay */}
      <AnimatePresence>
        {showMoreMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setShowMoreMenu(false)}
            />

            {/* More Menu */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[70vh] overflow-y-auto md:hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    More Options
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMoreMenu(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {moreItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setShowMoreMenu(false)}
                      className={`p-4 rounded-xl border-2 transition-all hover:border-blue-200 hover:bg-blue-50 ${
                        isActive(item.href)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.name.includes("Analytics") &&
                          "View performance data"}
                        {item.name.includes("Campaign") && "Manage campaigns"}
                        {item.name.includes("Team") && "Manage team members"}
                        {item.name.includes("API") && "Developer resources"}
                        {item.name.includes("Integration") &&
                          "Connect platforms"}
                        {item.name.includes("Performance") && "Monitor speed"}
                        {item.name.includes("Automation") &&
                          "Automated workflows"}
                        {item.name.includes("Testing") && "Quality assurance"}
                        {item.name.includes("Dashboard") && "Custom views"}
                        {item.name.includes("Collaboration") &&
                          "Team workspace"}
                        {item.name.includes("AI") && "Smart recommendations"}
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button
                    className="w-full"
                    onClick={() => setShowMoreMenu(false)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Campaign
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation;
