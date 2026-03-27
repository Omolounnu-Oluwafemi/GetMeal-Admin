import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface ApiCook {
  cookId: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  isAvailable: boolean;
  isApproved: boolean;
  status?: string;
  rating: number;
  ordersCount: number;
  walletBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface CookStats {
  activeCooks: number;
  totalOrders: number;
  amountToday: number;
  cancellations: number;
  refunds: number;
  GMV: number;
}

interface CooksFilters {
  status?: string;
  city?: string;
  sortBy?: string;
}

const STATUS_MAP: Record<string, string> = {
  Active: "active",
  "Not Active": "inactive",
  Suspended: "suspended",
};

const SORT_MAP: Record<string, string> = {
  "highest-rating": "highestRating",
  "most-orders": "mostOrders",
  newest: "newest",
  oldest: "oldest",
  "last-active": "lastActive",
};

export function useCookStats(filters?: { dateFrom?: string; dateTo?: string; city?: string }) {
  return useQuery<CookStats>({
    queryKey: ["cook-stats", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters?.dateTo) params.dateTo = filters.dateTo;
      if (filters?.city) params.city = filters.city;
      const res = await api.get("/api/admin/cooks/stats", { params });
      return res.data.stats;
    },
  });
}

export function useCooks(filters: CooksFilters) {
  return useQuery<ApiCook[]>({
    queryKey: ["cooks", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};

      if (filters.status) {
        const apiStatus = STATUS_MAP[filters.status];
        if (apiStatus) params.status = apiStatus;
      }

      if (filters.city) params.city = filters.city;

      const sortBy = filters.sortBy ?? "newest";
      if (sortBy === "pending-verification") {
        params.verification = "false";
      } else if (sortBy === "verified") {
        params.verification = "true";
      } else {
        params.sortBy = SORT_MAP[sortBy] ?? sortBy;
      }

      const res = await api.get("/api/admin/cooks", { params });
      console.log("[useCooks] response:", res.data);
      return res.data.cooks ?? [];
    },
  });
}

export function useCookById(cookId: string | null) {
  return useQuery<ApiCook>({
    queryKey: ["cook", cookId],
    queryFn: async () => {
      const res = await api.get(`/api/admin/cooks/${cookId}`);
      return res.data.cook ?? res.data;
    },
    enabled: !!cookId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMessageCook(cookId: string) {
  return useMutation({
    mutationFn: (data: { subject: string; message: string }) =>
      api.post(`/api/admin/cooks/${cookId}/message`, data),
  });
}

export function useAddCookNote(cookId: string) {
  return useMutation({
    mutationFn: (data: { note: string }) =>
      api.post(`/api/admin/cooks/${cookId}/note`, data),
  });
}

export function useUpdateCookStatus(cookId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { action: string; reason?: string; note?: string; notify?: boolean }) =>
      api.post(`/api/admin/cooks/${cookId}/status`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cooks"] });
    },
  });
}

export function useCreditCookWallet(cookId: string) {
  return useMutation({
    mutationFn: (data: { amount: number; reason?: string }) =>
      api.post(`/api/admin/cooks/${cookId}/credit`, data),
  });
}
