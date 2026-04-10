"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { X, FileText, ChevronDown, Check } from "@/lib/icons";
import {
  Mail,
  CheckCircle,
  AlertTriangle,
  Package,
  Clock,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import {
  useMessageCook,
  useAddCookNote,
  useUpdateCookStatus,
  useCookSuspendAction,
  useCreditCookWallet,
} from "@/lib/hooks/cooks";

interface ModalProps {
  cookId: string;
  cookName: string;
  onClose: () => void;
  isAvailable?: boolean;
  isApproved?: boolean;
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
      <motion.div className="fixed inset-0 bg-black/40 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} onClick={onClose} />
      <motion.div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 ${width} bg-white rounded-2xl shadow-2xl overflow-hidden`}
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

/* ─── 1. View Orders Modal ─── */
export function ViewOrdersModal({ cookName, onClose }: ModalProps) {
  return (
    <ModalShell onClose={onClose} width="w-[38%]">
      {/* Header */}
      <div className="flex items-start justify-between px-7 pt-6 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-semibold text-[#111827]">
            Order History - {cookName}
          </h2>
          <p className="text-sm text-[#6B7280] mt-0.5">0 orders</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="p-6 bg-slate-50 rounded-full">
          <Package className="w-14 h-14 text-gray-300 " strokeWidth={2} />
        </div>
        <p className="text-base font-semibold text-[#6B7280]">No Orders Yet</p>
        <p className="text-sm text-[#83878d]">
          This cook hasn&apos;t completed or cancelled any orders
        </p>
      </div>
    </ModalShell>
  );
}

/* ─── 2. Send Email Modal ─── */
export function SendEmailModal({ cookId, cookName, onClose }: ModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { mutate, isPending } = useMessageCook(cookId);

  const handleSend = () => {
    mutate(
      { subject, message },
      {
        onSuccess: (res: any) => {
          toast.success(res.data.message);
          onClose();
        },
        onError: (e: any) =>
          toast.error(e?.response?.data?.message ?? "Failed to send email."),
      },
    );
  };

  return (
    <ModalShell onClose={onClose}>
      {/* Green header */}
      <div className="bg-[#219e02] px-7 pt-3 pb-8">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>
        <div className="flex gap-4 ">
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">
              Send Email to {cookName}
            </h2>
            <p className="text-base text-white/80 mt-1">
              Compose and send an email directly to this cook.
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-7 py-6 space-y-5">
        <div className="border border-[#E5E7EB] rounded-2xl px-4 pt-3 pb-2 bg-white  ">
          <label className="block text-sm font-semibold text-[#111827] mb-1">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter email subject..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full py-3 px-2 rounded-lg bg-gray-200 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus-within:ring-[#219e02]/20 focus-within:border-[#219e02]  transition-all"
          />
        </div>

        <div className="border border-[#E5E7EB] rounded-2xl px-4 pt-3 pb-2 bg-white ">
          <label className="block text-sm font-semibold text-[#111827] mb-1">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            className="w-full py-2 px-2 rounded-lg bg-gray-200 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none resize-none focus-within:ring-2 focus-within:ring-[#219e02]/20 focus-within:border-[#219e02] transition-all"
          />
          <p className="text-xs text-[#9CA3AF] pb-1">
            {message.length} characters
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

/* ─── 3. Change Status Modal (setActive / setInactive based on isAvailable) ─── */
export function ChangeStatusModal({ cookId, cookName, isAvailable = false, isApproved = true, onClose }: ModalProps) {
  const { mutate, isPending } = useUpdateCookStatus(cookId);

  // If not yet approved → always setActive to approve them
  // Otherwise toggle: active → setInactive, inactive → setActive
  const settingActive = !isApproved || !isAvailable;
  const action: "setActive" | "setInactive" = settingActive ? "setActive" : "setInactive";

  const handleChange = () => {
    mutate(
      { action },
      {
        onSuccess: (res: any) => {
          toast.success(res.data.message);
          onClose();
        },
        onError: (e: any) =>
          toast.error(e?.response?.data?.message ?? "Failed to update status."),
      },
    );
  };

  return (
    <ModalShell onClose={onClose} width="w-[520px]">
      {/* Header */}
      <div className="flex items-start justify-between px-7 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <Clock className={`w-5 h-5 ${settingActive ? "text-[#219e02]" : "text-orange-500"}`} />
          <div>
            <h2 className="text-base font-bold text-[#111827]">
              Set {cookName} to {settingActive ? "Active" : "Inactive"}?
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {settingActive
                ? "This cook will start receiving new orders again."
                : "This cook will be temporarily unavailable to receive new orders."}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>

      {/* Body */}
      <div className="px-7 pb-6">
        <div className={`flex gap-3 p-4 rounded-xl border ${settingActive ? "bg-[#f0fdf4] border-[#bbf7d0]" : "bg-orange-50 border-orange-200"}`}>
          <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${settingActive ? "text-[#219e02]" : "text-orange-500"}`} />
          <p className={`text-xs leading-relaxed ${settingActive ? "text-[#219e02]" : "text-orange-600"}`}>
            <span className="font-semibold">Impact:</span>{" "}
            {settingActive
              ? "This cook's meals will become visible to customers and they can receive new orders."
              : "This cook's meals will be hidden from customers until they are set back to active."}
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
          onClick={handleChange}
          disabled={isPending}
          className={`flex-1 py-3 rounded-xl text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${settingActive ? "bg-[#219e02] hover:bg-[#1a7d01]" : "bg-orange-500 hover:bg-orange-600"}`}
        >
          {isPending ? "Updating..." : settingActive ? "Set to Active" : "Set to Inactive"}
        </button>
      </div>
    </ModalShell>
  );
}

