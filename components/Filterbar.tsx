"use client";

import { Download, ShoppingBag, X } from "@/lib/icons";
import { SlidersHorizontal } from "lucide-react";

interface FilterBarProps {
  showFilters: boolean;
  activeFilters: string[];
  onToggleFilters: () => void;
  onRemoveFilter: (filter: string) => void;
  onExport: () => void;
}

export default function FilterBar({
  showFilters,
  activeFilters,
  onToggleFilters,
  onRemoveFilter,
  onExport,
}: FilterBarProps) {
  return (
    <div className="mb-1 pt-0 border border-[#F3F4F6]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Filters Button */}
          <button
            onClick={onToggleFilters}
            className="flex items-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-gray-800 hover:border-[#219e02] transition-colors relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters & Sort
            {activeFilters.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#219e02] text-white text-xs rounded-full flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* Active Filter Tags */}
          {activeFilters.map((filter, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#e8f5e4] text-[#209d02] rounded-full text-sm"
            >
              {filter}
              <button
                onClick={() => onRemoveFilter(filter)}
                className="hover:bg-[#219e02] hover:text-[#fff] rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3 py-2 border border-[#e2e2e4] rounded-lg text-sm text-gray-800 hover:border-[#219e02] transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>
    </div>
  );
}
