"use client";

import { useState } from "react";
import { Bell, Send } from "@/lib/icons";
import QualityMetricCard from "@/components/Snapshot/Qualitymetriccard";
import LiveOrdersList from "@/components/Snapshot/Liveorderslist";
import AlertsPanel from "@/components/Snapshot/Alertspanel";
import ZoneActivityList from "@/components/Snapshot/Zoneactivitylist";
import NudgeCooksModal from "@/components/Snapshot/Nudgecooksmodal";

// Sample data
const liveOrders = [
  {
    id: "1",
    orderId: "ORD-1234",
    location: "Lekki / Ajah",
    customerName: "Amara Obi",
    timeAgo: "12 min ago",
    status: "Cooking" as const,
    statusColor: "blue",
  },
  {
    id: "2",
    orderId: "ORD-1235",
    location: "Ikeja / Maryland",
    customerName: "Chidi Eze",
    timeAgo: "5 min ago",
    status: "Ready" as const,
    statusColor: "green",
  },
  {
    id: "3",
    orderId: "ORD-1236",
    location: "Yaba / Surulere",
    customerName: "Ngozi Okoro",
    timeAgo: "45 min ago",
    status: "Late" as const,
    statusColor: "red",
  },
  {
    id: "4",
    orderId: "ORD-1237",
    location: "Ikoyi / Victoria Island",
    customerName: "Tunde Balogun",
    timeAgo: "8 min ago",
    status: "Cooking" as const,
    statusColor: "blue",
  },
  {
    id: "5",
    orderId: "ORD-1238",
    location: "Festac / Amuwo",
    customerName: "Ada Chukwu",
    timeAgo: "15 min ago",
    status: "Cooking" as const,
    statusColor: "blue",
  },
];

const alerts = [
  { id: "1", type: "Late orders" as const, count: 3, color: "red" },
  { id: "2", type: "Payment failures" as const, count: 1, color: "orange" },
  { id: "3", type: "Cook cancellations" as const, count: 2, color: "red" },
];

const zones = [
  {
    id: "1",
    name: "Lekki / Ajah",
    cooksOnline: "20",
    totalCooks: 68,
    orders: 45,
    availability: 29,
    hasAlert: true,
  },
  {
    id: "2",
    name: "Ikoyi / Victoria Island",
    cooksOnline: "18",
    totalCooks: 42,
    orders: 38,
    availability: 43,
  },
  {
    id: "3",
    name: "Ikeja / Maryland",
    cooksOnline: "15",
    totalCooks: 38,
    orders: 32,
    availability: 39,
  },
  {
    id: "4",
    name: "Yaba / Surulere",
    cooksOnline: "14",
    totalCooks: 35,
    orders: 28,
    availability: 40,
  },
  {
    id: "5",
    name: "Mainland West (Agege / Alimosho)",
    cooksOnline: "10",
    totalCooks: 30,
    orders: 22,
    availability: 33,
  },
  {
    id: "6",
    name: "Festac / Amuwo",
    cooksOnline: "12",
    totalCooks: 28,
    orders: 19,
    availability: 32,
  },
];

export default function SnapshotPage() {
  const [showNudgeModal, setShowNudgeModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const handleViewAllOrders = () => {
    console.log("View all orders");
    // Navigate to orders page
  };

  const handleViewZoneDetails = () => {
    console.log("View zone details");
    // Navigate to zone details
  };

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
            value="4.6"
            showStar
            trend={{
              value: 0.2,
              label: "vs yesterday",
              isPositive: true,
            }}
          />
          <QualityMetricCard
            label="COMPLAINTS TODAY"
            value="8"
            trend={{
              value: 2,
              label: "vs yesterday",
              isPositive: true,
            }}
          />
          <QualityMetricCard
            label="REPEAT CUSTOMERS"
            value="45%"
            trend={{
              value: 5,
              label: "vs yesterday",
              isPositive: true,
            }}
          />
          <QualityMetricCard
            label="AT RISK ORDERS"
            value="6"
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
            onClick={() => setShowBroadcastModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#219e02] hover:text-[#219e02] transition-colors"
          >
            <Send className="w-4 h-4" />
            Send broadcast
          </button>
        </div>
      </div>

      {/* Live Orders and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveOrdersList orders={liveOrders} onViewAll={handleViewAllOrders} />
        <AlertsPanel alerts={alerts} />
      </div>

      {/* Zone Activity */}
      <ZoneActivityList
        zones={zones}
        totalOrders={191}
        capacity={910}
        browsing={250}
        onViewDetails={handleViewZoneDetails}
      />

      {/* Nudge Modal */}
      {showNudgeModal && (
        <NudgeCooksModal onClose={() => setShowNudgeModal(false)} />
      )}

      {/* Broadcast Modal - Reuse from Header component */}
      {/* {showBroadcastModal && (
        <BroadcastModal onClose={() => setShowBroadcastModal(false)} />
      )} */}
    </div>
  );
}
