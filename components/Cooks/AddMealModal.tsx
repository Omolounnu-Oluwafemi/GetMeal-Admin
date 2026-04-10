"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronDown, Plus, Trash2, Upload, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { useCreateMeal, useMealCategories } from "@/lib/hooks/meals";
import { useCooks } from "@/lib/hooks/cooks";

interface Props {
  onClose: () => void;
}

interface DeliveryRegion {
  region: string;
  fee: string;
}

interface FormState {
  cookId: string;
  category: string;
  name: string;
  description: string;
  price: string;
  quantityLabel: string;
  portionsTotal: string;
  unitsPerQuantity: string;
  cookingDate: string;
  pickupFrom: string;
  pickupTo: string;
  deliveryRegions: DeliveryRegion[];
}

const INITIAL: FormState = {
  cookId: "",
  category: "",
  name: "",
  description: "",
  price: "",
  quantityLabel: "",
  portionsTotal: "",
  unitsPerQuantity: "",
  cookingDate: "",
  pickupFrom: "",
  pickupTo: "",
  deliveryRegions: [{ region: "", fee: "" }],
};

export default function AddMealModal({ onClose }: Props) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useCreateMeal();
  const { data: categories = [] } = useMealCategories();
  const { data: cooksData = [] } = useCooks({});

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const setDeliveryRegion = (idx: number, key: keyof DeliveryRegion, value: string) => {
    setForm((f) => {
      const regions = [...f.deliveryRegions];
      regions[idx] = { ...regions[idx], [key]: value };
      return { ...f, deliveryRegions: regions };
    });
  };

  const addRegion = () =>
    setForm((f) => ({ ...f, deliveryRegions: [...f.deliveryRegions, { region: "", fee: "" }] }));

  const removeRegion = (idx: number) =>
    setForm((f) => ({ ...f, deliveryRegions: f.deliveryRegions.filter((_, i) => i !== idx) }));

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.cookId) e.cookId = "Cook is required";
    if (!form.category) e.category = "Category is required";
    if (!form.name.trim()) e.name = "Meal name is required";
    if (!form.price) e.price = "Price is required";
    if (!form.portionsTotal) e.portionsTotal = "Portions total is required";
    if (!form.cookingDate) e.cookingDate = "Cooking date is required";
    if (!form.pickupFrom) e.pickupFrom = "Pickup start is required";
    if (!form.pickupTo) e.pickupTo = "Pickup end is required";
    if (images.length === 0) e.images = "At least one image is required";
    form.deliveryRegions.forEach((r, i) => {
      if (!r.region.trim()) e[`region_${i}`] = "Region name is required";
      if (!r.fee) e[`fee_${i}`] = "Fee is required";
    });
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const fd = new FormData();
    fd.append("cookId", form.cookId);
    fd.append("category", form.category);
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("price", form.price);
    if (form.quantityLabel) fd.append("quantityLabel", form.quantityLabel);
    fd.append("portionsTotal", form.portionsTotal);
    fd.append("unitsPerQuantity", form.unitsPerQuantity || "1");
    fd.append("cookingDate", new Date(form.cookingDate).toISOString());
    fd.append("pickupWindow[from]", new Date(form.pickupFrom).toISOString());
    fd.append("pickupWindow[to]", new Date(form.pickupTo).toISOString());
    form.deliveryRegions.forEach((r, i) => {
      fd.append(`deliveryRegions[${i}][region]`, r.region);
      fd.append(`deliveryRegions[${i}][fee]`, r.fee);
    });
    images.forEach((img) => fd.append("images", img));

    mutate(fd, {
      onSuccess: (res: any) => {
        toast.success(res.message ?? "Meal created successfully");
        onClose();
      },
      onError: (err: any) =>
        toast.error(err?.response?.data?.message ?? "Failed to create meal"),
    });
  };

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[640px] max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#219e02] px-7 pt-5 pb-7 rounded-t-2xl flex-shrink-0">
          <div className="flex justify-end mb-3">
            <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Meal</h2>
              <p className="text-sm text-white/80 mt-0.5">Add a new meal on behalf of a cook</p>
            </div>
          </div>
        </div>

        {/* Scrollable form */}
        <form
          onSubmit={handleSubmit}
          className="px-7 py-6 space-y-5 overflow-y-auto scrollbar-hide flex-1"
        >
          {/* Cook selector */}
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1">
              Cook <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={form.cookId}
                onChange={set("cookId")}
                className={`w-full px-4 py-2.5 pr-9 rounded-xl border text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all ${errors.cookId ? "border-red-400 bg-red-50" : "border-[#E5E7EB] bg-[#f9fafb]"} ${!form.cookId ? "text-[#9CA3AF]" : "text-[#111827]"}`}
              >
                <option value="" disabled>Select a cook</option>
                {cooksData.map((c) => (
                  <option key={c.cookId} value={c.cookId}>
                    {c.name ?? c.cookId}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
            </div>
            {errors.cookId && <p className="text-xs text-red-500 mt-1">{errors.cookId}</p>}
          </div>

          {/* Name + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1">
                Meal Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ofe Nsala"
                value={form.name}
                onChange={set("name")}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all ${errors.name ? "border-red-400 bg-red-50" : "border-[#E5E7EB] bg-[#f9fafb]"}`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={set("category")}
                  className={`w-full px-4 py-2.5 pr-9 rounded-xl border text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all ${errors.category ? "border-red-400 bg-red-50" : "border-[#E5E7EB] bg-[#f9fafb]"} ${!form.category ? "text-[#9CA3AF]" : "text-[#111827]"}`}
                >
                  <option value="" disabled>Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
              </div>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1">Description</label>
            <textarea
              placeholder="Brief description of the meal..."
              value={form.description}
              onChange={set("description")}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#f9fafb] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all resize-none"
            />
          </div>

          {/* Price + Portions + Units + Quantity Label */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1">
                Price (₦) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 3500"
                value={form.price}
                onChange={set("price")}
                min="0"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all ${errors.price ? "border-red-400 bg-red-50" : "border-[#E5E7EB] bg-[#f9fafb]"}`}
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1">
                Portions Total <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 5"
                value={form.portionsTotal}
                onChange={set("portionsTotal")}
                min="1"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all ${errors.portionsTotal ? "border-red-400 bg-red-50" : "border-[#E5E7EB] bg-[#f9fafb]"}`}
              />
              {errors.portionsTotal && <p className="text-xs text-red-500 mt-1">{errors.portionsTotal}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1">Quantity Label</label>
              <input
                type="text"
                placeholder="e.g. litre, plate"
                value={form.quantityLabel}
                onChange={set("quantityLabel")}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#f9fafb] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1">Units per Quantity</label>
              <input
                type="number"
                placeholder="e.g. 2 (defaults to 1)"
                value={form.unitsPerQuantity}
                onChange={set("unitsPerQuantity")}
                min="1"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#f9fafb] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="border border-[#E5E7EB] rounded-xl p-4 space-y-4">
            <p className="text-sm font-semibold text-[#111827]">Schedule</p>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Cooking Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={form.cookingDate}
                onChange={set("cookingDate")}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all ${errors.cookingDate ? "border-red-400 bg-red-50" : "border-[#E5E7EB] bg-[#f9fafb]"}`}
              />
              {errors.cookingDate && <p className="text-xs text-red-500 mt-1">{errors.cookingDate}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">
                  Pickup Window — From <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={form.pickupFrom}
                  onChange={set("pickupFrom")}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all ${errors.pickupFrom ? "border-red-400 bg-red-50" : "border-[#E5E7EB] bg-[#f9fafb]"}`}
                />
                {errors.pickupFrom && <p className="text-xs text-red-500 mt-1">{errors.pickupFrom}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">
                  Pickup Window — To <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={form.pickupTo}
                  onChange={set("pickupTo")}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all ${errors.pickupTo ? "border-red-400 bg-red-50" : "border-[#E5E7EB] bg-[#f9fafb]"}`}
                />
                {errors.pickupTo && <p className="text-xs text-red-500 mt-1">{errors.pickupTo}</p>}
              </div>
            </div>
          </div>

          {/* Delivery Regions */}
          <div className="border border-[#E5E7EB] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#111827]">Delivery Regions</p>
              <button
                type="button"
                onClick={addRegion}
                className="flex items-center gap-1 text-xs text-[#219e02] font-medium hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Region
              </button>
            </div>
            {form.deliveryRegions.map((r, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Region (e.g. Mainland)"
                    value={r.region}
                    onChange={(e) => setDeliveryRegion(i, "region", e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all ${errors[`region_${i}`] ? "border-red-400 bg-red-50" : "border-[#E5E7EB] bg-[#f9fafb]"}`}
                  />
                  {errors[`region_${i}`] && <p className="text-xs text-red-500 mt-1">{errors[`region_${i}`]}</p>}
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    placeholder="Fee (₦)"
                    value={r.fee}
                    onChange={(e) => setDeliveryRegion(i, "fee", e.target.value)}
                    min="0"
                    className={`w-full px-3 py-2 rounded-lg border text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#219e02]/20 focus:border-[#219e02] transition-all ${errors[`fee_${i}`] ? "border-red-400 bg-red-50" : "border-[#E5E7EB] bg-[#f9fafb]"}`}
                  />
                  {errors[`fee_${i}`] && <p className="text-xs text-red-500 mt-1">{errors[`fee_${i}`]}</p>}
                </div>
                {form.deliveryRegions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRegion(i)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-0.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-2">
              Images <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImages}
              className="hidden"
            />
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#E5E7EB]">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`w-full py-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 text-sm transition-colors ${errors.images ? "border-red-400 bg-red-50 text-red-500" : "border-[#E5E7EB] hover:border-[#219e02] text-[#6B7280] hover:text-[#219e02]"}`}
            >
              <Upload className="w-4 h-4" />
              {imagePreviews.length > 0 ? "Add more images" : "Upload meal images"}
            </button>
            {errors.images && <p className="text-xs text-red-500 mt-1">{errors.images}</p>}
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-2 pb-1">
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
              {isPending ? "Creating Meal..." : "Create Meal"}
            </button>
          </div>
        </form>
      </div>
    </>,
    document.body,
  );
}
