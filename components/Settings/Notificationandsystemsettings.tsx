"use client";

import { useState, useEffect } from "react";
import { Check, Save } from "@/lib/icons";
import { useProfile, useUpdateProfile } from "@/lib/hooks/profile";
import { toast } from "sonner";


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
  const { data: profile, isLoading } = useProfile();
  const { mutate: updateProfile, isPending: saving } = useUpdateProfile();

  const defaultSettings = {
    push_enabled: true,
    email_enabled: true,
    transactions: true,
    promotions: false,
  };

  const [original, setOriginal] = useState(defaultSettings);
  const [settings, setSettings] = useState(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!profile) return;
    const loaded = { ...defaultSettings, ...profile.notificationSettings };
    setOriginal(loaded);
    setSettings(loaded);
  }, [profile]);

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateProfile(
      { notificationSettings: settings },
      {
        onSuccess: (res) => {
          toast.success(res.message ?? "Notification settings saved");
          setOriginal(settings);
          setHasChanges(false);
        },
        onError: () => toast.error("Failed to save notification settings"),
      },
    );
  };

  const handleCancel = () => {
    setSettings(original);
    setHasChanges(false);
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
        <h3 className="text-[15px] font-semibold text-gray-900">Channels</h3>
        <div className="space-y-2">
          <div className="pt-3 border-b border-gray-100 pb-5 space-y-2">
            <CustomCheckbox
              checked={settings.email_enabled}
              onChange={() => toggle("email_enabled")}
              label="Email Notifications"
              description="Receive notifications via email"
            />
            <CustomCheckbox
              checked={settings.push_enabled}
              onChange={() => toggle("push_enabled")}
              label="Push Notifications"
              description="Receive push notifications on your device"
            />
          </div>
        </div>

        <div>
          <h3 className="text-[15px] font-semibold text-gray-900 pt-5 mb-3">
            Notification Types
          </h3>
          <div className="space-y-2 border-b border-gray-100 pb-5">
            <CustomCheckbox
              checked={settings.transactions}
              onChange={() => toggle("transactions")}
              label="Transactions"
              description="Payment confirmations, failures, refunds"
            />
            <CustomCheckbox
              checked={settings.promotions}
              onChange={() => toggle("promotions")}
              label="Promotions"
              description="Promotional offers and marketing updates"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 mt-8">
        <button
          onClick={handleCancel}
          disabled={!hasChanges || saving}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="flex items-center gap-3 px-3 py-2.5 bg-[#219e02] text-white rounded-xl text-sm font-medium hover:bg-[#1a7d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
