"use client";

import { Trash2 } from "@/lib/icons";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
  role: string;
  lastActive: string;
  status: "Active" | "Pending";
}

interface TeamSettingsProps {
  onAddMember: () => void;
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Chioma Okeke",
    email: "chioma@getameal.com",
    initials: "CO",
    color: "#219e02",
    role: "Operations Agent",
    lastActive: "Last active 2 mins ago",
    status: "Active",
  },
  {
    id: "2",
    name: "Tunde Williams",
    email: "tunde@getameal.com",
    initials: "TW",
    color: "#10B981",
    role: "Operations Agent",
    lastActive: "Last active 5 mins ago",
    status: "Active",
  },
  {
    id: "3",
    name: "Ngozi Eze",
    email: "ngozi@getameal.com",
    initials: "NE",
    color: "#6366F1",
    role: "Operations Manager",
    lastActive: "Last active 1 hour ago",
    status: "Active",
  },
];

export default function TeamSettings({ onAddMember }: TeamSettingsProps) {
  const handleRemoveMember = (memberId: string) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      console.log("Removing member:", memberId);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Team Members
          </h2>
          <p className="text-sm text-gray-600">
            Manage team members and their permissions
          </p>
        </div>
        <button
          onClick={onAddMember}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#219e02] text-white rounded-lg text-sm font-medium hover:bg-[#1a7d01] transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Member
        </button>
      </div>

      <div className="space-y-4">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {/* Avatar */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
              style={{ backgroundColor: member.color }}
            >
              {member.initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900">{member.name}</div>
              <div className="text-sm text-gray-500">{member.email}</div>
            </div>

            {/* Role & Status */}
            <div className="text-right">
              <div className="font-medium text-gray-900">{member.role}</div>
              <div className="text-sm text-gray-500">{member.lastActive}</div>
            </div>

            {/* Status Badge */}
            <span className="px-3 py-1 bg-[#F0FDF4] text-[#219e02] text-sm font-medium rounded-full">
              {member.status}
            </span>

            {/* Delete Button */}
            <button
              onClick={() => handleRemoveMember(member.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
            >
              <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
