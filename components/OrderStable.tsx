"use client";

import { useRef, useState } from "react";
import { MoreVertical, Phone, User, X, DollarSign } from "@/lib/icons";
import OrderDetailsSidebar from "@/components/Order/Orderdetailssidebar";
import OrderFiltersPopover from "@/components/Order/OrderFiltersPopover";
import { SlidersHorizontal } from "lucide-react";
import Pagination from "@/components/Pagination";

export interface Order {
  id: string;
  meal: string;
  items: number;
  image: string;
  orderId: string;
  customerArea: string;
  payment: string;
  paymentStatus: "Paid" | "Pending" | "Failed";
  cook: {
    initial: string;
    name: string;
    color: string;
    email: string;
    phone: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  timeline: {
    orderPlaced: string;
    expectedDelivery: string;
  };
  status: string;
  statusColor: string;
  tabKey: string;
  mealItems?: {
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
  cookId?: string;
  customerId?: string;
}

interface OrdersTableProps {
  orders?: Order[];
  atRiskOrders?: Order[];
  loading?: boolean;
  onCancelOrder?: (id: string) => void;
  onIssueRefund?: (id: string) => void;
  page?: number;
  totalPages?: number;
  total?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

export default function OrdersTable({
  orders = [],
  atRiskOrders = [],
  loading = false,
  onCancelOrder,
  onIssueRefund,
  page = 1,
  totalPages = 1,
  total = 0,
  pageSize = 10,
  onPageChange,
}: OrdersTableProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  const [sortBy, setSortBy] = useState("Date");
  const [sortOrder, setSortOrder] = useState("Descending");
  const [paymentStatuses, setPaymentStatuses] = useState<string[]>([]);
  const [atRiskOnly, setAtRiskOnly] = useState(false);
  const [atRiskPage, setAtRiskPage] = useState(1);
  const AT_RISK_PAGE_SIZE = 10;

  const handleClearFilters = () => {
    setSortBy("Date");
    setSortOrder("Descending");
    setPaymentStatuses([]);
    setAtRiskOnly(false);
  };

  const handleExportCSV = () => {
    const headers = [
      "Order ID",
      "Meal",
      "Items",
      "Customer Area",
      "Payment",
      "Cook",
      "Status",
      "Payment Status",
    ];
    const rows = filteredOrders.map((o) => [
      o.orderId,
      `"${o.meal}"`,
      o.items,
      o.customerArea,
      o.payment,
      `"${o.cook.name}"`,
      o.status,
      o.paymentStatus,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const style = document.createElement("style");
    style.innerHTML = "@page { size: landscape; }";
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  const atRiskTotalPages = Math.ceil(atRiskOrders.length / AT_RISK_PAGE_SIZE);
  const pagedAtRiskOrders = atRiskOrders.slice(
    (atRiskPage - 1) * AT_RISK_PAGE_SIZE,
    atRiskPage * AT_RISK_PAGE_SIZE,
  );

  const filterTabs = [
    { label: "All Orders", count: orders.length, value: "all" },
    {
      label: "Pending",
      count: orders.filter((o) => o.tabKey === "new").length,
      value: "new",
    },
    {
      label: "Active Cooks",
      count: orders.filter((o) => o.tabKey === "active-cooks").length,
      value: "active-cooks",
    },
    {
      label: "At-Risk Orders",
      count: pagedAtRiskOrders.length,
      value: "at-risk",
    },
    {
      label: "Cancelled",
      count: orders.filter((o) => o.tabKey === "cancelled").length,
      value: "cancelled",
    },
    {
      label: "Completed",
      count: orders.filter((o) => o.tabKey === "completed").length,
      value: "completed",
    },
    {
      label: "Refunded",
      count: orders.filter((o) => o.tabKey === "refunded").length,
      value: "refunded",
    },
  ];

  const sourceOrders = activeTab === "at-risk" ? pagedAtRiskOrders : orders;
  let filteredOrders =
    activeTab === "all" || activeTab === "at-risk"
      ? sourceOrders
      : sourceOrders.filter((o) => o.tabKey === activeTab);

  if (paymentStatuses.length > 0) {
    filteredOrders = filteredOrders.filter((o) =>
      paymentStatuses.includes(o.paymentStatus),
    );
  }
  if (atRiskOnly) {
    filteredOrders = filteredOrders.filter((o) => o.tabKey === "at-risk");
  }

  filteredOrders = [...filteredOrders].sort((a, b) => {
    let cmp = 0;
    if (sortBy === "Amount") {
      cmp =
        parseInt(a.payment.replace(/[^0-9]/g, "")) -
        parseInt(b.payment.replace(/[^0-9]/g, ""));
    } else if (sortBy === "Status") {
      cmp = a.status.localeCompare(b.status);
    } else if (sortBy === "Area") {
      cmp = a.customerArea.localeCompare(b.customerArea);
    } else if (sortBy === "Cook") {
      cmp = a.cook.name.localeCompare(b.cook.name);
    }
    return sortOrder === "Descending" ? -cmp : cmp;
  });

  return (
    <div className="bg-white rounded-[20px] border border-[#F3F4F6] overflow-hidden">
      {/* Pagination */}
      {activeTab === "at-risk" ? (
        <Pagination
          page={atRiskPage}
          totalPages={atRiskTotalPages}
          total={atRiskOrders.length}
          pageSize={AT_RISK_PAGE_SIZE}
          onPageChange={setAtRiskPage}
          label="at-risk orders"
        />
      ) : onPageChange ? (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={pageSize}
          onPageChange={onPageChange}
          label="orders"
        />
      ) : null}
      {/* Filter Tabs */}
      <div className="flex items-center gap-3 p-6 border-b border-[#F3F4F6] overflow-x-auto scrollbar-hide">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${
                  tab.value === activeTab
                    ? "bg-[#219e02] text-white"
                    : " bg-[#f9fbff] text-gray-700 hover:border-[#219e02]"
                }
              `}
          >
            {tab.label} ({tab.count})
          </button>
        ))}

        <button
          ref={filterButtonRef}
          onClick={() => setShowFilters((p) => !p)}
          className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <OrderFiltersPopover
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        anchorRef={filterButtonRef}
        sortBy={sortBy}
        sortOrder={sortOrder}
        paymentStatuses={paymentStatuses}
        atRiskOnly={atRiskOnly}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
        onPaymentStatusesChange={setPaymentStatuses}
        onAtRiskOnlyChange={setAtRiskOnly}
        onClear={handleClearFilters}
        onExportCSV={handleExportCSV}
        onPrint={handlePrint}
      />

      {/* Table */}
      <div className="overflow-x-auto px-4">
        {loading ? (
          <div className="py-6 space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 border border-[#F3F4F6] rounded-xl"
              >
                <div className="w-14 h-14 bg-gray-200 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-base font-semibold text-gray-400">
              No orders in this category
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Orders will appear here when available
            </p>
          </div>
        ) : (
          <table className="w-full border-separate border-spacing-y-2">
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  {/* Image */}
                  <td className="pl-4 py-4 border-y border-l border-[#F3F4F6] rounded-l-xl bg-white">
                    {order.image ? (
                      <img
                        src={order.image}
                        alt={order.meal}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-400 text-xs">No img</span>
                      </div>
                    )}
                  </td>

                  {/* Meal */}
                  <td className="pl-4 pr-1 py-3 whitespace-nowrap border-y border-[#F3F4F6] bg-white w-[20%]">
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      MEAL
                    </div>
                    <span
                      className="text-base font-medium text-gray-900 text-wrap block"
                      title={order.meal}
                    >
                      {order.meal}
                      {order.items > 0
                        ? ` + ${order.items} Item${order.items > 1 ? "s" : ""}`
                        : ""}
                    </span>
                  </td>

                  {/* Order ID */}
                  <td className="px-6 py-3 whitespace-nowrap border-y border-[#F3F4F6] bg-white">
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      ORDER ID
                    </div>
                    <div className="text-base font-medium text-gray-900">
                      {order.orderId}
                    </div>
                  </td>

                  {/* Customer Area */}
                  <td className="px-10 py-3 whitespace-nowrap border-y border-[#F3F4F6] bg-white">
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      CUSTOMER AREA
                    </div>
                    <div className="text-base text-gray-900">
                      {order.customerArea}
                    </div>
                  </td>

                  {/* Payment */}
                  <td className="pl-4 pr-24 py-3 whitespace-nowrap border-y border-[#F3F4F6] bg-white">
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      PAYMENT
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      {order.payment}
                    </div>
                  </td>

                  {/* Cook */}
                  <td className="px-4 py-3 whitespace-nowrap border-y border-[#F3F4F6] bg-white">
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      COOK
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: "#219e02" }}
                      >
                        {order.cook.initial}
                      </div>
                      <span
                        className="text-base text-gray-900 truncate max-w-[120px]"
                        title={order.cook.name}
                      >
                        {order.cook.name}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap border-y border-[#F3F4F6] bg-white">
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      STATUS
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        order.status === "Cooking"
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {order.status}
                    </div>
                  </td>

                  {/* Actions Menu */}
                  <td
                    className="pr-4 py-4 whitespace-nowrap text-right border-y border-r border-[#F3F4F6] rounded-r-xl bg-white relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === order.id ? null : order.id)
                      }
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>

                    {openMenuId === order.id && (
                      <div className="absolute right-6 top-12 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View Order Details
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Phone className="w-4 h-4" /> Contact Cook
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <User className="w-4 h-4" /> Contact Customer
                        </button>
                        <div className="border-t border-gray-200 my-1" />
                        <button
                          onClick={() => {
                            onCancelOrder?.(order.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <X className="w-4 h-4" /> Cancel Order
                        </button>
                        <button
                          onClick={() => {
                            onIssueRefund?.(order.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <DollarSign className="w-4 h-4" /> Issue Refund
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailsSidebar
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onCancelOrder={() => {
            onCancelOrder?.(selectedOrder.id);
            setSelectedOrder(null);
          }}
          onIssueRefund={() => {
            onIssueRefund?.(selectedOrder.id);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}
