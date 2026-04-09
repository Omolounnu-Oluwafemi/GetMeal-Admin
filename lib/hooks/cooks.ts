import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface ApiMeal {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  images: { url: string; publicId: string }[];
  status: "open" | "cooking" | "closed" | string;
  portionsRemaining?: number;
  createdAt: string;
}

export interface ApiCook {
  cookId?: string;    // from list endpoint
  _id?: string;       // from single endpoint
  name?: string;      // from list endpoint
  cookName?: string;  // from single endpoint
  phone?: string;
  email?: string;
  location?: { type?: string; coordinates?: number[]; address?: string } | null;
  cookAddress?: string;
  cookingExperience?: string;
  availableForCooking?: string;
  isAvailable: boolean;
  isApproved: boolean;
  status?: string;
  rating: number;
  reviewsCount?: number;
  ordersCount: number;
  walletBalance: number;
  availablePickup?: boolean;
  schedule?: string[];
  bankDetails?: {
    bankName?: string;
    bankCode?: string;
    accountNumber?: string;
    accountName?: string;
  } | null;
  userId?: {
    _id?: string;
    email?: string;
    fullName?: string;
    phone?: string;
    profileImage?: { url?: string; publicId?: string };
  } | null;
  createdAt: string;
  updatedAt: string;
  meals?: ApiMeal[];
  totalMeals?: number;
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
  dateFrom?: string;
  dateTo?: string;
}

const STATUS_MAP: Record<string, string> = {
  Active: "active",
  Inactive: "inactive",
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
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;

      const sortBy = filters.sortBy ?? "newest";
      if (sortBy === "pending-verification") {
        params.verification = "false";
      } else if (sortBy === "verified") {
        params.verification = "true";
      } else {
        params.sortBy = SORT_MAP[sortBy] ?? sortBy;
      }

      const res = await api.get("/api/admin/cooks", { params });
      // console.log("[useCooks] response:", res.data);
      return res.data.cooks ?? [];
    },
  });
}

export function useCookById(cookId: string | null, options?: { staleTime?: number; refetchOnMount?: boolean | "always" }) {
  return useQuery<ApiCook>({
    queryKey: ["cook", cookId],
    queryFn: async () => {
      const res = await api.get(`/api/admin/cooks/${cookId}`);
      const data = res.data.cook ?? res.data;
      // Normalize: single endpoint uses _id, list uses cookId
      if (data._id && !data.cookId) data.cookId = data._id;
      data.meals = res.data.meals ?? [];
      data.totalMeals = res.data.totalMeals ?? 0;
      return data;
    },
    enabled: !!cookId,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    refetchOnMount: options?.refetchOnMount ?? false,
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

export function useCreateCook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      phone: string;
      address: string;
    }) => api.post("/api/admin/cooks", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cooks"] });
      queryClient.invalidateQueries({ queryKey: ["cook-stats"] });
    },
  });
}