/* ─── 4. Add Internal Note Modal ─── */
const MAX_NOTE = 500;

export function AddNoteModal({ cookId, cookName, onClose }: ModalProps) {
  const [note, setNote] = useState("");
  const { mutate, isPending } = useAddCookNote(cookId);

  const handleSubmit = () => {
    mutate(
      { note },
      {
        onSuccess: (res: any) => {
          toast.success(res.data.message);
          onClose();
        },
        onError: (e: any) =>
          toast.error(e?.response?.data?.message ?? "Failed to add note."),
      },
    );
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
              Add a note to {cookName}&apos;s profile. This is only visible to
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
            onChange={(e) => setNote(e.target.value.slice(0, MAX_NOTE))}
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
          onClick={handleSubmit}
          disabled={!note.trim() || isPending}
          className="flex-1 py-3 rounded-xl bg-[#219e02] text-white text-sm font-semibold hover:bg-[#1a7d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Add Note"}
        </button>
      </div>
    </ModalShell>
  );
}

/* ─── 5. Reactivate Cook Modal (action: "activate" → sets isApproved: true) ─── */
export function ReactivateCookModal({ cookId, cookName, onClose }: ModalProps) {
  const [note, setNote] = useState("");
  const [notify, setNotify] = useState(true);
  const { mutate, isPending } = useCookSuspendAction(cookId);

  const handleActivate = () => {
    mutate(
      { action: "activate", note: note || undefined, notifyCook: notify },
      {
        onSuccess: (res: any) => {
          toast.success(res.data.message);
          onClose();
        },
        onError: (e: any) =>
          toast.error(e?.response?.data?.message ?? "Failed to activate cook."),
      },
    );
  };

  return (
    <ModalShell onClose={onClose} width="w-[520px]">
      {/* Header */}
      <div className="flex items-start justify-between px-7 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ddf5e5] flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-[#219e02]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111827]">
              Activate {cookName}?
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              This will approve their account and allow them to start receiving orders on the platform.
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>

      {/* Body */}
      <div className="px-7 pb-5 space-y-4">
        <div className="p-4 border border-[#E5E7EB] rounded-xl">
          <label className="block text-sm font-semibold text-[#111827] mb-1">
            Internal note{" "}
            <span className="text-[#6B7280] font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="Add any additional context about why the account is being activated..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 bg-[#f3f4f6] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all resize-none"
          />
        </div>

        {/* Notify toggle */}
        <div className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-xl">
          <div>
            <p className="text-sm font-semibold text-[#111827]">Notify cook</p>
            <p className="text-xs text-[#6B7280]">Send activation notice via email</p>
          </div>
          <button
            onClick={() => setNotify((p) => !p)}
            className={`relative w-11 h-6 rounded-full transition-colors ${notify ? "bg-[#219e02]" : "bg-gray-300"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notify ? "translate-x-5" : ""}`} />
          </button>
        </div>

        {/* Info box */}
        <div className="flex gap-3 p-4 bg-blue-50 rounded-xl">
          <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-[10px] font-bold">i</span>
          </div>
          <p className="text-xs text-blue-600 leading-relaxed">
            The cook&apos;s account will be approved and they will be able to start receiving orders on the platform right away.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 px-7 pb-7">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#111827] hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button
          onClick={handleActivate}
          disabled={isPending}
          className="flex-1 py-3 rounded-xl bg-[#219e02] text-white text-sm font-semibold hover:bg-[#1a7d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Activating..." : "Activate Cook"}
        </button>
      </div>
    </ModalShell>
  );
}

