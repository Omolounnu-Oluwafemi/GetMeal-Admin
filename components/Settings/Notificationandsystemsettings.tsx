"use client";

import { useState } from "react";
import { Check, Save } from "@/lib/icons";

interface NotificationToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

function CustomCheckbox({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-start justify-between py-1.5">
      <div className="flex-1">
        <div className="font-medium text-gray-900 text-sm">{label}</div>
        <div className="text-xs text-gray-400 mt-0.5">{description}</div>
      </div>
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <div
          className="
            w-[18px] h-[18px] rounded-md
            border-2 border-gray-300
            flex items-center justify-center
            transition-all duration-200
            peer-checked:bg-[#219e02]
            peer-checked:border-[#219e02]
          "
        >
          <Check strokeWidth={2} width={18} color="#fff" />
        </div>
      </label>
    </div>
  );
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
  const [reports, setReports] = useState<NotificationToggle[]>([
    {
      id: "weekly-reports",
      label: "Weekly Reports",
      description: "Receive weekly performance summary",
      enabled: true,
    },
    {
      id: "monthly-reports",
      label: "Monthly Reports",
      description: "Receive monthly business analytics",
      enabled: true,
    },
  ]);

  const toggleAlert = (id: string) => {
    setAlerts(
      alerts.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
    );
  };

  const toggleReport = (id: string) => {
    setReports(
      reports.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    );
  };

  const handleSave = () => {
    console.log("Saving notification settings...");
  };

  const handleCancel = () => {
    console.log("Cancelled");
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Notification Preferences
        </h2>
        <p className="text-[13px] text-gray-600">
          Choose what notifications you want to receive
        </p>
      </div>

      <div className="space-y-1">
        {/* Email Notifications */}
        <h3 className="text-[15px] font-semibold text-gray-900">
          Email Notifications
        </h3>
        <div className="space-y-2">
          <div className="pb-6 pt-3 border-b border-gray-100">
            <CustomCheckbox
              checked={emailEnabled}
              onChange={() => setEmailEnabled((p) => !p)}
              label="Enable email notifications"
              description="Receive notifications via email"
            />
          </div>
        </div>

        {/* Alert Types */}
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900 pt-5 mb-3">
            Alert Types
          </h3>
          <div className="space-y-2 border-b border-gray-100 pb-5">
            {alerts.map((alert) => (
              <CustomCheckbox
                key={alert.id}
                checked={alert.enabled}
                onChange={() => toggleAlert(alert.id)}
                label={alert.label}
                description={alert.description}
              />
            ))}
          </div>
        </div>

        {/* Reports */}
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900 pt-5 mb-3">
            Reports
          </h3>
          <div className="space-y-2 border-b border-gray-100 pb-5">
            {reports.map((report) => (
              <CustomCheckbox
                key={report.id}
                checked={report.enabled}
                onChange={() => toggleReport(report.id)}
                label={report.label}
                description={report.description}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 mt-8 ">
        <button
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex items-center justify-between gap-5 px-3 py-2.5 bg-[#219e02] text-white rounded-xl text-sm font-medium hover:bg-[#1a7d01] transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
