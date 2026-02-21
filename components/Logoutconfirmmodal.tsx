"use client";

import { LogOut, X } from "@/lib/icons";

interface LogoutConfirmModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmModal({
  onClose,
  onConfirm,
}: LogoutConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Confirm Logout
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Are you sure you want to log out?
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
        <div className="p-6">
          <p className="text-sm text-gray-600">
            You will be securely logged out of the Getameal Admin Dashboard. All
            your session data will be cleared.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
