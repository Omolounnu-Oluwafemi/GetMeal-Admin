"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, User, ChefHat, DollarSign, Phone } from "@/lib/icons";
import { CreditCard, Package, Receipt, RefreshCw } from "lucide-react";
import { usePaymentById } from "@/lib/hooks/payments";
import RefundModal from "@/components/Payments/RefundModal";

interface PaymentDetailsSidebarProps {
  paymentId: string;
  onClose: () => void;
}

const ORDER_STATUS_STYLES: Record<string, string> = {
  pending: "bg-[#FFF7ED] text-[#F59E0B]",
  confirmed: "bg-[#EFF6FF] text-[#3B82F6]",
  cooking: "bg-amber-50 text-amber-600",
  ready: "bg-[#F0FDF4] text-[#219e02]",
  delivered: "bg-[#F0FDF4] text-[#219e02]",
  picked_up: "bg-[#F0FDF4] text-[#219e02]",
  cancelled: "bg-[#FEF2F2] text-[#EF4444]",
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  paid: "bg-[#F0FDF4] text-[#219e02]",
  pending: "bg-[#FFF7ED] text-[#F59E0B]",
  failed: "bg-[#FEF2F2] text-[#EF4444]",
  refunded: "bg-blue-50 text-blue-600",
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ");
}

export default function PaymentDetailsSidebar({ paymentId, onClose }: PaymentDetailsSidebarProps) {
  const { data: payment, isLoading } = usePaymentById(paymentId);
  const [showRefundModal, setShowRefundModal] = useState(false);

  const createdAt = payment
    ? new Date(payment.createdAt).toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "—";

  const updatedAt = payment
    ? new Date(payment.updatedAt).toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "—";

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Sidebar */}
      <div
        className="fixed top-0 right-0 h-full w-[41%] pb-6 bg-white z-50 shadow-2xl flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Close */}
        <div className="flex justify-end px-4 pt-4">
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        {/* Header */}
        <div className="px-8 pb-5 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6 text-[#219e02]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-[#111827] truncate">
                {isLoading ? "Loading..." : (payment?.paymentReference ?? "—")}
              </h3>
              <p className="text-sm text-[#6B7280] mt-0.5">Payment Reference</p>
              {!isLoading && payment && (
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${ORDER_STATUS_STYLES[payment.status] ?? "bg-gray-100 text-gray-600"}`}>
                    Order: {capitalize(payment.status)}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${PAYMENT_STATUS_STYLES[payment.paymentStatus] ?? "bg-gray-100 text-gray-600"}`}>
                    Payment: {capitalize(payment.paymentStatus)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 px-8 py-6 space-y-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-10 bg-gray-100 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : payment ? (
          <div className="flex-1 px-8 py-5 space-y-6">

            {/* Amount */}
            <div className="bg-[#dcf0d8] rounded-xl p-4 border border-[#9cc494]">
              <p className="text-[13px] font-semibold text-[#219e02] mb-1">Total Amount</p>
              <p className="text-4xl font-bold text-black">
                ₦{payment.totalAmount.toLocaleString()}
              </p>
              <p className="text-xs text-black/50 mt-1">
                {payment.mealItems.length} item{payment.mealItems.length !== 1 ? "s" : ""} · {capitalize(payment.deliveryType)}
              </p>
            </div>

            {/* Customer */}
            <section>
              <h4 className="text-[15px] font-semibold text-[#000] mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-[#219e02]" />
                Customer
              </h4>
              <div className="bg-[#f7f7f7] rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Name</span>
                  <span className="font-medium text-[#111827]">{payment.userId?.fullName ?? "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Email</span>
                  <span className="font-medium text-[#111827] truncate max-w-[60%] text-right">{payment.userId?.email ?? "—"}</span>
                </div>
                {payment.userId?.phone && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9CA3AF] flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Phone
                    </span>
                    <span className="font-medium text-[#111827]">{payment.userId.phone}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Cook */}
            {payment.cookId && (
              <section>
                <h4 className="text-[15px] font-semibold text-[#000] mb-3 flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-[#219e02]" />
                  Cook
                </h4>
                <div className="bg-[#f7f7f7] rounded-xl p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9CA3AF]">Cook ID</span>
                    <span className="font-medium text-[#111827] font-mono text-xs">{payment.cookId._id}</span>
                  </div>
                </div>
              </section>
            )}

            {/* Meal Items */}
            <section>
              <h4 className="text-[15px] font-semibold text-[#000] mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#219e02]" />
                Meal Items
              </h4>
              <div className="space-y-2">
                {payment.mealItems.map((item, i) => (
                  <div key={item._id ?? i} className="bg-[#f7f7f7] rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#9CA3AF] font-mono">{item.mealId}</p>
                      <p className="text-sm text-[#6B7280] mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#111827]">₦{item.price.toLocaleString()}</p>
                      <p className="text-xs text-[#9CA3AF]">× {item.quantity} = ₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Payment Details */}
            <section>
              <h4 className="text-[15px] font-semibold text-[#000] mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#219e02]" />
                Payment Details
              </h4>
              <div className="bg-[#f7f7f7] rounded-xl p-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Delivery Type</span>
                  <span className="font-medium text-[#111827]">{capitalize(payment.deliveryType)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Reference</span>
                  <span className="font-medium text-[#111827] font-mono text-xs">{payment.paymentReference}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Created</span>
                  <span className="font-medium text-[#111827]">{createdAt}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Last Updated</span>
                  <span className="font-medium text-[#111827]">{updatedAt}</span>
                </div>
              </div>
            </section>

            {/* Note */}
            {payment.note && (
              <section>
                <h4 className="text-[15px] font-semibold text-[#000] mb-3 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#219e02]" />
                  Customer Note
                </h4>
                <div className="bg-[#fff8ed] border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-[#92400e] italic">&ldquo;{payment.note}&rdquo;</p>
                </div>
              </section>
            )}

            {/* Refund Action */}
            {payment.paymentStatus === "paid" && (
              <button
                onClick={() => setShowRefundModal(true)}
                className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Initiate Refund
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Payment not found
          </div>
        )}
      </div>
      {showRefundModal && (
        <RefundModal paymentId={paymentId} onClose={() => setShowRefundModal(false)} />
      )}
    </>,
    document.body
  );
}
