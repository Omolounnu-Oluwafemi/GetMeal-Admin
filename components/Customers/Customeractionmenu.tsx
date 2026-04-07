"use client";

import { useState } from "react";
import { Eye, MessageSquare, CreditCard, FileText, Ban } from "@/lib/icons";
import { UserCheck } from "lucide-react";
import {
  SendEmailModal,
  IssueCreditModal,
  AddNoteModal,
  SuspendUserModal,
  ReactivateModal,
} from "./CustomerModals";
import CustomerProfileSidebar from "./CustomerProfileSidebar";
import { useCustomerById } from "@/lib/hooks/customers";
import { mapCustomerDetail } from "@/lib/mappers/customers";
import type { Customer } from "./Customerstable";

function CustomerProfileFetcher({
  customerId,
  initialCustomer,
  onClose,
  onMessage,
  onAddNote,
  onSuspend,
  onReactivate,
}: {
  customerId: string;
  initialCustomer: Customer;
  onClose: () => void;
  onMessage: () => void;
  onAddNote: () => void;
  onSuspend: () => void;
  onReactivate: () => void;
}) {
  const { data, isLoading } = useCustomerById(customerId);
  const customer = data && !isLoading ? mapCustomerDetail(data) : initialCustomer;
  return (
    <CustomerProfileSidebar
      customer={customer}
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
  | "send-email"
  | "issue-credit"
  | "add-note"
  | "suspend"
  | "reactivate"
  | null;

interface CustomerActionMenuProps {
  customer: Customer;
  onClose: () => void;
}

export default function CustomerActionMenu({
  customer,
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

        {customer.status === "Suspended" ? (
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

      {activeModal === "view-profile" && (
        <CustomerProfileFetcher
          customerId={customer.id}
          initialCustomer={customer}
          onClose={closeModal}
          onMessage={() => setActiveModal("send-email")}
          onAddNote={() => setActiveModal("add-note")}
          onSuspend={() => setActiveModal("suspend")}
          onReactivate={() => setActiveModal("reactivate")}
        />
      )}
      {activeModal === "send-email" && (
        <SendEmailModal customerId={customer.id} customerName={customer.name} onClose={closeModal} />
      )}
      {activeModal === "issue-credit" && (
        <IssueCreditModal customerId={customer.id} customerName={customer.name} onClose={closeModal} />
      )}
      {activeModal === "add-note" && (
        <AddNoteModal customerId={customer.id} customerName={customer.name} onClose={closeModal} />
      )}
      {activeModal === "suspend" && (
        <SuspendUserModal customerId={customer.id} customerName={customer.name} onClose={closeModal} />
      )}
      {activeModal === "reactivate" && (
        <ReactivateModal customerId={customer.id} customerName={customer.name} onClose={closeModal} />
      )}
    </>
  );
}
