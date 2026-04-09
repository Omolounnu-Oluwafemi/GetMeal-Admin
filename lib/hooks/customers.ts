import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface ApiCustomer {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  status: "active" | "suspended";
  city: string;
  joinedAt: string;
  lastActive: string;
  ordersCount: number;
  notes: { note: string; createdAt: string }[];
}

export interface ApiCustomerOrder {
  _id: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  deliveryType: string;
  createdAt: string;
}

export interface ApiCustomerDetail extends ApiCustomer {
  walletBalance: number;
  orders: ApiCustomerOrder[];
  transactions: unknown[];
}

export interface CustomerStats {
  totalCustomers: number;
  newToday: number;
  joinedLast7Days: number;
  joinedLast30Days: number;
  noPurchases: number;
}

export interface CustomersResponse {
  stats: CustomerStats;
  customers: ApiCustomer[];
}

export interface CustomerFilters {
  status?: string;
  city?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
}

const SORT_MAP: Record<string, string> = {
  "newest": "newest",
  "oldest": "oldest",
  "most-orders": "mostOrders",
  "last-active": "lastActive",
};

export function useCustomerById(customerId: string | null) {
  return useQuery<ApiCustomerDetail>({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      const res = await api.get(`/api/admin/customer/${customerId}`);
      return res.data.customer ?? res.data;
    },
    enabled: !!customerId,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useCustomers(filters: CustomerFilters = {}) {
  return useQuery<CustomersResponse>({
    queryKey: ["customers", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status.toLowerCase());
      if (filters.city) params.set("city", filters.city);
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.set("dateTo", filters.dateTo);
      if (filters.sortBy && SORT_MAP[filters.sortBy]) {
        params.set("sortBy", SORT_MAP[filters.sortBy]);
      }
      const query = params.toString();
      const { data } = await api.get<CustomersResponse>(
        `/api/admin/customers${query ? `?${query}` : ""}`
      );
      return data;
    },
  });
}

export function useAddCustomerNote(customerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (note: string) =>
      api.post(`/api/admin/customers/${customerId}/note`, { note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
    },
  });
}

export function useMessageCustomer(customerId: string) {
  return useMutation({
    mutationFn: (payload: { subject: string; message: string }) =>
      api.post(`/api/admin/customers/${customerId}/message`, payload),
  });
}

export function useCreditCustomerWallet(customerId: string) {
  return useMutation({
    mutationFn: (payload: { amount: number; reason: string; note?: string }) =>
      api.post(`/api/admin/customers/${customerId}/credit`, payload),
  });
}

export function useUpdateCustomerStatus(customerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: "suspend" | "activate") =>
      api.post(`/api/admin/customers/${customerId}/status`, { action }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
    },
  });
}
