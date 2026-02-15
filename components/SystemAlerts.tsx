"use client";
import { AlertTriangle, AlertCircle, X, ArrowRight } from "@/lib/icons";
const alerts = [
  {
    id: 1,
    type: "error" as const,
    icon: AlertCircle,
    title: "Late Orders",
    count: 8,
    description: "Late Orders",
    zones: ["Lagos", "Abuja"],
    detail: "Oldest: 25 mins late",
    action: "View Queue",
    color: "#EF4444",
    bgColor: "#FEF2F2",
  },
  {
    id: 2,
    type: "warning" as const,
    icon: AlertCircle,
    title: "Payment Failures",
    count: 3,
    description: "Payment Failures",
    zones: ["Lagos"],
    detail: "₦11,800 at risk",
    action: "Review Payments",
    color: "#F59E0B",
    bgColor: "#FFFBEB",
  },
  {
    id: 3,
    type: "warning" as const,
    icon: AlertCircle,
    title: "Payment Failures",
    count: 3,
    description: "Payment Failures",
    zones: ["Lagos"],
    detail: "₦11,800 at risk",
    action: "Review Payments",
    color: "#F59E0B",
    bgColor: "#FFFBEB",
  },
];
export default function SystemAlerts() {
  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#F3F4F6]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#111827] mb-1">
            System Alerts
          </h3>
          <p className="text-sm text-[#6B7280]">
            13 issues requiring attention
          </p>
        </div>
        <AlertTriangle className="w-6 h-6 text-[#F59E0B]" />
      </div>
      {/* Alerts List - Scrollable without visible scrollbar */}
      <div className="h-[400px] overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-[12px] border transition-all hover:shadow-sm"
              style={{
                backgroundColor: alert.bgColor,
                borderColor: `${alert.color}20`,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <alert.icon
                    className="w-5 h-5"
                    style={{ color: alert.color }}
                  />
                  <span className="font-semibold text-[#111827]">
                    {alert.title}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: alert.color }}
                  >
                    {alert.count}
                  </span>
                </div>
                <button className="p-1 hover:bg-white/50 rounded transition-colors">
                  <X className="w-4 h-4 text-[#6B7280]" />
                </button>
              </div>
              <div className="text-sm text-[#6B7280] mb-2">
                {alert.description}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-[#6B7280]">Zones:</span>
                {alert.zones.map((zone, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-white rounded text-xs text-[#374151]"
                  >
                    {zone}
                  </span>
                ))}
              </div>
              <div className="font-medium text-sm text-[#111827] mb-3">
                {alert.detail}
              </div>
              <button
                className="flex items-center gap-1 text-sm font-medium transition-colors"
                style={{ color: alert.color }}
              >
                {alert.action}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
