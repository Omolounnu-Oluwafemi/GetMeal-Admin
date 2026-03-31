"use client";

import { useState } from "react";
import { Check, MoreVertical } from "@/lib/icons";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 10;
import { toast } from "sonner";
import { useRefundPayment } from "@/lib/hooks/payments";

export interface Payment {
  id: string;
  orderId: string;
  customer: {
    name: string;
    initials: string;
    avatarColor: string;
  };
  cook: {
    name: string;
  };
  amount: string;
  amountValue: number;
  method: string;
  status: "Paid" | "Pending" | "Failed" | "Refunded";
  date: string;
  time: string;
  timestamp: number;
}

interface PaymentsTableProps {
  payments: Payment[];
  loading?: boolean;
}

const statusStyles: Record<string, string> = {
  Paid: "bg-[#F0FDF4] text-[#219e02]",
  Pending: "bg-[#FFF7ED] text-[#F59E0B]",
  Failed: "bg-[#FEF2F2] text-[#EF4444]",
  Refunded: "bg-blue-50 text-blue-600",
};

function StatusIcon({ status }: { status: string }) {
  if (status === "Paid")
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  if (status === "Pending")
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  if (status === "Failed")
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  if (status === "Refunded")
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    );
  return null;
}

function RefundButton({ paymentId, onClose }: { paymentId: string; onClose: () => void }) {
  const { mutate, isPending } = useRefundPayment(paymentId);

  const handleRefund = () => {
    mutate(
      { reason: "Admin initiated refund" },
      {
        onSuccess: (res: any) => {
          toast.success(res.data.message);
          onClose();
        },
        onError: (e: any) =>
          toast.error(e?.response?.data?.message ?? "Failed to initiate refund."),
      },
    );
  };

  return (
    <button
      onClick={handleRefund}
      disabled={isPending}
      className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      {isPending ? "Processing..." : "Initiate Refund"}
    </button>
  );
}

export default function PaymentsTable({ payments, loading = false }: PaymentsTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(payments.length / PAGE_SIZE);
  const pagedPayments = payments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSelectAll = (checked: boolean) => {
    setSelectedPayments(checked ? pagedPayments.map((p) => p.id) : []);
  };

  const handleSelectPayment = (paymentId: string, checked: boolean) => {
    if (checked) {
      setSelectedPayments([...selectedPayments, paymentId]);
    } else {
      setSelectedPayments(selectedPayments.filter((id) => id !== paymentId));
    }
  };

  return (
    <div className="overflow-x-auto mt-6 border rounded-2xl">
      <Pagination
        page={page}
        totalPages={totalPages}
        total={payments.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        label="payments"
      />
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-5 text-left">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPayments.length === payments.length && payments.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded-[4px] border-2 border-gray-300 bg-[#f7f7f7] flex items-center justify-center transition-all duration-200 peer-checked:bg-[#219e02] peer-checked:border-[#219e02]">
                  <Check strokeWidth={4} width={10} color="#fff" />
                </div>
              </label>
            </th>
            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cook</th>
            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-5"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-8"><div className="w-4 h-4 bg-gray-200 rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 rounded" /></td>
                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-200 rounded-full" /><div className="h-4 w-24 bg-gray-200 rounded" /></div></td>
                <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded" /></td>
                <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-200 rounded-full" /></td>
                <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 w-4 bg-gray-200 rounded" /></td>
              </tr>
            ))
          ) : (
            pagedPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-[#f9fafb] transition-colors">
                <td className="px-6 py-8">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPayments.includes(payment.id)}
                      onChange={(e) => handleSelectPayment(payment.id, e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 rounded-[4px] border-2 border-gray-300 bg-[#f7f7f7] flex items-center justify-center transition-all duration-200 peer-checked:bg-[#219e02] peer-checked:border-[#219e02]">
                      <Check strokeWidth={4} width={10} color="#fff" />
                    </div>
                  </label>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{payment.orderId}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: payment.customer.avatarColor }}
                    >
                      {payment.customer.initials}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{payment.customer.name}</span>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{payment.cook.name}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{payment.amount}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{payment.method || "—"}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${statusStyles[payment.status] ?? "bg-gray-100 text-gray-600"}`}>
                    <StatusIcon status={payment.status} />
                    {payment.status}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{payment.date}</div>
                  <div className="text-sm text-gray-500">{payment.time}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === payment.id ? null : payment.id)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>

                  {openMenuId === payment.id && (
                    <div className="absolute right-6 top-12 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Receipt
                      </button>
                      {payment.status === "Paid" && (
                        <>
                          <div className="border-t border-gray-200 my-1" />
                          <RefundButton
                            paymentId={payment.id}
                            onClose={() => setOpenMenuId(null)}
                          />
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
