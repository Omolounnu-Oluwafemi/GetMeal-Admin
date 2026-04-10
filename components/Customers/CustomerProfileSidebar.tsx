"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { X, MessageSquare, FileText, Phone } from "@/lib/icons";
import { Ban, UserCheck } from "lucide-react";
import type { Customer } from "./Customerstable";
import CallModal from "@/components/CallModal";

interface Props {
  customer: Customer;
  loading?: boolean;
  onClose: () => void;
  onMessage: () => void;
  onAddNote: () => void;
  onSuspend: () => void;
  onReactivate: () => void;
}

export default function CustomerProfileSidebar({
  customer,
  loading,
  onClose,
  onMessage,
  onAddNote,
  onSuspend,
  onReactivate,
}: Props) {
  const [callTarget, setCallTarget] = useState<{ name: string; phone: string } | null>(null);

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <motion.div
        className="fixed top-0 right-0 h-full w-[41%] pb-6 bg-white z-50 shadow-2xl flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
      >
        <div className="flex justify-end px-4 pt-4">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        {/* Header */}
        {loading && (
          <div className="mx-5 mb-2 h-1 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full w-1/2 bg-[#219e02] animate-pulse rounded-full" />
          </div>
        )}
        <div className="flex items-start gap-3 px-10 pb-4 border-gray-100">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ backgroundColor: customer.avatarColor }}
          >
            {customer.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-[#111827] truncate">
                {customer.name}
              </h3>
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full flex-shrink-0">
                Customer
              </span>
            </div>
            <p className="text-sm text-[#6B7280] mt-1">{customer.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  customer.status === "Active"
                    ? "bg-[#F0FDF4] text-[#219e02]"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {customer.status}
              </span>
              {customer.city && customer.city !== "—" && (
                <span className="text-xs text-[#9CA3AF]">{customer.city}</span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 px-5 py-6 border-b border-gray-200">
          <button
            onClick={onMessage}
            className="flex-1 flex items-center border border-gray-200 justify-center gap-1.5 py-2 text-xs font-medium text-[#111827] hover:bg-[#e9eaec] rounded-lg transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Message
          </button>
          {customer.status === "Suspended" ? (
            <button
              onClick={onReactivate}
              className="flex-1 flex items-center border border-gray-200 justify-center gap-1.5 py-2 text-xs font-medium text-[#219e02] hover:bg-[#e9eaec] rounded-lg transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Reactivate
            </button>
          ) : (
            <button
              onClick={onSuspend}
              className="flex-1 flex items-center border border-gray-200 justify-center gap-1.5 py-2 text-xs font-medium text-red-500 hover:bg-[#e9eaec] rounded-lg transition-colors"
            >
              <Ban className="w-3.5 h-3.5" />
              Suspend
            </button>
          )}
          <button
            onClick={onAddNote}
            className="flex-[0.6] flex items-center justify-center border border-gray-200 gap-1.5 py-2 text-xs font-medium text-[#111827] hover:bg-[#e9eaec] rounded-lg transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Add Note
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 px-5 py-4 space-y-6">
          <section>
            <h4 className="text-[16px] font-semibold text-[#000] mb-3 mt-2">
              Contact Information
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#111827]">
                <span className="text-[#9CA3AF]">Phone:</span>
                <span className="font-medium">{customer.phone || "—"}</span>
                {customer.phone && (
                  <button onClick={() => setCallTarget({ name: customer.name, phone: customer.phone })} className="ml-1 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone className="w-3.5 h-3.5 text-[#219e02]" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#111827]">
                <span className="text-[#9CA3AF]">Email:</span>
                <span className="truncate font-medium">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#111827]">
                <span className="text-[#9CA3AF]">City:</span>
                <span className="font-medium">{customer.city || "—"}</span>
              </div>
              {customer.joinedAt && (
                <div className="flex items-center gap-2 text-sm text-[#111827]">
                  <span className="text-[#9CA3AF]">Joined:</span>
                  <span className="font-medium">{customer.joinedAt}</span>
                </div>
              )}
              {customer.lastActive && (
                <div className="flex items-center gap-2 text-sm text-[#111827]">
                  <span className="text-[#9CA3AF]">Last Active:</span>
                  <span className="font-medium">{customer.lastActive}</span>
                </div>
              )}
            </div>
          </section>

          <section>
            <h4 className="text-[16px] font-semibold text-[#000] mb-3">
              Order Activity
            </h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-[#f7f7f7] rounded-xl p-3">
                <p className="text-[11px] text-[#77797e] mt-0.5">Total Orders</p>
                <p className="text-lg font-bold text-[#111827]">{customer.orders}</p>
              </div>
              <div className="bg-[#f7f7f7] rounded-xl p-3">
                <p className="text-[11px] text-[#77797e] mt-0.5">Last Order</p>
                <p className="text-lg font-bold text-[#111827]">{customer.lastOrderDate}</p>
              </div>
            </div>
            {customer.recentOrders && customer.recentOrders.length > 0 && (
              <div className="space-y-2">
                {customer.recentOrders.slice(0, 3).map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 bg-[#f7f7f7] rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-[#111827]">
                        ₦{order.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        {" · "}{order.deliveryType}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        order.status === "completed" ? "bg-[#dcfce6] text-[#219e02]"
                        : order.status === "cancelled" ? "bg-red-100 text-red-600"
                        : "bg-yellow-50 text-yellow-700"
                      }`}>
                        {order.status}
                      </span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                        order.paymentStatus === "paid" ? "bg-[#dcfce6] text-[#219e02]"
                        : "bg-gray-100 text-gray-500"
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {customer.walletBalance !== undefined && (
            <section>
              <h4 className="text-[16px] font-semibold text-[#000] mb-2">
                Wallet
              </h4>
              <div className="bg-[#dcf0d8] rounded-xl p-4 border border-[#9cc494]">
                <p className="text-[14px] font-semibold text-[#219e02] mb-1">Balance</p>
                <p className="text-4xl font-bold text-black">
                  ₦{customer.walletBalance.toLocaleString()}
                </p>
              </div>
            </section>
          )}

          {customer.customerNotes && customer.customerNotes.length > 0 && (
            <section>
              <h4 className="text-[16px] font-semibold text-[#000] mb-3">
                Notes
              </h4>
              <div className="space-y-2">
                {customer.customerNotes.map((n, i) => (
                  <div key={i} className="p-3 bg-[#f7f7f7] rounded-xl">
                    <p className="text-sm text-[#111827]">{n.note}</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-1">
                      {new Date(n.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </motion.div>
      {callTarget && <CallModal name={callTarget.name} phone={callTarget.phone} onClose={() => setCallTarget(null)} />}
    </>,
    document.body,
  );
}
