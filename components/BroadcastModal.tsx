"use client";

import { useState, useMemo } from "react";
import { X, Send, Megaphone, Users, ChevronDown, Check } from "@/lib/icons";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { useSendBroadcast } from "@/lib/hooks/broadcast";
import { useCustomers } from "@/lib/hooks/customers";
import { useCookStats, useCooks } from "@/lib/hooks/cooks";
import { mapCook } from "@/lib/mappers/cooks";

interface BroadcastModalProps {
  onClose: () => void;
}

type MessageType = "system" | "order" | "payment" | "promo" | "alert";
type Audience = "all" | "customers" | "cooks" | "specific";
// "zones" commented out — zone data not yet captured in app

const messageTypes: {
  type: MessageType;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
}[] = [
  { type: "promo",   label: "Promotional", emoji: "🎉", color: "#209d01", bgColor: "#ecf5e9" },
  { type: "system",  label: "Announcement", emoji: "📢", color: "#3B82F6", bgColor: "#EFF6FF" },
  { type: "alert",   label: "Alert",        emoji: "⚠️", color: "#ef4444", bgColor: "#fff8ed" },
  { type: "order",   label: "Order",        emoji: "🛍️", color: "#D97706", bgColor: "#FFFBEB" },
  { type: "payment", label: "Payment",      emoji: "💳", color: "#7C3AED", bgColor: "#F5F3FF" },
];

