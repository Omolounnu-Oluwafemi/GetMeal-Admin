"use client";

import { useState } from "react";
import {
  X,
  Clock,
  User,
  ChefHat,
  DollarSign,
  Phone,
  MessageSquare,
} from "@/lib/icons";
import { Order } from "@/components/OrderStable";
import { CircleDot, Disc2 } from "lucide-react";
import CookOrdersView from "./CookOrdersView";
import CallModal from "@/components/CallModal";

interface OrderDetailsSidebarProps {
  order: Order;
  onClose: () => void;
  onCancelOrder: () => void;
  onIssueRefund: () => void;
}

interface OrderDetailsData {
  orderId: string;
  status: string;
  statusColor: string;
  meal: {
    name: string;
    quantity: number;
    price: string;
    image: string;
  };
  timeline: {
    orderPlaced: string;
    expectedDelivery: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    area: string;
  };
  cook: {
    name: string;
    initials: string;
    color: string;
    email: string;
    phone: string;
  };
  payment: {
    amount: string;
    status: "Paid" | "Pending" | "Failed";
  };
}

interface OrderDetailsSidebarProps {
  order: Order;
  onClose: () => void;
  onCancelOrder: () => void;
  onIssueRefund: () => void;
}

export default function OrderDetailsSidebar({
  order,
  onClose,
  onCancelOrder,
  onIssueRefund,
}: OrderDetailsSidebarProps) {
  const [showCookOrders, setShowCookOrders] = useState(false);
  const [callTarget, setCallTarget] = useState<{ name: string; phone: string } | null>(null);

  return (
    <>
      {!showCookOrders && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order Details
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Order {order.orderId}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-hide">
              {/* Meal Details */}

              <span
                className={`inline-flex px-4 py-2 text-xs font-medium rounded-full ${order.statusColor}`}
              >
                {order.status}
              </span>
              <div>
                <div className="items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Disc2 className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold">Meal Details</span>
                  </div>
                  {order.mealItems && order.mealItems.length > 0 ? (
                    <div className="space-y-3">
                      {order.mealItems.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-500"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-[60px] h-[60px] rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-[60px] h-[60px] rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <span className="text-gray-400 text-[10px]">
                                No img
                              </span>
                            </div>
                          )}
                          <div className="flex-1 px-2">
                            <div className="font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-400 mt-0.5">
                              Qty: {item.quantity}
                            </div>
                            <div className="text-sm font-bold text-gray-900 mt-0.5">
                              ₦{(item.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                      {order.image ? (
                        <img
                          src={order.image}
                          alt={order.meal}
                          className="w-[70px] h-[70px] rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-[70px] h-[70px] rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-400 text-xs">No img</span>
                        </div>
                      )}
                      <div className="flex-1 mt-1 px-2">
                        <div className="font-medium text-gray-900">
                          {order.meal}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          Quantity: {order.items}
                        </div>
                        <div className="text-sm font-bold text-gray-900 mt-2">
                          {order.payment}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <div className=" items-center gap-4 p-4 bg-gray-50 rounded-lg ">
                  <div className="flex items-center gap-2  mb-3 ">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold text-black text-xs">
                      Timeline
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#219e02] mt-2" />
                      <div className="flex-1 mt-2">
                        <div className="font-medium text-gray-900 text-sm">
                          Order Placed
                        </div>
                        <div className="text-xs text-gray-400">
                          {order.timeline.orderPlaced}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-300 mt-2" />
                      <div className="flex-1 mt-2">
                        <div className="font-medium text-gray-900 text-sm">
                          Expected Delivery
                        </div>
                        <div className="text-xs text-gray-400">
                          {order.timeline.expectedDelivery}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer */}
              <div>
                <div className=" items-center gap-4 p-4 bg-gray-50 rounded-lg ">
                  <div className="flex items-center justify-between mb-3 bg-gray-50">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <User className="w-4 h-4" />
                      <span className="font-semibold text-black text-xs">
                        Customer
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCallTarget({ name: order.customer.name, phone: order.customer.phone })}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Phone className="w-4 h-4 text-[#219e02]" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MessageSquare className="w-4 h-4 text-[#219e02]" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Name</span>
                      <span className="text-sm font-medium text-gray-900">
                        {order.customer.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Email</span>
                      <span className="text-sm font-medium text-gray-900">
                        {order.customer.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Phone</span>
                      <span className="text-sm font-medium text-gray-900">
                        {order.customer.phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Area</span>
                      <span className="text-sm font-medium text-gray-900">
                        {order.customerArea}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cook */}
              <div>
                <div className=" items-center gap-4 p-4 bg-gray-50 rounded-lg ">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <ChefHat className="w-4 h-4" />
                      <span className="font-semibold text-black text-xs">
                        Cook
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCallTarget({ name: order.cook.name, phone: order.cook.phone })}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Phone className="w-4 h-4 text-[#219e02]" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MessageSquare className="w-4 h-4 text-[#219e02]" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Name</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={{ backgroundColor: order.cook.color }}
                        >
                          {order.cook.initial}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {order.cook.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Email</span>
                      <span className="text-sm font-medium text-gray-900">
                        {order.cook.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Phone</span>
                      <span className="text-sm font-medium text-gray-900">
                        {order.cook.phone}
                      </span>
                    </div>
                  </div>
                  {order.cook.name !== "—" && (
                    <button
                      onClick={() => setShowCookOrders(true)}
                      className="w-full mt-3 py-2 rounded-lg border border-[#cfe6ca] text-xs text-[#219e02] hover:bg-[#f3f9f2] font-medium transition-colors"
                    >
                      View All Orders by {order.cook.name.split(" ")[0]}
                    </button>
                  )}
                </div>
              </div>

              {/* Payment */}
              <div>
                <div className=" items-center gap-4 p-4 bg-gray-50 rounded-lg ">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold text-black text-xs">
                      Payment
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Amount</span>
                      <span className="text-lg font-bold text-gray-900">
                        {order.payment}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Status</span>
                      <span
                        className={`text-sm font-medium ${
                          order.paymentStatus === "Paid"
                            ? "text-[#219e02]"
                            : order.paymentStatus === "Pending"
                              ? "text-[#F59E0B]"
                              : "text-[#EF4444]"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 flex border-t border-gray-200 gap-3">
              <button
                onClick={onCancelOrder}
                className="w-full px-6 py-2.5 border-2 border-[#f1baba] text-[#EF4444] rounded-full font-medium hover:bg-[#FEF2F2] transition-colors"
              >
                Cancel Order
              </button>
              <button
                onClick={onIssueRefund}
                className="w-full px-6 py-2.5 bg-[#219e02] text-white rounded-full font-medium hover:bg-[#1a7d01] transition-colors"
              >
                Issue Refund
              </button>
            </div>
          </div>

          <style jsx>{`
            @keyframes slide-in {
              from {
                transform: translateX(100%);
              }
              to {
                transform: translateX(0);
              }
            }
            .animate-slide-in {
              animation: slide-in 0.3s ease-out;
            }
          `}</style>
        </>
      )}

      {callTarget && (
        <CallModal
          name={callTarget.name}
          phone={callTarget.phone}
          onClose={() => setCallTarget(null)}
        />
      )}

      {showCookOrders && order.cook.name !== "—" && (
        <CookOrdersView
          cookId={order.cookId ?? order.id}
          cookName={order.cook.name}
          onClose={() => setShowCookOrders(false)}
        />
      )}
    </>
  );
}
