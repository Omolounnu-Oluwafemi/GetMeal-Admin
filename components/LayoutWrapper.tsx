"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { clearAuthStorage } from "@/lib/api";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"] as const;

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const excludedPaths = ["/", "/logout", "/login", "/forgot-password", "/reset-password"];
  const isProtected = !excludedPaths.includes(pathname);

  const logout = useCallback(() => {
    clearAuthStorage();
    router.replace("/");
  }, [router]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, INACTIVITY_TIMEOUT);
  }, [logout]);

  useEffect(() => {
    if (!isProtected) return;

    resetTimer();
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [isProtected, resetTimer]);

  if (!isProtected) {
    return <div className="min-h-screen bg-[#fafafa]">{children}</div>;
  }

  return (
    <div className="flex h-full bg-[#fafafa]">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 md:ml-[108px] flex flex-col min-h-0">
        {/* Header */}
        <div className="sticky top-0 z-30">
          <Header onMenuClick={() => setMobileSidebarOpen(true)} />
        </div>

        {/* Page Content */}
        <main className="relative flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 pt-4 sm:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
