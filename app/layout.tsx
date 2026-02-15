import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Getameal Admin Dashboard",
  description: "Admin dashboard for Getameal food delivery platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-[#F9FAFB]">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 ml-[108px]">
            {/* Header */}
            <Header />

            {/* Page Content */}
            <main className="p-8 pt-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
