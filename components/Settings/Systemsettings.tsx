"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import {
  MapPin,
  Trash2,
  Plus,
  X,
  Eye,
  Save,
  CheckCircle,
  AlertCircle,
  Check,
  AlertTriangle,
} from "@/lib/icons";

interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  logoColor: string;
  status: "Connected" | "Disconnected";
  webhookPath: string;
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
    webhookPath: "paystack",
  },
  {
    id: "2",
    name: "OPay",
    logo: "O",
    logoColor: "#00D632",
    status: "Connected",
    webhookPath: "opay",
  },
  {
    id: "3",
    name: "Apple Pay",
    logo: "A",
    logoColor: "#000000",
    status: "Connected",
    webhookPath: "applepay",
  },
  {
    id: "4",
    name: "Google Pay",
    logo: "G",
    logoColor: "#4285F4",
    status: "Connected",
    webhookPath: "googlepay",
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

const popularZones = [
  "Lekki",
  "Victoria Island",
  "Ikoyi",
  "Surulere",
  "Yaba",
  "Ikeja",
  "Maryland",
  "Ajah",
];

function ConfigureModal({
  method,
  onClose,
}: {
  method: PaymentMethod;
  onClose: () => void;
}) {
  const [showPublicKey, setShowPublicKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [testMode, setTestMode] = useState(false);

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                style={{ backgroundColor: method.logoColor }}
              >
                {method.logo}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {method.name} Configuration
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Manage your {method.name} integration settings
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Status */}
          <div className="flex items-center gap-3 p-4 bg-[#F0FDF4] border border-green-200 rounded-xl">
            <CheckCircle className="w-5 h-5 text-[#219e02] flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                Status: Connected
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Last synced: 2 minutes ago
              </div>
            </div>
          </div>

          {/* API Credentials */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              API Credentials
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Public Key
                </label>
                <div className="relative">
                  <input
                    type={showPublicKey ? "text" : "password"}
                    defaultValue="pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full pl-4 pr-10 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#219e02]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPublicKey((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Secret Key
                </label>
                <div className="relative">
                  <input
                    type={showSecretKey ? "text" : "password"}
                    defaultValue=""
                    placeholder="sk_live_..."
                    className="w-full pl-4 pr-10 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#219e02]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Webhook Configuration */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Webhook Configuration
            </h4>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Webhook URL
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-600 font-mono select-all">
                https://getameal.com/api/webhooks/{method.webhookPath}
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Add this URL to your {method.name} dashboard to receive payment
                notifications
              </p>
            </div>
          </div>

          {/* Settings */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Settings
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Enable {method.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Allow customers to pay using {method.name}
                  </div>
                </div>
                <label className="cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-[18px] h-[18px] rounded-md border-2 border-gray-300 flex items-center justify-center transition-all duration-200 peer-checked:bg-[#219e02] peer-checked:border-[#219e02]">
                    <Check strokeWidth={3} width={12} color="#fff" />
                  </div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Test Mode
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Use test credentials for development
                  </div>
                </div>
                <label className="cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={testMode}
                    onChange={(e) => setTestMode(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-[18px] h-[18px] rounded-md border-2 border-gray-300 flex items-center justify-center transition-all duration-200 peer-checked:bg-[#219e02] peer-checked:border-[#219e02]">
                    <Check strokeWidth={3} width={12} color="#fff" />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Best Practices */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-blue-900">
                Security Best Practices
              </div>
              <p className="text-xs text-blue-600 mt-0.5">
                Never share your secret keys. Rotate your keys regularly and use
                webhooks to receive real-time updates.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
          <button className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Test Connection
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#219e02] text-white rounded-xl text-sm font-medium hover:bg-[#1a7d01] transition-colors">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function DeleteZoneModal({
  zone,
  onClose,
  onConfirm,
}: {
  zone: ServiceZone;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] w-full max-w-md flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Service Zone
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Confirmation message */}
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-sm text-red-700">
              You are about to delete the{" "}
              <span className="font-semibold">{zone.name}</span> service zone.
              This will permanently remove this zone from the system.
            </p>
          </div>

          {/* Impact list */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">
              This will affect:
            </p>
            <ul className="space-y-1.5">
              {[
                "All active orders in this zone",
                "Cook assignments linked to this zone",
                "Delivery routing for this area",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Consider deactivating instead */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-blue-900">
                Consider deactivating instead
              </div>
              <p className="text-xs text-blue-600 mt-0.5">
                Deactivating a zone temporarily removes it from operations
                without losing historical data.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Delete Zone
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function AddZoneModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (name: string) => void;
}) {
  const [zoneName, setZoneName] = useState("");
  const [coverageAreas, setCoverageAreas] = useState("");
  const [activateZone, setActivateZone] = useState(true);

  const handleAdd = () => {
    if (zoneName.trim()) {
      onAdd(zoneName.trim());
    }
  };

  const handleChipClick = (chip: string) => {
    setZoneName(chip);
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#F0FDF4] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-[#219e02]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Service Zone
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Define a new operational coverage area
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Zone Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Zone Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                placeholder="e.g., Lekki Phase 1"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#219e02]"
              />
            </div>
          </div>

          {/* Coverage Areas */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Coverage Areas
            </label>
            <textarea
              value={coverageAreas}
              onChange={(e) => setCoverageAreas(e.target.value)}
              placeholder="Describe the streets, landmarks, or neighbourhoods covered..."
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#219e02] resize-none"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Optional — helps cooks and customers identify the zone
            </p>
          </div>

          {/* Activate Zone */}
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
            <div>
              <div className="text-sm font-medium text-gray-900">
                Activate Zone
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                Make this zone immediately available for orders
              </div>
            </div>
            <label className="cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={activateZone}
                onChange={(e) => setActivateZone(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-[18px] h-[18px] rounded-md border-2 border-gray-300 flex items-center justify-center transition-all duration-200 peer-checked:bg-[#219e02] peer-checked:border-[#219e02]">
                <Check strokeWidth={3} width={12} color="#fff" />
              </div>
            </label>
          </div>

          {/* Map Integration info */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-blue-900">
                Map Integration
              </div>
              <p className="text-xs text-blue-600 mt-0.5">
                Zones are used to assign cooks and route deliveries. Ensure the
                name matches a recognised area in Lagos for accurate
                geo-routing.
              </p>
            </div>
          </div>

          {/* Popular Lagos Zones */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">
              Popular Lagos Zones
            </p>
            <div className="flex flex-wrap gap-2">
              {popularZones.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    zoneName === chip
                      ? "bg-[#219e02] text-white border-[#219e02]"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!zoneName.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#219e02] text-white rounded-xl text-sm font-medium hover:bg-[#1a7d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Add Zone
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function SystemSettings() {
  const [zones, setZones] = useState<ServiceZone[]>(initialZones);
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [deletingZone, setDeletingZone] = useState<ServiceZone | null>(null);
  const [configuringMethod, setConfiguringMethod] =
    useState<PaymentMethod | null>(null);

  const handleAddZone = (name: string) => {
    setZones([...zones, { id: Date.now().toString(), name }]);
    setShowAddZoneModal(false);
  };

  const handleConfirmDelete = () => {
    if (deletingZone) {
      setZones(zones.filter((z) => z.id !== deletingZone.id));
      setDeletingZone(null);
    }
  };

  return (
    <div className="w-full space-y-10">
      {/* Payment Methods */}
      <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Payment Methods
          </h2>
          <p className="text-sm text-gray-500">
            Manage integrated payment providers
          </p>
        </div>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-base font-bold flex-shrink-0"
                  style={{ backgroundColor: method.logoColor }}
                >
                  {method.logo}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {method.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {method.status}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setConfiguringMethod(method)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Configure
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Service Zones */}
      <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Service Zones
            </h2>
            <p className="text-sm text-gray-500">
              Manage operational zones and coverage areas
            </p>
          </div>
          <button
            onClick={() => setShowAddZoneModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#219e02] text-white rounded-xl text-sm font-medium hover:bg-[#1a7d01] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Zone
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#219e02]" />
                <span className="text-sm font-medium text-gray-900">
                  {zone.name}
                </span>
              </div>
              <button
                onClick={() => setDeletingZone(zone)}
                className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 bg-white border border-red-200 rounded-2xl shadow-sm">
        <h2 className="text-lg font-semibold text-red-600 mb-1">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-5">
          Irreversible actions that affect the entire platform
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-red-100 rounded-xl">
            <div>
              <div className="text-sm font-semibold text-gray-900">
                Clear All Orders
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                Permanently delete all historical order data
              </div>
            </div>
            <button className="px-4 py-2 border border-red-400 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
              Clear Orders
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-red-100 rounded-xl">
            <div>
              <div className="text-sm font-semibold text-gray-900">
                Reset System Settings
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                Restore all settings to their default values
              </div>
            </div>
            <button className="px-4 py-2 border border-red-400 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
              Reset Settings
            </button>
          </div>
        </div>
      </div>

      {/* Configure Modal */}
      {configuringMethod && (
        <ConfigureModal
          method={configuringMethod}
          onClose={() => setConfiguringMethod(null)}
        />
      )}

      {/* Delete Zone Modal */}
      {deletingZone && (
        <DeleteZoneModal
          zone={deletingZone}
          onClose={() => setDeletingZone(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Add Zone Modal */}
      {showAddZoneModal && (
        <AddZoneModal
          onClose={() => setShowAddZoneModal(false)}
          onAdd={handleAddZone}
        />
      )}
    </div>
  );
}
