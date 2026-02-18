"use client";

import { MapPin, AlertTriangle } from "@/lib/icons";

interface Zone {
  id: string;
  name: string;
  cooksOnline: string;
  totalCooks: number;
  orders: number;
  availability: number;
  hasAlert?: boolean;
}

interface ZoneActivityListProps {
  zones: Zone[];
  totalOrders: number;
  capacity: number;
  browsing: number;
  onViewDetails: () => void;
}

export default function ZoneActivityList({
  zones,
  totalOrders,
  capacity,
  browsing,
  onViewDetails,
}: ZoneActivityListProps) {
  const getAvailabilityColor = (percentage: number) => {
    if (percentage < 35) return "bg-orange-500";
    if (percentage < 50) return "bg-[#219e02]";
    return "bg-[#219e02]";
  };

  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#F3F4F6]">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-sm font-semibold text-gray-900 uppercase mb-2">
            ZONE ACTIVITY
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {zones.length} active zones
          </div>
        </div>
        <button
          onClick={onViewDetails}
          className="text-sm text-[#219e02] hover:underline font-medium"
        >
          View details
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-1 text-xs text-gray-500 uppercase mb-1">
            <svg
              className="w-4 h-4 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            Orders/hr
          </div>
          <div className="text-lg font-bold text-gray-900">{totalOrders}</div>
        </div>
        <div>
          <div className="flex items-center gap-1 text-xs text-gray-500 uppercase mb-1">
            <svg
              className="w-4 h-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Capacity
          </div>
          <div className="text-lg font-bold text-gray-900">~{capacity}</div>
        </div>
        <div>
          <div className="flex items-center gap-1 text-xs text-gray-500 uppercase mb-1">
            <svg
              className="w-4 h-4 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Browsing
          </div>
          <div className="text-lg font-bold text-gray-900">{browsing}</div>
        </div>
      </div>

      {/* Zone List */}
      <div className="space-y-4">
        {zones.map((zone) => (
          <div key={zone.id} className="flex items-center gap-4">
            {/* Location Icon */}
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />

            {/* Zone Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {zone.name}
                </span>
                {zone.hasAlert && (
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                )}
              </div>
              <div className="text-xs text-gray-500">
                {zone.cooksOnline} of {zone.totalCooks} cooks online
              </div>
            </div>

            {/* Orders */}
            <div className="text-center">
              <div className="text-xs text-gray-500 uppercase mb-1">Orders</div>
              <div className="text-2xl font-bold text-blue-600">
                {zone.orders}
              </div>
            </div>

            {/* Availability */}
            <div className="text-right" style={{ minWidth: "80px" }}>
              <div className="text-xs text-gray-500 mb-1">Availability</div>
              <div className="flex items-center gap-2 justify-end">
                <div
                  className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"
                  style={{ maxWidth: "60px" }}
                >
                  <div
                    className={`h-full ${getAvailabilityColor(zone.availability)} transition-all`}
                    style={{ width: `${zone.availability}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {zone.availability}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
