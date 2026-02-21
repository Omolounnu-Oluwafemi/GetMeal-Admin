"use client";

import { useState } from "react";
import SettingsNav from "@/components/Settings/Settingsnav";
import ProfileSettings from "@/components/Settings/Profilesettings";
import { NotificationSettings } from "@/components/Settings/Notificationandsystemsettings";
import SystemSettings from "@/components/Settings/Systemsettings";
import TeamSettings from "@/components/Settings/Teamsettings";
import AddTeamMemberModal from "@/components/Settings/Addteammembermodal";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const handleAddMember = (member: {
    name: string;
    email: string;
    role: string;
  }) => {
    console.log("Adding member:", member);
    setShowAddMemberModal(false);
    // Add to team list
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "security":
        return <SecuritySettings />;
      case "team":
        return <TeamSettings onAddMember={() => setShowAddMemberModal(true)} />;
      case "system":
        return <SystemSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)]">
      {/* Settings Navigation */}
      <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">{renderContent()}</div>

      {/* Add Team Member Modal */}
      {showAddMemberModal && (
        <AddTeamMemberModal
          onClose={() => setShowAddMemberModal(false)}
          onAdd={handleAddMember}
        />
      )}
    </div>
  );
}

// Security Settings Component
function SecuritySettings() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Security Settings
        </h2>
        <p className="text-sm text-gray-600">
          Manage your account security and privacy
        </p>
      </div>

      <div className="space-y-6">
        {/* Change Password */}
        <div className="p-6 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">Change Password</h3>
          <p className="text-sm text-gray-600 mb-4">
            Update your password to keep your account secure
          </p>
          <button className="px-4 py-2 bg-[#219e02] text-white rounded-lg text-sm font-medium hover:bg-[#1a7d01] transition-colors">
            Change Password
          </button>
        </div>

        {/* Two-Factor Authentication */}
        <div className="p-6 bg-gray-50 rounded-xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-gray-600">
                Add an extra layer of security to your account
              </p>
            </div>
            <button className="px-4 py-2 border border-[#219e02] text-[#219e02] rounded-lg text-sm font-medium hover:bg-[#F0FDF4] transition-colors">
              Enable 2FA
            </button>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="p-6 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-4">Active Sessions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Current Session</div>
                <div className="text-sm text-gray-500">
                  Lagos, Nigeria • Chrome on Mac
                </div>
              </div>
              <span className="px-3 py-1 bg-[#F0FDF4] text-[#219e02] text-xs font-medium rounded-full">
                Active Now
              </span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl">
          <h3 className="font-semibold text-red-900 mb-2">Danger Zone</h3>
          <p className="text-sm text-red-600 mb-4">
            Irreversible actions that affect your account
          </p>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
