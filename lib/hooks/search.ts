import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface SearchUser {
  type: "user";
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface SearchCook {
  type: "cook";
  id: string;
  name: string;
  email: string;
  phone: string;
  isAvailable: boolean;
  rating: number;
}

export interface SearchOrder {
  type: "order";
  id: string;
  [key: string]: unknown;
}

export interface SearchResults {
  users: SearchUser[];
  cooks: SearchCook[];
  orders: SearchOrder[];
}

export function useSearch(q: string) {
  return useQuery<SearchResults>({
    queryKey: ["search", q],
    queryFn: async () => {
      const res = await api.get("/api/admin/search", { params: { q } });
      return res.data;
    },
    enabled: q.trim().length >= 2,
    staleTime: 30_000,
  });
}
