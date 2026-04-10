"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface ApiMealCategory {
  _id: string;
  name: string;
  image?: { url: string; publicId: string };
  createdAt?: string;
  updatedAt?: string;
}

export function useMealCategories() {
  return useQuery<ApiMealCategory[]>({
    queryKey: ["meal-categories"],
    queryFn: async () => {
      const res = await api.get("/api/category/");
      return Array.isArray(res.data) ? res.data : [];
    },
    staleTime: 5 * 60_000,
  });
}

export function useCreateMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post("/api/admin/meals/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cooks"] });
    },
  });
}
