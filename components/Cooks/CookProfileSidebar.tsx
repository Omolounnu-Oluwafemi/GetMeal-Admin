"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, MessageSquare, FileText, Star, Phone } from "@/lib/icons";
import CallModal from "@/components/CallModal";
import {
  AlertTriangle,
  CreditCard,
  ShieldOff,
  ShieldCheck,
  UserCheck,
  Ban,
} from "lucide-react";
import type { Cook } from "./Cookstable";
import CookMealsView from "./CookMealsView";

interface Props {
  cook: Cook;
  loading?: boolean;
  onClose: () => void;
  onMessage: () => void;
  onAddNote: () => void;
  onSuspend: () => void;
  onReactivate: () => void;
}

export default function CookProfileSidebar({
  cook,
  onClose,
  onMessage,
  onAddNote,
  onSuspend,
  onReactivate,
}: Props) {
  const [showMeals, setShowMeals] = useState(false);
  const [callTarget, setCallTarget] = useState<{ name: string; phone: string } | null>(null);

  if (showMeals) {
    return createPortal(
      <CookMealsView
        cookId={cook.id}
        cookName={cook.name}
        onClose={() => setShowMeals(false)}
      />,
      document.body,
    );
  }

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Sidebar */}
      <div
        className="fixed top-0 right-0 h-full w-[41%] pb-6 bg-white z-50 shadow-2xl flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex justify-end px-4 pt-4">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>
        {/* Header */}
        <div className="flex items-start gap-3 px-10 pb-4 border-gray-100">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ backgroundColor: cook.avatarColor }}
          >
            {cook.avatar ? (
              <img
                src={cook.avatar}
                alt={cook.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              cook.initials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-[#111827] truncate">
                {cook.name}
              </h3>
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full flex-shrink-0">
                Cook
              </span>
            </div>
            <p className="text-base text-[#6B7280] mt-1">{cook.kitchen}</p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-[#9CA3AF]">
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-sm">{cook.city}</p>
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm">Joined</p>
                <p className="text-sm"> {cook.joinedDate}</p>
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 ">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  cook.status === "Active"
                    ? "bg-[#F0FDF4] text-[#219e02]"
                    : cook.status === "Suspended"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {cook.status}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                <span className="text-sm text-[#6B7280] flex gap-1 items-center">
                  <p className="text-base font-bold"> {cook.rating}</p>

                  <p className="text-sm"> ({cook.ratingNumber})</p>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 px-5 py-6 border-b border-gray-200">
          <button
            onClick={onMessage}
            className="flex-1 flex items-center border border-gray-200 justify-center gap-1.5 py-2 text-xs font-medium text-[#111827] hover:bg-[#e9eaec] rounded-lg transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Message
          </button>
          {cook.status === "Suspended" ? (
            <button
              onClick={onReactivate}
              className="flex-1 flex items-center border border-gray-200 justify-center gap-1.5 py-2 text-xs font-medium text-[#219e02] hover:bg-[#e9eaec] rounded-lg transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Reactivate
            </button>
          ) : (
            <button
              onClick={onSuspend}
              className="flex-1 flex items-center border border-gray-200 justify-center gap-1.5 py-2 text-xs font-medium text-red-500 hover:bg-[#e9eaec] rounded-lg transition-colors"
            >
              <Ban className="w-3.5 h-3.5" />
              Suspend
            </button>
          )}
          <button
            onClick={onAddNote}
            className="flex-[0.6] flex items-center justify-center border border-gray-200 gap-1.5 py-2 text-xs font-medium text-[#111827] hover:bg-[#e9eaec] rounded-lg transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Add Note
          </button>
        </div>

        <div className="flex-1 px-5 py-4 space-y-6">
          {/* Contact */}
          <section>
            <h4 className="text-[16px] font-semibold text-[#000]  mb-3 mt-2">
              Contact Information
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#111827]">
                <span className=" text-[#9CA3AF]">Phone:</span>
                <span className="font-medium">{cook.phone}</span>
                {cook.phone && (
                  <button onClick={() => setCallTarget({ name: cook.name, phone: cook.phone })} className="ml-1 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone className="w-3.5 h-3.5 text-[#219e02]" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <span className=" text-[#9CA3AF]">Email:</span>
                <span className="truncate font-medium">{cook.email}</span>
              </div>
            </div>
          </section>

          {/* Availability */}
          <section>
            <h4 className="text-[16px] font-semibold text-[#111827] mb-3">
              Availability
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#111827]">
                <span className=" text-[#9CA3AF]">Next Cooking Day:</span>
                <span className="font-medium">{cook.nextCookingDay}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <span className=" text-[#9CA3AF]">Schedule:</span>
                <span className="truncate font-medium">{cook.schedule}</span>
              </div>
            </div>
          </section>

          {/* Performance */}
          <section>
            <h4 className="text-[16px] font-semibold text-[#000] mb-3">
              Performance Metrics
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "On-Time Rate", value: cook.onTimeRate },
                { label: "Avg Prep Time", value: cook.avgPrepTime },
                { label: "Cancel Rate", value: cook.cancelRate },
              ].map((m) => (
                <div key={m.label} className="bg-[#f7f7f7] rounded-xl p-3">
                  <p className="text-[11px] text-[#77797e] mt-0.5">{m.label}</p>

                  <p className="text-lg font-bold text-[#111827]">{m.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Order Statistics */}
          <section>
            <h4 className="text-[16px] font-semibold text-[#000] mb-2">
              Order Statistics
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#f7f7f7] rounded-xl p-3">
                <p className="text-[11px] text-[#77797e] mt-0.5">
                  Meals Listed
                </p>
                <p className="text-lg font-bold text-[#111827]">
                  {cook.mealsListed}
                </p>
              </div>
              <div className="bg-[#f7f7f7] rounded-xl p-3">
                <p className="text-[11px] text-[#77797e] mt-0.5">
                  Orders Completed
                </p>
                <p className="text-lg font-bold text-[#111827]">
                  {cook.orders}
                </p>
              </div>
            </div>
          </section>

          {/* Top Meals */}
          <section>
            <div className="items-center  mb-3">
              <h4 className="text-[16px] font-semibold text-[#000]">
                Top Meals
              </h4>
            </div>
            <div className="bg-[#f7f7f7] rounded-xl p-3 w-1/2">
              <p className="text-sm font-medium text-[#111827]">
                {cook.topMeal.name}
              </p>
              <p className="text-[11px] text-[#77797e]">
                {cook.topMeal.orders} orders
              </p>
            </div>
            <button
              onClick={() => setShowMeals(true)}
              className="text-sm text-[#219e02] hover:underline mt-6 w-full text-center"
            >
              View all meals →
            </button>
          </section>

          {/* Payouts */}
          <section>
            <h4 className="text-[16px] font-semibold text-[#000] mb-2">
              Payouts
            </h4>
            <div className="bg-[#dcf0d8] rounded-xl p-4 mb-3 border border-[#9cc494]">
              <p className="text-[14px] font-semibold text-[#219e02] mb-1">
                Total Earnings
              </p>
              <p className="text-4xl font-bold text-black">
                {cook.totalEarnings}
              </p>
              <p className="text-[12px] text-black/50 mt-1">
                From {cook.orders} completed orders
              </p>
            </div>
            <div className="bg-[#f7f7f7] p-4 rounded-xl">
              <div className="flex items-center justify-between text-sm mb-2 ">
                <span className="text-[#6B7280]">Last Payout</span>
                <span className="text-[11px] px-2 py-0.5 bg-[#dcfce6] text-[#219e02] rounded-full font-medium">
                  Completed
                </span>
              </div>
              <div className="flex items-center justify-between text-sm ">
                <p className="text-2xl font-bold text-[#111827]">
                  {cook.lastPayoutAmount}
                </p>
                <p className="text-sm text-[#9CA3AF]">{cook.lastPayoutDate}</p>
              </div>
            </div>
          </section>

          {/* Payout History */}
          <section>
            <h4 className="text-[16px] font-semibold text-[#000] mb-3">
              Payout History
            </h4>
            <div className="flex items-center justify-between p-3 bg-[#f7f7f7] rounded-xl">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#219e02] flex-shrink-0" />
                <div>
                  <span className="text-lg font-medium text-[#111827]">
                    {cook.lastPayoutAmount}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-[#9CA3AF]">{cook.lastPayoutDate}</p>
                    {cook.lastPayoutMethod && (
                      <span className="text-xs px-1.5 py-0.5 bg-white rounded text-[#6B7280] border border-gray-200">
                        {cook.lastPayoutMethod}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[11px] px-2 py-0.5 bg-[#dcfce6] text-[#219e02] rounded-full">
                  Completed
                </span>
                {cook.lastPayoutRef && (
                  <span className="text-[11px] text-[#9CA3AF]">{cook.lastPayoutRef}</span>
                )}
              </div>
            </div>
          </section>

          {/* Complaints & Flags */}
          {cook.complaint && (
            <section>
              <h4 className="text-[16px] font-semibold text-[#000] mb-3">
                Complaints & Flags
              </h4>
              <div className="p-3 bg-[#fff2f3] rounded-xl border border-red-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-base font-medium text-red-800">
                    Complaint
                  </span>
                </div>
                <p className="text-sm text-red-600 pl-6 mb-2">
                  {cook.complaint.text}
                </p>
                <p className="text-[12px] text-red-400 mt-1 pl-6">
                  {cook.complaint.date}
                </p>
              </div>
            </section>
          )}

          {/* Recent Reviews */}
          {cook.lastReview && (
            <section>
              <h4 className="text-[16px] font-semibold text-[#000]  mb-3">
                Recent Reviews
              </h4>
              <div className="p-4 bg-[#f7f7f7] rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-base font-medium text-[#111827]">
                    {cook.lastReview.reviewer}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                    <span className="text-base font-bold text-[#6B7280]">
                      {cook.lastReview.rating}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  {cook.lastReview.timeAgo}
                </p>

                <p className="text-sm text-[#0000007f] py-2">
                  &quot;{cook.lastReview.text}&quot;
                </p>
                <p className="text-xs text-[#9CA3AF] mt-1 bg-white p-2 inline-block">
                  {cook.lastReview.meal}
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
      {callTarget && <CallModal name={callTarget.name} phone={callTarget.phone} onClose={() => setCallTarget(null)} />}
    </>,
    document.body,
  );
}
