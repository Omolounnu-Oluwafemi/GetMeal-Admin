"use client";

import { useState } from "react";
import { Bell, Send } from "@/lib/icons";
import QualityMetricCard from "@/components/Snapshot/Qualitymetriccard";
import LiveOrdersList from "@/components/Snapshot/Liveorderslist";
import AlertsPanel from "@/components/Snapshot/Alertspanel";
import ZoneActivityList from "@/components/Snapshot/Zoneactivitylist";
import NudgeCooksModal from "@/components/Snapshot/Nudgecooksmodal";
import { useSnapshot } from "@/lib/hooks/snapshot";

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return "just now";
  if (diff === 1) return "1 min ago";
  return `${diff} min ago`;
}

function mapStatus(status: string): "Cooking" | "Ready" | "Late" {
  if (status === "ready") return "Ready";
  if (status === "late") return "Late";
  return "Cooking";
}

const ALERT_TYPE_LABEL: Record<string, "Late orders" | "Payment failures" | "Cook cancellations"> = {
  late_order: "Late orders",
  payment_failure: "Payment failures",
  cook_cancellation: "Cook cancellations",
};

const ALERT_COLOR: Record<string, string> = {
  "Late orders": "red",
  "Payment failures": "orange",
  "Cook cancellations": "red",
};

export default function SnapshotPage() {
  const [showNudgeModal, setShowNudgeModal] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const { data, isLoading } = useSnapshot({ date: today });

  const liveOrders = (data?.liveOrders ?? []).map((o, i) => ({
    id: o._id ?? String(i),
    orderId: o.orderId,
    location: o.location,
    customerName: o.customerName,
    timeAgo: timeAgo(o.createdAt),
    status: mapStatus(o.status),
    statusColor:
      mapStatus(o.status) === "Ready"
        ? "green"
        : mapStatus(o.status) === "Late"
          ? "red"
          : "blue",
  }));

  const alertGroups = (data?.alerts ?? []).reduce<Record<string, number>>(
    (acc, a) => {
      const label = ALERT_TYPE_LABEL[a.type] ?? a.type;
      acc[label] = (acc[label] ?? 0) + 1;
      return acc;
    },
    {},
  );
  const alerts = Object.entries(alertGroups).map(([type, count], i) => ({
    id: String(i),
    type: type as "Late orders" | "Payment failures" | "Cook cancellations",
    count,
    color: ALERT_COLOR[type] ?? "red",
  }));

  const zones = Object.entries(data?.zoneActivities ?? {}).map(
    ([name, count], i) => ({
      id: String(i),
      name,
      cooksOnline: "—",
      totalCooks: 0,
      orders: count,
      availability: 0,
    }),
  );

  const totalOrdersPerHour = Object.values(data?.ordersPerHour ?? {}).reduce(
    (sum, v) => sum + v,
    0,
  );

  const ratingDiff = (data?.avgRatingToday ?? 0) - (data?.avgRatingYesterday ?? 0);
  const complaintDiff = (data?.complaintsToday ?? 0) - (data?.complaintsYesterday ?? 0);

  return (
    <div className="space-y-6">
      {/* Quality Snapshot Section */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 uppercase mb-4">
          QUALITY SNAPSHOT
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QualityMetricCard
            label="AVG RATING TODAY"
            value={isLoading ? "—" : (data?.avgRatingToday ?? 0).toFixed(1)}
            showStar
            trend={
              !isLoading
                ? {
                    value: Math.abs(ratingDiff),
                    label: "vs yesterday",
                    isPositive: ratingDiff >= 0,
                  }
                : undefined
            }
          />
          <QualityMetricCard
            label="COMPLAINTS TODAY"
            value={isLoading ? "—" : data?.complaintsToday ?? 0}
            trend={
              !isLoading
                ? {
                    value: Math.abs(complaintDiff),
                    label: "vs yesterday",
                    isPositive: complaintDiff <= 0,
                  }
                : undefined
            }
          />
          <QualityMetricCard
            label="REPEAT CUSTOMERS"
            value={isLoading ? "—" : `${data?.repeatCustomerPercentage ?? "0"}%`}
          />
          <QualityMetricCard
            label="AT RISK ORDERS"
            value={isLoading ? "—" : data?.atRiskOrders ?? 0}
            subtitle="needs attention"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 uppercase mb-4">
          QUICK ACTIONS
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNudgeModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#219e02] hover:text-[#219e02] transition-colors"
          >
            <Bell className="w-4 h-4" />
            Nudge cooks online
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#219e02] hover:text-[#219e02] transition-colors"
          >
            <Send className="w-4 h-4" />
            Send broadcast
          </button>
        </div>
      </div>

      {/* Live Orders and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveOrdersList orders={liveOrders} onViewAll={() => {}} />
        <AlertsPanel alerts={alerts} />
      </div>

      {/* Zone Activity */}
      <ZoneActivityList
        zones={zones}
        totalOrders={totalOrdersPerHour}
        capacity={data?.totalCooks ?? 0}
        browsing={0}
        onViewDetails={() => {}}
      />

      {showNudgeModal && (
        <NudgeCooksModal onClose={() => setShowNudgeModal(false)} />
      )}
    </div>
  );
}
