"use client";

import { useState, useEffect } from "react";
import FilterBar from "@/components/Filterbar";
import PaymentsFilterPanel from "@/components/Payments/Paymentsfilterpanel";
import PaymentsTable, { Payment } from "@/components/Payments/Paymentstable";
import PaymentStatCard from "@/components/Payments/PaymentStatsCard";
import { useQueries } from "@tanstack/react-query";
import { usePayments, usePaymentStats, ApiPayment } from "@/lib/hooks/payments";
import api from "@/lib/api";

const AVATAR_COLORS = [
  "#8B4513", "#9333EA", "#219e02", "#2563EB",
  "#DC2626", "#D97706", "#0891B2", "#7C3AED",
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function getAvatarColor(id: string) {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function mapPaymentStatus(paymentStatus: string): "Paid" | "Pending" | "Failed" | "Refunded" {
  if (paymentStatus === "paid") return "Paid";
  if (paymentStatus === "refunded") return "Refunded";
  if (paymentStatus === "failed") return "Failed";
  return "Pending";
}

function mapPayment(p: ApiPayment, cookMap: Record<string, string> = {}): Payment {
  const customerName = p.userId?.fullName ?? "Unknown";
  const customerId = p.userId?._id ?? p._id;
  const date = new Date(p.createdAt);

  return {
    id: p._id,
    orderId: p.paymentReference,
    customer: {
      name: customerName,
      initials: getInitials(customerName),
      avatarColor: getAvatarColor(customerId),
    },
    cook: {
      name: p.cookId ? (cookMap[p.cookId._id] ?? "—") : "—",
    },
    amount: `₦${p.totalAmount.toLocaleString()}`,
    amountValue: p.totalAmount,
    method: p.deliveryType
      ? p.deliveryType.charAt(0).toUpperCase() + p.deliveryType.slice(1)
      : "—",
    status: mapPaymentStatus(p.paymentStatus),
    date: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    time: date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    timestamp: date.getTime(),
  };
}

export default function PaymentsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const { data: statsData, isLoading: statsLoading } = usePaymentStats({ status: selectedStatus, sortBy });
  const { data: paymentsData, isLoading: paymentsLoading } = usePayments({ status: selectedStatus, sortBy });

  const cookIds = [...new Set((paymentsData ?? []).map((p) => p.cookId?._id).filter(Boolean) as string[])];

  const cookQueries = useQueries({
    queries: cookIds.map((id) => ({
      queryKey: ["cook", id],
      queryFn: async () => {
        const res = await api.get(`/api/admin/cooks/${id}`);
        return res.data.cook ?? res.data;
      },
      staleTime: 5 * 60 * 1000,
    })),
  });

  const cookMap: Record<string, string> = Object.fromEntries(
    cookIds.map((id, i) => [id, cookQueries[i]?.data?.name ?? "—"]),
  );

  const payments: Payment[] = (paymentsData ?? []).map((p) =>
    mapPayment(p, cookMap),
  );

  useEffect(() => {
    const filters: string[] = [];
    if (selectedStatus) filters.push(`Status: ${selectedStatus}`);
    if (selectedMethod) filters.push(`Method: ${selectedMethod}`);
    setActiveFilters(filters);
  }, [selectedStatus, selectedMethod]);

  const handleClearFilters = () => {
    setSelectedStatus(null);
    setSelectedMethod(null);
    setSortBy("newest");
    setActiveFilters([]);
  };

  const handleRemoveFilter = (filter: string) => {
    if (filter.startsWith("Status:")) setSelectedStatus(null);
    else if (filter.startsWith("Method:")) setSelectedMethod(null);
  };

  const stats = statsData;

  return (
    <div className="space-y-6 mt-[-4]">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PaymentStatCard
          label="Total Revenue"
          value={stats ? `₦${stats.totalRevenue.toLocaleString()}` : "₦0"}
          change={{ value: stats?.revenueChange ?? 0, isPositive: (stats?.revenueChange ?? 0) >= 0 }}
          loading={statsLoading}
        />
        <PaymentStatCard
          label="Pending Payments"
          value={stats?.pendingPayments ?? 0}
          change={{ value: stats?.pendingChange ?? 0, isPositive: false }}
          isOrders
          loading={statsLoading}
        />
        <PaymentStatCard
          label="Failed Payments"
          value={stats?.failedPayments ?? 0}
          change={{ value: stats?.failedChange ?? 0, isPositive: (stats?.failedChange ?? 0) <= 0 }}
          loading={statsLoading}
        />
        <PaymentStatCard
          label="Refunded"
          value={stats?.refundedPayments ?? 0}
          change={{ value: stats?.refundedChange ?? 0, isPositive: true }}
          isOrders
          loading={statsLoading}
        />
      </div>

      <div className="overflow-hidden">
        <FilterBar
          showFilters={showFilters}
          activeFilters={activeFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onRemoveFilter={handleRemoveFilter}
          onExport={() => {}}
        />

        {showFilters && (
          <PaymentsFilterPanel
            selectedStatus={selectedStatus}
            selectedMethod={selectedMethod}
            sortBy={sortBy}
            onStatusChange={setSelectedStatus}
            onMethodChange={setSelectedMethod}
            onSortChange={setSortBy}
            onClear={handleClearFilters}
          />
        )}

        <PaymentsTable payments={payments} loading={paymentsLoading} />

        {!paymentsLoading && payments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No payments match the selected filters
          </div>
        )}
      </div>
    </div>
  );
}
