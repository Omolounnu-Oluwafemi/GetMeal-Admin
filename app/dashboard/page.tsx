"use client";

import StatCard from "@/components/StatCard";
import OrdersChart from "@/components/OrdersChart";
import SystemAlerts from "@/components/SystemAlerts";
import OrdersTable from "@/components/OrderStable";
import {
  useStatsOverview,
  useOrdersChart,
  useFulfillmentStats,
  useSystemAlerts,
} from "@/lib/hooks/dashboard";

// Default to last 60 days
const end = new Date().toISOString();
const start = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();

function formatNaira(value: number) {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(1)}k`;
  return `₦${value}`;
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useStatsOverview(start, end);
  const { data: chartData, isLoading: chartLoading } = useOrdersChart(start, end);
  const { data: fulfillment, isLoading: fulfillmentLoading } = useFulfillmentStats(start, end);
  const { data: alerts, isLoading: alertsLoading } = useSystemAlerts();

  return (
    <div className="space-y-6 mt-[-4]">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          label="Active Cooks"
          value={statsLoading ? "—" : stats?.activeCooks.value ?? "—"}
          trend={
            stats
              ? {
                  value: Math.abs(stats.activeCooks.change),
                  isPositive: stats.activeCooks.change >= 0,
                  comparedTo: "vs prev period",
                }
              : undefined
          }
        />

        <StatCard
          label="Total Orders"
          value={statsLoading ? "—" : stats?.totalOrders.value ?? "—"}
          trend={
            stats
              ? {
                  value: Math.abs(stats.totalOrders.change),
                  isPositive: stats.totalOrders.change >= 0,
                  comparedTo: "vs prev period",
                }
              : undefined
          }
        />

        <StatCard
          label="GMV"
          value={statsLoading ? "—" : stats ? formatNaira(stats.gmv.value) : "—"}
          trend={
            stats
              ? {
                  value: Math.abs(stats.gmv.change),
                  isPositive: stats.gmv.change >= 0,
                  comparedTo: "vs prev period",
                }
              : undefined
          }
        />

        <StatCard
          label="Cancellations"
          value={statsLoading ? "—" : stats?.cancellations.value ?? "—"}
          trend={
            stats
              ? {
                  value: Math.abs(stats.cancellations.change),
                  isPositive: stats.cancellations.change <= 0,
                  comparedTo: "vs prev period",
                }
              : undefined
          }
        />

        <StatCard
          label="Refunds"
          value={statsLoading ? "—" : stats?.refunds.value ?? "—"}
          trend={
            stats
              ? {
                  value: Math.abs(stats.refunds.change),
                  isPositive: stats.refunds.change <= 0,
                  comparedTo: "vs prev period",
                }
              : undefined
          }
        />

        <StatCard
          label="Avg Fulfillment"
          value={
            fulfillmentLoading
              ? "—"
              : fulfillment
              ? `${fulfillment.averageFulfillmentTime.toFixed(1)} min`
              : "—"
          }
        />
      </div>

      {/* Charts and Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OrdersChart
            chartData={chartData ?? []}
            fulfillmentTime={fulfillment?.averageFulfillmentTime}
            loading={chartLoading || fulfillmentLoading}
          />
        </div>

        <div className="lg:col-span-1">
          <SystemAlerts alerts={alerts} loading={alertsLoading} />
        </div>
      </div>

      <OrdersTable />
    </div>
  );
}
