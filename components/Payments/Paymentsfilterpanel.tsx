"use client";

import { Check } from "@/lib/icons";

interface PaymentsFilterPanelProps {
  selectedStatus: string | null;
  selectedMethod: string | null;
  sortBy: string;
  onStatusChange: (status: string | null) => void;
  onMethodChange: (method: string | null) => void;
  onSortChange: (sort: string) => void;
  onClear: () => void;
}

const paymentStatuses = ["Paid", "Pending", "Failed"];
const paymentMethods = ["Paystack", "OPay", "Apple Pay", "Google Pay"];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest-amount", label: "Highest Amount" },
  { value: "lowest-amount", label: "Lowest Amount" },
];

export default function PaymentsFilterPanel({
  selectedStatus,
  selectedMethod,
  sortBy,
  onStatusChange,
  onMethodChange,
  onSortChange,
  onClear,
}: PaymentsFilterPanelProps) {
  const handleStatusToggle = (status: string) => {
    if (selectedStatus === status) {
      onStatusChange(null);
    } else {
      onStatusChange(status);
    }
  };

  const handleMethodToggle = (method: string) => {
    if (selectedMethod === method) {
      onMethodChange(null);
    } else {
      onMethodChange(method);
    }
  };

  return (
    <div className="absolute border border-[#dee1e6] bg-white p-8 w-[48%] rounded-2xl shadow-lg z-10 mt-2">
      <div className="flex items-start justify-between mb-6 align-middle">
        <h3 className="text-base font-medium text-gray-900">
          Filters & Sorting
        </h3>
        <button
          onClick={onClear}
          className="text-sm text-gray-400 hover:text-[#219e02] transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-3 gap-12">
        {/* Payment Status */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">
            PAYMENT STATUS
          </h4>
          <div className="space-y-2">
            {paymentStatuses.map((status) => (
              <label
                key={status}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedStatus === status}
                    onChange={() => handleStatusToggle(status)}
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
                </div>
                <span
                  className={`text-sm ${selectedStatus === status ? "text-gray-900 font-semibold" : "text-gray-400"}`}
                >
                  {status}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">
            PAYMENT METHOD
          </h4>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <label
                key={method}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedMethod === method}
                    onChange={() => handleMethodToggle(method)}
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
                </div>
                <span
                  className={`text-sm ${selectedMethod === method ? "text-gray-900 font-semibold" : "text-gray-400"}`}
                >
                  {method}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">
            SORT BY
          </h4>
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex items-center">
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.value}
                    checked={sortBy === option.value}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="w-4 h-4 accent-[#219e02] rounded"
                  />
                </div>
                <span
                  className={`text-sm ${sortBy === option.value ? "text-gray-900 font-semibold" : "text-gray-400"}`}
                >
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
