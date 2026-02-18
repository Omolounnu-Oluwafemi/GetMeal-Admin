"use client";

import { LucideIcon } from "@/lib/icons";

interface CustomerStatsCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  variant?: "default" | "danger" | "muted";
}

export default function CustomerStatsCard({
  icon: Icon,
  value,
  label,
  variant = "default",
}: CustomerStatsCardProps) {
  const bgColors = {
    default: "bg-[#F0FDF4]",
    danger: "bg-[#FEF2F2]",
    muted: "bg-[#F9FAFB]",
  };

  const iconColors = {
    default: "text-[#219e02]",
    danger: "text-[#EF4444]",
    muted: "text-gray-400",
  };

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-[0_4px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)] transition-all duration-300">
      <div
        className={`w-12 h-12 rounded-xl bg-[#f5f5f5] flex items-center justify-center mb-3.5`}
      >
        <Icon className={`w-5 h-5 ${iconColors[variant]}`} />
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-2">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
