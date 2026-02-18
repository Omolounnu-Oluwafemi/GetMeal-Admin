"use client";

import { LucideIcon } from "@/lib/icons";

interface CookStatsCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  variant?: "default" | "danger" | "muted";
}

export default function CookStatsCard({
  icon: Icon,
  value,
  label,
  variant = "default",
}: CookStatsCardProps) {
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
    <div
      className="bg-white rounded-[30px] p-6  shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all duration-300
"
    >
      <div
        className={`w-10 h-10 rounded-full ${bgColors[variant]} flex items-center justify-center mb-3 `}
      >
        <Icon className={`w-5 h-5 ${iconColors[variant]}`} />
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
