"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "@/lib/icons";
import OrderStatsCard from "@/components/Order/Orderstatscard";
import OrdersTable, { Order } from "@/components/Order/Orderstable";
import OrderDetailsSidebar from "@/components/Order/Orderdetailssidebar";

// Sample orders data
const ordersData: Order[] = [
  {
    id: "1",
    meal: "Ofe Akwu & Fufu",
    items: 1,
    image: "/orders/ofe-akwu.jpg",
    orderId: "ORD-2026-010",
    customerArea: "Victoria Island",
    payment: "₦3,900",
    cook: {
      name: "Chinwe's Delights",
      color: "#219e02",
    },
    status: "Cooking Tomorrow",
    statusColor: "text-blue-600",
  },
  {
    id: "2",
    meal: "Egusi Soup & Pounded Yam",
    items: 2,
    image: "/orders/egusi.jpg",
    orderId: "ORD-2026-005",
    customerArea: "Ikoyi",
    payment: "₦6,200",
    cook: {
      name: "Chioma's Kitchen",
      color: "#219e02",
    },
    status: "Cooking",
    statusColor: "text-green-600",
  },
  {
    id: "3",
    meal: "Gizdodo & Plantain",
    items: 3,
    image: "/orders/gizdodo.jpg",
    orderId: "ORD-2026-004",
    customerArea: "Wuse 2",
    payment: "₦5,400",
    cook: {
      name: "Zainab's Kitchen",
      color: "#219e02",
    },
    status: "Ready",
    statusColor: "text-green-700",
  },
  {
    id: "4",
    meal: "Jollof Rice & Chicken",
    items: 2,
    image: "/orders/jollof.jpg",
    orderId: "ORD-2026-001",
    customerArea: "Lekki",
    payment: "₦4,500",
    cook: {
      name: "Chioma's Kitchen",
      color: "#219e02",
    },
    status: "Cooking",
    statusColor: "text-green-600",
  },
];

const filterTabs = [
  { label: "All Orders", count: 12, value: "all" },
  { label: "New", count: 3, value: "new" },
  { label: "Active Cooks", count: 2, value: "active-cooks" },
  { label: "At-Risk Orders", count: 1, value: "at-risk" },
  { label: "Cancelled", count: 1, value: "cancelled" },
  { label: "Completed", count: 3, value: "completed" },
  { label: "Refunded", count: 1, value: "refunded" },
];

// Sample order details
const orderDetailsData = {
  orderId: "ORD-2026-010",
  status: "Cooking Tomorrow",
  statusColor: "bg-blue-100 text-blue-600",
  meal: {
    name: "Ofe Akwu & Fufu",
    quantity: 1,
    price: "₦3,900",
    image: "/orders/ofe-akwu.jpg",
  },
  timeline: {
    orderPlaced: "Feb 7, 2026, 10:45 AM",
    expectedDelivery: "Feb 7, 2026, 12:15 PM",
  },
  customer: {
    name: "Olu Ogunleye",
    email: "olu.ogunleye@example.com",
    phone: "+234 806 234 5678",
    area: "Victoria Island",
  },
  cook: {
    name: "Chinwe Nnamdi",
    initials: "C",
    color: "#219e02",
    email: "chinwe@getameal.com",
    phone: "+234 813 888 9999",
  },
  payment: {
    amount: "₦3,900",
    status: "Paid" as const,
  },
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseSidebar = () => {
    setSelectedOrderId(null);
  };

  const handleCancelOrder = () => {
    console.log("Cancel order");
    // Handle cancel logic
  };

  const handleIssueRefund = () => {
    console.log("Issue refund");
    // Handle refund logic
  };

  return (
    <div className="space-y-6">
      {/* Filters Row */}
      <div className="flex items-center gap-4">
        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#219e02] focus:border-transparent">
          <option>All Statuses</option>
          <option>Cooking</option>
          <option>Ready</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>

        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#219e02] focus:border-transparent">
          <option>All Area</option>
          <option>Lagos</option>
          <option>Abuja</option>
          <option>Port Harcourt</option>
        </select>

        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#219e02] focus:border-transparent">
          <option>Newest First</option>
          <option>Oldest First</option>
          <option>Highest Amount</option>
          <option>Lowest Amount</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <OrderStatsCard
          icon={ShoppingCart}
          value={12}
          label="Total Orders"
          variant="default"
        />

        <OrderStatsCard
          icon={Package}
          value={0}
          label="Orders Today"
          variant="default"
        />

        <OrderStatsCard
          icon={Clock}
          value={7}
          label="Active Orders"
          variant="default"
        />

        <OrderStatsCard
          icon={CheckCircle}
          value={3}
          label="Completed"
          variant="success"
        />

        <OrderStatsCard
          icon={XCircle}
          value={1}
          label="Cancelled"
          variant="danger"
        />

        <OrderStatsCard
          icon={AlertCircle}
          value={1}
          label="At Risk"
          variant="warning"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[20px] border border-[#F3F4F6] overflow-hidden">
        {/* Filter Tabs */}
        <div className="flex items-center gap-3 p-6 border-b border-[#F3F4F6] overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${
                  tab.value === activeTab
                    ? "bg-[#219e02] text-white"
                    : "bg-white border border-[#E5E7EB] text-gray-700 hover:border-[#219e02]"
                }
              `}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Table */}
        <OrdersTable orders={ordersData} onViewDetails={handleViewDetails} />
      </div>

      {/* Order Details Sidebar */}
      {selectedOrderId && (
        <OrderDetailsSidebar
          order={orderDetailsData}
          onClose={handleCloseSidebar}
          onCancelOrder={handleCancelOrder}
          onIssueRefund={handleIssueRefund}
        />
      )}
    </div>
  );
}
