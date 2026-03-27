"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, ArrowLeft } from "@/lib/icons";
import { useForgotPassword } from "@/lib/hooks/auth";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const { mutate: sendOtp, isPending } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendOtp(
      { email },
      {
        onSuccess: () => {
          setEmailSent(true);
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ?? "Failed to send OTP. Please try again."
          );
        },
      }
    );
  };

  const handleResend = () => {
    sendOtp(
      { email },
      {
        onSuccess: () => {
          toast.success("OTP resent successfully.");
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ?? "Failed to resend OTP. Please try again."
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
            className="object-contain [&>*]:fill-[#219e02]"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(97%) contrast(50%)",
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-lg">
        {!emailSent ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Forgot Password?
              </h1>
              <p className="text-gray-600 text-sm">
                No worries! Enter your email and we'll send you a reset OTP
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@getameal.app"
                      className="w-full pl-10 pr-4 py-3 bg-[#f3f3f5] border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#219e02] focus:shadow-[0_0_0_3px_rgba(33,158,2,0.1)] transition-all"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                      Send OTP
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="w-full flex items-center justify-center gap-2 py-3 text-gray-700 hover:text-[#219e02] transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Sign In
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-[#219e02]" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Check Your Email
              </h1>
              <p className="text-gray-600 text-sm">
                We've sent a reset OTP to
              </p>
              <p className="text-[#219e02] font-medium text-sm mt-1">{email}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 space-y-4">
              <button
                onClick={() =>
                  router.push(
                    `/reset-password?email=${encodeURIComponent(email)}`
                  )
                }
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#219e02] text-white rounded-lg font-medium hover:bg-[#1a7d01] transition-colors"
              >
                Enter OTP
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-sm text-gray-600 text-center">
                Didn't receive it?{" "}
                <button
                  onClick={handleResend}
                  disabled={isPending}
                  className="text-[#219e02] font-medium hover:underline disabled:opacity-50"
                >
                  {isPending ? "Resending..." : "Resend OTP"}
                </button>
              </p>

              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full flex items-center justify-center gap-2 py-3 text-gray-700 hover:text-[#219e02] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Sign In
              </button>
            </div>
          </>
        )}
      </div>

      <p className="mt-8 text-sm text-gray-500">
        © 2026 Getameal. All rights reserved.
      </p>
    </div>
  );
}
