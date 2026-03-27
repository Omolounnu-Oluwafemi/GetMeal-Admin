import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface LiveOrder {
  _id: string;
  orderId: string;
  location: string;
  customerName: string;
  createdAt: string;
  status: string;
}

export interface SnapshotAlert {
  orderId: string;
  status: string;
  type: string;
}

export interface SnapshotData {
  avgRatingToday: number;
  avgRatingYesterday: number;
  complaintsToday: number;
  complaintsYesterday: number;
  repeatCustomerPercentage: string;
  atRiskOrders: number;
  liveOrders: LiveOrder[];
  alerts: SnapshotAlert[];
  zoneActivities: Record<string, number>;
  totalActiveZones: number;
  ordersPerHour: Record<string, number>;
  cooksOnline: number;
  totalCooks: number;
  availabilityPercentage: string;
}

export function useSnapshot(filters?: { date?: string; zone?: string }) {
  return useQuery<SnapshotData>({
    queryKey: ["snapshot", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters?.date) params.date = filters.date;
      if (filters?.zone) params.zone = filters.zone;
      const res = await api.get("/api/admin/snapshot", { params });
      return res.data;
    },
    refetchInterval: 30_000,
  });
}
