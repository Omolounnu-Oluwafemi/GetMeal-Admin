"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const excludedPaths = ["/", "/logout", "/login", "/forgot-password", "/reset-password"];
  const shouldShowLayout = !excludedPaths.includes(pathname);

  if (!shouldShowLayout) {
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
