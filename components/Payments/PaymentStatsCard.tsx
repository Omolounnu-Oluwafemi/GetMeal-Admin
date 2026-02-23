"use client";

import { ArrowUpRight, ArrowDownRight } from "@/lib/icons";

interface PaymentStatCardProps {
  label: string;
  value: string | number;
  change: {
    value: number;
    isPositive: boolean;
  };
  isOrders?: boolean;
}

export default function PaymentStatCard({
  label,
  value,
  change,
  isOrders,
}: PaymentStatCardProps) {
  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#dddfe2] hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Label */}

        <div className="text-xs text-[#6B7280]">{label}</div>

        {/* Value */}
        <div className="text-[24px] font-bold text-[#111827] leading-none">
          {value}
        </div>

        {isOrders ? (
          <div className="text-xs text-[#6B7280]">{change.value} orders</div>
        ) : (
          <div className="flex items-center gap-1.5">
            {change.isPositive ? (
              <span
                className={`text-xs font-medium ${change.isPositive ? "text-[#10B981]" : "text-[#EF4444]"}`}
              >
                + {change.value}
              </span>
            ) : (
              <span
                className={`text-xs font-medium ${change.isPositive ? "text-[#10B981]" : "text-[#EF4444]"}`}
              >
                - {change.value}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
