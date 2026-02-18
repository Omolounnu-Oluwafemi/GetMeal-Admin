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

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  const totalAlerts = alerts.reduce((sum, alert) => sum + alert.count, 0);

  const getColorClasses = (color: string) => {
    switch (color) {
      case "red":
        return "bg-red-500";
      case "orange":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#F3F4F6]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase mb-2">
            ALERTS
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {totalAlerts} items
          </div>
        </div>
        <AlertTriangle className="w-6 h-6 text-[#F59E0B]" />
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${getColorClasses(alert.color)}`}
              />
              <span className="text-sm text-gray-700">{alert.type}</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {alert.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
