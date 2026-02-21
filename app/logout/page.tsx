"use client";

import { useRouter } from "next/navigation";
import { Check, LogIn, ArrowLeft } from "@/lib/icons";

export default function LogoutPage() {
  const router = useRouter();

  const handleLogBackIn = () => {
    router.push("/");
  };

  const handleReturnToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Success Icon */}
      <div className="mb-8">
        <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="w-16 h-16 bg-[#F0FDF4] rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-[#219e02]" />
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          You've Been Logged Out
        </h1>
        <p className="text-gray-600">
          Your session has ended successfully. Thanks for using Getameal Admin.
        </p>
      </div>

      {/* Info Cards */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 mb-6 space-y-6">
        {/* Session Cleared */}
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-[#219e02] mt-2 flex-shrink-0" />
          <div>
            <div className="font-semibold text-gray-900 mb-1">
              Session Cleared
            </div>
            <div className="text-sm text-gray-600">
              All your login credentials have been securely removed from this
              device.
            </div>
          </div>
        </div>

        {/* Data Protected */}
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-[#219e02] mt-2 flex-shrink-0" />
          <div>
            <div className="font-semibold text-gray-900 mb-1">
              Data Protected
            </div>
            <div className="text-sm text-gray-600">
              Your account information remains secure and no data was
              compromised.
            </div>
          </div>
        </div>

        {/* Ready to Return */}
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-[#219e02] mt-2 flex-shrink-0" />
          <div>
            <div className="font-semibold text-gray-900 mb-1">
              Ready to Return
            </div>
            <div className="text-sm text-gray-600">
              You can log back in anytime to access the admin dashboard.
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md space-y-3">
        <button
          onClick={handleLogBackIn}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#219e02] text-white rounded-lg font-medium hover:bg-[#1a7d01] transition-colors"
        >
          <LogIn className="w-5 h-5" />
          Log Back In
        </button>

        <button
          onClick={handleReturnToLogin}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Return to Login Page
        </button>
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-gray-500">
        © 2026 Getameal. All rights reserved.
      </p>
    </div>
  );
}
