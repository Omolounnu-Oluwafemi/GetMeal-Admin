"use client";

import { Check } from "@/lib/icons";

interface PaymentsFilterPanelProps {
  selectedStatus: string[];
  selectedCities: string[];
  sortBy: string;
  onStatusChange: (status: string[]) => void;
  onCitiesChange: (cities: string[]) => void;
  onSortChange: (sort: string) => void;
  onClear: () => void;
}

const cities = ["Lagos", "Abuja", "Port Harcourt", "Ibadan"];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "most-orders", label: "Most Orders" },
  { value: "last-active", label: "Last Active" },
];

export default function PaymentsFilterPanel({
  selectedStatus,
  selectedCities,
  sortBy,
  onStatusChange,
  onCitiesChange,
  onSortChange,
  onClear,
}: PaymentsFilterPanelProps) {
  const handleStatusToggle = (status: string) => {
    if (selectedStatus.includes(status)) {
      onStatusChange(selectedStatus.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatus, status]);
    }
  };

  const handleCitySelect = (city: string) => {
    onCitiesChange([city]);
  };

  return (
    <div className="absolute border border-[#dee1e6] bg-white p-6 w-[54%] rounded-lg shadow-lg">
      <div className="flex items-start justify-between mb-6 align-middle">
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

      <div className="grid grid-cols-3 gap-8">
        {/* Status */}
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">
            STATUS
          </h4>
          <div className="space-y-2">
            {["Active", "Suspended"].map((status) => (
              <label
                key={status}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedStatus.includes(status)}
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

                <span className="text-sm text-gray-700">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* City */}
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">
            CITY
          </h4>
          <div className="space-y-2">
            {cities.map((city) => (
              <label
                key={city}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="city"
                  checked={selectedCities.includes(city)}
                  onChange={() => handleCitySelect(city)}
                  className="w-4 h-4 accent-[#219e02] rounded"
                />
                <span className="text-sm text-gray-700">{city}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">
            SORT BY
          </h4>
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="sortBy"
                  value={option.value}
                  checked={sortBy === option.value}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="w-4 h-4 accent-[#219e02] rounded"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
