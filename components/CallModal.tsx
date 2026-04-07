"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Phone } from "@/lib/icons";
import { Copy, CheckCheck } from "lucide-react";

interface CallModalProps {
  name: string;
  phone: string;
  onClose: () => void;
}

export default function CallModal({ name, phone, onClose }: CallModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(phone).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        {/* Green header */}
        <div className="bg-[#219e02] px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-base">{name}</p>
            <p className="text-white/70 text-xs">Call this contact</p>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-xs text-gray-400 mb-2">Phone number</p>
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <span className="text-lg font-semibold text-gray-900 tracking-wide">
              {phone || "—"}
            </span>
            <button
              onClick={handleCopy}
              disabled={!phone || phone === "—"}
              className="flex items-center gap-1.5 text-xs font-medium text-[#219e02] hover:text-[#1a7d01] disabled:opacity-40 transition-colors"
            >
              {copied ? (
                <><CheckCheck className="w-4 h-4" /> Copied</>
              ) : (
                <><Copy className="w-4 h-4" /> Copy</>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Copy the number above to call from your phone
          </p>
        </div>

        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
