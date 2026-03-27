"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ArrowLeft, Eye, EyeOff, Lock } from "@/lib/icons";
import { useResetPassword } from "@/lib/hooks/auth";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetPassword(
      { email, otp, newPassword },
      {
        onSuccess: () => {
          toast.success("Password reset successful. Please sign in.");
          router.push("/");
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ?? "Reset failed. Please try again."
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="h-[75px] flex items-center justify-center border-[#F3F4F6] mb-14">
        <div className="px-6 py-4 rounded-2xl bg-white shadow-xl flex items-center justify-center overflow-hidden">
          <img
            src="/logoWhite.svg"
            alt="Getameal Logo"
            width={30}
            height={40}
            className="object-contain"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(97%) contrast(50%)",
            }}
          />
        </div>
      </div>

      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Reset Password
          </h1>
          <p className="text-gray-600 text-sm">
            Enter the OTP sent to{" "}
            <span className="text-[#219e02] font-medium">{email}</span> and
            your new password
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                OTP Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full px-4 py-3 bg-[#f3f3f5] border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#219e02] focus:shadow-[0_0_0_3px_rgba(33,158,2,0.1)] transition-all tracking-widest text-center font-medium"
                required
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-[#f3f3f5] border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#219e02] focus:shadow-[0_0_0_3px_rgba(33,158,2,0.1)] transition-all"
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#219e02] text-white rounded-lg font-medium hover:bg-[#1a7d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="w-full flex items-center justify-center gap-2 py-3 text-gray-700 hover:text-[#219e02] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </form>
        </div>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        © 2026 Getameal. All rights reserved.
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
