"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  ShoppingBag,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  ClockIcon,
  ChevronDown,
  Filter,
} from "@/lib/icons";
import { notifications as allNotifications, type Notification, type NotifType } from "@/lib/notificationsData";

function NotifIcon({ type }: { type: NotifType }) {
  if (type === "order") {
    return (
      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
        <ShoppingBag className="w-4 h-4 text-blue-500" />
      </div>
    );
  }
  if (type === "alert") {
    return (
      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
        <AlertTriangle className="w-4 h-4 text-orange-400" />
      </div>
    );
  }
  if (type === "system") {
    return (
      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
        <AlertCircle className="w-4 h-4 text-[#209d01]" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
      <AlertCircle className="w-4 h-4 text-purple-500" />
    </div>
  );
}

type Tab = "all" | "unread" | "read";

export default function NotificationsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [notifs, setNotifs] = useState<Notification[]>(allNotifications);

  const total = notifs.length;
  const unreadCount = notifs.filter((n) => !n.read).length;
  const todayCount = notifs.length; // all are "today" in mock data

  const filtered = notifs.filter((n) => {
    const matchesTab =
      tab === "all" ||
      (tab === "unread" && !n.read) ||
      (tab === "read" && n.read);
    const matchesSearch =
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const allSelected =
    filtered.length > 0 && filtered.every((n) => selected.has(n.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((n) => next.delete(n.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((n) => next.add(n.id));
        return next;
      });
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const markAsRead = (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all", label: "All", count: total },
    { key: "unread", label: "Unread", count: unreadCount },
    { key: "read", label: "Read", count: total - unreadCount },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-8">
      {/* Back + Title */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111827] mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="mb-7">
        <h1 className="text-2xl font-bold text-[#111827]">Notifications</h1>
        <p className="text-sm text-[#6B7280] mt-0.5">
          Stay updated on orders, alerts, and system activities
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-gray-100">
          <div>
            <p className="text-xs text-[#6B7280] mb-1">Total Notifications</p>
            <p className="text-3xl font-bold text-[#111827]">{total}</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-[#6B7280]" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-gray-100">
          <div>
            <p className="text-xs text-[#6B7280] mb-1">Unread</p>
            <p className="text-3xl font-bold text-[#209d01]">{unreadCount}</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-[#209d01]/30 bg-[#F0FDF4] flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-[#209d01]" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-gray-100">
          <div>
            <p className="text-xs text-[#6B7280] mb-1">Today</p>
            <p className="text-3xl font-bold text-[#111827]">{todayCount}</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-blue-200 bg-blue-50 flex items-center justify-center">
            <ClockIcon className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="relative w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#209d01]/20 focus:border-[#209d01] transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#374151] hover:border-[#D1D5DB] transition-colors">
            <Filter className="w-4 h-4 text-[#6B7280]" />
            All Types
            <ChevronDown className="w-4 h-4 text-[#6B7280]" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#374151] hover:border-[#D1D5DB] transition-colors">
            <ClockIcon className="w-4 h-4 text-[#6B7280]" />
            All Time
            <ChevronDown className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-[#209d01] text-white"
                : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#D1D5DB]"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Main list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Select all row */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            className="w-4 h-4 rounded accent-[#209d01] cursor-pointer"
          />
          <span className="text-sm text-[#6B7280]">
            Select all {filtered.length} notifications
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#9CA3AF]">
            No notifications found
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-4 px-5 py-5 border-b border-gray-100 last:border-0 transition-colors ${
                !n.read ? "bg-[#F0FDF4]/60" : "bg-white"
              }`}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selected.has(n.id)}
                onChange={() => toggleSelect(n.id)}
                className="mt-1 w-4 h-4 rounded accent-[#209d01] cursor-pointer flex-shrink-0"
              />

              {/* Icon */}
              <NotifIcon type={n.type} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-[#111827]">
                    {n.title}
                  </span>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-[#209d01] flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {n.description}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ClockIcon className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  <span className="text-xs text-[#9CA3AF]">{n.time}</span>
                </div>
              </div>

              {/* Mark as read */}
              {!n.read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="flex-shrink-0 text-sm text-[#6B7280] hover:text-[#111827] transition-colors whitespace-nowrap"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
