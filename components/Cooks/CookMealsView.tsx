"use client";

import { X } from "@/lib/icons";
import { Package, UtensilsCrossed } from "lucide-react";
import { useCookById } from "@/lib/hooks/cooks";
import type { ApiMeal } from "@/lib/hooks/cooks";

interface CookMealsViewProps {
  cookId: string;
  cookName: string;
  onClose: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  open: { label: "Open", className: "bg-[#F0FDF4] text-[#219e02]" },
  cooking: { label: "Cooking", className: "bg-amber-50 text-amber-600" },
  closed: { label: "Closed", className: "bg-gray-100 text-gray-500" },
};

function MealCard({ meal }: { meal: ApiMeal }) {
  const status = STATUS_CONFIG[meal.status] ?? {
    label: meal.status,
    className: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative w-full h-44 bg-gray-100">
        {meal.images?.[0]?.url ? (
          <img
            src={meal.images[0].url}
            alt={meal.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UtensilsCrossed className="w-10 h-10 text-gray-300" />
          </div>
        )}
        <span
          className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-1">
            {meal.name}
          </h3>
          <span className="text-sm font-bold text-[#219e02] flex-shrink-0">
            ₦{meal.price.toLocaleString()}
          </span>
        </div>

        {meal.description && (
          <p className="text-xs text-gray-400 line-clamp-2 mt-0.5 mb-3">
            {meal.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-500">
              {meal.portionsRemaining ?? 0} portions left
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {new Date(meal.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CookMealsView({
  cookId,
  cookName,
  onClose,
}: CookMealsViewProps) {
  const { data: cookData, isLoading } = useCookById(cookId);

  const meals = cookData?.meals ?? [];
  const totalMeals = cookData?.totalMeals ?? meals.length;

  const openCount = meals.filter((m) => m.status === "open").length;
  const cookingCount = meals.filter((m) => m.status === "cooking").length;
  const closedCount = meals.filter((m) => m.status === "closed").length;

  return (
    <div className="fixed top-0 right-0 bottom-0 left-[108px] bg-[#fafafa] z-[60] flex flex-col overflow-y-auto">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <span className="text-sm text-gray-400">/ Cooks /</span>
        <span className="text-sm text-gray-400">{cookName} /</span>
        <span className="text-sm font-medium text-gray-800">Meals</span>
      </div>

      <div className="flex-1 px-8 py-6 max-w-6xl w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {cookName}&apos;s Meals
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {isLoading ? "Loading..." : `${totalMeals} meal${totalMeals !== 1 ? "s" : ""} listed`}
            </p>
          </div>
        </div>

        {/* Summary chips */}
        {!isLoading && meals.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F0FDF4] rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#219e02]" />
              <span className="text-xs font-medium text-[#219e02]">
                {openCount} Open
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs font-medium text-amber-600">
                {cookingCount} Cooking
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="text-xs font-medium text-gray-500">
                {closedCount} Closed
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="w-full h-44 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : meals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <UtensilsCrossed className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-base font-semibold text-gray-400">
              No meals listed yet
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {cookName} hasn&apos;t added any meals
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {meals.map((meal) => (
              <MealCard key={meal._id} meal={meal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
