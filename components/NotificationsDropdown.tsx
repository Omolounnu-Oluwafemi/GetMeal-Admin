"use client";

import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  X,
  CheckCircle,
  ShoppingBag,
  AlertTriangle,
  AlertCircle,
  ClockIcon,
} from "@/lib/icons";
import { useState } from "react";
import {
  notifications as initialNotifications,
  type NotifType,
} from "@/lib/notificationsData";
import { CheckCheck } from "lucide-react";

interface Props {
  onClose: () => void;
}

function NotifIcon({ type }: { type: NotifType }) {
  if (type === "order") {
    return (
      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
        <ShoppingBag className="w-4 h-4 text-blue-500" />
      </div>
    );
  }
  if (type === "alert") {
    return (
      <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
        <AlertTriangle className="w-4 h-4 text-orange-400" />
      </div>
    );
  }
  if (type === "system") {
    return (
      <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
        <AlertCircle className="w-4 h-4 text-[#209d01]" />
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
      <AlertCircle className="w-4 h-4 text-purple-500" />
    </div>
  );
}

export default function NotificationsDropdown({ onClose }: Props) {
  const router = useRouter();
  const [notifs, setNotifs] = useState(initialNotifications);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAsRead = (id: string) =>
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const markAllAsRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-[85px] right-6 z-50 w-[430px] bg-white rounded-2xl shadow-2xl flex flex-col max-h-[680px]">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3">
          <div>
            <h3 className="text-base font-semibold text-[#111827]">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                You have {unreadCount} unread notifications
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        <div className="border-t border-gray-100" />

        {/* Mark all as read */}
        {unreadCount > 0 && (
          <div className="px-5 pb-3 mt-4">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#209d01] hover:opacity-80 hover:underline transition-opacity"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all as read
            </button>
          </div>
        )}

        {/* Notification list */}
        <div
          className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {notifs.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`flex gap-3 px-5 py-4 border-b border-gray-50 last:border-0 cursor-pointer transition-colors ${
                !n.read ? "bg-[#f5faf3] hover:bg-[#edf7ea]" : "hover:bg-gray-50"
              }`}
            >
              <NotifIcon type={n.type} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-[#111827] leading-snug line-clamp-1">
                    {n.title}
                  </span>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-[#209d01] flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
                  {n.description}
                </p>
                <div className="flex items-center gap-1 mt-1.5">
                  <ClockIcon className="w-3 h-3 text-[#9CA3AF]" />
                  <span className="text-[11px] text-[#9CA3AF]">{n.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-3.5">
          <button
            onClick={() => {
              onClose();
              router.push("/notifications");
            }}
            className="w-full text-sm font-semibold text-[#209d01] hover:opacity-80 transition-opacity"
          >
            View All Notifications
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
