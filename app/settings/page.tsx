"use client";

import { useState } from "react";
import { Lock as LockIcon, Eye, Key, Globe, LogOut } from "@/lib/icons";
import { useChangePassword } from "@/lib/hooks/profile";
import { toast } from "sonner";
import SettingsNav from "@/components/Settings/Settingsnav";
import ProfileSettings from "@/components/Settings/Profilesettings";
import { NotificationSettings } from "@/components/Settings/Notificationandsystemsettings";
import SystemSettings from "@/components/Settings/Systemsettings";
import TeamSettings from "@/components/Settings/Teamsettings";
import AddTeamMemberModal from "@/components/Settings/Addteammembermodal";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const handleAddMember = () => {
    setShowAddMemberModal(false);
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
    <div className="flex p-4 gap-2">
      {/* Settings Navigation */}
      <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content Area */}
      <div
        className={`flex-1 ml-4 ${activeTab === "security" || activeTab === "system" ? "" : "p-6 bg-white rounded-2xl shadow-md"}`}
      >
        {renderContent()}
      </div>

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
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate: changePassword, isPending } = useChangePassword();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!passwords.current) e.current = "Current password is required";
    if (!passwords.newPass) e.newPass = "New password is required";
    else if (passwords.newPass.length < 8)
      e.newPass = "Must be at least 8 characters";
    if (!passwords.confirm) e.confirm = "Please confirm your new password";
    else if (passwords.newPass !== passwords.confirm)
      e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    changePassword(
      {
        oldPassword: passwords.current,
        newPassword: passwords.newPass,
        confirmPassword: passwords.confirm,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message ?? "Password updated successfully");
          setPasswords({ current: "", newPass: "", confirm: "" });
          setErrors({});
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ?? "Failed to update password";
          toast.error(msg);
        },
      },
    );
  };

  const handleCancel = () => {
    setPasswords({ current: "", newPass: "", confirm: "" });
    setErrors({});
  };

  return (
    <div className="w-full space-y-6">
      {/* Change Password Card */}
      <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Change Password
          </h2>
          <p className="text-sm text-gray-500">
            Update your password to keep your account secure
          </p>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-[13px] font-medium text-gray-900 mb-[6px]">
              Current Password
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showCurrent ? "text" : "password"}
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
                placeholder="Enter current password"
                className={`w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#219e02] ${errors.current ? "ring-2 ring-red-400" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            {errors.current && (
              <p className="text-[11px] text-red-500 mt-1">{errors.current}</p>
            )}
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-900 mb-[6px]">
              New Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showNew ? "text" : "password"}
                value={passwords.newPass}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPass: e.target.value })
                }
                placeholder="Enter new password"
                className={`w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#219e02] ${errors.newPass ? "ring-2 ring-red-400" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            {errors.newPass ? (
              <p className="text-[11px] text-red-500 mt-1">{errors.newPass}</p>
            ) : (
              <p className="text-[11px] text-gray-400 mt-1.5">
                Must be at least 8 characters with letters and numbers
              </p>
            )}
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-900 mb-[6px]">
              Confirm New Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showConfirm ? "text" : "password"}
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
                }
                placeholder="Confirm new password"
                className={`w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#219e02] ${errors.confirm ? "ring-2 ring-red-400" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            {errors.confirm && (
              <p className="text-[11px] text-red-500 mt-1">{errors.confirm}</p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex items-center gap-3 px-4 py-2.5 bg-[#219e02] text-white rounded-xl text-sm font-medium hover:bg-[#1a7d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      {/* <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Add an extra layer of security to your account
            </p>
          </div>
          <span className="px-3 py-1 bg-orange-50 text-orange-500 text-xs font-medium rounded-full">
            Not Enabled
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Two-factor authentication adds an additional layer of security to your
          account by requiring more than just a password to sign in.
        </p>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#219e02] text-white rounded-xl text-sm font-medium hover:bg-[#1a7d01] transition-colors">
          <Shield className="w-4 h-4" />
          Enable 2FA
        </button>
      </div> */}

      {/* Active Sessions */}
      <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">
          Active Sessions
        </h3>
        <p className="text-sm text-gray-500 mt-0.5 mb-5">
          Manage your active sessions across devices
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F0FDF4] rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-[#219e02]" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Chrome on MacOS
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Lagos, Nigeria • Current session
                </div>
              </div>
            </div>
            <span className="px-3 py-1 bg-[#F0FDF4] text-[#219e02] text-xs font-medium rounded-lg">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Safari on iPhone
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Lagos, Nigeria • Last active 2 hours ago
                </div>
              </div>
            </div>
            <button className="px-3 py-1 border border-red-400 text-red-500 text-xs font-medium rounded-lg hover:bg-red-50 transition-colors">
              Revoke
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
