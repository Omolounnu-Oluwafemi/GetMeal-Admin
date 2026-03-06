"use client";

import { useEffect, useRef } from "react";
import { Download, Printer, Check } from "@/lib/icons";

interface OrderFiltersPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
  sortBy: string;
  sortOrder: string;
  paymentStatuses: string[];
  atRiskOnly: boolean;
  onSortByChange: (val: string) => void;
  onSortOrderChange: (val: string) => void;
  onPaymentStatusesChange: (val: string[]) => void;
  onAtRiskOnlyChange: (val: boolean) => void;
  onClear: () => void;
  onExportCSV: () => void;
  onPrint: () => void;
}

export default function OrderFiltersPopover({
  isOpen,
  onClose,
  anchorRef,
  sortBy,
  sortOrder,
  paymentStatuses,
  atRiskOnly,
  onSortByChange,
  onSortOrderChange,
  onPaymentStatusesChange,
  onAtRiskOnlyChange,
  onClear,
  onExportCSV,
  onPrint,
}: OrderFiltersPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  const togglePaymentStatus = (status: string) => {
    if (paymentStatuses.includes(status)) {
      onPaymentStatusesChange(paymentStatuses.filter((s) => s !== status));
    } else {
      onPaymentStatusesChange([...paymentStatuses, status]);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen || !anchorRef.current) return null;

  const rect = anchorRef.current.getBoundingClientRect();
  const openUp = rect.top > window.innerHeight / 2;
  const right = window.innerWidth - rect.right;

  const positionStyle: React.CSSProperties = openUp
    ? { bottom: window.innerHeight - rect.top + 8, right }
    : { top: rect.bottom + 8, right };

  return (
    <div
      ref={popoverRef}
      style={{ ...positionStyle, position: "fixed" }}
      className="z-50 w-[60%] bg-white rounded-xl shadow-xl border border-[#dee1e6] p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-medium text-gray-900">
          Filters & Sorting
        </h3>
        <button
          onClick={onClear}
          className="text-sm text-gray-600 hover:text-[#219e02] transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-4 gap-8">
        {/* Sort By */}
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">
            SORT BY
          </h4>
          <div className="space-y-2">
            {["Date", "Amount", "Status", "Area", "Cook"].map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="sortBy"
                  checked={sortBy === option}
                  onChange={() => onSortByChange(option)}
                  className="w-4 h-4 accent-[#219e02]"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
            {["Descending", "Ascending"].map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="sortOrder"
                  checked={sortOrder === option}
                  onChange={() => onSortOrderChange(option)}
                  className="w-4 h-4 accent-[#219e02]"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Status */}
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">
            PAYMENT STATUS
          </h4>
          <div className="space-y-2">
            {["Paid", "Pending", "Failed"].map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={paymentStatuses.includes(option)}
                  onChange={() => togglePaymentStatus(option)}
                  className="peer sr-only"
                />
                <div
                  className="
                    w-5 h-5 rounded-lg
                    border-2 border-gray-300
                    flex items-center justify-center
                    transition-all duration-200
                    peer-checked:bg-[#219e02]
                    peer-checked:border-[#219e02]
                  "
                >
                  <Check strokeWidth={4} width={10} color="#fff" />
                </div>
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Amount Range */}
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">
            AMOUNT RANGE
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                Min Amount
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#219e02] focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                Max Amount
              </label>
              <input
                type="number"
                placeholder="999999"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#219e02] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Additional Filters & Export */}
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">
            ADDITIONAL FILTERS
          </h4>
          <label className="flex items-center gap-2 cursor-pointer mb-6">
            <input
              type="checkbox"
              checked={atRiskOnly}
              onChange={(e) => onAtRiskOnlyChange(e.target.checked)}
              className="peer sr-only"
            />
            <div
              className="
                w-5 h-5 rounded-lg
                border-2 border-gray-300
                flex items-center justify-center
                transition-all duration-200
                peer-checked:bg-[#219e02]
                peer-checked:border-[#219e02]
              "
            >
              <Check strokeWidth={4} width={10} color="#fff" />
            </div>
            <span className="text-sm text-gray-700">At-Risk Only</span>
          </label>

          <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">
            EXPORT
          </h4>
          <div className="space-y-2">
            <button
              onClick={onExportCSV}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#219e02] transition-colors"
            >
              <Download className="w-4 h-4" />
              Export to CSV
            </button>
            <button
              onClick={onPrint}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#219e02] transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
