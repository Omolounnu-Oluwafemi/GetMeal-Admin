"use client";

import { useState, useEffect } from "react";
import { X, Send, Megaphone, Users, ChevronDown, Check } from "@/lib/icons";

interface BroadcastModalProps {
  onClose: () => void;
}

type MessageType = "promotional" | "announcement" | "alert";
type Audience = "all" | "active" | "zone" | "cooks";

const messageTypes: {
  type: MessageType;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
}[] = [
  {
    type: "promotional",
    label: "Promotional",
    emoji: "🎉",
    color: "#209d01",
    bgColor: "#ecf5e9",
  },
  {
    type: "announcement",
    label: "Announcement",
    emoji: "📢",
    color: "#3B82F6",
    bgColor: "#EFF6FF",
  },
  {
    type: "alert",
    label: "Alert",
    emoji: "⚠️",
    color: "#ef4444",
    bgColor: "#fff8ed",
  },
];

const zones = [
  { id: "lekki", name: "Lekki / Ajah", customers: 3500 },
  { id: "ikoyi", name: "Ikoyi / Victoria Island", customers: 2800 },
  { id: "ikeja", name: "Ikeja / Maryland", customers: 2200 },
  { id: "yaba", name: "Yaba / Surulere", customers: 1900 },
  { id: "festac", name: "Festac / Amuwo", customers: 1500 },
  { id: "gbagada", name: "Gbagada / Bariga", customers: 1200 },
];

const audienceOptions = [
  { value: "all", label: "All Customers", count: 15000 },
  { value: "active", label: "Active Customers", count: 8500 },
  { value: "zone", label: "Specific Zone", count: 0 },
  { value: "cooks", label: "Cooks", count: 500 },
];

const exampleMessages: Record<MessageType, { title: string; message: string }> =
  {
    promotional: {
      title: "50% Off Your Next Order!",
      message:
        "Enjoy half price on all meals this weekend. Order now and save big! Limited time offer.",
    },
    announcement: {
      title: "New Menu Items Available",
      message:
        "We've added exciting new dishes to our menu. Check out our latest offerings and try something new today!",
    },
    alert: {
      title: "Service Update",
      message:
        "We're experiencing high demand in your area. Delivery times may be slightly longer than usual. Thank you for your patience!",
    },
  };

