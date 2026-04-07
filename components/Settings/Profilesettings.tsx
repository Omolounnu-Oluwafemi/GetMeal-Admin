"use client";

import { useState, useRef, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Clock,
  Globe,
  Save,
  ChevronDown,
  Check,
} from "@/lib/icons";

function CustomSelect({
  value,
  options,
  icon: Icon,
  onChange,
}: {
  value: string;
  options: string[];
  icon: React.ElementType;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center bg-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#219e02]"
      >
        <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <span className="flex-1 text-center">{value}</span>
        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute bottom-[calc(100%+4px)] left-0 z-50 w-full bg-white rounded-xl shadow-lg border border-gray-200 py-1 px-1">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-1.5 text-sm text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span>{opt}</span>
              {value !== opt && <span className="w-4" />}

              {value === opt && (
                <Check className="w-4 h-4 text-[#219e02] flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function readStoredUser() {
  try {
    const raw = localStorage.getItem("user") ?? sessionStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw) as { _id?: string; fullName?: string; email?: string; role?: string; phone?: string };
  } catch {
    return null;
  }
}

export default function ProfileSettings() {
  const [original, setOriginal] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    timezone: "Africa/Lagos (WAT)",
    language: "English",
  });

  const [formData, setFormData] = useState({ ...original });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const user = readStoredUser();
    if (!user) return;
    const loaded = {
      fullName: user.fullName ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      role: user.role ?? "",
      timezone: "Africa/Lagos (WAT)",
      language: "English",
    };
    setOriginal(loaded);
    setFormData(loaded);
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Persist updated name/email back to storage so sidebar initials stay in sync
    try {
      const inLocal = !!localStorage.getItem("user");
      const storage = inLocal ? localStorage : sessionStorage;
      const raw = storage.getItem("user");
      if (raw) {
        const user = JSON.parse(raw);
        storage.setItem("user", JSON.stringify({ ...user, fullName: formData.fullName, email: formData.email }));
      }
    } catch { /* ignore */ }
    setOriginal(formData);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setFormData(original);
    setHasChanges(false);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Profile Information
        </h2>
        <p className="text-sm text-gray-500">
          Update your personal information and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-[13px] font-medium text-gray-900 mb-[6px]">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#219e02] focus:border-transparent"
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-[13px] font-medium text-gray-900 mb-[6px]">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#219e02] focus:border-transparent"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-[13px] font-medium text-gray-900 mb-[6px]">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#219e02] focus:border-transparent"
            />
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="block text-[13px] font-medium text-gray-900 mb-[6px]">
            Role
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.role}
              disabled
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg text-sm text-gray-500 cursor-not-allowed"
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5">
            Contact your administrator to change your role
          </p>
        </div>

        {/* Timezone and Language */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[13px] font-medium text-gray-900 mb-[6px]">
              Timezone
            </label>
            <CustomSelect
              value={formData.timezone}
              options={[
                "Africa/Lagos (WAT)",
                "Africa/Nairobi (EAT)",
                "Europe/Cairo (GMT)",
                "America/Cairo (EET)",
              ]}
              icon={Clock}
              onChange={(val) => handleChange("timezone", val)}
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-gray-900 mb-[6px]">
              Language
            </label>
            <CustomSelect
              value={formData.language}
              options={["English", "French", "Yoruba"]}
              icon={Globe}
              onChange={(val) => handleChange("language", val)}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
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
