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
  ViewOrdersModal,
  SendEmailModal,
  ChangeStatusModal,
  AddNoteModal,
  ReactivateCookModal,
  SuspendCookModal,
  IssueCreditModal,
} from "./CookModals";
import CookProfileSidebar from "./CookProfileSidebar";
import type { Cook } from "./Cookstable";

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

        {cook.status === "Suspended" ? (
          <button
            onClick={() => openModal("reactivate")}
            className="w-full px-4 py-2 text-left text-sm text-[#219e02] hover:bg-green-50 flex items-center gap-2 transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            Reactivate Cook
          </button>
        ) : (
          <button
            onClick={() => openModal("suspend")}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
          >
            <UserX className="w-4 h-4" />
            Suspend Cook
          </button>
        )}
      </div>

      {activeModal === "view-profile" && (
        <CookProfileSidebar
          cook={cook}
          onClose={closeModal}
          onMessage={() => setActiveModal("message")}
          onAddNote={() => setActiveModal("add-note")}
          onSuspend={() => setActiveModal("suspend")}
          onReactivate={() => setActiveModal("reactivate")}
        />
      )}
      {activeModal === "view-orders" && (
        <ViewOrdersModal cookId={cook.id} cookName={cook.name} onClose={closeModal} />
      )}
      {activeModal === "message" && (
        <SendEmailModal cookId={cook.id} cookName={cook.name} onClose={closeModal} />
      )}
      {activeModal === "change-status" && (
        <ChangeStatusModal cookId={cook.id} cookName={cook.name} onClose={closeModal} />
      )}
      {activeModal === "add-note" && (
        <AddNoteModal cookId={cook.id} cookName={cook.name} onClose={closeModal} />
      )}
      {activeModal === "issue-credit" && (
        <IssueCreditModal cookId={cook.id} cookName={cook.name} onClose={closeModal} />
      )}
      {activeModal === "reactivate" && (
        <ReactivateCookModal cookId={cook.id} cookName={cook.name} onClose={closeModal} />
      )}
      {activeModal === "suspend" && (
        <SuspendCookModal cookId={cook.id} cookName={cook.name} onClose={closeModal} />
      )}
    </>
  );
}
