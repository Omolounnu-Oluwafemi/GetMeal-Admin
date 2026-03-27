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
import { useCookStats, useCooks, ApiCook } from "@/lib/hooks/cooks";

const AVATAR_COLORS = [
  "#8B4513",
  "#9333EA",
  "#219e02",
  "#2563EB",
  "#DC2626",
  "#D97706",
  "#0891B2",
  "#7C3AED",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getAvatarColor(id: string) {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function formatNaira(value: number): string {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${Math.round(value / 1_000)}k`;
  return `₦${value}`;
}

function mapCook(c: ApiCook): Cook {
  let status: "Online" | "Not Active" | "Suspended" = "Not Active";
  if (c.status === "suspended") {
    status = "Suspended";
  } else if (c.isAvailable) {
    status = "Online";
  }

  return {
    id: c.cookId,
    name: c.name,
    initials: getInitials(c.name),
    avatarColor: getAvatarColor(c.cookId),
    kitchen: `${c.name.split(" ")[0]}'s Kitchen`,
    city: c.location ?? "—",
    verified: c.isApproved ? "Verified" : "Pending",
    rating: c.rating ?? 0,
    ratingNumber: 0,
    orders: c.ordersCount ?? 0,
    joinedDate: new Date(c.createdAt).toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    }),
    phone: c.phone,
    email: c.email,
    nextCookingDay: "—",
    schedule: "—",
    onTimeRate: "—",
    avgPrepTime: "—",
    cancelRate: "—",
    mealsListed: 0,
    topMeal: { name: "—", orders: 0 },
    totalEarnings: "—",
    lastPayoutAmount: "—",
    lastPayoutDate: "—",
    status,
  };
}

export default function CooksPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const { data: statsData, isLoading: statsLoading } = useCookStats();
  const { data: cooksData, isLoading: cooksLoading } = useCooks({
    status: selectedStatus.length === 1 ? selectedStatus[0] : undefined,
    city: selectedCities[0],
    sortBy,
  });

  const stats = statsData;
  const cooks: Cook[] = (cooksData ?? []).map(mapCook);

  useEffect(() => {
    const filters: string[] = [];
    selectedStatus.forEach((status) => filters.push(`Status: ${status}`));
    selectedCities.forEach((city) => filters.push(`City: ${city}`));
    setActiveFilters(filters);
  }, [selectedStatus, selectedCities]);

  const handleClearFilters = () => {
    setSelectedStatus([]);
    setSelectedCities([]);
    setSortBy("newest");
    setActiveFilters([]);
  };

  const handleRemoveFilter = (filter: string) => {
    if (filter.startsWith("Status:")) {
      const status = filter.replace("Status: ", "");
      setSelectedStatus(selectedStatus.filter((s) => s !== status));
    } else if (filter.startsWith("City:")) {
      const city = filter.replace("City: ", "");
      setSelectedCities(selectedCities.filter((c) => c !== city));
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-5">
        <CookStatsCard
          icon={ChefHat}
          value={stats?.activeCooks ?? 0}
          label="Active Cooks"
          variant="default"
          loading={statsLoading}
        />

        <CookStatsCard
          icon={ShoppingCart}
          value={stats?.totalOrders ?? 0}
          label="Total Orders Today"
          variant="default"
          loading={statsLoading}
        />

        <CookStatsCard
          icon={DollarSign}
          value={stats ? formatNaira(stats.amountToday) : "—"}
          label="Amount Today"
          variant="default"
          loading={statsLoading}
        />

        <CookStatsCard
          icon={XCircle}
          value={stats?.cancellations ?? 0}
          label="Cancellations Today"
          variant="default"
          loading={statsLoading}
        />

        <CookStatsCard
          icon={RefreshCw}
          value={stats?.refunds ?? 0}
          label="Refunds Today"
          variant="default"
          loading={statsLoading}
        />

        <CookStatsCard
          icon={TrendingUp}
          value={stats ? formatNaira(stats.GMV) : "—"}
          label="GMV"
          variant="default"
          loading={statsLoading}
        />
      </div>

      {/* Cooks Table */}
      <div className="overflow-hidden">
        <FilterBar
          showFilters={showFilters}
          activeFilters={activeFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onRemoveFilter={handleRemoveFilter}
          onExport={() => {}}
        />

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

        <CooksTable cooks={cooks} loading={cooksLoading} />
      </div>
    </div>
  );
}
