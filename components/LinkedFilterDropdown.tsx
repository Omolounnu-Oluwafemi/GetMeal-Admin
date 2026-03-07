"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "@/lib/icons";

const SECONDARY_OPTIONS: Record<string, string[]> = {
  Zone: ["All Zones", "Lagos", "Abuja", "Port Harcourt", "Ibadan"],
  Date: ["Today", "Yesterday", "Last 7 Days", "Custom Range"],
  Status: [], // filled from prop
};

interface LinkedFilterDropdownProps {
  statusOptions?: string[];
}

function MiniDropdown({
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
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1 px-3 py-2 border border-[#E5E7EB] rounded-full text-sm text-[#6B7280] hover:border-[#209d01] transition-colors min-w-[120px] justify-between"
      >
        <span>{value}</span>
        <ChevronDown className="w-4 h-4 flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 z-50 bg-white rounded-2xl shadow-lg border border-[#E5E7EB] py-2 min-w-[160px]">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between text-sm text-[#111827] transition-colors"
            >
              <span className="w-full mx-1 flex gap-3 hover:bg-[#f0f1f2] rounded-lg px-2 py-1.5">
                {option}
                {value === option && <Check className="w-5 h-5 text-[#209d01]" />}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LinkedFilterDropdown({
  statusOptions = ["Active", "Suspended"],
}: LinkedFilterDropdownProps) {
  const [filterType, setFilterType] = useState("Zone");
  const [typeOpen, setTypeOpen] = useState(false);
  const typeRef = useRef<HTMLDivElement>(null);

  const secondaryMap: Record<string, string[]> = { ...SECONDARY_OPTIONS, Status: statusOptions };
  const secondaryOpts = secondaryMap[filterType] ?? [];
  const [secondaryValue, setSecondaryValue] = useState(secondaryOpts[0] ?? "");

  const handleTypeChange = (type: string) => {
    setFilterType(type);
    setTypeOpen(false);
    const opts = secondaryMap[type] ?? [];
    setSecondaryValue(opts[0] ?? "");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(e.target as Node))
        setTypeOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-2">
      {/* Filter type selector */}
      <div ref={typeRef} className="relative">
        <button
          onClick={() => setTypeOpen((p) => !p)}
          className="flex items-center gap-1 px-3 py-2 border border-[#E5E7EB] rounded-full text-sm text-[#6B7280] hover:border-[#209d01] transition-colors min-w-[100px] justify-between"
        >
          <span>{filterType}</span>
          <ChevronDown className="w-4 h-4 flex-shrink-0" />
        </button>

        {typeOpen && (
          <div className="absolute top-[calc(100%+6px)] left-0 z-50 bg-white rounded-2xl shadow-lg border border-[#E5E7EB] py-2 min-w-[140px]">
            {["Zone", "Date", "Status"].map((option) => (
              <button
                key={option}
                onClick={() => handleTypeChange(option)}
                className="w-full flex items-center text-sm text-[#111827] transition-colors"
              >
                <span className="w-full mx-1 flex justify-between hover:bg-[#f0f1f2] rounded-lg px-2 py-1.5">
                  {option}
                  {filterType === option && (
                    <Check className="w-5 h-5 text-[#209d01]" />
                  )}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Secondary contextual dropdown */}
      <MiniDropdown
        value={secondaryValue}
        options={secondaryOpts}
        onChange={setSecondaryValue}
      />
    </div>
  );
}
