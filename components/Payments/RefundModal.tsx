"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, RefreshCw } from "@/lib/icons";
import { toast } from "sonner";
import { useRefundPayment } from "@/lib/hooks/payments";

interface Props {
  paymentId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RefundModal({ paymentId, onClose, onSuccess }: Props) {
  const [reason, setReason] = useState("");
  const { mutate, isPending } = useRefundPayment(paymentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    mutate(
      { reason: reason.trim() },
      {
        onSuccess: (res: any) => {
          toast.success(res.data?.message ?? "Refund initiated successfully");
          onSuccess?.();
          onClose();
        },
        onError: (e: any) =>
          toast.error(e?.response?.data?.message ?? "Failed to initiate refund"),
      },
    );
  };

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/40 z-[110]" onClick={onClose} />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111827]">Initiate Refund</h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Provide a reason for this refund. This will be recorded for audit purposes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-2">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="e.g. Customer complaint, duplicate charge, order not delivered..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-[#f3f4f6] border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#111827] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason.trim() || isPending}
              className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Processing..." : "Initiate Refund"}
            </button>
          </div>
        </form>
      </div>
    </>,
    document.body,
  );
}
