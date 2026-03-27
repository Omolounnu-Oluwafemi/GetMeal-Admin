"use client";

import { AlertTriangle, ArrowRight } from "@/lib/icons";
import { Clock4 } from "lucide-react";
import { SystemAlerts as SystemAlertsData } from "@/lib/hooks/dashboard";

interface Props {
  alerts?: SystemAlertsData;
  loading?: boolean;
}

interface AlertConfig {
  key: keyof SystemAlertsData;
  title: string;
  action: string;
  color: string;
  bgColor: string;
}

const ALERT_CONFIGS: AlertConfig[] = [
  {
    key: "lateOrders",
    title: "Late Orders",
    action: "View Queue",
    color: "#EF4444",
    bgColor: "#FEF2F2",
  },
  {
    key: "paymentFailures",
    title: "Payment Failures",
    action: "Review Payments",
    color: "#F59E0B",
    bgColor: "#FFFBEB",
  },
  {
    key: "pendingPayouts",
    title: "Pending Payouts",
    action: "Review Payouts",
    color: "#6366F1",
    bgColor: "#EEF2FF",
  },
];

export default function SystemAlerts({ alerts, loading }: Props) {
  const issueCount = alerts
    ? alerts.lateOrders + alerts.paymentFailures + alerts.pendingPayouts
    : 0;

  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#F3F4F6]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#111827] mb-1">
            System Alerts
          </h3>
          <p className="text-sm text-[#6B7280]">
            {loading
              ? "Loading…"
              : `${issueCount} issue${issueCount !== 1 ? "s" : ""} requiring attention`}
          </p>
        </div>
        <div className="bg-[#faf1f1] p-2 rounded-md">
          <AlertTriangle className="w-5 h-5 text-[#f5460b]" />
        </div>
      </div>

      <div className="h-[400px] overflow-y-auto overflow-x-hidden scrollbar-hide">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-[12px] bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {ALERT_CONFIGS.map((config) => {
              const count = alerts?.[config.key] ?? 0;
              return (
                <div
                  key={config.key}
                  className="p-4 rounded-[12px] border transition-all hover:shadow-sm grid grid-cols-[auto_1fr] gap-3"
                  style={{
                    backgroundColor: config.bgColor,
                    borderColor: `${config.color}20`,
                  }}
                >
                  <Clock4
                    className="w-4 h-4 mt-0.5"
                    style={{ color: config.color }}
                  />

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-[#111827] text-sm">
                        {config.title}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{
                          outline: `1px solid ${config.color}`,
                          color: config.color,
                        }}
                      >
                        {count}
                      </span>
                    </div>

                    <button
                      className="flex items-center gap-1 text-xs font-medium transition-colors"
                      style={{ color: config.color }}
                    >
                      {config.action}
                      <ArrowRight className="w-4 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
