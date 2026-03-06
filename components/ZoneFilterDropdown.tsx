"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "@/lib/icons";

const ZONES = ["Lagos", "Abuja", "Port Harcourt", "Ibadan"];

export default function ZoneFilterDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const allSelected = selected.length === 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleZone(zone: string) {
    setSelected((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone],
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between gap-2 px-3 py-2 border border-[#E5E7EB] rounded-full text-sm text-[#6B7280] hover:border-[#209d01] transition-colors min-w-[160px]"
      >
        <div className="flex items-center gap-2">
          <span>{allSelected ? "All Zones" : "Zones"}</span>
          {!allSelected && (
            <span className="w-[24px] h-[23px] rounded-full bg-[#209d01] text-white text-xs font-semibold flex items-center justify-center">
              {selected.length}
            </span>
          )}
        </div>
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 z-50 px-1 bg-white rounded-md shadow-lg border border-[#E5E7EB] py-1 min-w-[180px]">
          {/* All Zones option */}
          <button
            onClick={() => setSelected([])}
            className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[#111827] hover:bg-[#f1f3f5] transition-colors"
          >
            <span
              className={`w-4 h-4 rounded flex items-center justify-center border ${
                allSelected
                  ? "bg-[#209d01] border-[#209d01]"
                  : "border-[#D1D5DB] bg-[#f5f7fa]"
              }`}
            >
              {allSelected && (
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            All Zones
          </button>

          {ZONES.map((zone) => {
            const checked = selected.includes(zone);
            return (
              <button
                key={zone}
                onClick={() => toggleZone(zone)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[#111827] hover:bg-[#f1f3f5] transition-colors"
              >
                <span
                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                    checked
                      ? "bg-[#209d01] border-[#209d01]"
                      : "border-[#D1D5DB] bg-[#f5f7fa]"
                  }`}
                >
                  {checked && (
                    <svg
                      className="w-4 h-4 text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                {zone}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
