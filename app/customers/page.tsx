"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  TrendingUp,
  ShoppingCart,
  UserMinus,
} from "@/lib/icons";
import CustomerStatsCard from "@/components/Customers/Customerstatscard";
import FilterBar from "@/components/Filterbar";
import CustomersFilterPanel from "@/components/Customers/Customersfilterpanel";
import CustomersTable, {
  Customer,
} from "@/components/Customers/Customerstable";
import { useCustomers, ApiCustomer } from "@/lib/hooks/customers";

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

function mapCustomer(c: ApiCustomer): Customer {
  const lastActive = new Date(c.lastActive);
  const daysDiff = Math.floor(
    (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24),
  );
  return {
    id: c._id,
    name: c.fullName,
    initials: getInitials(c.fullName),
    avatarColor: getAvatarColor(c._id),
    phone: c.phone,
    email: c.email,
    city: c.city || "—",
    orders: c.ordersCount,
    lastOrderDays: daysDiff,
    lastOrderDate: lastActive.toLocaleDateString("en-GB"),
    status: c.status === "active" ? "Active" : "Suspended",
  };
}

export default function CustomersPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const { data, isLoading } = useCustomers({
    status: selectedStatus.length === 1 ? selectedStatus[0] : undefined,
    city: selectedCities[0],
    sortBy,
  });

  const stats = data?.stats;
  const customers: Customer[] = (data?.customers ?? []).map(mapCustomer);

  useEffect(() => {
    const filters: string[] = [];
    selectedStatus.forEach((s) => filters.push(`Status: ${s}`));
    selectedCities.forEach((c) => filters.push(`City: ${c}`));
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
      const s = filter.replace("Status: ", "");
      setSelectedStatus(selectedStatus.filter((x) => x !== s));
    } else if (filter.startsWith("City:")) {
      const c = filter.replace("City: ", "");
      setSelectedCities(selectedCities.filter((x) => x !== c));
    }
  };

  return (
    <div className="space-t-6 ">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-5">
        <CustomerStatsCard
          icon={Users}
          value={stats?.totalCustomers ?? 0}
          label="Total Customers"
          variant="default"
          loading={isLoading}
        />
        <CustomerStatsCard
          icon={UserPlus}
          value={stats?.newToday ?? 0}
          label="New Today"
          variant="default"
          loading={isLoading}
        />
        <CustomerStatsCard
          icon={TrendingUp}
          value={stats?.joinedLast7Days ?? 0}
          label="Joined Last 7 Days"
          variant="default"
          loading={isLoading}
        />
        <CustomerStatsCard
          icon={TrendingUp}
          value={stats?.joinedLast30Days ?? 0}
          label="Joined Last 30 Days"
          variant="default"
          loading={isLoading}
        />
        <CustomerStatsCard
          icon={UserMinus}
          value={customers.filter((c) => c.status === "Suspended").length}
          label="Suspended"
          variant="danger"
          loading={isLoading}
        />
        <CustomerStatsCard
          icon={ShoppingCart}
          value={stats?.noPurchases ?? 0}
          label="No Purchases Yet"
          variant="muted"
          loading={isLoading}
        />
      </div>

      {/* Customers Table */}
      <div className="overflow-hidden">
        <FilterBar
          showFilters={showFilters}
          activeFilters={activeFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onRemoveFilter={handleRemoveFilter}
          onExport={() => {}}
        />

        {showFilters && (
          <CustomersFilterPanel
            selectedStatus={selectedStatus}
            selectedCities={selectedCities}
            sortBy={sortBy}
            onStatusChange={setSelectedStatus}
            onCitiesChange={setSelectedCities}
            onSortChange={setSortBy}
            onClear={handleClearFilters}
          />
        )}

        <CustomersTable customers={customers} loading={isLoading} />
      </div>
    </div>
  );
}
