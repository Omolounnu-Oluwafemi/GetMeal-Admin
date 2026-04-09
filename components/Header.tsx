"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Search, Bell, Megaphone } from "@/lib/icons";
import BroadcastModal from "./BroadcastModal";
import NotificationsDropdown from "./NotificationsDropdown";
import DateFilterDropdown from "./DateFilterDropdown";
import ZoneFilterDropdown from "./ZoneFilterDropdown";
import LinkedFilterDropdown from "./LinkedFilterDropdown";
import OrdersHeaderFilters from "./OrdersHeaderFilters";
import GlobalSearchDropdown from "./GlobalSearchDropdown";
import { useSearch } from "@/lib/hooks/search";

const TITLE_MAP: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/orders": "Orders",
  "/customers": "Customers",
  "/cooks": "Cooks",
  "/snapshot": "Snapshot",
  "/payments": "Payments",
  "/settings": "Settings",
};

export default function Header() {
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const title = TITLE_MAP[pathname] ?? "Dashboard";

  // Debounce search input by 350ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data: searchResults, isLoading: searchLoading } =
    useSearch(debouncedQuery);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setShowResults(true);
  };

  const handleSearchClose = () => {
    setShowResults(false);
    setSearchInput("");
    setDebouncedQuery("");
  };

  const handleSearchFocus = () => {
    if (searchInput.trim().length >= 2) setShowResults(true);
  };

  const renderFilters = () => {
    if (pathname === "/dashboard") {
      return (
        <>
          <DateFilterDropdown />
          <ZoneFilterDropdown />
        </>
      );
    }
    if (pathname === "/customers") {
      return "";
    }
    if (pathname === "/cooks") {
      return "";
    }
    if (pathname === "/orders") {
      return <OrdersHeaderFilters />;
    }
    return null;
  };

  const showDropdown = showResults && debouncedQuery.trim().length >= 2;

  return (
    <>
      <header className="h-[95px] bg-white border-b-2 border-[#F3F4F6] flex items-center justify-between px-8">
        {/* Left: Title and Filters */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-[#111827]">{title}</h1>
          {renderFilters()}
        </div>

        {/* Right: Search, Broadcast, Notifications */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div ref={searchRef} className="relative w-[400px]">
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              placeholder="Search by name, phone, email, or order ID..."
              className="w-full pl-6 pr-12 py-3.5 bg-[#f7f7f7] border border-[#E5E7EB] rounded-full text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#209d01] focus:ring-2 focus:ring-[#209d01]/20 transition-all"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#9CA3AF]" />

            {showDropdown && (
              <GlobalSearchDropdown
                results={searchResults}
                isLoading={searchLoading}
                query={debouncedQuery}
                onClose={handleSearchClose}
              />
            )}
          </div>

          {/* Send Broadcast Button */}
          {pathname === "/dashboard" && (
            <button
              onClick={() => setShowBroadcast(true)}
              className="flex items-center gap-2 px-4 py-3 bg-[#209d01] text-white rounded-full font-medium text-xs hover:bg-[#1a7d01] transition-colors"
            >
              <Megaphone className="w-4 h-4" />
              Send Broadcast
            </button>
          )}

          {/* Notifications */}
          <button
            onClick={() => setShowNotifications((p) => !p)}
            className="relative p-2.5 hover:bg-[#F3F4F6] rounded-lg transition-colors"
          >
            <Bell className="w-6 h-6 text-[#6B7280]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full" />
          </button>
        </div>
      </header>

      {showBroadcast && (
        <BroadcastModal onClose={() => setShowBroadcast(false)} />
      )}

      {showNotifications && (
        <NotificationsDropdown onClose={() => setShowNotifications(false)} />
      )}
    </>
  );
}
