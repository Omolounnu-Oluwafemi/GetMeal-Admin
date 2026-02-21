"use client";

import { useState } from "react";
import { MapPin, Trash2, Plus } from "@/lib/icons";

interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  logoColor: string;
  status: "Connected" | "Disconnected";
}

interface ServiceZone {
  id: string;
  name: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "1",
    name: "Paystack",
    logo: "P",
    logoColor: "#0055FF",
    status: "Connected",
  },
  {
    id: "2",
    name: "OPay",
    logo: "O",
    logoColor: "#00D632",
    status: "Connected",
  },
  {
    id: "3",
    name: "Apple Pay",
    logo: "A",
    logoColor: "#000000",
    status: "Connected",
  },
  {
    id: "4",
    name: "Google Pay",
    logo: "G",
    logoColor: "#4285F4",
    status: "Connected",
  },
];

const initialZones: ServiceZone[] = [
  { id: "1", name: "Lekki" },
  { id: "2", name: "Victoria Island" },
  { id: "3", name: "Ikeja/Maryland" },
  { id: "4", name: "Surulere" },
  { id: "5", name: "Yaba" },
  { id: "6", name: "Ikoyi" },
];

export default function SystemSettings() {
  const [zones, setZones] = useState<ServiceZone[]>(initialZones);
  const [showAddZone, setShowAddZone] = useState(false);
  const [newZoneName, setNewZoneName] = useState("");

  const handleAddZone = () => {
    if (newZoneName.trim()) {
      const newZone: ServiceZone = {
        id: Date.now().toString(),
        name: newZoneName.trim(),
      };
      setZones([...zones, newZone]);
      setNewZoneName("");
      setShowAddZone(false);
    }
  };

  const handleDeleteZone = (zoneId: string) => {
    if (confirm("Are you sure you want to delete this zone?")) {
      setZones(zones.filter((zone) => zone.id !== zoneId));
    }
  };

  const handleClearNotifications = () => {
    if (
      confirm(
        "Are you sure you want to permanently delete all notification history?",
      )
    ) {
      console.log("Clearing all notifications...");
    }
  };

  const handleExportData = () => {
    console.log("Exporting all platform data...");
  };

  return (
    <div className="max-w-4xl space-y-12">
      {/* Payment Methods */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Payment Methods
          </h2>
          <p className="text-sm text-gray-600">
            Manage integrated payment providers
          </p>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                  style={{ backgroundColor: method.logoColor }}
                >
                  {method.logo}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {method.name}
                  </div>
                  <div className="text-sm text-gray-500">{method.status}</div>
                </div>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Configure
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Service Zones */}
      <div>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Service Zones
            </h2>
            <p className="text-sm text-gray-600">
              Manage operational zones and coverage areas
            </p>
          </div>
          <button
            onClick={() => setShowAddZone(!showAddZone)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#219e02] text-white rounded-lg text-sm font-medium hover:bg-[#1a7d01] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Zone
          </button>
        </div>

        {/* Add Zone Input */}
        {showAddZone && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="Enter zone name..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#219e02] focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && handleAddZone()}
              />
              <button
                onClick={handleAddZone}
                disabled={!newZoneName.trim()}
                className="px-4 py-2 bg-[#219e02] text-white rounded-lg text-sm font-medium hover:bg-[#1a7d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddZone(false);
                  setNewZoneName("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Zones Grid */}
        <div className="grid grid-cols-2 gap-4">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#219e02]" />
                <span className="text-sm font-medium text-gray-900">
                  {zone.name}
                </span>
              </div>
              <button
                onClick={() => handleDeleteZone(zone.id)}
                className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
        <h2 className="text-xl font-semibold text-red-900 mb-2">Danger Zone</h2>
        <p className="text-sm text-red-600 mb-6">
          Irreversible and destructive actions
        </p>

        <div className="space-y-4">
          {/* Clear All Notifications */}
          <div className="flex items-start justify-between p-4 bg-white rounded-lg">
            <div>
              <div className="font-medium text-gray-900 mb-1">
                Clear all notifications
              </div>
              <div className="text-sm text-gray-600">
                Permanently delete all notification history
              </div>
            </div>
            <button
              onClick={handleClearNotifications}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Export All Data */}
          <div className="flex items-start justify-between p-4 bg-white rounded-lg">
            <div>
              <div className="font-medium text-gray-900 mb-1">
                Export all data
              </div>
              <div className="text-sm text-gray-600">
                Download a copy of all platform data
              </div>
            </div>
            <button
              onClick={handleExportData}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
