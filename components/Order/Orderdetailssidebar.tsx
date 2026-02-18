"use client";

import {
  X,
  Clock,
  User,
  ChefHat,
  DollarSign,
  Phone,
  MessageSquare,
} from "@/lib/icons";

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
  order: OrderDetailsData;
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
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Order Details
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Order #{order.orderId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <span
            className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${order.statusColor}`}
          >
            {order.status}
          </span>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Meal Details */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Clock className="w-4 h-4" />
              Meal Details
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {order.meal.name}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Quantity: {order.meal.quantity}
                </div>
                <div className="text-lg font-bold text-gray-900 mt-2">
                  {order.meal.price}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Clock className="w-4 h-4" />
              Timeline
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#219e02] mt-2" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Order Placed</div>
                  <div className="text-sm text-gray-500">
                    {order.timeline.orderPlaced}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-gray-300 mt-2" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    Expected Delivery
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.timeline.expectedDelivery}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="w-4 h-4" />
                Customer
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-4 h-4 text-[#219e02]" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MessageSquare className="w-4 h-4 text-[#219e02]" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Name</span>
                <span className="text-sm font-medium text-gray-900">
                  {order.customer.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm font-medium text-gray-900">
                  {order.customer.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Phone</span>
                <span className="text-sm font-medium text-gray-900">
                  {order.customer.phone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Area</span>
                <span className="text-sm font-medium text-gray-900">
                  {order.customer.area}
                </span>
              </div>
            </div>
          </div>

          {/* Cook */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ChefHat className="w-4 h-4" />
                Cook
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-4 h-4 text-[#219e02]" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MessageSquare className="w-4 h-4 text-[#219e02]" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: order.cook.color }}
              >
                {order.cook.initials}
              </div>
              <span className="font-medium text-gray-900">
                {order.cook.name}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm font-medium text-gray-900">
                  {order.cook.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Phone</span>
                <span className="text-sm font-medium text-gray-900">
                  {order.cook.phone}
                </span>
              </div>
            </div>
            <button className="w-full mt-3 text-sm text-[#219e02] hover:underline font-medium">
              View All Orders by {order.cook.name.split(" ")[0]}
            </button>
          </div>

          {/* Payment */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <DollarSign className="w-4 h-4" />
              Payment
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Amount</span>
                <span className="text-lg font-bold text-gray-900">
                  {order.payment.amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span
                  className={`text-sm font-medium ${
                    order.payment.status === "Paid"
                      ? "text-[#219e02]"
                      : order.payment.status === "Pending"
                        ? "text-[#F59E0B]"
                        : "text-[#EF4444]"
                  }`}
                >
                  {order.payment.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          <button
            onClick={onCancelOrder}
            className="w-full px-6 py-3 border-2 border-[#EF4444] text-[#EF4444] rounded-lg font-medium hover:bg-[#FEF2F2] transition-colors"
          >
            Cancel Order
          </button>
          <button
            onClick={onIssueRefund}
            className="w-full px-6 py-3 bg-[#219e02] text-white rounded-lg font-medium hover:bg-[#1a7d01] transition-colors"
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
  );
}
