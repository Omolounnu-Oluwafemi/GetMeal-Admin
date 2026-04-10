"use client";

import { useTeamMembers } from "@/lib/hooks/profile";
import { Trash2 } from "@/lib/icons";

interface TeamSettingsProps {
  onAddMember: () => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function capitalize(str: string) {
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function TeamSettings({ onAddMember }: TeamSettingsProps) {
  const { data: members = [], isLoading } = useTeamMembers();

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

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl animate-pulse">
              <div className="w-11 h-11 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
              <div className="space-y-2 text-right">
                <div className="h-3.5 bg-gray-200 rounded w-24" />
                <div className="h-3 bg-gray-100 rounded w-16 ml-auto" />
              </div>
              <div className="h-6 w-16 bg-gray-100 rounded-lg" />
              <div className="w-7 h-7 bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="py-16 text-center text-sm text-gray-400">No team members yet</div>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member._id}
              className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm"
            >
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full bg-[#F0FDF4] flex items-center justify-center text-[#219e02] text-sm font-bold flex-shrink-0">
                {getInitials(member.fullName)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm">{member.fullName}</div>
                <div className="text-xs text-gray-400 mt-0.5">{member.email}</div>
              </div>

              {/* Role */}
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{capitalize(member.role)}</div>
                {member.phone && (
                  <div className="text-xs text-gray-400 mt-0.5">{member.phone}</div>
                )}
              </div>

              {/* Status Badge */}
              <span className={`px-3 py-1 text-xs font-medium rounded-lg ${member.isVerified ? "bg-[#F0FDF4] text-[#219e02]" : "bg-amber-50 text-amber-500"}`}>
                {member.isVerified ? "Active" : "Pending"}
              </span>

              {/* Delete Button */}
              <button
                onClick={() => {
                  if (confirm(`Remove ${member.fullName} from the team?`)) {
                    // remove action — endpoint not yet provided
                  }
                }}
                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
              >
                <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
