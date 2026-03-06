"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "@/lib/icons";

const STATUS_OPTIONS = [
  "All Status",
  "New",
  "Cooking",
  "Ready",
  "Completed",
  "Cancelled",
  "Refunded",
];

const AREA_OPTIONS = [
  "All Areas",
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Ibadan",
];

const SORT_OPTIONS = [
  "Newest First",
  "Oldest First",
  "Amount (High to Low)",
  "Amount (Low to High)",
];

function HeaderDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1 px-3 py-2 border border-[#E5E7EB] rounded-full text-sm text-[#6B7280] hover:border-[#209d01] transition-colors min-w-[130px] justify-between"
      >
        <span className="truncate">{value}</span>
        <ChevronDown className="w-4 h-4 flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 z-50 bg-white rounded-2xl shadow-lg border border-[#E5E7EB] py-2 min-w-[180px]">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="w-full flex items-center text-sm text-[#111827] transition-colors"
            >
              <span className="w-full mx-1 flex justify-between hover:bg-[#f0f1f2] rounded-lg px-2 py-1.5">
                {option}
                {value === option && (
                  <Check className="w-5 h-5 text-[#209d01]" />
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersHeaderFilters() {
  const [status, setStatus] = useState("All Status");
  const [area, setArea] = useState("All Areas");
  const [sort, setSort] = useState("Newest First");

  return (
    <div className="flex items-center gap-2">
      <HeaderDropdown value={status} options={STATUS_OPTIONS} onChange={setStatus} />
      <HeaderDropdown value={area} options={AREA_OPTIONS} onChange={setArea} />
      <HeaderDropdown value={sort} options={SORT_OPTIONS} onChange={setSort} />
    </div>
  );
}
