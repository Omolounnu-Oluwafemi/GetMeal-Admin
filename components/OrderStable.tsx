"use client";

import { useRef, useState } from "react";
import { MoreVertical, Phone, User, X, DollarSign } from "@/lib/icons";
import OrderDetailsSidebar from "@/components/Order/Orderdetailssidebar";
import OrderFiltersPopover from "@/components/Order/OrderFiltersPopover";
import { SlidersHorizontal } from "lucide-react";

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
  customer: { name: string; email: string; phone: string };
  timeline: { orderPlaced: string; expectedDelivery: string };
  status: string;
  statusColor: string;
  tabKey: string;
}

const orders: Order[] = [
  {
    id: "1",
    meal: "Catfish Pepper Soup",
    items: 1,
    image:
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=80&h=80&fit=crop",
    orderId: "#GTM-1241",
    customerArea: "Ajah",
    payment: "₦4,200",
    paymentStatus: "Paid",
    cook: {
      initial: "P",
      name: "Pepper Soup Catering House",
      color: "#219e02",
      email: "pepper@getameal.com",
      phone: "+234 801 234 5678",
    },
    customer: {
      name: "Tunde Bakare",
      email: "tunde@example.com",
      phone: "+234 802 345 6789",
    },
    timeline: {
      orderPlaced: "Today, 09:30 AM",
      expectedDelivery: "Today, 11:00 AM",
    },
    status: "Cooking Tomorrow",
    statusColor: "bg-blue-50 text-blue-600",
    tabKey: "new",
  },
  {
    id: "2",
    meal: "Coconut Rice with Vegetables",
    items: 2,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=80&h=80&fit=crop",
    orderId: "#GTM-1240",
    customerArea: "Maitama",
    payment: "₦3,800",
    paymentStatus: "Paid",
    cook: {
      initial: "R",
      name: "Rice & Stew Hub by Amaka",
      color: "#219e02",
      email: "amaka@getameal.com",
      phone: "+234 803 456 7890",
    },
    customer: {
      name: "Ngozi Okafor",
      email: "ngozi@example.com",
      phone: "+234 804 567 8901",
    },
    timeline: {
      orderPlaced: "Today, 10:00 AM",
      expectedDelivery: "Today, 11:30 AM",
    },
    status: "Cooking",
    statusColor: "bg-green-100 text-green-600",
    tabKey: "active-cooks",
  },
  {
    id: "3",
    meal: "Jollof Rice with Chicken",
    items: 2,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=80&h=80&fit=crop",
    orderId: "#GTM-1234",
    customerArea: "Lekki Phase 1",
    payment: "₦4,500",
    paymentStatus: "Paid",
    cook: {
      initial: "M",
      name: "Mama Put Kitchen & Catering",
      color: "#219e02",
      email: "mamaput@getameal.com",
      phone: "+234 805 678 9012",
    },
    customer: {
      name: "Emeka Eze",
      email: "emeka@example.com",
      phone: "+234 806 789 0123",
    },
    timeline: {
      orderPlaced: "Today, 10:15 AM",
      expectedDelivery: "Today, 11:45 AM",
    },
    status: "Cooking",
    statusColor: "bg-green-100 text-green-600",
    tabKey: "active-cooks",
  },
  {
    id: "4",
    meal: "Amala with Ewedu & Gbegiri",
    items: 2,
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop",
    orderId: "#GTM-1237",
    customerArea: "GRA Phase 2",
    payment: "₦2,900",
    paymentStatus: "Paid",
    cook: {
      initial: "A",
      name: "Amala Spot by Iya Beji",
      color: "#219e02",
      email: "iyabeji@getameal.com",
      phone: "+234 807 890 1234",
    },
    customer: {
      name: "Biodun Adeyemi",
      email: "biodun@example.com",
      phone: "+234 808 901 2345",
    },
    timeline: {
      orderPlaced: "Today, 08:45 AM",
      expectedDelivery: "Today, 10:15 AM",
    },
    status: "30 mins late",
    statusColor: "bg-red-100 text-red-600",
    tabKey: "at-risk",
  },
  {
    id: "5",
    meal: "Plantain & Beans",
    items: 1,
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=80&h=80&fit=crop",
    orderId: "#GTM-1242",
    customerArea: "Surulere",
    payment: "₦2,200",
    paymentStatus: "Failed",
    cook: {
      initial: "M",
      name: "Mama Put Kitchen & Catering",
      color: "#219e02",
      email: "mamaput@getameal.com",
      phone: "+234 805 678 9012",
    },
    customer: {
      name: "Funke Adesanya",
      email: "funke@example.com",
      phone: "+234 809 012 3456",
    },
    timeline: {
      orderPlaced: "Today, 09:00 AM",
      expectedDelivery: "Today, 10:30 AM",
    },
    status: "Cancelled",
    statusColor: "bg-red-100 text-red-500",
    tabKey: "cancelled",
  },
  {
    id: "6",
    meal: "Egusi Soup with Pounded Yam",
    items: 1,
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=80&h=80&fit=crop",
    orderId: "#GTM-1235",
    customerArea: "Garki II",
    payment: "₦3,200",
    paymentStatus: "Paid",
    cook: {
      initial: "J",
      name: "Jollof Express & Soup Kitchen",
      color: "#219e02",
      email: "jollof@getameal.com",
      phone: "+234 810 123 4567",
    },
    customer: {
      name: "Chidi Nwosu",
      email: "chidi@example.com",
      phone: "+234 811 234 5678",
    },
    timeline: {
      orderPlaced: "Yesterday, 12:00 PM",
      expectedDelivery: "Yesterday, 1:30 PM",
    },
    status: "Completed",
    statusColor: "bg-gray-100 text-gray-500",
    tabKey: "completed",
  },
  {
    id: "7",
    meal: "Fried Rice & Turkey",
    items: 2,
    image:
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=80&h=80&fit=crop",
    orderId: "#GTM-1238",
    customerArea: "Victoria Island",
    payment: "₦5,500",
    paymentStatus: "Paid",
    cook: {
      initial: "T",
      name: "Temi's Rice Palace & Grill",
      color: "#219e02",
      email: "temi@getameal.com",
      phone: "+234 812 345 6789",
    },
    customer: {
      name: "Adaeze Obi",
      email: "adaeze@example.com",
      phone: "+234 813 456 7890",
    },
    timeline: {
      orderPlaced: "Yesterday, 2:00 PM",
      expectedDelivery: "Yesterday, 3:30 PM",
    },
    status: "Refunded",
    statusColor: "bg-purple-100 text-purple-500",
    tabKey: "completed",
  },
];

