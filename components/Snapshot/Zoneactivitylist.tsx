"use client";

import { MapPin, AlertTriangle, TrendingUp, Users } from "@/lib/icons";

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
  const getBarColor = (pct: number) => (pct < 30 ? "bg-orange-400" : "bg-[#219e02]");
  const getOrderColor = (count: number) => (count >= 30 ? "text-blue-600" : "text-gray-900");

  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#F3F4F6]">
      {/* Header row */}
      <div className="flex items-center justify-between mb-8">
        {/* Title */}
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            ZONE ACTIVITY
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {zones.length} active zones
          </div>
        </div>

        {/* Center stats */}
        <div className="flex items-center gap-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 uppercase tracking-wide mb-1">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Orders/hr
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 uppercase tracking-wide mb-1">
              <Users className="w-4 h-4 text-[#219e02]" />
              Capacity
            </div>
            <div className="text-2xl font-bold text-gray-900">~{capacity}</div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 uppercase tracking-wide mb-1">
              <MapPin className="w-4 h-4 text-purple-500" />
              Browsing
            </div>
            <div className="text-2xl font-bold text-gray-900">{browsing}</div>
          </div>
        </div>

        {/* View details button */}
        <button
          onClick={onViewDetails}
          className="px-4 py-2 border border-[#219e02] text-[#219e02] rounded-lg text-sm font-semibold hover:bg-[#F0FDF4] transition-colors"
        >
          View details
        </button>
      </div>

      {/* Zone rows */}
      <div>
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="grid items-center gap-4 py-4 border-b border-gray-100 last:border-0"
            style={{ gridTemplateColumns: "auto 1fr 80px 180px" }}
          >
            {/* MapPin icon box */}
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-gray-500" />
            </div>

            {/* Zone info */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold text-gray-900">{zone.name}</span>
                {zone.hasAlert && <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0" />}
              </div>
              <div className="text-xs text-gray-400">
                {zone.cooksOnline} of {zone.totalCooks} cooks online
              </div>
            </div>

            {/* Orders — center column */}
            <div className="text-center">
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Orders</div>
              <div className={`text-2xl font-bold ${getOrderColor(zone.orders)}`}>{zone.orders}</div>
            </div>

            {/* Availability */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-400">Availability</span>
                <span className="text-sm font-semibold text-gray-900">{zone.availability}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${getBarColor(zone.availability)}`}
                  style={{ width: `${zone.availability}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
