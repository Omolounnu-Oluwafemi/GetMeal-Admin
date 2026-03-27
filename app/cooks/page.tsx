"use client";

import { useEffect, useState } from "react";
import {
  ChefHat,
  ShoppingCart,
  DollarSign,
  XCircle,
  RefreshCw,
  TrendingUp,
} from "@/lib/icons";
import CookStatsCard from "@/components/Cooks/Cookstatscard";
import FilterBar from "@/components/Filterbar";
import CooksFilterPanel from "@/components/Cooks/Cooksfilterpanel";
import CooksTable, { Cook } from "@/components/Cooks/Cookstable";

// Sample cooks data
const cooksData: Cook[] = [
  {
    id: "1",
    name: "Emeka Okonkwo",
    initials: "CE",
    avatarColor: "#219e02",
    kitchen: "Chef Emeka",
    city: "Lagos",
    verified: "Pending",
    rating: 4.2,
    ratingNumber: 48,
    orders: 45,
    joinedDate: "Oct 2025",
    phone: "+234 804 456 7890",
    email: "emekaokonkwo@getameal.ng",
    nextCookingDay: "Not scheduled",
    schedule: "N/A",
    onTimeRate: "72.3%",
    avgPrepTime: "65min",
    cancelRate: "15.6%",
    mealsListed: 6,
    topMeal: { name: "Fried Rice", orders: 15 },
    totalEarnings: "₦40,000",
    lastPayoutAmount: "₦34,000",
    lastPayoutDate: "Jan 15, 2026",
    lastPayoutMethod: "Paystack",
    lastPayoutRef: "PSTK1234567893",
    complaint: { text: "Multiple complaints about late deliveries and food quality", date: "Jan 20, 2026" },
    lastReview: { reviewer: "Ademola Williams", rating: 2, timeAgo: "28 days ago", text: "Food was cold and not as expected.", meal: "Fried Rice" },
    status: "Suspended",
  },
  {
    id: "2",
    name: "Adamu Musa",
    avatar: "/cooks/adamu.jpg",
    initials: "AM",
    avatarColor: "#6B7280",
    kitchen: "Adamu's Grill",
    city: "Kaduna",
    verified: "Verified",
    rating: 4.4,
    ratingNumber: 98,
    orders: 124,
    joinedDate: "Aug 2025",
    phone: "+234 803 567 8901",
    email: "adamumusa@getameal.ng",
    nextCookingDay: "Tomorrow",
    schedule: "Mon – Fri",
    onTimeRate: "89.1%",
    avgPrepTime: "52min",
    cancelRate: "4.2%",
    mealsListed: 12,
    topMeal: { name: "Suya & Yam", orders: 38 },
    totalEarnings: "₦98,000",
    lastPayoutAmount: "₦52,000",
    lastPayoutDate: "Feb 10, 2026",
    lastPayoutMethod: "Paystack",
    lastPayoutRef: "PSTK9876543210",
    status: "Online",
  },
  {
    id: "3",
    name: "Tayo Afolabi",
    avatar: "/cooks/tayo.jpg",
    initials: "TA",
    avatarColor: "#8B4513",
    kitchen: "Chef Tayo",
    city: "Ibadan",
    verified: "Verified",
    rating: 4.5,
    ratingNumber: 28,
    orders: 154,
    joinedDate: "Jul 2025",
    phone: "+234 805 678 9012",
    email: "tayoafolabi@getameal.ng",
    nextCookingDay: "Today",
    schedule: "Daily",
    onTimeRate: "94.0%",
    avgPrepTime: "45min",
    cancelRate: "2.1%",
    mealsListed: 9,
    topMeal: { name: "Egusi Soup", orders: 42 },
    totalEarnings: "₦132,500",
    lastPayoutAmount: "₦67,000",
    lastPayoutDate: "Feb 14, 2026",
    lastPayoutMethod: "Paystack",
    lastPayoutRef: "PSTK5647382910",
    lastReview: { reviewer: "Ngozi Eze", rating: 5, timeAgo: "3 days ago", text: "Absolutely delicious! Best egusi I've had.", meal: "Egusi Soup" },
    status: "Online",
  },
  {
    id: "4",
    name: "Chukwudi Okafor",
    avatar: "/cooks/chukwudi.jpg",
    initials: "CO",
    avatarColor: "#9333EA",
    kitchen: "Chef Chukwudi",
    city: "Enugu",
    verified: "Pending",
    rating: 4.5,
    ratingNumber: 8,
    orders: 142,
    joinedDate: "Sep 2025",
    phone: "+234 806 789 0123",
    email: "chukwudiokafor@getameal.ng",
    nextCookingDay: "Not scheduled",
    schedule: "N/A",
    onTimeRate: "81.5%",
    avgPrepTime: "58min",
    cancelRate: "7.3%",
    mealsListed: 7,
    topMeal: { name: "Ofe Onugbu", orders: 27 },
    totalEarnings: "₦75,200",
    lastPayoutAmount: "₦40,000",
    lastPayoutDate: "Jan 30, 2026",
    lastPayoutMethod: "Paystack",
    lastPayoutRef: "PSTK1122334455",
    status: "Not Active",
  },
];