const filterTabs = [
  { label: "All Orders", count: orders.length, value: "all" },
  {
    label: "New",
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
    count: orders.filter((o) => o.tabKey === "at-risk").length,
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

export default function OrdersTable() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  // Filter state
  const [sortBy, setSortBy] = useState("Date");
  const [sortOrder, setSortOrder] = useState("Descending");
  const [paymentStatuses, setPaymentStatuses] = useState<string[]>([]);
  const [atRiskOnly, setAtRiskOnly] = useState(false);

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

  // Apply filters then sort
  let filteredOrders =
    activeTab === "all" ? orders : orders.filter((o) => o.tabKey === activeTab);

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
    } else {
      cmp = parseInt(a.id) - parseInt(b.id);
    }
    return sortOrder === "Descending" ? -cmp : cmp;
  });

  return (
    <div className="bg-white rounded-[20px] border border-[#F3F4F6] overflow-hidden">
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

        <SlidersHorizontal className="w-4 h-4 ml-auto" />
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
        {filteredOrders.length === 0 ? (
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
                  {/* Image — first cell: left border + rounded-l */}
                  <td className="pl-4 py-4 border-y border-l border-[#F3F4F6] rounded-l-xl bg-white">
                    <img
                      src={order.image}
                      alt={order.meal}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
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
                      {order.meal} + {order.items} Item
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
                            setSelectedOrder(order);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <X className="w-4 h-4" /> Cancel Order
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
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
          onCancelOrder={() => setSelectedOrder(null)}
          onIssueRefund={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
