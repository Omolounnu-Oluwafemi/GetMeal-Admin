import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface ApiPayment {
  _id: string;
  userId: {
    _id: string;
    email: string;
    fullName: string;
    phone?: string;
  } | null;
  cookId: { _id: string } | null;
  totalAmount: number;
  mealItems: { mealId: string; quantity: number; price: number; _id: string }[];
  deliveryType: string;
  note: string | null;
  status: string;
  paymentStatus: string;
  paymentReference: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentStats {
  totalRevenue: number;
  revenueChange: number;
  pendingPayments: number;
  pendingChange: string | number;
  failedPayments: number;
  failedChange: number;
  refundedPayments: number;
  refundedChange: number;
}

interface PaymentsFilters {
  status?: string | null;
  sortBy?: string;
}

const STATUS_MAP: Record<string, string> = {
  Paid: "paid",
  Pending: "pending",
  Failed: "failed",
  Refunded: "refunded",
};

const SORT_MAP: Record<string, string> = {
  "highest-amount": "highest",
  "lowest-amount": "lowest",
};

export function usePaymentStats(filters: PaymentsFilters) {
  return useQuery<PaymentStats>({
    queryKey: ["payment-stats", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters.status) {
        const apiStatus = STATUS_MAP[filters.status];
        if (apiStatus) params.status = apiStatus;
      }
      if (filters.sortBy && SORT_MAP[filters.sortBy]) {
        params.sortBy = SORT_MAP[filters.sortBy];
      }
      const res = await api.get("/api/admin/payments/stats", { params });
      return res.data;
    },
  });
}

export function usePayments(filters: PaymentsFilters) {
  return useQuery<ApiPayment[]>({
    queryKey: ["payments", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters.status) {
        const apiStatus = STATUS_MAP[filters.status];
        if (apiStatus) params.status = apiStatus;
      }
      if (filters.sortBy) {
        params.sortBy = SORT_MAP[filters.sortBy] ?? filters.sortBy;
      }
      const res = await api.get("/api/admin/payments", { params });
      return res.data.payments ?? [];
    },
  });
}

export function useRefundPayment(paymentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { reason: string }) =>
      api.post(`/api/admin/payments/${paymentId}/refund`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payment-stats"] });
    },
  });
}
