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
import { useNotifications, type NotifType, type Notification } from "@/lib/hooks/notifications";
import { CheckCheck } from "lucide-react";
import { motion } from "framer-motion";

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
  if (type === "customer") {
    return (
      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
        <CheckCircle className="w-4 h-4 text-blue-500" />
      </div>
    );
  }
  if (type === "cook") {
    return (
      <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
        <AlertCircle className="w-4 h-4 text-amber-500" />
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
  const { data: fetchedNotifs = [], isLoading } = useNotifications();
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const notifs: Notification[] = fetchedNotifs.map((n) =>
    readIds.has(n.id) ? { ...n, read: true } : n,
  );
  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAsRead = (id: string) =>
    setReadIds((prev) => new Set([...prev, id]));

  const handleView = (n: Notification) => {
    markAsRead(n.id);
    onClose();
    if (n.linkedUserId) router.push(`/customers?openProfile=${n.linkedUserId}`);
    else if (n.linkedCookId) router.push(`/cooks?openProfile=${n.linkedCookId}`);
  };

  const markAllAsRead = () =>
    setReadIds(new Set(fetchedNotifs.map((n) => n.id)));

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Panel */}
      <motion.div
        className="fixed top-[70px] sm:top-[85px] right-2 sm:right-6 z-50 w-[calc(100vw-1rem)] sm:w-[430px] bg-white rounded-2xl shadow-2xl flex flex-col max-h-[80vh] sm:max-h-[680px]"
        initial={{ opacity: 0, y: -10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
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
          {isLoading ? (
            <div className="flex flex-col gap-3 px-5 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-9 h-9 rounded-xl bg-gray-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-2 bg-gray-100 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifs.length === 0 ? (
            <div className="py-10 text-center text-sm text-[#9CA3AF]">No notifications</div>
          ) : (
            notifs.map((n) => (
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
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-3 h-3 text-[#9CA3AF]" />
                      <span className="text-[11px] text-[#9CA3AF]">{n.time}</span>
                    </div>
                    {(n.linkedUserId || n.linkedCookId) && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleView(n); }}
                        className="text-[11px] font-medium text-[#209d01] hover:underline"
                      >
                        View {n.linkedUserId ? "Customer" : "Cook"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
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
      </motion.div>
    </>,
    document.body,
  );
}
