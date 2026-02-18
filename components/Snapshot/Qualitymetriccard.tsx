"use client";

import { Star, TrendingUp, TrendingDown } from "@/lib/icons";

interface QualityMetricCardProps {
  label: string;
  value: string | number;
  showStar?: boolean;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  subtitle?: string;
}

export default function QualityMetricCard({
  label,
  value,
  showStar = false,
  trend,
  subtitle,
}: QualityMetricCardProps) {
  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#F3F4F6]">
      <div className="text-xs font-medium text-gray-500 uppercase mb-4">
        {label}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="text-4xl font-bold text-gray-900">{value}</div>
        {showStar && <Star className="w-7 h-7 fill-[#F59E0B] text-[#F59E0B]" />}
      </div>

      {subtitle && <div className="text-sm text-gray-600 mb-3">{subtitle}</div>}

      {trend && (
        <div className="flex items-center gap-1.5">
          {trend.isPositive ? (
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
          ) : (
            <TrendingDown className="w-4 h-4 text-[#EF4444]" />
          )}
          <span
            className={`text-sm font-medium ${trend.isPositive ? "text-[#10B981]" : "text-[#EF4444]"}`}
          >
            {trend.value}
          </span>
          <span className="text-sm text-gray-600">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
