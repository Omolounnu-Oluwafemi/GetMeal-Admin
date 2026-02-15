"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  ChefHat,
  Clock,
  Package,
  CreditCard,
  Settings,
  LogOut,
} from "@/lib/icons";

const navigation = [
  { name: "Dashboard", href: "/", icon: Users },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Cooks", href: "/cooks", icon: ChefHat },
  { name: "Snapshot", href: "/snapshot", icon: Clock },
  { name: "Orders", href: "/orders", icon: Package },
  { name: "Payments", href: "/payments", icon: CreditCard },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 pt-4 h-screen w-[108px] bg-white border-r border-[#F3F4F6] flex flex-col">
      {/* Logo */}
      <div className="h-[75px] flex items-center justify-center border-[#F3F4F6] mt-4">
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

      {/* Navigation */}
      <nav className="pt-6 pb-0 ">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-1 py-3 px-2
                transition-colors duration-200 relative
                ${
                  isActive
                    ? "text-[#219e02] "
                    : "text-[#000] hover:text-[#219e02]"
                }
              `}
            >
              {isActive && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#219e02]" />
              )}
              <item.icon className="w-6 h-6" />
              <span className="text-[12px] font-medium text-center leading-6">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User Avatar at Bottom */}
      <div className="pt-0 pb-4 flex items-center justify-center ">
        <div className="w-16 h-16 rounded-xl shadow-2xl rounded-tl-none bg-[#219e02] flex items-center justify-center text-white text-xl font-bold">
          KO
        </div>
      </div>

      {/* Logout */}
      <Link
        href="/settings"
        className={`flex flex-col items-center justify-center gap-1 py-3 px-2 transition-colors duration-200 ${
          pathname === "/settings"
            ? "text-[#219e02] border-r-4 border-[#219e02]"
            : "text-[#000] hover:text-[#219e02]"
        }`}
      >
        <Settings className="w-6 h-6" />
        <span className="text-[12px] font-medium text-center leading-6">
          Settings
        </span>
      </Link>

      <Link
        href="/logout"
        className={`flex flex-col items-center justify-center gap-1 py-3 px-2 transition-colors duration-200 ${
          pathname === "/logout"
            ? "text-[#219e02] border-r-4 border-[#219e02]"
            : "text-[#000] hover:text-[#219e02]"
        }`}
      >
        <LogOut className="w-6 h-6" />
        <span className="text-[12px] font-medium text-center leading-6">
          Log out
        </span>
      </Link>
    </aside>
  );
}
