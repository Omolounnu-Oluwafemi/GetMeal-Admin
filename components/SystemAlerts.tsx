"use client";
import { AlertTriangle, AlertCircle, X, ArrowRight } from "@/lib/icons";
import { Clock4 } from "lucide-react";
const alerts = [
  {
    id: 1,
    type: "error" as const,
    icon: Clock4,
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
    icon: Clock4,
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
    icon: Clock4,
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
        <div className="bg-[#faf1f1] p-2 rounded-md">
          <AlertTriangle className="w-5 h-5 text-[#f5460b]  ]" />
        </div>
      </div>
      {/* Alerts List - Scrollable without visible scrollbar */}
      <div className="h-[400px] overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-[12px] border transition-all hover:shadow-sm grid grid-cols-[auto_1fr_auto] gap-3"
              style={{
                backgroundColor: alert.bgColor,
                borderColor: `${alert.color}20`,
              }}
            >
              {/* Col 1: Icon */}
              <alert.icon
                className="w-4 h-4 mt-0.5"
                style={{ color: alert.color }}
              />

              {/* Col 2: Content */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-[#111827] text-sm">
                    {alert.title}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{
                      outline: `1px solid ${alert.color}`,
                      color: alert.color,
                    }}
                  >
                    {alert.count}
                  </span>
                </div>
                <div className="text-xs text-[#6B7280] mb-2">
                  {alert.description}
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-[11px] text-[#6B7280]">Zones:</span>
                  {alert.zones.map((zone, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-white rounded text-[10px] text-[#374151]"
                    >
                      {zone}
                    </span>
                  ))}
                </div>
                <div className="font-medium text-xs text-[#111827] mb-3">
                  {alert.detail}
                </div>
                <button
                  className="flex items-center gap-1 text-xs font-medium transition-colors mb-3"
                  style={{ color: alert.color }}
                >
                  {alert.action}
                  <ArrowRight className="w-4 h-3" />
                </button>
              </div>

              {/* Col 3: Dismiss */}
              <button className="p-1 hover:bg-white/50 rounded transition-colors self-start">
                <X className="w-4 h-4 text-[#6B7280]" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
