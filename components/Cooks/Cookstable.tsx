"use client";

import { useState } from "react";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 10;

import {
  MoreVertical,
  ChefHat,
  Star,
  Check,
  AlertCircle,
  CheckCircle,
} from "@/lib/icons";
import CookActionMenu from "./Cookactionmenu";

export interface Cook {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  avatarColor: string;
  kitchen: string;
  city: string;
  verified: "Verified" | "Pending";
  rating: number;
  ratingNumber: number;
  orders: number;
  joinedDate: string;
  phone: string;
  email: string;
  nextCookingDay: string;
  schedule: string;
  onTimeRate: string;
  avgPrepTime: string;
  cancelRate: string;
  mealsListed: number;
  topMeal: { name: string; orders: number };
  totalEarnings: string;
  lastPayoutAmount: string;
  lastPayoutDate: string;
  lastPayoutMethod?: string;
  lastPayoutRef?: string;
  complaint?: { text: string; date: string };
  lastReview?: {
    reviewer: string;
    rating: number;
    timeAgo: string;
    text: string;
    meal: string;
  };
  status: "Active" | "Inactive" | "Suspended";
  isAvailable: boolean;
  isApproved: boolean;
  isSuspended: boolean;
  walletBalance: number;
  reviewsCount: number;
  bankDetails?: { bankName?: string; accountNumber?: string; accountName?: string; bankCode?: string } | null;
  scheduleList: string[];
  cookingExperience?: string;
  availableForCooking?: string;
  profileImage?: string;
  userEmail?: string;
}

interface CooksTableProps {
  cooks: Cook[];
  loading?: boolean;
}

export default function CooksTable({ cooks, loading = false }: CooksTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedCooks, setSelectedCooks] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(cooks.length / PAGE_SIZE);
  const pagedCooks = cooks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCooks(pagedCooks.map((c) => c.id));
    } else {
      setSelectedCooks([]);
    }
  };

  const handleSelectCook = (cookId: string, checked: boolean) => {
    if (checked) {
      setSelectedCooks([...selectedCooks, cookId]);
    } else {
      setSelectedCooks(selectedCooks.filter((id) => id !== cookId));
    }
  };

  const renderStars = (rating: number, ratingNumber: number) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
        <span className="text-sm font-medium text-gray-900">{rating}</span>
        <span className="text-sm text-gray-400">({ratingNumber})</span>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto mt-6 border rounded-2xl ">
      <Pagination
        page={page}
        totalPages={totalPages}
        total={cooks.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        label="cooks"
      />
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-5 text-left">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    pagedCooks.length > 0 &&
                    pagedCooks.every((c) => selectedCooks.includes(c.id))
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="peer sr-only"
                />

                <div
                  className="
                    w-4 h-4 rounded-[4px]
                    border-2 border-gray-300 bg-[#f7f7f7]
                    flex items-center justify-center
                    transition-all duration-200
                    peer-checked:bg-[#219e02]
                    peer-checked:border-[#219e02]
                  "
                >
                  <Check strokeWidth={4} width={10} color="#fff" />
                </div>
              </label>
            </th>
            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kitchen
            </th>
            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              City
            </th>
            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              VERIFIED
            </th>
            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rating
            </th>
            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Orders
            </th>
            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-5"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-8"><div className="w-4 h-4 bg-gray-200 rounded" /></td>
                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-200 rounded-full" /><div className="h-4 w-28 bg-gray-200 rounded" /></div></td>
                <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 w-10 bg-gray-200 rounded" /></td>
                <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-200 rounded-full" /></td>
                <td className="px-6 py-4"><div className="h-4 w-4 bg-gray-200 rounded" /></td>
              </tr>
            ))
          ) : pagedCooks.map((cook) => (
            <tr key={cook.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-8">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCooks.includes(cook.id)}
                    onChange={(e) =>
                      handleSelectCook(cook.id, e.target.checked)
                    }
                    className="peer sr-only"
                  />

                  <div
                    className="
                    w-4 h-4 rounded-[4px]
                    border-2 border-gray-300 bg-[#f7f7f7]
                    flex items-center justify-center
                    transition-all duration-200
                    peer-checked:bg-[#219e02]
                    peer-checked:border-[#219e02]
                  "
                  >
                    <Check strokeWidth={4} width={10} color="#fff" />
                  </div>
                </label>
              </td>

              {/* Name */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  {cook.avatar ? (
                    <img
                      src={cook.avatar}
                      alt={cook.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: cook.avatarColor }}
                    >
                      {cook.initials}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900">
                    {cook.name}
                  </span>
                </div>
              </td>

              {/* Kitchen */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ChefHat className="w-4 h-4 text-gray-400" />
                  {cook.kitchen}
                </div>
              </td>

              {/* City */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{cook.city}</div>
              </td>

              {/* Verified */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${
                    cook.verified === "Verified"
                      ? "text-[#219e02]"
                      : cook.verified === "Pending"
                        ? "text-[#F59E0B]"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {cook.verified === "Verified" ? (
                    <CheckCircle className="w-4 h-4 text-[#219e02]" />
                  ) : cook.verified === "Pending" ? (
                    <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
                  ) : null}
                  {cook.verified}
                </span>
              </td>

              {/* Rating */}
              <td className="px-6 py-4 whitespace-nowrap">
                {renderStars(cook.rating, cook.ratingNumber)}
              </td>

              {/* Orders */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {cook.orders}
                </div>
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    cook.status === "Active"
                      ? "bg-[#F0FDF4] text-[#219e02]"
                      : cook.status === "Suspended"
                        ? "bg-[#FEF2F2] text-[#EF4444]"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {cook.status}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right relative">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === cook.id ? null : cook.id)
                  }
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>

                {/* Action Mexnu */}
                {openMenuId === cook.id && (
                  <CookActionMenu
                    cook={cook}
                    onClose={() => setOpenMenuId(null)}
                  />
                )}
              </td>
            </tr>
          ))}
          </tbody>
      </table>
    </div>
  );
}
