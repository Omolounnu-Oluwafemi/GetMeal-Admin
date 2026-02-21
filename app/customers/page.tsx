"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  TrendingUp,
  UserX,
  ShoppingCart,
  UserMinus,
} from "@/lib/icons";
import CustomerStatsCard from "@/components/Customers/Customerstatscard";
import FilterBar from "@/components/Filterbar";
import CustomersFilterPanel from "@/components/Customers/Customersfilterpanel";
import CustomersTable, {
  Customer,
} from "@/components/Customers/Customerstable";

// Sample customer data
const customersData: Customer[] = [
  {
    id: "1",
    name: "Mohammed Sani",
    initials: "MS",
    avatarColor: "#8B4513",
    phone: "+234 814 678 9012",
    email: "mohammed.sani@example.com",
    city: "Kano",
    orders: 15,
    lastOrderDays: 18,
    lastOrderDate: "30/01/2026",
    status: "Active",
  },
  {
    id: "2",
    name: "Funke Adeyemi",
    initials: "FA",
    avatarColor: "#9333EA",
    phone: "+234 815 234 5678",
    email: "funke.adeyemi@example.com",
    city: "Lagos",
    orders: 12,
    lastOrderDays: 30,
    lastOrderDate: "15/01/2026",
    status: "Suspended",
  },
  {
    id: "3",
    name: "Segun Akinwale",
    initials: "SA",
    avatarColor: "#219e02",
    phone: "+234 808 234 5678",
    email: "segun.a@example.com",
    city: "Lagos",
    orders: 18,
    lastOrderDays: 16,
    lastOrderDate: "01/02/2026",
    status: "Active",
  },
  {
    id: "4",
    name: "Chioma Nwosu",
    initials: "CN",
    avatarColor: "#219e02",
    phone: "+234 803 456 7890",
    email: "chioma.nwosu@example.com",
    city: "Abuja",
    orders: 23,
    lastOrderDays: 13,
    lastOrderDate: "04/02/2026",
    status: "Active",
  },
  {
    id: "5",
    name: "Grace Obi",
    initials: "GO",
    avatarColor: "#219e02",
    phone: "+234 810 123 4567",
    email: "grace.obi@example.com",
    city: "Abuja",
    orders: 44,
    lastOrderDays: 12,
    lastOrderDate: "06/02/2026",
    status: "Active",
  },
  {
    id: "6",
    name: "Blessing Nneka",
    initials: "BN",
    avatarColor: "#6B7280",
    phone: "+234 802 345 6789",
    email: "blessing.n@example.com",
    city: "Abuja",
    orders: 72,
    lastOrderDays: 12,
    lastOrderDate: "05/02/2026",
    status: "Active",
  },
];

export default function CustomersPage() {
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
    console.log("Exporting customers to CSV...");
    // Implement CSV export logic
  };

  return (
    <div className="space-t-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-5">
        <CustomerStatsCard
          icon={Users}
          value={15}
          label="Total Customers"
          variant="default"
        />

        <CustomerStatsCard
          icon={UserPlus}
          value={0}
          label="New Today"
          variant="default"
        />

        <CustomerStatsCard
          icon={TrendingUp}
          value={0}
          label="Joined Last 7 Days"
          variant="default"
        />

        <CustomerStatsCard
          icon={TrendingUp}
          value={0}
          label="Joined Last 30 Days"
          variant="default"
        />

        <CustomerStatsCard
          icon={UserMinus}
          value={1}
          label="Suspended"
          variant="default"
        />

        <CustomerStatsCard
          icon={ShoppingCart}
          value={0}
          label="No Purchases Yet"
          variant="default"
        />
      </div>

      {/* Customers Table */}
      <div className=" overflow-hidden">
        <FilterBar
          showFilters={showFilters}
          activeFilters={activeFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onRemoveFilter={handleRemoveFilter}
          onExport={handleExport}
        />

        {/* Filters Panel */}
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
        {/* Table */}
        <CustomersTable customers={customersData} />
      </div>
    </div>
  );
}
