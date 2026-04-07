"use client";

import { useState } from "react";
import {
  Eye,
  ShoppingBag,
  MessageSquare,
  Clock,
  FileText,
  UserX,
  UserCheck,
  CreditCard,
} from "@/lib/icons";
import {
  SendEmailModal,
  ChangeStatusModal,
  AddNoteModal,
  ReactivateCookModal,
  SuspendCookModal,
  IssueCreditModal,
} from "./CookModals";
import CookOrdersView from "@/components/Order/CookOrdersView";
import CookProfileSidebar from "./CookProfileSidebar";
import { useCookById } from "@/lib/hooks/cooks";
import { mapCook } from "@/lib/mappers/cooks";
import type { Cook } from "./Cookstable";

function CookProfileFetcher({
  cookId,
  initialCook,
  onClose,
  onMessage,
  onAddNote,
  onSuspend,
  onReactivate,
}: {
  cookId: string;
  initialCook: Cook;
  onClose: () => void;
  onMessage: () => void;
  onAddNote: () => void;
  onSuspend: () => void;
  onReactivate: () => void;
}) {
  const { data, isLoading } = useCookById(cookId, { staleTime: 0, refetchOnMount: "always" });
  // Show table data immediately, swap to full data once loaded
  const cook = data && !isLoading ? mapCook(data) : initialCook;
  return (
    <CookProfileSidebar
      cook={cook}
      loading={isLoading}
      onClose={onClose}
      onMessage={onMessage}
      onAddNote={onAddNote}
      onSuspend={onSuspend}
      onReactivate={onReactivate}
    />
  );
}

type ModalType =
  | "view-profile"
  | "view-orders"
  | "message"
  | "change-status"
  | "add-note"
  | "issue-credit"
  | "reactivate"
  | "suspend"
  | null;

interface CookActionMenuProps {
  cook: Cook;
  onClose: () => void;
}

export default function CookActionMenu({ cook, onClose }: CookActionMenuProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openModal = (modal: ModalType) => setActiveModal(modal);
  const closeModal = () => {
    setActiveModal(null);
    onClose();
  };

  return (
    <>
      {/* Click-outside overlay — only when no modal is open */}
      {!activeModal && (
        <div className="fixed inset-0 z-[9]" onClick={onClose} />
      )}
      <div className="absolute right-6 top-12 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
        <button
          onClick={() => openModal("view-profile")}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
        >
          <Eye className="w-4 h-4" />
          View Profile
        </button>

        <button
          onClick={() => openModal("view-orders")}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          View Orders
        </button>

        <button
          onClick={() => openModal("message")}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Message Cook
        </button>

        <button
          onClick={() => openModal("change-status")}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
        >
          <Clock className="w-4 h-4" />
          Change Status
        </button>

        <button
          onClick={() => openModal("add-note")}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Add Note
        </button>

        <button
          onClick={() => openModal("issue-credit")}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
        >
          <CreditCard className="w-4 h-4" />
          Issue Credit
        </button>

        <div className="border-t border-gray-200 my-1" />

        {!cook.isApproved && (
          <button
            onClick={() => openModal("reactivate")}
            className="w-full px-4 py-2 text-left text-sm text-[#219e02] hover:bg-green-50 flex items-center gap-2 transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            Activate Cook
          </button>
        )}
        <button
          onClick={() => openModal("suspend")}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
        >
          <UserX className="w-4 h-4" />
          Suspend Cook
        </button>
      </div>

      {activeModal === "view-profile" && (
        <CookProfileFetcher
          cookId={cook.id}
          initialCook={cook}
          onClose={closeModal}
          onMessage={() => setActiveModal("message")}
          onAddNote={() => setActiveModal("add-note")}
          onSuspend={() => setActiveModal("suspend")}
          onReactivate={() => setActiveModal("reactivate")}
        />
      )}
      {activeModal === "view-orders" && (
        <CookOrdersView cookId={cook.id} cookName={cook.name} onClose={closeModal} />
      )}
      {activeModal === "message" && (
        <SendEmailModal cookId={cook.id} cookName={cook.name} onClose={closeModal} />
      )}
      {activeModal === "change-status" && (
        <ChangeStatusModal cookId={cook.id} cookName={cook.name} isAvailable={cook.isAvailable} onClose={closeModal} />
      )}
      {activeModal === "add-note" && (
        <AddNoteModal cookId={cook.id} cookName={cook.name} onClose={closeModal} />
      )}
      {activeModal === "issue-credit" && (
        <IssueCreditModal cookId={cook.id} cookName={cook.name} onClose={closeModal} />
      )}
      {activeModal === "reactivate" && (
        <ReactivateCookModal cookId={cook.id} cookName={cook.name} isAvailable={cook.isAvailable} onClose={closeModal} />
      )}
      {activeModal === "suspend" && (
        <SuspendCookModal cookId={cook.id} cookName={cook.name} onClose={closeModal} />
      )}
    </>
  );
}
