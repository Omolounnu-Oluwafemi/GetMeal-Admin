"use client";

import { LucideIcon } from "@/lib/icons";

interface OrderStatsCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  variant?: "default" | "success" | "danger" | "warning";
}

export default function OrderStatsCard({
  icon: Icon,
  value,
  label,
  variant = "default",
}: OrderStatsCardProps) {
  const bgColors = {
    default: "bg-[#F0FDF4]",
    success: "bg-[#F0FDF4]",
    danger: "bg-[#FEF2F2]",
    warning: "bg-[#FFF7ED]",
  };

  const iconColors = {
    default: "text-[#219e02]",
    success: "text-[#219e02]",
    danger: "text-[#EF4444]",
    warning: "text-[#F59E0B]",
  };

  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#F3F4F6]">
      <div
        className={`w-10 h-10 rounded-full ${bgColors[variant]} flex items-center justify-center mb-3`}
      >
        <Icon className={`w-5 h-5 ${iconColors[variant]}`} />
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
