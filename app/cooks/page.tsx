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
