"use client";

import { createPortal } from "react-dom";
import { X, MessageSquare, FileText } from "@/lib/icons";
import { Ban, UserCheck } from "lucide-react";
import type { Customer } from "./Customerstable";

interface Props {
  customer: Customer;
  onClose: () => void;
  onMessage: () => void;
  onAddNote: () => void;
  onSuspend: () => void;
  onReactivate: () => void;
}

export default function CustomerProfileSidebar({
  customer,
  onClose,
  onMessage,
  onAddNote,
  onSuspend,
  onReactivate,
}: Props) {
  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div
        className="fixed top-0 right-0 h-full w-[41%] pb-6 bg-white z-50 shadow-2xl flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
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
              </div>
              <div className="flex items-center gap-2 text-sm text-[#111827]">
                <span className="text-[#9CA3AF]">Email:</span>
                <span className="truncate font-medium">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#111827]">
                <span className="text-[#9CA3AF]">City:</span>
                <span className="font-medium">{customer.city || "—"}</span>
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-[16px] font-semibold text-[#000] mb-3">
              Order Activity
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#f7f7f7] rounded-xl p-3">
                <p className="text-[11px] text-[#77797e] mt-0.5">Total Orders</p>
                <p className="text-lg font-bold text-[#111827]">{customer.orders}</p>
              </div>
              <div className="bg-[#f7f7f7] rounded-xl p-3">
                <p className="text-[11px] text-[#77797e] mt-0.5">Last Order</p>
                <p className="text-lg font-bold text-[#111827]">{customer.lastOrderDate}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>,
    document.body,
  );
}
