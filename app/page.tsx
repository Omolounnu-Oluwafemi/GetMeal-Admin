"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Mail, Lock, Check } from "@/lib/icons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Handle login logic here
    console.log("Login:", { email, password, rememberMe });

    // Redirect to dashboard on success
    router.push("/dashboard");

    setLoading(false);
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

      {/* Welcome Text */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome Back</h1>
        <p className="text-gray-600 text-sm">
          Sign in to access the Getameal Admin Dashboard
        </p>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kingsleyezechukwu2018@gmail.com"
                className="w-full pl-10 pr-4 py-3 bg-[#f3f3f5] border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#219e02] focus:shadow-[0_0_0_3px_rgba(33,158,2,0.1)] transition-all"
                required
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="peer sr-only"
              />

              <div
                className="
                    w-4 h-4 rounded-md
                    border-2 border-gray-300
                    flex items-center justify-center
                    transition-all duration-200
                    peer-checked:bg-[#219e02]
                    peer-checked:border-[#219e02]
                  "
              >
                <Check strokeWidth={2} width={17} color="#fff" />
              </div>
              <span className="text-xs text-gray-700">Remember me</span>
            </label>

            <a
              href="/forgot-password"
              className="text-xs text-[#219e02] hover:underline font-medium"
            >
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#219e02] text-white rounded-xl font-medium hover:bg-[#1a7d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-sm">Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-gray-500">
        © 2026 Getameal. All rights reserved.
      </p>
    </div>
  );
}
