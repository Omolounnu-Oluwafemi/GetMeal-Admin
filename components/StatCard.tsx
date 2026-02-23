"use client";

import { ArrowUpRight, ArrowDownRight } from "@/lib/icons";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
    comparedTo?: string;
  };
  subtitle?: string;
}

export default function StatCard({
  label,
  value,
  trend,
  subtitle,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-[20px] p-4 border border-[#dddfe2] hover:shadow-md transition-shadow">
      <div className="space-y-2">
        {/* Label */}
        <div className="text-sm text-[#6B7280]">{label}</div>

        {/* Value */}
        <div className="text-[24px] font-bold text-[#111827] leading-none">
          {value}
        </div>

        {/* Subtitle if present */}
        {subtitle && <div className="text-xs text-[#6B7280]">{subtitle}</div>}

        {/* Trend Indicator */}
        {trend && (
          <div className="flex items-center gap-1.5">
            {trend.isPositive ? (
              <ArrowUpRight className="w-4 h-4 text-[#10B981]" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-[#EF4444]" />
            )}
            <span
              className={`text-sm font-medium ${trend.isPositive ? "text-[#10B981]" : "text-[#EF4444]"}`}
            >
              {trend.value}%
            </span>
            <span className="text-sm text-[#6B7280]">
              {trend.comparedTo || "vs yesterday"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
