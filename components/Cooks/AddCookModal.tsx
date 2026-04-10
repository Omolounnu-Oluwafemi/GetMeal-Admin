"use client";

import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, ChevronDown } from "lucide-react";
import { ChefHat } from "@/lib/icons";
import { toast } from "sonner";
import { useCreateCook } from "@/lib/hooks/cooks";
import { getStates, getLgas, getTowns } from "nigeria-state-lga-data";

interface Props {
  onClose: () => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  experience: string;
  state: string;
  lga: string;
  city: string;
  referralCode: string;
  startImmediately: boolean;
  availableDate: string;
  notifyUser: boolean;
}

const INITIAL: FormState = {
  name: "",
  email: "",
  phone: "",
  experience: "",
  state: "",
  lga: "",
  city: "",
  referralCode: "",
  startImmediately: true,
  availableDate: "",
  notifyUser: true,
};

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#111827] mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-2.5 pr-9 rounded-xl border text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            error
              ? "border-red-400 bg-red-50 text-[#111827]"
              : "border-[#E5E7EB] bg-[#f9fafb] text-[#111827]"
          } ${!value ? "text-[#9CA3AF]" : ""}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function AddCookModal({ onClose }: Props) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const { mutate, isPending } = useCreateCook();

  const states: string[] = useMemo(() => getStates(), []);
  const lgas: string[] = useMemo(
    () => (form.state ? (getLgas(form.state) ?? []) : []),
    [form.state],
  );
  const towns: string[] = useMemo(
    () =>
      form.state && form.lga ? (getTowns(form.state, form.lga) ?? []) : [],
    [form.state, form.lga],
  );

  const set = (field: keyof FormState) => (value: string) => {
    setForm((f) => {
      let parsed: string | boolean = value;
      if (field === "startImmediately" || field === "notifyUser") {
        parsed = value === "true";
      }
      const next = { ...f, [field]: parsed };
      if (field === "state") { next.lga = ""; next.city = ""; }
      if (field === "lga") { next.city = ""; }
      return next;
    });
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const setInput =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
      set(field)(e.target.value);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.experience.trim()) e.experience = "Experience is required";
    if (!form.state) e.state = "State is required";
    if (!form.lga) e.lga = "LGA is required";
    if (!form.city) e.city = "City / Town is required";
    if (!form.startImmediately && !form.availableDate)
      e.availableDate = "Available date is required when not starting immediately";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const address = `${form.city}, ${form.lga}, ${form.state}, Nigeria`;

    mutate(
      {
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        address,
        experience: form.experience,
        startImmediately: form.startImmediately,
        availableDate: form.startImmediately ? undefined : form.availableDate,
        referralCode: form.referralCode || undefined,
        notifyUser: form.notifyUser,
      },
      {
        onSuccess: (res: any) => {
          toast.success(res.data.message ?? "Cook added successfully");
          onClose();
        },
        onError: (err: any) =>
          toast.error(err?.response?.data?.message ?? "Failed to add cook"),
      },
    );
  };

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[580px] max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#219e02] px-7 pt-5 pb-7 sticky top-0">
          <div className="flex justify-end mb-3">
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add New Cook</h2>
              <p className="text-sm text-white/80 mt-0.5">
                Create a cook account on the platform
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Amara's Kitchen"
              value={form.name}
              onChange={setInput("name")}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all ${errors.name ? "border-red-400 bg-red-50" : "border-[#E5E7EB] bg-[#f9fafb]"}`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="cook@example.com"
                value={form.email}
                onChange={setInput("email")}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all ${errors.email ? "border-red-400 bg-red-50" : "border-[#E5E7EB] bg-[#f9fafb]"}`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="08012345678"
                value={form.phone}
                onChange={setInput("phone")}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all ${errors.phone ? "border-red-400 bg-red-50" : "border-[#E5E7EB] bg-[#f9fafb]"}`}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1">
              Cooking Experience <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 5 years"
              value={form.experience}
              onChange={setInput("experience")}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all ${errors.experience ? "border-red-400 bg-red-50" : "border-[#E5E7EB] bg-[#f9fafb]"}`}
            />
            {errors.experience && (
              <p className="text-xs text-red-500 mt-1">{errors.experience}</p>
            )}
          </div>

          {/* Start Immediately toggle */}
          <div className="flex items-center justify-between p-4 bg-[#f9fafb] rounded-xl border border-[#E5E7EB]">
            <div>
              <p className="text-sm font-semibold text-[#111827]">Start Immediately</p>
              <p className="text-xs text-[#6B7280]">Cook is available to start right away</p>
            </div>
            <button
              type="button"
              onClick={() => set("startImmediately")(form.startImmediately ? "false" : "true")}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.startImmediately ? "bg-[#219e02]" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.startImmediately ? "translate-x-5" : ""}`} />
            </button>
          </div>

          {/* Available Date (shown only when not starting immediately) */}
          {!form.startImmediately && (
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1">
                Available From <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={form.availableDate}
                onChange={setInput("availableDate")}
                min={new Date().toISOString().slice(0, 16)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all ${errors.availableDate ? "border-red-400 bg-red-50" : "border-[#E5E7EB] bg-[#f9fafb]"}`}
              />
              {errors.availableDate && (
                <p className="text-xs text-red-500 mt-1">{errors.availableDate}</p>
              )}
            </div>
          )}

          {/* Location section */}
          <div className="border border-[#E5E7EB] rounded-xl p-4 space-y-4">
            <p className="text-sm font-semibold text-[#111827]">Location</p>

            {/* State */}
            <SelectField
              label="State"
              value={form.state}
              onChange={set("state")}
              options={states}
              placeholder="Select state"
              error={errors.state}
            />

            {/* LGA */}
            <SelectField
              label="Local Government Area (LGA)"
              value={form.lga}
              onChange={set("lga")}
              options={lgas}
              placeholder={form.state ? "Select LGA" : "Select a state first"}
              disabled={!form.state}
              error={errors.lga}
            />

            {/* City / Town */}
            <SelectField
              label="City / Town"
              value={form.city}
              onChange={set("city")}
              options={towns}
              placeholder={
                form.lga ? "Select city / town" : "Select an LGA first"
              }
              disabled={!form.lga}
              error={errors.city}
            />
          </div>

          {/* Referral Code (optional) */}
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1">
              Referral Code <span className="text-[#6B7280] font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. REF12345"
              value={form.referralCode}
              onChange={setInput("referralCode")}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#f9fafb] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all"
            />
          </div>

          {/* Notify User toggle */}
          <div className="flex items-center justify-between p-4 bg-[#f9fafb] rounded-xl border border-[#E5E7EB]">
            <div>
              <p className="text-sm font-semibold text-[#111827]">Notify Cook</p>
              <p className="text-xs text-[#6B7280]">Send account creation email to the cook</p>
            </div>
            <button
              type="button"
              onClick={() => set("notifyUser")(form.notifyUser ? "false" : "true")}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.notifyUser ? "bg-[#219e02]" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.notifyUser ? "translate-x-5" : ""}`} />
            </button>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#111827] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3 rounded-xl bg-[#219e02] text-white text-sm font-semibold hover:bg-[#1a7d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Adding Cook..." : "Add Cook"}
            </button>
          </div>
        </form>
      </div>
    </>,
    document.body,
  );
}
