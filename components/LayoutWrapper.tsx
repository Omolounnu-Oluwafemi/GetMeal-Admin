"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Pages that should NOT show sidebar and header
  const excludedPaths = ["/", "/logout", "/login", "/forgot-password"];
  const shouldShowLayout = !excludedPaths.includes(pathname);

  if (!shouldShowLayout) {
    return <div className="min-h-screen bg-[#fafafa]">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-[108px]">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="p-4 pt-6">{children}</main>
      </div>
    </div>
  );
}
