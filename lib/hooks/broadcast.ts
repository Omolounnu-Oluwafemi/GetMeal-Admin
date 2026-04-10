import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

interface BroadcastPayload {
  title: string;
  body: string;
  type: "system" | "order" | "payment" | "promo" | "alert";
  target: "all" | "customers" | "cooks" | "admins" | "specific" | "zones";
  userIds?: string[];
  zones?: string[];
  pushOnly?: boolean;
  data?: Record<string, unknown>;
}

interface BroadcastResponse {
  success: boolean;
  message: string;
  count: number;
}

export function useSendBroadcast() {
  return useMutation({
    mutationFn: async (payload: BroadcastPayload): Promise<BroadcastResponse> => {
      const res = await api.post<BroadcastResponse>("/api/admin/bulk", payload);
      return res.data;
    },
  });
}
