"use client";

import {
  User,
  Bell,
  Shield,
  Users,
  Settings as SettingsIcon,
} from "@/lib/icons";

interface SettingsNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "team", label: "Team", icon: Users },
  { id: "system", label: "System", icon: SettingsIcon },
];

export default function SettingsNav({
  activeTab,
  onTabChange,
}: SettingsNavProps) {
  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
              ${
                isActive
                  ? "bg-[#219e02] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            <Icon className="w-5 h-5" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
