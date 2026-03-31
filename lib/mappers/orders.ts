import { ApiOrder, ApiAtRiskOrder, ApiOrderFilter } from "@/lib/hooks/orders";
import { Order } from "@/components/OrderStable";

export const STATUS_MAP: Record<string, { status: string; statusColor: string; tabKey: string }> = {
  pending: { status: "Pending", statusColor: "bg-blue-50 text-blue-600", tabKey: "new" },
  cooking: { status: "Cooking", statusColor: "bg-green-100 text-green-600", tabKey: "active-cooks" },
  completed: { status: "Completed", statusColor: "bg-gray-100 text-gray-500", tabKey: "completed" },
  delivered: { status: "Delivered", statusColor: "bg-gray-100 text-gray-500", tabKey: "completed" },
  cancelled: { status: "Cancelled", statusColor: "bg-red-100 text-red-500", tabKey: "cancelled" },
  refunded: { status: "Refunded", statusColor: "bg-purple-100 text-purple-500", tabKey: "refunded" },
};

export function mapOrder(o: ApiOrder): Order {
  const cookName = o.cookId?.fullName ?? "—";
  const totalItems = o.mealItems?.reduce((sum, i) => sum + i.quantity, 0) ?? 1;
  const mainItem = o.mealItems?.[0];
  const statusInfo = STATUS_MAP[o.status] ?? {
    status: o.status,
    statusColor: "bg-gray-100 text-gray-500",
    tabKey: "new",
  };

  return {
    id: o._id,
    meal: "—",
    items: Math.max(0, totalItems - (mainItem?.quantity ?? 1)),
    image: "",
    orderId: `#GTM-${o._id.slice(-6)}`,
    customerArea: "—",
    payment: `₦${(o.totalAmount ?? 0).toLocaleString()}`,
    paymentStatus:
      o.paymentStatus === "paid"
        ? "Paid"
        : o.paymentStatus === "pending"
          ? "Pending"
          : "Failed",
    cook: {
      initial: cookName[0]?.toUpperCase() ?? "?",
      name: cookName,
      color: "#219e02",
      email: "",
      phone: o.cookId?.phone ?? "",
    },
    customer: {
      name: o.userId?.fullName ?? "—",
      email: "",
      phone: o.userId?.phone ?? "",
    },
    timeline: {
      orderPlaced: new Date(o.createdAt).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      expectedDelivery: "—",
    },
    ...statusInfo,
  };
}

export function mapAtRiskOrder(o: ApiAtRiskOrder): Order {
  return {
    ...mapOrder(o),
    statusColor: "bg-red-100 text-red-600",
    tabKey: "at-risk",
  };
}

export function mapFilterOrder(o: ApiOrderFilter): Order {
  const mainItem = o.mealItems?.[0];
  const totalItems = o.mealItems?.reduce((sum, i) => sum + i.quantity, 0) ?? 1;
  const cookName = o.cook?.name ?? "—";
  const statusInfo = STATUS_MAP[o.status] ?? {
    status: o.status,
    statusColor: "bg-gray-100 text-gray-500",
    tabKey: "new",
  };

  return {
    id: o.orderId,
    meal: mainItem?.name ?? "—",
    items: Math.max(0, totalItems - (mainItem?.quantity ?? 1)),
    image: mainItem?.image ?? "",
    orderId: `#GTM-${o.orderId.slice(-6)}`,
    customerArea: o.user?.city ?? "—",
    payment: `₦${(o.totalAmount ?? 0).toLocaleString()}`,
    paymentStatus:
      o.paymentStatus === "paid"
        ? "Paid"
        : o.paymentStatus === "pending"
          ? "Pending"
          : "Failed",
    cook: {
      initial: cookName[0]?.toUpperCase() ?? "?",
      name: cookName,
      color: "#219e02",
      email: o.cook?.email ?? "",
      phone: o.cook?.phone ?? "",
    },
    customer: {
      name: o.user?.fullName ?? "—",
      email: o.user?.email ?? "",
      phone: o.user?.phone ?? "",
    },
    timeline: {
      orderPlaced: new Date(o.createdAt).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      expectedDelivery: o.deliveryTime
        ? new Date(o.deliveryTime).toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "—",
    },
    ...statusInfo,
  };
}
