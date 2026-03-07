"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  UserPlus,
  Check,
  ChevronDown,
  Mail,
  AlertCircle,
} from "@/lib/icons";

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
  const [roleOpen, setRoleOpen] = useState(false);
  const [toast, setToast] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node))
        setRoleOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const currentRole = roles.find((r) => r.value === selectedRole)!;

  const handleSubmit = async () => {
    if (!name.trim()) {
      setToast({
        type: "error",
        message: "Please enter the member's full name",
      });
      return;
    }
    if (!email.trim()) {
      setToast({
        type: "error",
        message: "Please enter the member's email address",
      });
      return;
    }
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onAdd({ name, email, role: selectedRole });
    setToast({ type: "success", message: "Invitation sent successfully!" });
    setSending(false);
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] w-full max-w-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] flex items-center justify-center flex-shrink-0">
                <UserPlus className="w-6 h-6 text-[#219e02]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
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
        <div className="p-6 space-y-5 overflow-y-auto flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Adaobi Nwosu"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#219e02]"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adaobi@getameal.com"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#219e02]"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              Invitation will be sent to this email address
            </p>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Role
            </label>
            <div ref={roleRef} className="relative">
              <button
                type="button"
                onClick={() => setRoleOpen((p) => !p)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#219e02]"
              >
                <span>{currentRole.label}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
              {roleOpen && (
                <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-full bg-white rounded-xl shadow-lg border border-gray-100 py-1">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => {
                        setSelectedRole(role.value);
                        setRoleOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      <span>{role.label}</span>
                      {selectedRole === role.value && (
                        <Check className="w-4 h-4 text-[#219e02]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              {currentRole.description}
            </p>
          </div>

          {/* Permissions */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <div className="text-sm font-medium text-gray-900 mb-3">
              This role will have access to:
            </div>
            <ul className="space-y-2">
              {currentRole.permissions.map((permission, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#219e02] flex-shrink-0" />
                  {permission}
                </li>
              ))}
            </ul>
          </div>

          {/* Send Invitation Checkbox */}
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
            <div>
              <div className="text-sm font-medium text-gray-900">
                Send invitation email
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                Member will receive an email with setup instructions
              </div>
            </div>
            <label className="cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={sendInvitation}
                onChange={(e) => setSendInvitation(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-[18px] h-[18px] rounded-md border-2 border-gray-300 flex items-center justify-center transition-all duration-200 peer-checked:bg-[#219e02] peer-checked:border-[#219e02]">
                <Check strokeWidth={3} width={12} color="#fff" />
              </div>
            </label>
          </div>

          {/* About Invitations */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-blue-900">
                About invitations
              </div>
              <p className="text-xs text-blue-600 mt-0.5">
                The invited member will receive an email with a secure link to
                set up their account. The link expires in 7 days.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={sending}
            className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={sending}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#219e02] text-white rounded-xl text-sm font-medium hover:bg-[#1a7d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-lg border ${toast.type === "error" ? "border-red-100" : "border-green-100"} z-50 min-w-[280px]`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
          ) : (
            <Check className="w-5 h-5 text-[#219e02] flex-shrink-0" />
          )}
          <span className="text-sm text-gray-800">{toast.message}</span>
        </div>
      )}
    </div>,
    document.body
  );
}
