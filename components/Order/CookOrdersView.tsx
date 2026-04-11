"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Star, Phone, MessageSquare } from "@/lib/icons";
import CallModal from "@/components/CallModal";
import Pagination from "@/components/Pagination";
import { Package, DollarSign, TrendingUp, ShoppingBag } from "lucide-react";
import { useCookById } from "@/lib/hooks/cooks";
import { useOrdersFilter } from "@/lib/hooks/orders";
import { mapCook } from "@/lib/mappers/cooks";
import { mapFilterOrder, STATUS_MAP } from "@/lib/mappers/orders";

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

interface CookOrdersViewProps {
  cookId: string;
  cookName: string;
  onClose: () => void;
}

export default function CookOrdersView({
  cookId,
  cookName,
  onClose,
}: CookOrdersViewProps) {
  const [activeTab, setActiveTab] = useState<"history" | "performance">("history");
  const [callTarget, setCallTarget] = useState<{ name: string; phone: string } | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const { data: cookData, isLoading: cookLoading } = useCookById(cookId);
  const { data: ordersData, isLoading: ordersLoading } = useOrdersFilter({
    cookId,
  });

  const cook = cookData ? mapCook(cookData) : null;
  const orders = (ordersData ?? []).map(mapFilterOrder);

  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const confirmedOrders = orders.filter((o) => o.status === "Confirmed").length;
  const deliveredOrders = orders.filter((o) =>
    ["Completed", "Delivered"].includes(o.status),
  ).length;
  const cancelledOrders = orders.filter((o) => o.status === "Cancelled").length;

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const pagedOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalRevenue = orders.reduce((sum, o) => {
    const amt = parseInt(o.payment.replace(/[^0-9]/g, ""), 10) || 0;
    return sum + amt;
  }, 0);
  const avgOrder =
    orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  const formatAmount = (n: number) => {
    if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}m`;
    if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}k`;
    return `₦${n.toLocaleString()}`;
  };

  return (
    <>
    <motion.div
      className="fixed top-0 right-0 bottom-0 left-0 md:left-[108px] bg-[#fafafa] z-[60] flex flex-col overflow-y-auto"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 30, stiffness: 280 }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 px-8 py-4 border-b border-gray-200">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <span className="text-sm text-gray-400">/ Cooks /</span>
        <span className="text-sm font-medium text-gray-800">{cookName}</span>
      </div>

      <div className="flex-1 px-8 py-6 max-w-6xl w-full mx-auto space-y-6">
        {/* Cook Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {cookLoading ? (
              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                style={{
                  backgroundColor: cook?.avatarColor ?? getAvatarColor(cookId),
                }}
              >
                {cook?.avatar ? (
                  <img
                    src={cook.avatar}
                    alt={cook.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  (cook?.initials ?? cookName[0]?.toUpperCase())
                )}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {cook?.name ?? cookName}
                </h2>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    cook?.status === "Active"
                      ? "bg-[#F0FDF4] text-[#219e02]"
                      : cook?.status === "Suspended"
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {cook?.status ?? "—"}
                </span>
              </div>

              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                <span className="text-sm font-semibold text-gray-900">
                  {cook?.rating ?? 0}
                </span>
                <span className="text-sm text-gray-400">
                  ({cook?.ratingNumber ?? 0} orders)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                {cook?.email && (
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
                    {cook.email}
                  </span>
                )}
                {cook?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {cook.phone}
                  </span>
                )}
                {cook?.city && cook.city !== "—" && (
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
                    {cook.city}
                  </span>
                )}
                {cook?.joinedDate && (
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Joined {cook.joinedDate}
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
            <button
              onClick={() => setCallTarget({ name: cook?.name ?? cookName, phone: cook?.phone ?? "" })}
              className="flex items-center gap-2 px-4 py-2 bg-[#219e02] text-white text-sm font-medium rounded-full hover:bg-[#1a7d01] transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call Cook
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            {
              label: "Pending",
              value: ordersLoading ? "—" : pendingOrders,
              icon: <ShoppingBag className="w-5 h-5 text-blue-500" />,
              iconBg: "bg-blue-50",
              valueColor: "text-gray-900",
            },
            {
              label: "Confirmed",
              value: ordersLoading ? "—" : confirmedOrders,
              icon: <Package className="w-5 h-5 text-purple-500" />,
              iconBg: "bg-purple-50",
              valueColor: "text-purple-600",
            },
            {
              label: "Delivered",
              value: ordersLoading ? "—" : deliveredOrders,
              icon: <Package className="w-5 h-5 text-[#219e02]" />,
              iconBg: "bg-[#F0FDF4]",
              valueColor: "text-[#219e02]",
            },
            {
              label: "Cancelled",
              value: ordersLoading ? "—" : cancelledOrders,
              icon: <ShoppingBag className="w-5 h-5 text-red-500" />,
              iconBg: "bg-red-50",
              valueColor: "text-red-500",
            },
            {
              label: "Total Revenue",
              value: ordersLoading ? "—" : formatAmount(totalRevenue),
              icon: <DollarSign className="w-5 h-5 text-[#219e02]" />,
              iconBg: "bg-[#F0FDF4]",
              valueColor: "text-gray-900",
            },
            {
              label: "Avg Order",
              value: ordersLoading ? "—" : formatAmount(avgOrder),
              icon: <TrendingUp className="w-5 h-5 text-orange-500" />,
              iconBg: "bg-orange-50",
              valueColor: "text-gray-900",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-full ${stat.iconBg} flex items-center justify-center flex-shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "history"
                  ? "border-[#219e02] text-[#219e02]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Order History ({ordersLoading ? "…" : orders.length})
            </button>
            <button
              onClick={() => setActiveTab("performance")}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "performance"
                  ? "border-[#219e02] text-[#219e02]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Performance Stats
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "history" && (
          <div>
            {ordersLoading ? (
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
                  This cook hasn&apos;t received any orders yet
                </p>
              </div>
            ) : (
              <div className="border rounded-2xl overflow-hidden">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  total={orders.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setPage}
                  label="orders"
                />
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Meal
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
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
                    {pagedOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {order.image ? (
                              <img
                                src={order.image}
                                alt={order.meal}
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <Package className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                            <div className="relative group">
                              <span className="text-sm font-medium text-gray-900 block truncate max-w-[140px]">
                                {order.meal}
                              </span>
                              {order.items > 0 && (
                                <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-500 rounded-full">
                                  +{order.items} more
                                </span>
                              )}
                              <div className="absolute bottom-[calc(100%+6px)] left-0 z-50 hidden group-hover:block">
                                <div className="bg-white text-gray-800 text-xs rounded-lg px-3 py-2 shadow-lg border border-gray-200 min-w-max max-w-[280px]">
                                  {order.mealItems && order.mealItems.length > 0
                                    ? order.mealItems.map((item, i) => (
                                        <div key={i} className={i > 0 ? "mt-1 pt-1 border-t border-gray-100" : ""}>
                                          {item.name} ×{item.quantity}
                                        </div>
                                      ))
                                    : order.meal}
                                  <div className="absolute top-full left-4 border-4 border-transparent border-t-white" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.orderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customer.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {order.payment}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.timeline.orderPlaced}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${order.statusColor}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm font-medium ${
                              order.paymentStatus === "Paid"
                                ? "text-[#219e02]"
                                : order.paymentStatus === "Pending"
                                  ? "text-[#F59E0B]"
                                  : "text-red-500"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "performance" && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "On-Time Rate", value: cook?.onTimeRate ?? "—" },
              { label: "Avg Prep Time", value: cook?.avgPrepTime ?? "—" },
              { label: "Cancel Rate", value: cook?.cancelRate ?? "—" },
              { label: "Total Orders", value: orders.length },
              {
                label: "Wallet Balance",
                value: cook
                  ? `₦${(cook.walletBalance ?? 0).toLocaleString()}`
                  : "—",
              },
              { label: "Reviews", value: cook?.reviewsCount ?? 0 },
            ].map((m) => (
              <div key={m.label} className="bg-[#f7f7f7] rounded-2xl p-5">
                <p className="text-sm text-[#77797e]">{m.label}</p>
                <p className="text-2xl font-bold text-[#111827] mt-1">
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>

    {callTarget && (
      <CallModal
        name={callTarget.name}
        phone={callTarget.phone}
        onClose={() => setCallTarget(null)}
      />
    )}
    </>
  );
}
