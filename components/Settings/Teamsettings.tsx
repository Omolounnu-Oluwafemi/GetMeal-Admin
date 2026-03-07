"use client";

import { Trash2 } from "@/lib/icons";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  initials: string;
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
    role: "Operations Agent",
    lastActive: "Last active 2 mins ago",
    status: "Active",
  },
  {
    id: "2",
    name: "Tunde Williams",
    email: "tunde@getameal.com",
    initials: "TW",
    role: "Operations Agent",
    lastActive: "Last active 5 mins ago",
    status: "Active",
  },
  {
    id: "3",
    name: "Ngozi Eze",
    email: "ngozi@getameal.com",
    initials: "NE",
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
    <div className="w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Team Members</h2>
          <p className="text-sm text-gray-500">Manage team members and their permissions</p>
        </div>
        <button
          onClick={onAddMember}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#219e02] text-white rounded-xl text-sm font-medium hover:bg-[#1a7d01] transition-colors"
        >
          <span className="text-lg leading-none">+</span>
          Add Member
        </button>
      </div>

      <div className="space-y-3">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm"
          >
            {/* Avatar */}
            <div className="w-11 h-11 rounded-full bg-[#F0FDF4] flex items-center justify-center text-[#219e02] text-sm font-bold flex-shrink-0">
              {member.initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-sm">{member.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">{member.email}</div>
            </div>

            {/* Role & Last Active */}
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">{member.role}</div>
              <div className="text-xs text-gray-400 mt-0.5">{member.lastActive}</div>
            </div>

            {/* Status Badge */}
            <span className="px-3 py-1 bg-[#F0FDF4] text-[#219e02] text-xs font-medium rounded-lg">
              {member.status}
            </span>

            {/* Delete Button */}
            <button
              onClick={() => handleRemoveMember(member.id)}
              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
            >
              <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
