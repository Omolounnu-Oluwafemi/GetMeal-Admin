"use client";

import { useState, useEffect, useMemo } from "react";
import FilterBar from "@/components/Filterbar";
import PaymentsFilterPanel from "@/components/Payments/Paymentsfilterpanel";
import PaymentsTable, { Payment } from "@/components/Payments/Paymentstable";
import PaymentStatCard from "@/components/Payments/PaymentStatsCard";

const paymentsData: Payment[] = [
  {
    id: "1",
    orderId: "ORD-2026-005",
    customer: {
      name: "Ibrahim Musa",
      initials: "I",
      avatarColor: "#219e02",
    },
    cook: {
      name: "Fatima Bello",
    },
    amount: "₦5,400",
    amountValue: 5400,
    method: "Paystack",
    status: "Paid",
    date: "Feb 19, 2026",
    time: "11:00 AM",
    timestamp: new Date("2026-02-19T11:00:00").getTime(),
  },
  {
    id: "2",
    orderId: "ORD-2026-006",
    customer: {
      name: "Ngozi Eze",
      initials: "N",
      avatarColor: "#219e02",
    },
    cook: {
      name: "Olumide Adeleke",
    },
    amount: "₦3,500",
    amountValue: 3500,
    method: "OPay",
    status: "Pending",
    date: "Feb 19, 2026",
    time: "10:45 AM",
    timestamp: new Date("2026-02-19T10:45:00").getTime(),
  },
  {
    id: "3",
    orderId: "ORD-2026-001",
    customer: {
      name: "Tunde Bakare",
      initials: "T",
      avatarColor: "#219e02",
    },
    cook: {
      name: "Chioma Okoro",
    },
    amount: "₦4,500",
    amountValue: 4500,
    method: "Apple Pay",
    status: "Paid",
    date: "Feb 19, 2026",
    time: "10:15 AM",
    timestamp: new Date("2026-02-19T10:15:00").getTime(),
  },
  {
    id: "4",
    orderId: "ORD-2026-010",
    customer: {
      name: "Fatima Bello",
      initials: "F",
      avatarColor: "#219e02",
    },
    cook: {
      name: "Chinwe Nnamdi",
    },
    amount: "₦4,300",
    amountValue: 4300,
    method: "Google Pay",
    status: "Paid",
    date: "Feb 19, 2026",
    time: "10:00 AM",
    timestamp: new Date("2026-02-19T10:00:00").getTime(),
  },
  {
    id: "5",
    orderId: "ORD-2026-002",
    customer: {
      name: "Amina Yusuf",
      initials: "A",
      avatarColor: "#219e02",
    },
    cook: {
      name: "Aisha Mohammed",
    },
    amount: "₦3,200",
    amountValue: 3200,
    method: "Paystack",
    status: "Paid",
    date: "Feb 19, 2026",
    time: "09:30 AM",
    timestamp: new Date("2026-02-19T09:30:00").getTime(),
  },
  {
    id: "6",
    orderId: "ORD-2026-007",
    customer: {
      name: "Olu Ogunleye",
      initials: "O",
      avatarColor: "#EF4444",
    },
    cook: {
      name: "Bola Adeyemi",
    },
    amount: "₦6,800",
    amountValue: 6800,
    method: "OPay",
    status: "Failed",
    date: "Feb 18, 2026",
    time: "08:20 AM",
    timestamp: new Date("2026-02-18T08:20:00").getTime(),
  },
];

export default function PaymentsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Update active filters display
  useEffect(() => {
    const filters: string[] = [];
    if (selectedStatus) filters.push(`Status: ${selectedStatus}`);
    if (selectedMethod) filters.push(`Method: ${selectedMethod}`);
    setActiveFilters(filters);
  }, [selectedStatus, selectedMethod]);

  // Filter and sort payments
  const filteredPayments = useMemo(() => {
    let filtered = [...paymentsData];

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(
        (payment) => payment.status === selectedStatus,
      );
    }

    // Filter by payment method
    if (selectedMethod) {
      filtered = filtered.filter(
        (payment) => payment.method === selectedMethod,
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case "oldest":
        filtered.sort((a, b) => a.timestamp - b.timestamp);
        break;
      case "highest-amount":
        filtered.sort((a, b) => b.amountValue - a.amountValue);
        break;
      case "lowest-amount":
        filtered.sort((a, b) => a.amountValue - b.amountValue);
        break;
    }

    return filtered;
  }, [selectedStatus, selectedMethod, sortBy]);

  // Calculate stats based on filtered data
  const stats = useMemo(() => {
    const totalRevenue = filteredPayments
      .filter((p) => p.status === "Paid")
      .reduce((sum, p) => sum + p.amountValue, 0);

    const pendingCount = filteredPayments.filter(
      (p) => p.status === "Pending",
    ).length;
    const failedCount = filteredPayments.filter(
      (p) => p.status === "Failed",
    ).length;
    const refundedCount = 0; // No refunded payments in sample data

    return {
      totalRevenue,
      pendingCount,
      failedCount,
      refundedCount,
    };
  }, [filteredPayments]);

  const handleClearFilters = () => {
    setSelectedStatus(null);
    setSelectedMethod(null);
    setSortBy("newest");
    setActiveFilters([]);
  };

  const handleRemoveFilter = (filter: string) => {
    if (filter.startsWith("Status:")) {
      setSelectedStatus(null);
    } else if (filter.startsWith("Method:")) {
      setSelectedMethod(null);
    }
  };

  const handleExport = () => {
    console.log("Exporting payments to CSV...");
    // Implement CSV export logic
  };

  return (
    <div className="space-y-6 mt-[-4]">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PaymentStatCard
          label="Total Revenue"
          value={`₦${stats.totalRevenue.toLocaleString()}`}
          change={{
            value: 12.5,
            isPositive: true,
          }}
        />

        <PaymentStatCard
          label="Pending Payments"
          value={stats.pendingCount.toString()}
          change={{
            value: 1,
            isPositive: true,
          }}
          isOrders={true}
        />

        <PaymentStatCard
          label="Failed Payments"
          value={stats.failedCount.toString()}
          change={{
            value: 2.3,
            isPositive: false,
          }}
        />

        <PaymentStatCard
          label="Refunded"
          value={stats.refundedCount.toString()}
          change={{
            value: 0,
            isPositive: true,
          }}
          isOrders={true}
        />
      </div>

      <div className="overflow-hidden">
        <FilterBar
          showFilters={showFilters}
          activeFilters={activeFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onRemoveFilter={handleRemoveFilter}
          onExport={handleExport}
        />

        {/* Filters Panel */}
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

        {/* Table */}
        <PaymentsTable payments={filteredPayments} />

        {/* No Results Message */}
        {filteredPayments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No payments match the selected filters
          </div>
        )}
      </div>
    </div>
  );
}
