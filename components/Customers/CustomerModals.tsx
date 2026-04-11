"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { X, CreditCard, FileText, ChevronDown, Check } from "@/lib/icons";
import { Mail, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  useMessageCustomer,
  useCreditCustomerWallet,
  useAddCustomerNote,
  useUpdateCustomerStatus,
} from "@/lib/hooks/customers";

interface ModalProps {
  customerId: string;
  customerName: string;
  onClose: () => void;
}

/* ─── Shared Backdrop + Panel wrapper ─── */
function ModalShell({
  children,
  onClose,
  width = "w-[560px]",
}: {
  children: React.ReactNode;
  onClose: () => void;
  width?: string;
}) {
  return createPortal(
    <>
      <motion.div
        className="fixed inset-0 bg-black/40 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />
      <motion.div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] ${width} bg-white rounded-2xl shadow-2xl overflow-hidden`}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </>,
    document.body,
  );
}

/* ─── 1. Send Email Modal ─── */
export function SendEmailModal({ customerId, customerName, onClose }: ModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { mutate: sendMessage, isPending } = useMessageCustomer(customerId);

  const handleSend = () => {
    sendMessage(
      { subject, message },
      {
        onSuccess: (res: any) => { toast.success(res.data.message); onClose(); },
        onError: (e: any) => toast.error(e?.response?.data?.message ?? "Failed to send email."),
      }
    );
  };

  return (
    <ModalShell onClose={onClose}>
      {/* Green header */}
      <div className="bg-[#219e02] px-7 py-6 flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <Mail className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">
            Send Email to {customerName}
          </h2>
          <p className="text-sm text-white/80 mt-0.5">
            Compose and send an email directly to this customer.
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-auto p-1.5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Body */}
      <div className="px-7 py-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter email subject..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-3 bg-[#f3f4f6] border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <div className="bg-[#f3f4f6] border border-[#E5E7EB] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#219e02]/20 focus-within:border-[#219e02] transition-all">
            <textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full px-4 pt-3 bg-transparent text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none resize-none"
            />
            <p className="text-xs text-[#9CA3AF] px-4 pb-3">
              {message.length} characters
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 px-7 pb-7">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#111827] hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSend}
          disabled={!subject || !message || isPending}
          className="flex-1 py-3 rounded-xl bg-[#219e02] text-white text-sm font-semibold hover:bg-[#1a7d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Sending..." : "Send Email"}
        </button>
      </div>
    </ModalShell>
  );
}

/* ─── 2. Issue Credit Modal ─── */
const creditReasons = [
  "Order cancellation refund",
  "Delayed delivery compensation",
  "Poor food quality compensation",
  "Goodwill credit",
  "Other",
];

export function IssueCreditModal({ customerId, customerName, onClose }: ModalProps) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [reasonOpen, setReasonOpen] = useState(false);
  const { mutate: creditWallet, isPending } = useCreditCustomerWallet(customerId);

  const handleCredit = () => {
    creditWallet(
      { amount: Number(amount), reason, note: note || undefined },
      {
        onSuccess: (res: any) => { toast.success(res.data.message); onClose(); },
        onError: (e: any) => toast.error(e?.response?.data?.message ?? "Failed to issue credit."),
      }
    );
  };

  return (
    <ModalShell onClose={onClose} width="w-[520px]">
      {/* Header */}
      <div className="flex items-start justify-between px-7 pt-6 pb-1">
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-[#219e02]" />
          <div>
            <h2 className="text-base font-bold text-[#111827]">Issue Credit</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Add credit to {customerName}&apos;s account. This amount can be used
              for future orders.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>

      {/* Body */}
      <div className="px-7 py-5 space-y-4">
        {/* Amount */}
        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-2">
            Amount (NGN) <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center bg-[#f3f4f6] border border-[#E5E7EB] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#219e02]/20 focus-within:border-[#219e02] transition-all">
            <span className="pl-4 text-sm text-[#6B7280] font-medium">₦</span>
            <input
              type="number"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 px-3 py-3 bg-transparent text-sm text-[#111827] focus:outline-none"
            />
          </div>
        </div>

        {/* Reason dropdown */}
        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-2">
            Reason <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <button
              onClick={() => setReasonOpen((p) => !p)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#f3f4f6] border border-[#E5E7EB] rounded-xl text-sm transition-all focus:outline-none hover:border-[#219e02] hover:ring-2 hover:ring-[#219e02]/20"
            >
              <span className={reason ? "text-[#111827]" : "text-[#9CA3AF]"}>
                {reason || "Select a reason"}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${reasonOpen ? "rotate-180" : ""}`}
              />
            </button>
            {reasonOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setReasonOpen(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-20 overflow-hidden">
                  {creditReasons.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setReason(r);
                        setReasonOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-[#111827] hover:bg-[#F9FAFB] transition-colors"
                    >
                      <span>{r}</span>
                      {reason === r && (
                        <Check className="w-4 h-4 text-[#219e02]" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Internal note */}
        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-2">
            Internal note{" "}
            <span className="text-[#6B7280] font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="Add context or reference order number..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-[#f3f4f6] border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all resize-none"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 px-7 pb-7">
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#111827] hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCredit}
          disabled={!amount || !reason || isPending}
          className="flex-1 py-3 rounded-xl bg-[#219e02] text-white text-sm font-semibold hover:bg-[#1a7d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Processing..." : "Issue Credit"}
        </button>
      </div>
    </ModalShell>
  );
}

/* ─── 3. Add Internal Note Modal ─── */
const MAX_NOTE = 500;

export function AddNoteModal({ customerId, customerName, onClose }: ModalProps) {
  const [note, setNote] = useState("");
  const { mutate: addNote, isPending } = useAddCustomerNote(customerId);

  const handleAdd = () => {
    addNote(note, {
      onSuccess: (res: any) => { toast.success(res.data.message); onClose(); },
      onError: (e: any) => toast.error(e?.response?.data?.message ?? "Failed to add note."),
    });
  };

  return (
    <ModalShell onClose={onClose} width="w-[520px]">
      {/* Header */}
      <div className="flex items-start justify-between px-7 pt-6 pb-1">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#219e02]" />
          <div>
            <h2 className="text-base font-bold text-[#111827]">
              Add Internal Note
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Add a note to {customerName}&apos;s profile. This is only visible to
              admin team members.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>

      {/* Body */}
      <div className="px-7 py-5">
        <label className="block text-sm font-semibold text-[#111827] mb-2">
          Note
        </label>
        <div className="bg-[#f3f4f6] border border-[#E5E7EB] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#219e02]/20 focus-within:border-[#219e02] transition-all">
          <textarea
            placeholder="e.g., VIP customer, prefers mild spice level..."
            value={note}
            onChange={(e) =>
              setNote(e.target.value.slice(0, MAX_NOTE))
            }
            rows={5}
            className="w-full px-4 pt-3 pb-2 bg-transparent text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none resize-none"
          />
          <p className="text-xs text-[#9CA3AF] px-4 pb-3">
            {note.length} / {MAX_NOTE} characters
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 px-7 pb-7">
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#111827] hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleAdd}
          disabled={!note.trim() || isPending}
          className="flex-1 py-3 rounded-xl bg-[#219e02] text-white text-sm font-semibold hover:bg-[#1a7d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Add Note"}
        </button>
      </div>
    </ModalShell>
  );
}

/* ─── 4. Suspend User Modal ─── */
export function SuspendUserModal({ customerId, customerName, onClose }: ModalProps) {
  const [note, setNote] = useState("");
  const [notify, setNotify] = useState(true);
  const { mutate: updateStatus, isPending } = useUpdateCustomerStatus(customerId);

  const handleSuspend = () => {
    updateStatus("suspend", {
      onSuccess: (res: any) => { toast.success(res.data.message); onClose(); },
      onError: (e: any) => toast.error(e?.response?.data?.message ?? "Failed to suspend account."),
    });
  };

  return (
    <ModalShell onClose={onClose} width="w-[520px]">
      {/* Header */}
      <div className="flex items-start justify-between px-7 pt-6 pb-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111827]">
              Suspend {customerName}?
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              This will prevent them from placing orders on the platform.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>

      {/* Body */}
      <div className="px-7 py-5 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1">
            Internal note{" "}
            <span className="text-[#6B7280] font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="Add any additional context about why the account is being suspended..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-[#f3f4f6] border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all resize-none"
          />
        </div>

        {/* Notify toggle */}
        <div className="flex items-center justify-between p-4 bg-[#f9fafb] rounded-xl border border-[#E5E7EB]">
          <div>
            <p className="text-sm font-semibold text-[#111827]">
              Notify customer
            </p>
            <p className="text-xs text-[#6B7280]">
              Send suspension notice via email
            </p>
          </div>
          <button
            onClick={() => setNotify((p) => !p)}
            className={`relative w-11 h-6 rounded-full transition-colors ${notify ? "bg-[#219e02]" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notify ? "translate-x-5" : ""}`}
            />
          </button>
        </div>

        {/* Info box */}
        <div className="flex gap-3 p-4 bg-red-50 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-600 leading-relaxed">
            The customer&apos;s account will be immediately suspended. They will not
            be able to place orders until the account is reactivated.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 px-7 pb-7">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#111827] hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSuspend}
          disabled={isPending}
          className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Suspending..." : "Suspend Account"}
        </button>
      </div>
    </ModalShell>
  );
}

/* ─── 5. Reactivate Account Modal ─── */
export function ReactivateModal({ customerId, customerName, onClose }: ModalProps) {
  const [note, setNote] = useState("");
  const [notify, setNotify] = useState(true);
  const { mutate: updateStatus, isPending } = useUpdateCustomerStatus(customerId);

  const handleReactivate = () => {
    updateStatus("activate", {
      onSuccess: (res: any) => { toast.success(res.data.message); onClose(); },
      onError: (e: any) => toast.error(e?.response?.data?.message ?? "Failed to reactivate account."),
    });
  };

  return (
    <ModalShell onClose={onClose} width="w-[520px]">
      {/* Header */}
      <div className="flex items-start justify-between px-7 pt-6 pb-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ddf5e5] flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-[#219e02]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111827]">
              Reactivate {customerName}?
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              This will restore their account and allow them to place orders on
              the platform immediately.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>

      {/* Body */}
      <div className="px-7 py-5 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1">
            Internal note{" "}
            <span className="text-[#6B7280] font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="Add any additional context about why the account is being reactivated..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-[#f3f4f6] border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all resize-none"
          />
        </div>

        {/* Notify toggle */}
        <div className="flex items-center justify-between p-4 bg-[#f9fafb] rounded-xl border border-[#E5E7EB]">
          <div>
            <p className="text-sm font-semibold text-[#111827]">
              Notify customer
            </p>
            <p className="text-xs text-[#6B7280]">
              Send reactivation notice via email
            </p>
          </div>
          <button
            onClick={() => setNotify((p) => !p)}
            className={`relative w-11 h-6 rounded-full transition-colors ${notify ? "bg-[#219e02]" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notify ? "translate-x-5" : ""}`}
            />
          </button>
        </div>

        {/* Info box */}
        <div className="flex gap-3 p-4 bg-blue-50 rounded-xl">
          <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-[10px] font-bold">i</span>
          </div>
          <p className="text-xs text-blue-600 leading-relaxed">
            The customer&apos;s account will be immediately restored to active
            status. They will be able to use the platform right away.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 px-7 pb-7">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#111827] hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleReactivate}
          disabled={isPending}
          className="flex-1 py-3 rounded-xl bg-[#219e02] text-white text-sm font-semibold hover:bg-[#1a7d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Reactivating..." : "Reactivate Account"}
        </button>
      </div>
    </ModalShell>
  );
}
