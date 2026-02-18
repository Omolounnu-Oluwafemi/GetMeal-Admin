"use client";

interface CooksFilterPanelProps {
  selectedStatus: string[];
  selectedCities: string[];
  sortBy: string;
  onStatusChange: (status: string[]) => void;
  onCitiesChange: (cities: string[]) => void;
  onSortChange: (sort: string) => void;
  onApply: () => void;
  onClear: () => void;
}

const cities = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kaduna", "Enugu"];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "most-orders", label: "Most Orders" },
  { value: "highest-rating", label: "Highest Rating" },
  { value: "last-active", label: "Last Active" },
];

export default function CooksFilterPanel({
  selectedStatus,
  selectedCities,
  sortBy,
  onStatusChange,
  onCitiesChange,
  onSortChange,
  onApply,
  onClear,
}: CooksFilterPanelProps) {
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
    <div className="border-b border-[#F3F4F6] bg-gray-50 p-6">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
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
            {["Online", "Offline", "Suspended"].map((status) => (
              <label
                key={status}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedStatus.includes(status)}
                  onChange={() => handleStatusToggle(status)}
                  className="w-4 h-4 text-[#219e02] focus:ring-[#219e02] rounded"
                />
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
                  className="w-4 h-4 text-[#219e02] focus:ring-[#219e02]"
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
                  className="w-4 h-4 text-[#219e02] focus:ring-[#219e02]"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onApply}
          className="px-6 py-2 bg-[#219e02] text-white rounded-lg text-sm font-medium hover:bg-[#1a7d01] transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
