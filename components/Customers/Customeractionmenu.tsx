"use client";

import { useState } from "react";
import { MessageSquare, CreditCard, FileText, Ban } from "@/lib/icons";
import { UserCheck } from "lucide-react";
import {
  SendEmailModal,
  IssueCreditModal,
  AddNoteModal,
  SuspendUserModal,
  ReactivateModal,
} from "./CustomerModals";

type ModalType =
  | "send-email"
  | "issue-credit"
  | "add-note"
  | "suspend"
  | "reactivate"
  | null;

interface CustomerActionMenuProps {
  customerName: string;
  customerStatus: "Active" | "Suspended";
  onClose: () => void;
}

export default function CustomerActionMenu({
  customerName,
  customerStatus,
  onClose,
}: CustomerActionMenuProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openModal = (modal: ModalType) => setActiveModal(modal);
  const closeModal = () => {
    setActiveModal(null);
    onClose();
  };

  return (
    <>
      <div className="absolute right-6 top-12 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
        <button
          onClick={() => openModal("send-email")}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Message User
        </button>

        <button
          onClick={() => openModal("issue-credit")}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
        >
          <CreditCard className="w-4 h-4" />
          Issue Credit
        </button>

        <button
          onClick={() => openModal("add-note")}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Add Note
        </button>

        <div className="border-t border-gray-200 my-1" />

        {customerStatus === "Suspended" ? (
          <button
            onClick={() => openModal("reactivate")}
            className="w-full px-4 py-2 text-left text-sm text-[#219e02] hover:bg-green-50 flex items-center gap-2 transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            Reactivate User
          </button>
        ) : (
          <button
            onClick={() => openModal("suspend")}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
          >
            <Ban className="w-4 h-4" />
            Suspend User
          </button>
        )}
      </div>

      {activeModal === "send-email" && (
        <SendEmailModal customerName={customerName} onClose={closeModal} />
      )}
      {activeModal === "issue-credit" && (
        <IssueCreditModal customerName={customerName} onClose={closeModal} />
      )}
      {activeModal === "add-note" && (
        <AddNoteModal customerName={customerName} onClose={closeModal} />
      )}
      {activeModal === "suspend" && (
        <SuspendUserModal customerName={customerName} onClose={closeModal} />
      )}
      {activeModal === "reactivate" && (
        <ReactivateModal customerName={customerName} onClose={closeModal} />
      )}
    </>
  );
}
