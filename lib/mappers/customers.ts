import type { ApiCustomer, ApiCustomerDetail } from "@/lib/hooks/customers";
import type { Customer } from "@/components/Customers/Customerstable";

const AVATAR_COLORS = [
  "#8B4513", "#9333EA", "#219e02", "#2563EB",
  "#DC2626", "#D97706", "#0891B2", "#7C3AED",
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function getAvatarColor(id: string) {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function mapCustomer(c: ApiCustomer): Customer {
  const lastActive = new Date(c.lastActive);
  const daysDiff = Math.floor(
    (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24),
  );
  return {
    id: c._id,
    name: c.fullName,
    initials: getInitials(c.fullName),
    avatarColor: getAvatarColor(c._id),
    phone: c.phone,
    email: c.email,
    city: c.city || "—",
    orders: c.ordersCount,
    lastOrderDays: daysDiff,
    lastOrderDate: lastActive.toLocaleDateString("en-GB"),
    status: c.status === "active" ? "Active" : "Suspended",
  };
}

export function mapCustomerDetail(c: ApiCustomerDetail): Customer {
  const base = mapCustomer(c);
  return {
    ...base,
    walletBalance: c.walletBalance,
    joinedAt: new Date(c.joinedAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    lastActive: new Date(c.lastActive).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    recentOrders: c.orders,
    customerNotes: c.notes,
  };
}