export default function BroadcastModal({ onClose }: BroadcastModalProps) {
  const [selectedType, setSelectedType] = useState<MessageType>("promotional");
  const [selectedAudience, setSelectedAudience] = useState<Audience>("all");
  const [selectedZone, setSelectedZone] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [audienceOpen, setAudienceOpen] = useState(false);
  const [zoneOpen, setZoneOpen] = useState(false);

  // Auto-fill example message when type changes
  useEffect(() => {
    const example = exampleMessages[selectedType];
    setTitle(example.title);
    setMessage(example.message);
  }, [selectedType]);

  const getEstimatedReach = () => {
    if (selectedAudience === "zone" && selectedZone) {
      const zone = zones.find((z) => z.id === selectedZone);
      return zone ? zone.customers : 0;
    }
    const option = audienceOptions.find((o) => o.value === selectedAudience);
    return option?.count || 0;
  };

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) return;

    setSending(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSending(false);
    onClose();
  };

  const selectedTypeData = messageTypes.find((t) => t.type === selectedType)!;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] w-full max-w-2xl flex flex-col max-h-[85vh]">
        {/* Header - Fixed */}
        <div className="shrink-0 p-6 border-b border-[#F3F4F6]">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#f0f4f1] flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-[#209d01]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#111827]">
                  Send Broadcast Message
                </h2>
                <p className="text-[14px] text-[#9197a4] mt-0.5">
                  Send push notifications to customers
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Message Type Selection */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Message Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {messageTypes.map((type) => (
                <button
                  key={type.type}
                  onClick={() => setSelectedType(type.type)}
                  className={`
                    p-3.5 rounded-[12px] border-2 transition-all flex justify-center align-middle gap-2
                    ${
                      selectedType === type.type
                        ? `border-[${type.color}] bg-[${type.bgColor}]`
                        : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                    }
                  `}
                  style={{
                    borderColor:
                      selectedType === type.type ? type.color : undefined,
                    backgroundColor:
                      selectedType === type.type ? type.bgColor : undefined,
                  }}
                >
                  <div className="text-sm">{type.emoji}</div>
                  <div
                    className="text-sm font-medium"
                    style={{
                      color:
                        selectedType === type.type ? type.color : "#111827",
                    }}
                  >
                    {type.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Audience Dropdown */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-3">
              Target Audience
            </label>
            <div className="relative">
              {/* Trigger */}
              <button
                type="button"
                onClick={() => setAudienceOpen((p) => !p)}
                className="w-full flex items-center justify-between px-4 py-3 border border-[#E5E7EB] rounded-[12px] text-sm bg-white hover:border-[#209d01] hover:ring-2 hover:ring-[#209d01]/20 focus:outline-none focus:ring-2 focus:ring-[#209d01]/20 focus:border-[#209d01] transition-all"
              >
                <span className="font-medium text-[#111827]">
                  {
                    audienceOptions.find((o) => o.value === selectedAudience)
                      ?.label
                  }
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${audienceOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown panel */}
              {audienceOpen && (
                <>
                  {/* Backdrop to close on outside click */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setAudienceOpen(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-[12px] shadow-lg z-20 overflow-hidden">
                    {audienceOptions.map((option) => {
                      const isSelected = selectedAudience === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setSelectedAudience(option.value as Audience);
                            if (option.value !== "zone") setSelectedZone("");
                            setAudienceOpen(false);
                          }}
                          className={`w-full flex items-center gap-4 px-4 py-1.5 text-sm transition-colors hover:bg-[#F9FAFB] ${isSelected ? "bg-[#F0FDF4]" : ""}`}
                        >
                          <span
                            className={`font-medium ${isSelected ? "text-[#209d01]" : "text-[#111827]"}`}
                          >
                            {option.label}
                          </span>
                          <div className="flex items-center gap-2">
                            {option.count > 0 && (
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${isSelected ? "bg-[#209d01]/10 text-[#209d01]" : "bg-[#F3F4F6] text-[#6B7280]"}`}
                              >
                                {option.count.toLocaleString()}
                              </span>
                            )}
                            {isSelected && (
                              <Check className="w-4 h-4 text-[#209d01]" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Zone Selection (Conditional) */}
          {selectedAudience === "zone" && (
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-3">
                Select Zone
              </label>
              <div className="relative">
                {/* Trigger */}
                <button
                  type="button"
                  onClick={() => setZoneOpen((p) => !p)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-[#E5E7EB] rounded-[12px] text-sm bg-white hover:border-[#209d01] hover:ring-2 hover:ring-[#209d01]/20 focus:outline-none focus:ring-2 focus:ring-[#209d01]/20 focus:border-[#209d01] transition-all"
                >
                  <span
                    className={
                      selectedZone
                        ? "font-medium text-[#111827]"
                        : "text-[#9CA3AF]"
                    }
                  >
                    {selectedZone
                      ? zones.find((z) => z.id === selectedZone)?.name
                      : "Choose a zone..."}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${zoneOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown panel */}
                {zoneOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setZoneOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-[12px] shadow-lg z-20 overflow-hidden">
                      {zones.map((zone) => {
                        const isSelected = selectedZone === zone.id;
                        return (
                          <button
                            key={zone.id}
                            type="button"
                            onClick={() => {
                              setSelectedZone(zone.id);
                              setZoneOpen(false);
                            }}
                            className={`w-full flex items-center gap-10 px-4 py-1.5 text-sm transition-colors hover:bg-[#F9FAFB] ${isSelected ? "bg-[#F0FDF4]" : ""}`}
                          >
                            <span
                              className={`font-medium ${isSelected ? "text-[#209d01]" : "text-[#111827]"}`}
                            >
                              {zone.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${isSelected ? "bg-[#209d01]/10 text-[#209d01]" : "bg-[#F3F4F6] text-[#6B7280]"}`}
                              >
                                {zone.customers.toLocaleString()}
                              </span>
                              {isSelected && (
                                <Check className="w-4 h-4 text-[#209d01]" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Estimated Reach */}
          <div className="flex items-center gap-3 p-4 bg-[#fafafa] rounded-[12px]">
            <div className="bg-[#209d01] p-2 rounded-full">
              <Users className="w-5 h-5 text-[#fff]" />
            </div>
            <div>
              <div className="text-xs text-[#000]">Estimated Reach</div>
              <div className="text-lg font-semibold text-[#209d01]">
                ~{getEstimatedReach().toLocaleString()}{" "}
                {selectedAudience === "cooks" ? "cooks" : "customers"}
              </div>
            </div>
          </div>

          {/* Notification Title */}
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-3 mt-[-5px]">
              Notification Title
            </label>
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
            <label className="block text-[13px] font-medium text-[#374151] mb-3">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={5}
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-[12px] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#209d01]/20 focus:border-[#209d01] transition-all resize-none"
            />
            <p className="text-xs text-[#8e9093] mt-2">
              Keep it concise and engaging. Include a clear call-to-action.
            </p>
          </div>

          {/* Live Preview */}
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-3">
              Preview
            </label>
            <div className="p-5 bg-[#F9FAFB] rounded-[12px] ">
              <div className="bg-white p-4 rounded-[12px] shadow-sm border border-[#e3e9f3]">
                <div className="flex gap-3">
                  <div className="text-[14px] h-8 px-2 rounded-lg flex items-center" style={{ backgroundColor: selectedTypeData.bgColor }}>
                    {selectedTypeData.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[#111827] text-[13px] mb-1 line-clamp-1">
                      {title || "Notification Title"}
                    </div>
                    <div className="text-[11px] text-[#6B7280] line-clamp-2">
                      {message || "Your message will appear here..."}
                    </div>
                  </div>
                  <div className="text-xs text-[#9CA3AF] ">now</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
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
            disabled={
              !title.trim() ||
              !message.trim() ||
              sending ||
              (selectedAudience === "zone" && !selectedZone)
            }
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#209d01] text-white rounded-full text-sm font-medium hover:bg-[#1a7d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Broadcast
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
