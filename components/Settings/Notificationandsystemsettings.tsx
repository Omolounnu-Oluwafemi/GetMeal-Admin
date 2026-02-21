"use client";

import { useState } from "react";
import { Check, Save } from "@/lib/icons";

interface NotificationToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export function NotificationSettings() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [alerts, setAlerts] = useState<NotificationToggle[]>([
    {
      id: "order-alerts",
      label: "Order Alerts",
      description: "New orders, cancellations, completions",
      enabled: true,
    },
    {
      id: "cook-alerts",
      label: "Cook Alerts",
      description: "Cook registrations, suspensions, complaints",
      enabled: true,
    },
    {
      id: "customer-alerts",
      label: "Customer Alerts",
      description: "New registrations, account issues",
      enabled: true,
    },
    {
      id: "payment-alerts",
      label: "Payment Alerts",
      description: "Payment confirmations, failures, refunds",
      enabled: true,
    },
    {
      id: "system-alerts",
      label: "System Alerts",
      description: "System updates, maintenance notices",
      enabled: true,
    },
  ]);

  const toggleAlert = (id: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, enabled: !alert.enabled } : alert,
      ),
    );
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Notification Preferences
        </h2>
        <p className="text-sm text-gray-600">
          Choose what notifications you want to receive
        </p>
      </div>

      <div className="space-y-8">
        {/* Email Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Email Notifications
          </h3>
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                type="checkbox"
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
                className="w-5 h-5 text-[#219e02] focus:ring-[#219e02] border-gray-300 rounded"
              />
              {emailEnabled && (
                <Check className="absolute w-4 h-4 text-white pointer-events-none" />
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                Enable email notifications
              </div>
              <div className="text-sm text-gray-500 mt-0.5">
                Receive notifications via email
              </div>
            </div>
          </label>
        </div>

        {/* Alert Types */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Alert Types
          </h3>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{alert.label}</div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {alert.description}
                  </div>
                </div>
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={alert.enabled}
                    onChange={() => toggleAlert(alert.id)}
                    className="w-5 h-5 text-[#219e02] focus:ring-[#219e02] border-gray-300 rounded"
                  />
                  {alert.enabled && (
                    <Check className="absolute w-4 h-4 text-white pointer-events-none" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