/* ─── 6. Suspend Cook Modal ─── */
const suspendReasons = [
  "Multiple customer complaints",
  "Food quality issues",
  "Late deliveries",
  "Unprofessional behaviour",
  "Fraud or policy violation",
  "Other",
];

export function SuspendCookModal({ cookId, cookName, onClose }: ModalProps) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [notify, setNotify] = useState(true);
  const [reasonOpen, setReasonOpen] = useState(false);
  const { mutate, isPending } = useCookSuspendAction(cookId);

  const handleSuspend = () => {
    mutate(
      { action: "suspend", reason, note: note || undefined, notifyCook: notify },
      {
        onSuccess: (res: any) => {
          toast.success(res.data.message);
          onClose();
        },
        onError: (e: any) =>
          toast.error(e?.response?.data?.message ?? "Failed to suspend cook."),
      },
    );
  };

  return (
    <ModalShell onClose={onClose} width="w-[560px]">
      {/* Red header */}
      <div className="bg-red-50 px-7 py-5 flex items-center gap-4 border-b border-red-100">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-[#111827]">
            Suspend {cookName}?
          </h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            This will prevent them from receiving orders on the platform. You
            can reactivate them anytime.
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>

      {/* Body */}
      <div className="px-7 py-5 space-y-4">
        {/* Reason dropdown */}
        <div className="p-4 border border-[#E5E7EB] rounded-xl">
          <label className="block text-sm font-semibold text-[#111827] mb-2">
            Reason for suspension <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <button
              onClick={() => setReasonOpen((p) => !p)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#f3f4f6] border border-[#E5E7EB] rounded-xl text-sm transition-all focus:outline-none hover:border-red-300 hover:ring-2 hover:ring-red-100"
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
                  {suspendReasons.map((r) => (
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
        <div className="p-4 border border-[#E5E7EB] rounded-xl">
          <label className="block text-sm font-semibold text-[#111827] mb-2">
            Internal note{" "}
            <span className="text-[#6B7280] font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="Add any additional context or details for the team..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 bg-[#f3f4f6] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all resize-none"
          />
        </div>

        {/* Notify toggle */}
        <div className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-xl">
          <div>
            <p className="text-sm font-semibold text-[#111827]">Notify cook</p>
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
          disabled={!reason || isPending}
          className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Suspending..." : "Suspend Account"}
        </button>
      </div>
    </ModalShell>
  );
}

/* ─── 7. Issue Credit Modal ─── */
export function IssueCreditModal({ cookId, cookName, onClose }: ModalProps) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const { mutate, isPending } = useCreditCookWallet(cookId);

  const handleSubmit = () => {
    mutate(
      { amount: Number(amount), reason },
      {
        onSuccess: (res: any) => {
          toast.success(res.data.message);
          onClose();
        },
        onError: (e: any) =>
          toast.error(e?.response?.data?.message ?? "Failed to credit wallet."),
      },
    );
  };

  return (
    <ModalShell onClose={onClose} width="w-[520px]">
      {/* Header */}
      <div className="flex items-start justify-between px-7 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ddf5e5] flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5 text-[#219e02]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111827]">
              Issue Credit to {cookName}
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Add funds directly to this cook&apos;s wallet balance.
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
      <div className="px-7 pb-5 space-y-4">
        <div className="p-4 border border-[#E5E7EB] rounded-xl">
          <label className="block text-sm font-semibold text-[#111827] mb-2">
            Amount (₦) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={1}
            className="w-full px-3 py-2.5 bg-[#f3f4f6] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all"
          />
        </div>

        <div className="p-4 border border-[#E5E7EB] rounded-xl">
          <label className="block text-sm font-semibold text-[#111827] mb-2">
            Reason{" "}
            <span className="text-[#6B7280] font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="e.g., Compensation for delayed payout..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 bg-[#f3f4f6] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all resize-none"
          />
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
          onClick={handleSubmit}
          disabled={!amount || Number(amount) <= 0 || isPending}
          className="flex-1 py-3 rounded-xl bg-[#219e02] text-white text-sm font-semibold hover:bg-[#1a7d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Processing..." : "Issue Credit"}
        </button>
      </div>
    </ModalShell>
  );
}
