import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

interface BroadcastPayload {
  title: string;
  body: string;
  type: string;
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
