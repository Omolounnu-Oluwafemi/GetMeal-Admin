"use client";

import { X, Phone, MessageSquare } from "@/lib/icons";
import { Package } from "lucide-react";
import { useCustomerById } from "@/lib/hooks/customers";
import { STATUS_MAP } from "@/lib/mappers/orders";

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

function getAvatarColor(id: string) {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

interface UserOrdersViewProps {
  userId: string;
  userName: string;
  onClose: () => void;
}

export default function UserOrdersView({
  userId,
  userName,
  onClose,
}: UserOrdersViewProps) {
  const { data: customerData, isLoading } = useCustomerById(userId);

  const orders = customerData?.orders ?? [];
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);
  const completedOrders = orders.filter((o) =>
    ["completed", "delivered"].includes(o.status),
  ).length;
  const pendingOrders = orders.filter((o) =>
    ["pending", "cooking"].includes(o.status),
  ).length;

  const formatAmount = (n: number) => {
    if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}m`;
    if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}k`;
    return `₦${n.toLocaleString()}`;
  };

  const avatarColor = getAvatarColor(userId);
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="fixed inset-0 bg-[#fafafa] z-[60] flex flex-col overflow-y-auto">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-8 py-4 border-b border-gray-200">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <span className="text-sm text-gray-400">/ Orders /</span>
        <span className="text-sm font-medium text-gray-800">{userName}</span>
      </div>

      <div className="flex-1 px-8 py-6 max-w-6xl w-full mx-auto space-y-6">
        {/* Customer Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                style={{ backgroundColor: avatarColor }}
              >
                {initials}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {customerData?.fullName ?? userName}
                </h2>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    customerData?.status === "active"
                      ? "bg-[#F0FDF4] text-[#219e02]"
                      : customerData?.status === "suspended"
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {customerData?.status
                    ? customerData.status.charAt(0).toUpperCase() +
                      customerData.status.slice(1)
                    : "—"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                {customerData?.email && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {customerData.email}
                  </span>
                )}
                {customerData?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {customerData.phone}
                  </span>
                )}
                {customerData?.city && customerData.city !== "—" && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {customerData.city}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-[#219e02] text-[#219e02] text-sm font-medium rounded-full hover:bg-[#f3f9f2] transition-colors">
              <MessageSquare className="w-4 h-4" />
              Send Message
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#219e02] text-white text-sm font-medium rounded-full hover:bg-[#1a7d01] transition-colors">
              <Phone className="w-4 h-4" />
              Call Customer
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: "Total Orders",
              value: isLoading ? "—" : orders.length,
              icon: "📦",
              color: "text-blue-600",
            },
            {
              label: "Completed",
              value: isLoading ? "—" : completedOrders,
              icon: "✅",
              color: "text-[#219e02]",
            },
            {
              label: "Pending",
              value: isLoading ? "—" : pendingOrders,
              icon: "⏳",
              color: "text-[#F59E0B]",
            },
            {
              label: "Total Spent",
              value: isLoading ? "—" : formatAmount(totalSpent),
              icon: "💰",
              color: "text-gray-900",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{stat.icon}</span>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Order History */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Order History ({isLoading ? "…" : orders.length})
          </h3>

          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Package className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-base font-semibold text-gray-400">
                No orders found
              </p>
              <p className="text-sm text-gray-400 mt-1">
                This customer hasn&apos;t placed any orders yet
              </p>
            </div>
          ) : (
            <div className="border rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {orders.map((order) => {
                    const statusInfo = STATUS_MAP[order.status] ?? {
                      status: order.status,
                      statusColor: "bg-gray-100 text-gray-500",
                    };
                    const paymentColor =
                      order.paymentStatus === "paid"
                        ? "text-[#219e02]"
                        : order.paymentStatus === "pending"
                          ? "text-[#F59E0B]"
                          : "text-red-500";
                    const paymentLabel =
                      order.paymentStatus === "paid"
                        ? "Paid"
                        : order.paymentStatus === "pending"
                          ? "Pending"
                          : "Failed";

                    return (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #GTM-{order._id.slice(-6)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ₦{(order.totalAmount ?? 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {order.deliveryType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusInfo.statusColor}`}
                          >
                            {statusInfo.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${paymentColor}`}>
                            {paymentLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