export default function BroadcastModal({ onClose }: BroadcastModalProps) {
  const [selectedType, setSelectedType] = useState<MessageType>("promo");
  const [selectedAudience, setSelectedAudience] = useState<Audience>("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audienceOpen, setAudienceOpen] = useState(false);

  // Specific users state
  const [specificTab, setSpecificTab] = useState<"customers" | "cooks">("customers");
  const [search, setSearch] = useState("");
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [selectedCookIds, setSelectedCookIds] = useState<string[]>([]);

  const { mutateAsync: sendBroadcast, isPending: sending } = useSendBroadcast();
  const { data: customersData } = useCustomers();
  const { data: cookStatsData } = useCookStats();
  const { data: cooksRaw = [] } = useCooks({});

  const audienceOptions: { value: Audience; label: string; count: number }[] = [
    { value: "all",       label: "All Users",       count: customersData?.stats.totalCustomers ?? 0 },
    { value: "customers", label: "Customers Only",  count: (customersData?.stats.totalCustomers ?? 0) - (customersData?.stats.noPurchases ?? 0) },
    { value: "cooks",     label: "Cooks",           count: cookStatsData?.activeCooks ?? 0 },
    { value: "specific",  label: "Specific Users",  count: 0 },
    // { value: "zones", label: "Specific Zone", count: 0 }, // zones not yet captured
  ];

  // Build user lists for the specific picker
  const customerList = useMemo(() =>
    (customersData?.customers ?? []).map((c) => ({
      id: c._id,
      name: c.fullName,
      sub: c.email,
    })),
    [customersData]
  );

  const cookList = useMemo(() =>
    cooksRaw.map((c) => {
      const mapped = mapCook(c);
      return { id: mapped.id, name: mapped.name, sub: mapped.email };
    }),
    [cooksRaw]
  );

  const activeList = specificTab === "customers" ? customerList : cookList;
  const filteredList = useMemo(() =>
    activeList.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.sub.toLowerCase().includes(search.toLowerCase())
    ),
    [activeList, search]
  );

  const selectedUserIds = [...selectedCustomerIds, ...selectedCookIds];
  const activeSelectedIds = specificTab === "customers" ? selectedCustomerIds : selectedCookIds;
  const setActiveSelectedIds = specificTab === "customers" ? setSelectedCustomerIds : setSelectedCookIds;

  const toggleUser = (id: string) => {
    setActiveSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const getEstimatedReach = () => {
    if (selectedAudience === "specific") return selectedUserIds.length;
    return audienceOptions.find((o) => o.value === selectedAudience)?.count || 0;
  };

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) return;
    if (selectedAudience === "specific" && selectedUserIds.length === 0) {
      toast.error("Please select at least one user.");
      return;
    }

    try {
      const res = await sendBroadcast({
        title: title.trim(),
        body: message.trim(),
        type: selectedType,
        target: selectedAudience,
        ...(selectedAudience === "specific" ? { userIds: selectedUserIds } : {}),
      });
      toast.success(`Broadcast sent to ${res.count.toLocaleString()} ${selectedAudience === "cooks" ? "cook" : "user"}${res.count !== 1 ? "s" : ""}!`);
      onClose();
    } catch {
      toast.error("Failed to send broadcast. Please try again.");
    }
  };

  const selectedTypeData = messageTypes.find((t) => t.type === selectedType)!;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="shrink-0 p-6 border-b border-[#F3F4F6]">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#f0f4f1] flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-[#209d01]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#111827]">Send Broadcast Message</h2>
                <p className="text-[14px] text-[#9197a4] mt-0.5">Send push notifications to users</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>

          {/* Message Type */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">Message Type</label>
            <div className="grid grid-cols-5 gap-2">
              {messageTypes.map((type) => (
                <button
                  key={type.type}
                  onClick={() => setSelectedType(type.type)}
                  className="p-3 rounded-[12px] border-2 transition-all flex flex-col items-center gap-1"
                  style={{
                    borderColor: selectedType === type.type ? type.color : "#E5E7EB",
                    backgroundColor: selectedType === type.type ? type.bgColor : undefined,
                  }}
                >
                  <span className="text-base">{type.emoji}</span>
                  <span className="text-xs font-medium" style={{ color: selectedType === type.type ? type.color : "#111827" }}>
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-3">Target Audience</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setAudienceOpen((p) => !p)}
                className="w-full flex items-center justify-between px-4 py-3 border border-[#E5E7EB] rounded-[12px] text-sm bg-white hover:border-[#209d01] hover:ring-2 hover:ring-[#209d01]/20 focus:outline-none focus:ring-2 focus:ring-[#209d01]/20 focus:border-[#209d01] transition-all"
              >
                <span className="font-medium text-[#111827]">
                  {audienceOptions.find((o) => o.value === selectedAudience)?.label}
                </span>
                <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${audienceOpen ? "rotate-180" : ""}`} />
              </button>

              {audienceOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setAudienceOpen(false)} />
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-[12px] shadow-lg z-20 overflow-hidden">
                    {audienceOptions.map((option) => {
                      const isSelected = selectedAudience === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setSelectedAudience(option.value);
                            setSelectedCustomerIds([]);
                            setSelectedCookIds([]);
                            setSearch("");
                            setAudienceOpen(false);
                          }}
                          className={`w-full flex items-center gap-4 px-4 py-2 text-sm transition-colors hover:bg-[#F9FAFB] ${isSelected ? "bg-[#F0FDF4]" : ""}`}
                        >
                          <span className={`font-medium ${isSelected ? "text-[#209d01]" : "text-[#111827]"}`}>
                            {option.label}
                          </span>
                          <div className="flex items-center gap-2 ml-auto">
                            {option.count > 0 && (
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isSelected ? "bg-[#209d01]/10 text-[#209d01]" : "bg-[#F3F4F6] text-[#6B7280]"}`}>
                                {option.count.toLocaleString()}
                              </span>
                            )}
                            {isSelected && <Check className="w-4 h-4 text-[#209d01]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Specific Users Picker */}
          {selectedAudience === "specific" && (
            <div className="border border-[#E5E7EB] rounded-[12px] overflow-hidden">
              {/* Tab toggle */}
              <div className="flex border-b border-[#E5E7EB]">
                {(["customers", "cooks"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => { setSpecificTab(tab); setSearch(""); }}
                    className={`flex-1 py-2.5 text-sm font-medium transition-colors ${specificTab === tab ? "bg-[#F0FDF4] text-[#209d01] border-b-2 border-[#209d01]" : "text-[#6B7280] hover:bg-gray-50"}`}
                  >
                    {tab === "customers" ? "Customers" : "Cooks"}
                    {(tab === "customers" ? selectedCustomerIds : selectedCookIds).length > 0 && (
                      <span className="ml-1.5 text-xs bg-[#209d01] text-white rounded-full px-1.5 py-0.5">
                        {(tab === "customers" ? selectedCustomerIds : selectedCookIds).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="px-3 py-2 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F9FAFB] rounded-lg">
                  <Search className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
                  <input
                    type="text"
                    placeholder={`Search ${specificTab}...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 text-sm bg-transparent text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
                  />
                </div>
              </div>

              {/* User list */}
              <div className="max-h-48 overflow-y-auto">
                {filteredList.length === 0 ? (
                  <p className="text-sm text-[#9CA3AF] text-center py-6">No {specificTab} found</p>
                ) : (
                  filteredList.map((user) => {
                    const isChecked = activeSelectedIds.includes(user.id);
                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => toggleUser(user.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#F9FAFB] transition-colors ${isChecked ? "bg-[#F0FDF4]" : ""}`}
                      >
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isChecked ? "bg-[#209d01] border-[#209d01]" : "border-gray-300"}`}>
                          {isChecked && <Check strokeWidth={3} className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-medium text-[#111827] truncate">{user.name}</p>
                          <p className="text-xs text-[#9CA3AF] truncate">{user.sub}</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {activeSelectedIds.length > 0 && (
                <div className="px-4 py-2 bg-[#F0FDF4] border-t border-[#E5E7EB] flex items-center justify-between">
                  <span className="text-xs text-[#209d01] font-medium">{activeSelectedIds.length} {specificTab === "customers" ? "customer" : "cook"}{activeSelectedIds.length !== 1 ? "s" : ""} selected</span>
                  <button type="button" onClick={() => setActiveSelectedIds([])} className="text-xs text-[#6B7280] hover:text-red-500 transition-colors">Clear all</button>
                </div>
              )}
            </div>
          )}

          {/* Estimated Reach */}
          <div className="flex items-center gap-3 p-4 bg-[#fafafa] rounded-[12px]">
            <div className="bg-[#209d01] p-2 rounded-full">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-[#000]">Estimated Reach</div>
              <div className="text-lg font-semibold text-[#209d01]">
                ~{getEstimatedReach().toLocaleString()}{" "}
                {selectedAudience === "cooks" ? "cooks" : "users"}
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-3 mt-[-5px]">Notification Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title..."
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-[12px] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#209d01]/20 focus:border-[#209d01] transition-all"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-3">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-[12px] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#209d01]/20 focus:border-[#209d01] transition-all resize-none"
            />
            <p className="text-xs text-[#8e9093] mt-2">Keep it concise and engaging. Include a clear call-to-action.</p>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-3">Preview</label>
            <div className="p-5 bg-[#F9FAFB] rounded-[12px]">
              <div className="bg-white p-4 rounded-[12px] shadow-sm border border-[#e3e9f3]">
                <div className="flex gap-3">
                  <div className="text-[14px] h-8 px-2 rounded-lg flex items-center" style={{ backgroundColor: selectedTypeData.bgColor }}>
                    {selectedTypeData.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[#111827] text-[13px] mb-1 line-clamp-1">{title || "Notification Title"}</div>
                    <div className="text-[11px] text-[#6B7280] line-clamp-2">{message || "Your message will appear here..."}</div>
                  </div>
                  <div className="text-xs text-[#9CA3AF]">now</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center gap-3 px-6 py-6 border-t border-[#F3F4F6] bg-white rounded-b-[20px]">
          <button
            onClick={onClose}
            disabled={sending}
            className="flex-1 py-3 border border-[#E5E7EB] rounded-full text-sm font-medium text-[#6B7280] hover:bg-[#F9FAFB] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!title.trim() || !message.trim() || sending || (selectedAudience === "specific" && selectedUserIds.length === 0)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#209d01] text-white rounded-full text-sm font-medium hover:bg-[#1a7d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
            ) : (
              <><Send className="w-4 h-4" />Send Broadcast</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
