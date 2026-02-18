"use client";

import { useState } from "react";
import { MoreVertical, Eye, Phone, User, X, DollarSign } from "@/lib/icons";

export interface Order {
  id: string;
  meal: string;
  items: number;
  image: string;
  orderId: string;
  customerArea: string;
  payment: string;
  cook: {
    name: string;
    color: string;
  };
  status: string;
  statusColor: string;
}

interface OrdersTableProps {
  orders: Order[];
  onViewDetails: (orderId: string) => void;
}

export default function OrdersTable({
  orders,
  onViewDetails,
}: OrdersTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleAction = (action: string, orderId: string) => {
    console.log(`${action} for order:`, orderId);
    setOpenMenuId(null);

    if (action === "view-details") {
      onViewDetails(orderId);
    }
  };

  return (
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
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
              {/* Meal */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 uppercase">MEAL</div>
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
                <div className="text-xs text-gray-500 uppercase mb-1">COOK</div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: order.cook.color }}
                  />
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

              {/* Actions */}
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
                    <button
                      onClick={() => handleAction("view-details", order.id)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleAction("contact-customer", order.id)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Contact Customer
                    </button>
                    <button
                      onClick={() => handleAction("contact-cook", order.id)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Contact Cook
                    </button>
                    <div className="border-t border-gray-200 my-1" />
                    <button
                      onClick={() => handleAction("cancel-order", order.id)}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel Order
                    </button>
                    <button
                      onClick={() => handleAction("issue-refund", order.id)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
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
  );
}
