import type { ApiCook } from "@/lib/hooks/cooks";
import type { Cook } from "@/components/Cooks/Cookstable";

const AVATAR_COLORS = [
  "#8B4513", "#9333EA", "#219e02", "#2563EB",
  "#DC2626", "#D97706", "#0891B2", "#7C3AED",
];

function getInitials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function getAvatarColor(id: string) {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function mapCook(c: ApiCook): Cook {
  const id = c.cookId ?? c._id ?? "";
  // Single endpoint uses cookName; list endpoint uses name
  const displayName = c.cookName ?? c.name ?? "—";
  let status: "Active" | "Inactive" | "Suspended" = "Inactive";
  if (c.isSuspended) status = "Suspended";
  else if (c.isAvailable) status = "Active";

  // Phone/email: prefer userId object if available
  const phone = c.phone ?? c.userId?.phone ?? "—";
  const email = c.email ?? c.userId?.email ?? "—";
  const city = c.cookAddress ?? c.location?.address ?? "—";

  return {
    id,
    name: displayName,
    avatar: c.userId?.profileImage?.url,
    initials: getInitials(displayName),
    avatarColor: getAvatarColor(id),
    kitchen: displayName !== "—" ? `${displayName.split(" ")[0]}'s Kitchen` : "—",
    city,
    verified: c.isApproved ? "Verified" : "Pending",
    rating: c.rating ?? 0,
    ratingNumber: c.reviewsCount ?? 0,
    orders: c.ordersCount ?? 0,
    joinedDate: new Date(c.createdAt).toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    }),
    phone,
    email,
    nextCookingDay: c.availableForCooking
      ? new Date(c.availableForCooking).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      : "—",
    schedule: Array.isArray(c.schedule)
      ? c.schedule
          .map((s) => {
            if (s === "Immediate") return "Immediate";
            const d = new Date(s);
            return isNaN(d.getTime())
              ? s
              : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
          })
          .join(", ")
      : "—",
    scheduleList: c.schedule ?? [],
    onTimeRate: "—",
    avgPrepTime: "—",
    cancelRate: "—",
    mealsListed: 0,
    topMeal: { name: "—", orders: 0 },
    totalEarnings: `₦${(c.walletBalance ?? 0).toLocaleString()}`,
    lastPayoutAmount: "—",
    lastPayoutDate: "—",
    status,
    isAvailable: c.isAvailable,
    isApproved: c.isApproved,
    isSuspended: c.isSuspended ?? false,
    walletBalance: c.walletBalance ?? 0,
    reviewsCount: c.reviewsCount ?? 0,
    bankDetails: c.bankDetails ?? null,
    cookingExperience: c.cookingExperience,
    availableForCooking: c.availableForCooking
      ? new Date(c.availableForCooking).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : undefined,
    profileImage: c.userId?.profileImage?.url,
    userEmail: c.userId?.email,
  };
}
