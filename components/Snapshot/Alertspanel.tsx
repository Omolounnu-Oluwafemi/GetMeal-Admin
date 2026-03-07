"use client";

import { AlertTriangle } from "@/lib/icons";

interface Alert {
  id: string;
  type: "Late orders" | "Payment failures" | "Cook cancellations";
  count: number;
  color: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
}

const dotColor: Record<string, string> = {
  red: "bg-red-500",
  orange: "bg-orange-400",
};

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  const totalAlerts = alerts.reduce((sum, alert) => sum + alert.count, 0);

  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#F3F4F6]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            ALERTS
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {totalAlerts} items
          </div>
        </div>
        <div className="w-9 h-9 rounded-xl border border-red-200 bg-red-50 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>
      </div>

      <div>
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotColor[alert.color] ?? "bg-gray-400"}`} />
              <span className="text-sm text-gray-700">{alert.type}</span>
            </div>
            <span className="text-xl font-bold text-gray-900">{alert.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
