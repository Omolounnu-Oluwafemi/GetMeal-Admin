"use client";

import { useState } from "react";
import { User, Mail, Phone, Clock, Globe, Save } from "@/lib/icons";

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    fullName: "Oluwaseun Adebayo",
    email: "seun.adebayo@getameal.com",
    phone: "+234 801 234 5678",
    role: "Admin",
    timezone: "Africa/Lagos (WAT)",
    language: "English",
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log("Saving profile...", formData);
    setHasChanges(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setHasChanges(false);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Profile Information
        </h2>
        <p className="text-sm text-gray-600">
          Update your personal information and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#219e02] focus:border-transparent"
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#219e02] focus:border-transparent"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#219e02] focus:border-transparent"
            />
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Role
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.role}
              disabled
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-500 cursor-not-allowed"
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1.5">
            Contact your administrator to change your role
          </p>
        </div>

        {/* Timezone and Language */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Timezone
            </label>
            <div className="relative">
              <select
                value={formData.timezone}
                onChange={(e) => handleChange("timezone", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#219e02] focus:border-transparent appearance-none"
              >
                <option>Africa/Lagos (WAT)</option>
                <option>Africa/Accra (GMT)</option>
                <option>Africa/Cairo (EET)</option>
              </select>
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Language
            </label>
            <div className="relative">
              <select
                value={formData.language}
                onChange={(e) => handleChange("language", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#219e02] focus:border-transparent appearance-none"
              >
                <option>English</option>
                <option>French</option>
                <option>Yoruba</option>
              </select>
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#219e02] text-white rounded-lg text-sm font-medium hover:bg-[#1a7d01] transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
