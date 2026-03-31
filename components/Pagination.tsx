"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  label?: string;
}

function getPageNumbers(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | "...")[] = [1];
  if (page > 3) pages.push("...");
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
    pages.push(i);
  }
  if (page < totalPages - 2) pages.push("...");
  pages.push(totalPages);
  return pages;
}

export default function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  label = "results",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#F3F4F6]">
      {/* Count */}
      <span className="text-sm text-[#6B7280]">
        Showing <span className="font-medium text-[#111827]">{start}–{end}</span> of{" "}
        <span className="font-medium text-[#111827]">{total}</span> {label}
      </span>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#374151] rounded-lg hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>

        {pageNumbers.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="w-8 text-center text-sm text-[#9CA3AF]">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? "bg-[#219e02] text-white"
                  : "text-[#374151] hover:bg-[#F3F4F6]"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#374151] rounded-lg hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
