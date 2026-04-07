"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface ApiOrderFilter {
  orderId: string; // MongoDB _id used as identifier
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  deliveryTime?: string;
  mealItems: {
    mealId: string;
    name: string;
    image?: string;
    quantity: number;
    price: number;
  }[];
  user: { _id: string; fullName: string; email: string; phone: string; city?: string };
  cook: { cookId: string; name: string; email: string; phone: string };
}

// Shape returned by GET /api/admin/orders/:id
export interface ApiOrderDetail {
  _id: string;
  user: { _id: string; email: string; fullName: string } | null;
  cook: { _id: string; email: string; fullName: string } | null;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  deliveryType: string;
  note?: string | null;
  mealItems: {
    mealId: string;
    name: string;
    images: { url: string; publicId: string }[];
    price: number;
    quantity: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiOrder {
  _id: string;
  user: { _id: string; fullName: string; phone: string } | null;
  cook: { _id: string; fullName: string; phone: string } | null;
  totalAmount: number;
  mealItems: {
    mealId: string;
    name: string;
    images: { url: string; publicId: string }[];
    quantity: number;
    price: number;
    _id?: string;
  }[];
  deliveryType: string;
  note?: string | null;
  status: string;
  paymentStatus: string;
  paymentReference?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ApiAtRiskOrder {
  _id: string;
  userId: { _id: string; fullName: string; phone: string } | null;
  cookId: { _id: string; fullName: string; phone: string } | null;
  totalAmount: number;
  mealItems: {
    mealId: string;
    quantity: number;
    price: number;
    _id?: string;
  }[];
  deliveryType: string;
  note?: string | null;
  status: string;
  paymentStatus: string;
  paymentReference?: string;
  createdAt: string;
  updatedAt?: string;
}

export function useOrders(page = 1) {
  return useQuery<{ page: number; total: number; pages: number; orders: ApiOrder[] }>({
    queryKey: ["orders", page],
    queryFn: async () => {
      const res = await api.get("/api/admin/orders", { params: { page } });
      return res.data;
    },
    staleTime: 30_000,
  });
}

interface OrdersFilterParams {
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  cookId?: string;
}

export function useOrdersFilter(filters: OrdersFilterParams = {}) {
  return useQuery<ApiOrderFilter[]>({
    queryKey: ["orders-filter", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters.status) params.status = filters.status;
      if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;
      if (filters.cookId) params.cookId = filters.cookId;
      const res = await api.get("/api/admin/orders/filter", { params });
      return res.data.orders ?? res.data ?? [];
    },
    staleTime: 30_000,
  });
}

export function useAtRiskOrders() {
  return useQuery<ApiAtRiskOrder[]>({
    queryKey: ["orders-at-risk"],
    queryFn: async () => {
      const res = await api.get("/api/admin/orders/at-risk");
      return res.data.orders ?? res.data ?? [];
    },
    staleTime: 30_000,
  });
}

export function useOrderById(id: string | null) {
  return useQuery<ApiOrderFilter>({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await api.get(`/api/admin/orders/${id}`);
      return res.data.order ?? res.data;
    },
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/api/admin/orders/${id}/cancel`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["orders-filter"] });
      qc.invalidateQueries({ queryKey: ["orders-at-risk"] });
    },
  });
}

export function useRefundOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/api/admin/orders/${id}/refund`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["orders-filter"] });
    },
  });
}
