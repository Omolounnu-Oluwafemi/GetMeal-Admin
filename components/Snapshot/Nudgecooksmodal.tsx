"use client";

import { useState } from "react";
import { X, Bell, Send } from "@/lib/icons";

interface NudgeCooksModalProps {
  onClose: () => void;
}

export default function NudgeCooksModal({ onClose }: NudgeCooksModalProps) {
  const [selectedAudience, setSelectedAudience] = useState("all-online");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setSending(true);
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSending(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] w-full max-w-xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#F0FDF4] flex items-center justify-center">
                <Bell className="w-6 h-6 text-[#219e02]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Nudge Cooks Online
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Send a push notification to encourage more cooking
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
          {/* Audience Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Who should receive this nudge?
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedAudience("all-online")}
                className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                  selectedAudience === "all-online"
                    ? "border-[#219e02] bg-[#F0FDF4] text-[#219e02]"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                All Online Cooks
              </button>
              <button
                onClick={() => setSelectedAudience("idle")}
                className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                  selectedAudience === "idle"
                    ? "border-[#219e02] bg-[#F0FDF4] text-[#219e02]"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                Idle Cooks
              </button>
              <button
                onClick={() => setSelectedAudience("zone")}
                className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                  selectedAudience === "zone"
                    ? "border-[#219e02] bg-[#F0FDF4] text-[#219e02]"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                Specific Zone
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-[#F0FDF4] rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#219e02] flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Push Notification Preview
                </div>
                <div className="text-xs text-gray-500">
                  {selectedAudience === "all-online" &&
                    "Sending to all online cooks"}
                  {selectedAudience === "idle" && "Sending to idle cooks"}
                  {selectedAudience === "zone" && "Sending to specific zone"}
                </div>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Notification Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#219e02] focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Tip: Keep it short and encouraging. Mention high demand or
              earnings potential.
            </p>
          </div>
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
            onClick={handleSend}
            disabled={!message.trim() || sending}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#219e02] text-white rounded-lg text-sm font-medium hover:bg-[#1a7d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Nudge
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
