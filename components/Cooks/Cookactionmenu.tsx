"use client";

import {
  Eye,
  ShoppingBag,
  MessageSquare,
  Clock,
  FileText,
  UserX,
  UserCheck,
} from "@/lib/icons";

interface CookActionMenuProps {
  cookId: string;
  cookName: string;
  status: "Online" | "Offline" | "Suspended";
  onClose: () => void;
}

export default function CookActionMenu({
  cookId,
  cookName,
  status,
  onClose,
}: CookActionMenuProps) {
  const handleAction = (action: string) => {
    console.log(`${action} for cook:`, cookId);
    onClose();
  };

  return (
    <div className="absolute right-6 top-12 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
      <button
        onClick={() => handleAction("view-profile")}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
      >
        <Eye className="w-4 h-4" />
        View Profile
      </button>

      <button
        onClick={() => handleAction("view-orders")}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
      >
        <ShoppingBag className="w-4 h-4" />
        View Orders
      </button>

      <button
        onClick={() => handleAction("message-cook")}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        Message Cook
      </button>

      <button
        onClick={() => handleAction("change-status")}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
      >
        <Clock className="w-4 h-4" />
        Change Status
      </button>

      <button
        onClick={() => handleAction("add-note")}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
      >
        <FileText className="w-4 h-4" />
        Add Note
      </button>

      <div className="border-t border-gray-200 my-1" />

      {status === "Suspended" ? (
        <button
          onClick={() => handleAction("reactivate-cook")}
          className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2 transition-colors"
        >
          <UserCheck className="w-4 h-4" />
          Reactivate Cook
        </button>
      ) : (
        <button
          onClick={() => handleAction("suspend-cook")}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
        >
          <UserX className="w-4 h-4" />
          Suspend Cook
        </button>
      )}
    </div>
  );
}