export default function CooksPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    const filters: string[] = [];

    selectedStatus.forEach((status) => filters.push(`Status: ${status}`));

    selectedCities.forEach((city) => filters.push(`City: ${city}`));

    setActiveFilters(filters);
  }, [selectedStatus, selectedCities]);

  // const handleApplyFilters = () => {
  //   const filters: string[] = [];
  //   if (selectedStatus.length > 0) {
  //     selectedStatus.forEach((status) => filters.push(`Status: ${status}`));
  //   }
  //   if (selectedCities.length > 0) {
  //     selectedCities.forEach((city) => filters.push(`City: ${city}`));
  //   }
  //   setActiveFilters(filters);
  //   setShowFilters(false);
  // };

  const handleClearFilters = () => {
    setSelectedStatus([]);
    setSelectedCities([]);
    setSortBy("newest");
    setActiveFilters([]);
  };

  const handleRemoveFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));

    // Also update the underlying filter state
    if (filter.startsWith("Status:")) {
      const status = filter.replace("Status: ", "");
      setSelectedStatus(selectedStatus.filter((s) => s !== status));
    } else if (filter.startsWith("City:")) {
      const city = filter.replace("City: ", "");
      setSelectedCities(selectedCities.filter((c) => c !== city));
    }
  };

  const handleExport = () => {
    console.log("Exporting cooks to CSV...");
    // Implement CSV export logic
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-5">
        <CookStatsCard
          icon={ChefHat}
          value={11}
          label="Active Cooks"
          variant="default"
        />

        <CookStatsCard
          icon={ShoppingCart}
          value={47}
          label="Total Orders Today"
          variant="default"
        />

        <CookStatsCard
          icon={DollarSign}
          value="₦125,430"
          label="Amount Today"
          variant="default"
        />

        <CookStatsCard
          icon={XCircle}
          value={3}
          label="Cancellations Today"
          variant="default"
        />

        <CookStatsCard
          icon={RefreshCw}
          value={2}
          label="Refunds Today"
          variant="default"
        />

        <CookStatsCard
          icon={TrendingUp}
          value="₦8.8M"
          label="GMV"
          variant="default"
        />
      </div>

      {/* Cooks Table */}
      <div className=" overflow-hidden">
        {/* Filter Bar */}
        <FilterBar
          showFilters={showFilters}
          activeFilters={activeFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onRemoveFilter={handleRemoveFilter}
          onExport={handleExport}
        />

        {/* Filters Panel */}
        {showFilters && (
          <CooksFilterPanel
            selectedStatus={selectedStatus}
            selectedCities={selectedCities}
            sortBy={sortBy}
            onStatusChange={setSelectedStatus}
            onCitiesChange={setSelectedCities}
            onSortChange={setSortBy}
            onClear={handleClearFilters}
          />
        )}

        {/* Table */}
        <CooksTable cooks={cooksData} />
      </div>
    </div>
  );
}
