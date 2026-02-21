"use client";

import {
  Eye,
  ShoppingBag,
  MessageSquare,
  CreditCard,
  FileText,
  Ban,
} from "@/lib/icons";

interface PaymentsActionMenuProps {
  customerId: string;
  customerName: string;
  onClose: () => void;
}

export default function PaymentsActionMenu({
  customerId,
  customerName,
  onClose,
}: PaymentsActionMenuProps) {
  const handleAction = (action: string) => {
    console.log(`${action} for customer:`, customerId);
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
        onClick={() => handleAction("message-user")}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        Message User
      </button>

      <button
        onClick={() => handleAction("issue-credit")}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
      >
        <CreditCard className="w-4 h-4" />
        Issue Credit
      </button>

      <button
        onClick={() => handleAction("add-note")}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
      >
        <FileText className="w-4 h-4" />
        Add Note
      </button>

      <div className="border-t border-gray-200 my-1" />

      <button
        onClick={() => handleAction("suspend-user")}
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
      >
        <Ban className="w-4 h-4" />
        Suspend User
      </button>
    </div>
  );
}
