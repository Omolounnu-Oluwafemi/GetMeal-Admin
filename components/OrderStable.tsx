"use client";

import { useState } from "react";
import {
  MoreVertical,
  Phone,
  User,
  X,
  DollarSign,
  Download,
  Printer,
} from "@/lib/icons";

interface Order {
  id: string;
  meal: string;
  items: number;
  image: string;
  orderId: string;
  customerArea: string;
  payment: string;
  cook: {
    initial: string;
    name: string;
    color: string;
  };
  status: string;
  statusColor: string;
}

const orders: Order[] = [
  {
    id: "1",
    meal: "Catfish Pepper Soup",
    items: 1,
    image: "/orders/catfish.jpg",
    orderId: "#GTM-1241",
    customerArea: "Ajah",
    payment: "₦4,200",
    cook: { initial: "P", name: "Pepper Soup C...", color: "#219e02" },
    status: "Cooking Tomorrow",
    statusColor: "text-gray-600",
  },
  {
    id: "2",
    meal: "Coconut Rice with Vegetables",
    items: 2,
    image: "/orders/coconut-rice.jpg",
    orderId: "#GTM-1240",
    customerArea: "Maitama",
    payment: "₦3,800",
    cook: { initial: "R", name: "Rice & Stew Hub", color: "#219e02" },
    status: "Cooking",
    statusColor: "text-green-600",
  },
  {
    id: "3",
    meal: "Jollof Rice with Chicken",
    items: 2,
    image: "/orders/jollof.jpg",
    orderId: "#GTM-1234",
    customerArea: "Lekki Phase 1",
    payment: "₦4,500",
    cook: { initial: "M", name: "Mama Put Kitc...", color: "#F59E0B" },
    status: "Cooking",
    statusColor: "text-green-600",
  },
  {
    id: "4",
    meal: "Amala with Ewedu",
    items: 2,
    image: "/orders/amala.jpg",
    orderId: "#GTM-1237",
    customerArea: "GRA Phase 2",
    payment: "₦2,900",
    cook: { initial: "A", name: "Amala Spot", color: "#10B981" },
    status: "Ready",
    statusColor: "text-gray-800",
  },
  {
    id: "5",
    meal: "Plantain & Beans",
    items: 1,
    image: "/orders/plantain.jpg",
    orderId: "#GTM-1242",
    customerArea: "Surulere",
    payment: "₦2,200",
    cook: { initial: "M", name: "Mama Put Kitc...", color: "#F59E0B" },
    status: "Ready",
    statusColor: "text-gray-800",
  },
  {
    id: "6",
    meal: "Egusi Soup with Pounded Yam",
    items: 1,
    image: "/orders/egusi.jpg",
    orderId: "#GTM-1235",
    customerArea: "Garki II",
    payment: "₦3,200",
    cook: { initial: "J", name: "Jollof Express", color: "#219e02" },
    status: "Cooking",
    statusColor: "text-green-600",
  },
];

const filterTabs = [
  { label: "All Orders", count: 10, active: true },
  { label: "New", count: 2, active: false },
  { label: "Active Cooks", count: 5, active: false },
  { label: "At-Risk Orders", count: 2, active: false },
  { label: "Cancelled", count: 0, active: false },
  { label: "Completed", count: 0, active: false },
  { label: "Refunded", count: 0, active: false },
];

export default function OrdersTable() {
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("All Orders");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-[20px] border border-[#F3F4F6] overflow-hidden">
      {/* Filter Tabs */}
      <div className="flex items-center gap-3 p-6 border-b border-[#F3F4F6] overflow-x-auto">
        {filterTabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${
                tab.label === activeTab
                  ? "bg-[#219e02] text-white"
                  : "bg-white border border-[#E5E7EB] text-gray-700 hover:border-[#219e02]"
              }
            `}
          >
            {tab.label} ({tab.count})
          </button>
        ))}

        {/* Filter Icon */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="ml-auto p-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </button>
      </div>

      {/* Filters & Sorting Modal */}
      {showFilters && (
        <div className="border-b border-[#F3F4F6] bg-gray-50 p-6">
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Filters & Sorting
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-sm text-[#219e02] hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {/* Sort By */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">
                SORT BY
              </h4>
              <div className="space-y-2">
                {["Date", "Amount", "Status", "Area", "Cook"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="sortBy"
                      defaultChecked={option === "Date"}
                      className="w-4 h-4 text-[#219e02] focus:ring-[#219e02]"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {["Descending", "Ascending"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="sortOrder"
                      defaultChecked={option === "Descending"}
                      className="w-4 h-4 text-[#219e02] focus:ring-[#219e02]"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Status */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">
                PAYMENT STATUS
              </h4>
              <div className="space-y-2">
                {["Paid", "Pending", "Failed"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#219e02] focus:ring-[#219e02] rounded"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amount Range */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">
                AMOUNT RANGE
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">
                    Min Amount
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#219e02] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">
                    Max Amount
                  </label>
                  <input
                    type="number"
                    placeholder="999999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#219e02] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Additional Filters & Export */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">
                ADDITIONAL FILTERS
              </h4>
              <label className="flex items-center gap-2 cursor-pointer mb-6">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#219e02] focus:ring-[#219e02] rounded"
                />
                <span className="text-sm text-gray-700">At-Risk Only</span>
              </label>

              <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">
                EXPORT
              </h4>
              <div className="space-y-2">
                <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#219e02]">
                  <Download className="w-4 h-4" />
                  Export to CSV
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#219e02]">
                  <Printer className="w-4 h-4" />
                  Print View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Meal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Area
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cook
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                {/* Meal */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase">
                        MEAL
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.meal} + {order.items} Item
                      </div>
                    </div>
                  </div>
                </td>

                {/* Order ID */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-500 uppercase mb-1">
                    ORDER ID
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {order.orderId}
                  </div>
                </td>

                {/* Customer Area */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-500 uppercase mb-1">
                    CUSTOMER AREA
                  </div>
                  <div className="text-sm text-gray-900">
                    {order.customerArea}
                  </div>
                </td>

                {/* Payment */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-500 uppercase mb-1">
                    PAYMENT
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {order.payment}
                  </div>
                </td>

                {/* Cook */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-500 uppercase mb-1">
                    COOK
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: order.cook.color }}
                    >
                      {order.cook.initial}
                    </div>
                    <span className="text-sm text-gray-900">
                      {order.cook.name}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-500 uppercase mb-1">
                    STATUS
                  </div>
                  <div className={`text-sm font-medium ${order.statusColor}`}>
                    {order.status}
                  </div>
                </td>

                {/* Actions Menu */}
                <td className="px-6 py-4 whitespace-nowrap text-right relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === order.id ? null : order.id)
                    }
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === order.id && (
                    <div className="absolute right-6 top-12 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
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
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact Cook
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Contact Customer
                      </button>
                      <div className="border-t border-gray-200 my-1" />
                      <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <X className="w-4 h-4" />
                        Cancel Order
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Issue Refund
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
