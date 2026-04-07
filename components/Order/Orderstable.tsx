"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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

interface MenuState {
  orderId: string;
  top: number;
  right: number;
}

export default function OrdersTable({ orders, onViewDetails }: OrdersTableProps) {
  const [openMenu, setOpenMenu] = useState<MenuState | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Close on outside click
  useEffect(() => {
    if (!openMenu) return;
    const handler = (e: MouseEvent) => {
      const btn = buttonRefs.current[openMenu.orderId];
      if (btn && btn.contains(e.target as Node)) return;
      setOpenMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openMenu]);

  const openMenuFor = (orderId: string) => {
    const btn = buttonRefs.current[orderId];
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setOpenMenu({
      orderId,
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
    });
  };

  const handleAction = (action: string, orderId: string) => {
    setOpenMenu(null);
    if (action === "view-details") onViewDetails(orderId);
  };

  return (
    <>
      <div className="overflow-visible">
        <table className="w-full border-separate border-spacing-y-2">
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="bg-white hover:bg-gray-50 transition-colors">
                <td colSpan={7} className="px-0">
                  <div className="mx-8 border rounded-2xl">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          {/* Meal */}
                          <td className="px-6 py-4 whitespace-nowrap w-[18%]">
                            <div className="text-xs text-gray-500 uppercase mb-1">MEAL</div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.meal} + {order.items} Item
                            </div>
                          </td>

                          {/* Order ID */}
                          <td className="px-6 py-4 whitespace-nowrap w-[14%]">
                            <div className="text-xs text-gray-500 uppercase mb-1">ORDER ID</div>
                            <div className="text-sm font-medium text-gray-900">{order.orderId}</div>
                          </td>

                          {/* Customer Area */}
                          <td className="px-6 py-4 whitespace-nowrap w-[16%]">
                            <div className="text-xs text-gray-500 uppercase mb-1">CUSTOMER AREA</div>
                            <div className="text-sm text-gray-900">{order.customerArea}</div>
                          </td>

                          {/* Payment */}
                          <td className="px-6 py-4 whitespace-nowrap w-[12%]">
                            <div className="text-xs text-gray-500 uppercase mb-1">PAYMENT</div>
                            <div className="text-sm font-semibold text-gray-900">{order.payment}</div>
                          </td>

                          {/* Cook */}
                          <td className="px-6 py-4 whitespace-nowrap w-[16%]">
                            <div className="text-xs text-gray-500 uppercase mb-1">COOK</div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: order.cook.color }} />
                              <span className="text-sm text-gray-900">{order.cook.name}</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap w-[14%]">
                            <div className="text-xs text-gray-500 uppercase mb-1">STATUS</div>
                            <div className={`text-sm font-medium ${order.statusColor}`}>{order.status}</div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-right w-[10%]">
                            <button
                              ref={(el) => { buttonRefs.current[order.id] = el; }}
                              onClick={() =>
                                openMenu?.orderId === order.id
                                  ? setOpenMenu(null)
                                  : openMenuFor(order.id)
                              }
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <MoreVertical className="w-5 h-5 text-gray-400" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openMenu && createPortal(
        <div
          className="fixed w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[200]"
          style={{ top: openMenu.top, right: openMenu.right }}
        >
          <button
            onClick={() => handleAction("view-details", openMenu.orderId)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Order Details
          </button>
          <button
            onClick={() => handleAction("contact-customer", openMenu.orderId)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Contact Customer
          </button>
          <button
            onClick={() => handleAction("contact-cook", openMenu.orderId)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Contact Cook
          </button>
          <div className="border-t border-gray-200 my-1" />
          <button
            onClick={() => handleAction("cancel-order", openMenu.orderId)}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel Order
          </button>
          <button
            onClick={() => handleAction("issue-refund", openMenu.orderId)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            Issue Refund
          </button>
        </div>,
        document.body
      )}
    </>
  );
}
