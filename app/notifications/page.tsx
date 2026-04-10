"use client";

import { useState, useEffect } from "react";
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
import { useNotifications, type Notification, type NotifType } from "@/lib/hooks/notifications";
import { Check, CheckCheck } from "lucide-react";

function NotifIcon({ type }: { type: NotifType }) {
  if (type === "order") {
    return (
      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
        <ShoppingBag className="w-4 h-4 text-blue-500" />
      </div>
    );
  }
  if (type === "alert") {
    return (
      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
        <AlertTriangle className="w-4 h-4 text-orange-400" />
      </div>
    );
  }
  if (type === "system") {
    return (
      <div className="w-10 h-10 rounded-lg bg-[#dbf4d5ca] flex items-center justify-center flex-shrink-0">
        <AlertCircle className="w-4 h-4 text-[#209d01ca]" />
      </div>
    );
  }
  if (type === "customer") {
    return (
      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
        <CheckCircle className="w-4 h-4 text-blue-500" />
      </div>
    );
  }
  if (type === "cook") {
    return (
      <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
        <AlertCircle className="w-4 h-4 text-amber-500" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-md bg-purple-50 flex items-center justify-center flex-shrink-0">
      <AlertCircle className="w-4 h-4 text-purple-500" />
    </div>
  );
}

type Tab = "all" | "unread" | "read";
type TypeFilter = "all" | "order" | "alert" | "system" | "payment" | "customer" | "cook";
type TimeFilter = "all" | "today" | "7days" | "30days";

const typeOptions: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "order", label: "Orders" },
  { value: "alert", label: "Alerts" },
  { value: "system", label: "System" },
  { value: "payment", label: "Payment" },
  { value: "customer", label: "Customer" },
  { value: "cook", label: "Cook" },
];

const timeOptions: { value: TimeFilter; label: string }[] = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [typeOpen, setTypeOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const { data: fetchedNotifs = [], isLoading } = useNotifications();
  const [notifs, setNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifs(fetchedNotifs);
  }, [fetchedNotifs]);

  const total = notifs.length;
  const unreadCount = notifs.filter((n) => !n.read).length;
  const today = new Date().toDateString();
  const todayCount = notifs.filter((n) => new Date(n.createdAt).toDateString() === today).length;

  const filtered = notifs.filter((n) => {
    const matchesTab =
      tab === "all" ||
      (tab === "unread" && !n.read) ||
      (tab === "read" && n.read);
    const matchesSearch =
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || n.type === typeFilter;
    return matchesTab && matchesSearch && matchesType;
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
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleView = (n: Notification) => {
    markAsRead(n.id);
    if (n.linkedUserId) router.push(`/customers?openProfile=${n.linkedUserId}`);
    else if (n.linkedCookId) router.push(`/cooks?openProfile=${n.linkedCookId}`);
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all", label: "All", count: total },
    { key: "unread", label: "Unread", count: unreadCount },
    { key: "read", label: "Read", count: total - unreadCount },
  ];

  return (
    <div className="min-h-screen bg-[#fff] p-8 shadow-lg">
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
          <div className="w-12 h-12 rounded-lg bg-[#f3f4f6] flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-[#6B7280]" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-gray-100">
          <div>
            <p className="text-xs text-[#6B7280] mb-1">Unread</p>
            <p className="text-3xl font-bold text-[#209d01]">{unreadCount}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[#ddf5e5a1] flex items-center justify-center">
            <CheckCheck className="w-6 h-6 text-[#209d01]" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-gray-100">
          <div>
            <p className="text-xs text-[#6B7280] mb-1">Today</p>
            <p className="text-3xl font-bold text-[#111827]">{todayCount}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <ClockIcon className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Main list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-5">
        {/* Search + Filters */}
        <div className="flex items-center justify-between mb-4 gap-4">
          <div className="relative w-[410px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#616367]" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#f3f3f5] border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder:text-[#616367] focus:outline-none focus:ring-2 focus:ring-[#209d01]/20 focus:border-[#209d01] transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            {/* All Types dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setTypeOpen((p) => !p);
                  setTimeOpen(false);
                }}
                className="w-[160px] flex items-center justify-between px-4 py-2 bg-[#f3f3f5] rounded-xl text-sm text-[#374151] transition-colors"
              >
                <Filter className="w-4 h-4 text-[#6B7280]" />
                <span>
                  {typeOptions.find((o) => o.value === typeFilter)?.label}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${typeOpen ? "rotate-180" : ""}`}
                />
              </button>
              {typeOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setTypeOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-[160px] bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-20 overflow-hidden">
                    {typeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setTypeFilter(opt.value);
                          setTypeOpen(false);
                        }}
                        className="w-full flex items-center gap-4 px-4 py-1.5 text-sm text-[#111827] hover:bg-[#F9FAFB] transition-colors"
                      >
                        <span>{opt.label}</span>
                        {typeFilter === opt.value && (
                          <Check className="w-6 h-6 text-[#209d01]" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* All Time dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setTimeOpen((p) => !p);
                  setTypeOpen(false);
                }}
                className="w-[160px] flex items-center justify-between px-4 py-2 bg-[#f3f3f5] rounded-xl text-sm text-[#374151] transition-colors"
              >
                <ClockIcon className="w-4 h-4 text-[#6B7280]" />
                <span>
                  {timeOptions.find((o) => o.value === timeFilter)?.label}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${timeOpen ? "rotate-180" : ""}`}
                />
              </button>
              {timeOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setTimeOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-[160px] bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-20 overflow-hidden">
                    {timeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setTimeFilter(opt.value);
                          setTimeOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-1.5 text-sm text-[#111827] hover:bg-[#F9FAFB] transition-colors"
                      >
                        <span>{opt.label}</span>
                        {timeFilter === opt.value && (
                          <Check className="w-6 h-6 text-[#209d01]" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
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
        {/* Select all row */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
          <label
            className="flex items-center cursor-pointer flex-shrink-0"
            onClick={toggleSelectAll}
          >
            <div
              className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${allSelected ? "bg-[#209d01] border-[#209d01]" : "border-gray-300 bg-white"}`}
            >
              {allSelected && <Check className="w-3 h-3 text-white" />}
            </div>
          </label>
          <span className="text-sm text-[#6B7280]">
            Select all {filtered.length} notifications
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4 px-5 py-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
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
              <label
                className="flex items-center cursor-pointer flex-shrink-0 mt-1"
                onClick={() => toggleSelect(n.id)}
              >
                <div
                  className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${selected.has(n.id) ? "bg-[#209d01] border-[#209d01]" : "border-gray-300 bg-white"}`}
                >
                  {selected.has(n.id) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </label>

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

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                {!n.read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="text-sm text-[#6B7280] hover:text-[#111827] transition-colors whitespace-nowrap"
                  >
                    Mark as read
                  </button>
                )}
                {(n.linkedUserId || n.linkedCookId) && (
                  <button
                    onClick={() => handleView(n)}
                    className="text-sm font-medium text-[#209d01] hover:underline whitespace-nowrap"
                  >
                    View {n.linkedUserId ? "Customer" : "Cook"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
