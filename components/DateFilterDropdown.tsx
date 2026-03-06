"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, Check } from "@/lib/icons";

const DATE_OPTIONS = ["Today", "Yesterday", "Last 7 days", "Custom Range"];

export default function DateFilterDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Today");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between gap-1 px-3 py-2 border border-[#E5E7EB] rounded-full text-sm text-[#6B7280] hover:border-[#209d01] transition-colors min-w-[140px]"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{selected}</span>
        </div>
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 z-50 bg-white rounded-2xl shadow-lg border border-[#E5E7EB] py-2 min-w-[160px]">
          {DATE_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => {
                setSelected(option);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between text-sm text-[#111827]  transition-colors"
            >
              <span className="w-full mx-1 flex gap-3 hover:bg-[#f0f1f2] rounded-lg px-2 py-1.5">
                {option}
                {selected === option && (
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
