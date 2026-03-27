import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface StatsOverview {
  activeCooks: { value: number; change: number };
  totalOrders: { value: number; change: number };
  gmv: { value: number; change: number };
  cancellations: { value: number; change: number };
  refunds: { value: number; change: number };
}

export interface OrdersChartItem {
  _id: string;
  data: { status: string; count: number }[];
}

export interface FulfillmentStats {
  averageFulfillmentTime: number;
}

export interface SystemAlerts {
  lateOrders: number;
  paymentFailures: number;
  pendingPayouts: number;
}

function buildDateParams(start: string, end: string) {
  return new URLSearchParams({ start, end }).toString();
}

export function useStatsOverview(start: string, end: string) {
  return useQuery<StatsOverview>({
    queryKey: ["stats-overview", start, end],
    queryFn: async () => {
      const { data } = await api.get(
        `/api/admin/stats/overview?${buildDateParams(start, end)}`
      );
      return data;
    },
  });
}

export function useOrdersChart(start: string, end: string) {
  return useQuery<OrdersChartItem[]>({
    queryKey: ["orders-chart", start, end],
    queryFn: async () => {
      const { data } = await api.get(
        `/api/admin/stats/orders-chart?${buildDateParams(start, end)}`
      );
      return data;
    },
  });
}

export function useFulfillmentStats(start: string, end: string) {
  return useQuery<FulfillmentStats>({
    queryKey: ["fulfillment-stats", start, end],
    queryFn: async () => {
      const { data } = await api.get(
        `/api/admin/stats/fulfilment?${buildDateParams(start, end)}`
      );
      return data;
    },
  });
}

export function useSystemAlerts() {
  return useQuery<SystemAlerts>({
    queryKey: ["system-alerts"],
    queryFn: async () => {
      const { data } = await api.get("/api/admin/system-alerts");
      return data;
    },
    refetchInterval: 60_000, // refresh every minute
  });
}
