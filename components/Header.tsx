"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Bell, Megaphone } from "@/lib/icons";
import BroadcastModal from "./BroadcastModal";
import NotificationsDropdown from "./NotificationsDropdown";
import DateFilterDropdown from "./DateFilterDropdown";
import ZoneFilterDropdown from "./ZoneFilterDropdown";
import LinkedFilterDropdown from "./LinkedFilterDropdown";
import OrdersHeaderFilters from "./OrdersHeaderFilters";

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
  const pathname = usePathname();
  const title = TITLE_MAP[pathname] ?? "Dashboard";

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
      return <LinkedFilterDropdown statusOptions={["Active", "Suspended"]} />;
    }
    if (pathname === "/cooks") {
      return <LinkedFilterDropdown statusOptions={["Active", "Inactive"]} />;
    }
    if (pathname === "/orders") {
      return <OrdersHeaderFilters />;
    }
    return null;
  };

  return (
    <>
      <header className="h-[95px] bg-white border-b-2 border-[#F3F4F6] flex items-center justify-between px-8">
        {/* Left: Title and Filters */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-[#111827]">{title}</h1>
          {renderFilters()}
        </div>

        {/* Right: Search, Broadcast, Notifications */}
        <div className="flex items-center gap-4 ">
          {/* Search Bar */}
          <div className="relative w-[400px]">
            <input
              type="text"
              placeholder="Search by name, phone, email, or order ID..."
              className="w-full pl-6 pr-12 py-3.5 bg-[#f7f7f7] border border-[#E5E7EB] rounded-full text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#209d01] focus:ring-2 focus:ring-[#209d01]/20 transition-all"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#9CA3AF]" />
          </div>

          {/* Send Broadcast Button */}
          <button
            onClick={() => setShowBroadcast(true)}
            className="flex items-center gap-2 px-4 py-3 bg-[#209d01] text-white rounded-full font-medium text-xs hover:bg-[#1a7d01] transition-colors"
          >
            <Megaphone className="w-4 h-4" />
            Send Broadcast
          </button>

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

      {/* Broadcast Modal */}
      {showBroadcast && (
        <BroadcastModal onClose={() => setShowBroadcast(false)} />
      )}

      {/* Notifications Dropdown */}
      {showNotifications && (
        <NotificationsDropdown onClose={() => setShowNotifications(false)} />
      )}
    </>
  );
}
