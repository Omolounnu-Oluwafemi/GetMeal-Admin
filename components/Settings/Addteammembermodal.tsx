"use client";

import { useState } from "react";
import { X, UserPlus, Check } from "@/lib/icons";

interface AddTeamMemberModalProps {
  onClose: () => void;
  onAdd: (member: { name: string; email: string; role: string }) => void;
}

const roles = [
  {
    value: "operations-agent",
    label: "Operations Agent",
    description: "Handle day-to-day operations",
    permissions: [
      "View and manage orders",
      "View cook and customer profiles",
      "Send messages and notifications",
    ],
  },
  {
    value: "operations-manager",
    label: "Operations Manager",
    description: "Full operational control",
    permissions: [
      "All Operations Agent permissions",
      "Manage team members",
      "Access financial data",
      "Configure system settings",
    ],
  },
  {
    value: "admin",
    label: "Admin",
    description: "Complete system access",
    permissions: [
      "All system permissions",
      "Manage all users and roles",
      "Access sensitive data",
    ],
  },
];

export default function AddTeamMemberModal({
  onClose,
  onAdd,
}: AddTeamMemberModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("operations-agent");
  const [sendInvitation, setSendInvitation] = useState(true);
  const [sending, setSending] = useState(false);

  const currentRole = roles.find((r) => r.value === selectedRole);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) return;

    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onAdd({ name, email, role: selectedRole });
    setSending(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#F0FDF4] flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-[#219e02]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Add Team Member
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Invite a new member to your team
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Adaobi Nwosu"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#219e02] focus:border-transparent"
              />
              <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adaobi@getameal.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#219e02] focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              Invitation will be sent to this email address
            </p>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#219e02] focus:border-transparent"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1.5">
              {currentRole?.description}
            </p>
          </div>

          {/* Permissions */}
          {currentRole && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-900 mb-3">
                This role will have access to:
              </div>
              <ul className="space-y-2">
                {currentRole.permissions.map((permission, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#219e02] mt-1.5 flex-shrink-0" />
                    {permission}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Send Invitation Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={sendInvitation}
                onChange={(e) => setSendInvitation(e.target.checked)}
                className="w-5 h-5 text-[#219e02] focus:ring-[#219e02] border-gray-300 rounded"
              />
              {sendInvitation && (
                <Check className="absolute w-4 h-4 text-white pointer-events-none" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                Send invitation email
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                New team will receive an email with setup instructions
              </div>
            </div>
          </label>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={sending}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !email.trim() || sending}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#219e02] text-white rounded-lg text-sm font-medium hover:bg-[#1a7d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Send Invitation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
