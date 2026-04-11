import { ApiOrder, ApiAtRiskOrder, ApiOrderFilter } from "@/lib/hooks/orders";
import { Order } from "@/components/OrderStable";

export const STATUS_MAP: Record<string, { status: string; statusColor: string; tabKey: string }> = {
  pending: { status: "Pending", statusColor: "bg-blue-50 text-blue-600", tabKey: "new" },
  confirmed: { status: "Confirmed", statusColor: "bg-purple-50 text-purple-600", tabKey: "active-cooks" },
  cooking: { status: "Cooking", statusColor: "bg-green-100 text-green-600", tabKey: "active-cooks" },
  picked_up: { status: "Picked Up", statusColor: "bg-cyan-50 text-cyan-600", tabKey: "active-cooks" },
  completed: { status: "Completed", statusColor: "bg-gray-100 text-gray-500", tabKey: "completed" },
  delivered: { status: "Delivered", statusColor: "bg-green-50 text-green-600", tabKey: "completed" },
  cancelled: { status: "Cancelled", statusColor: "bg-red-100 text-red-500", tabKey: "cancelled" },
  refunded: { status: "Refunded", statusColor: "bg-orange-50 text-orange-500", tabKey: "refunded" },
};

export function mapOrder(o: ApiOrder): Order {
  const cookName = o.cook?.fullName ?? "—";
  const totalItems = o.mealItems?.reduce((sum, i) => sum + i.quantity, 0) ?? 1;
  const mainItem = o.mealItems?.[0];
  const statusInfo = STATUS_MAP[o.status] ?? {
    status: o.status,
    statusColor: "bg-gray-100 text-gray-500",
    tabKey: "new",
  };

  const userLocation = o.user?.location;
  const customerArea =
    userLocation?.lga ??
    userLocation?.city ??
    userLocation?.state ??
    userLocation?.address ??
    "—";

  return {
    id: o._id,
    meal: mainItem?.name ?? "—",
    items: Math.max(0, totalItems - (mainItem?.quantity ?? 1)),
    image: mainItem?.images?.[0]?.url ?? "",
    orderId: `#GTM-${o._id.slice(-6)}`,
    customerArea,
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
      expectedDelivery: "—",
    },
    ...statusInfo,
    mealItems: o.mealItems?.map((item) => ({
      name: item.name,
      image: item.images?.[0]?.url ?? "",
      quantity: item.quantity,
      price: item.price,
    })),
    cookId: o.cook?._id,
    customerId: o.user?._id,
  };
}

export function mapAtRiskOrder(o: ApiAtRiskOrder): Order {
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
    statusColor: "bg-red-100 text-red-600",
    tabKey: "at-risk",
    cookId: o.cookId?._id,
    customerId: o.userId?._id,
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
    mealItems: o.mealItems?.map((item) => ({
      name: item.name,
      image: item.images?.[0]?.url ?? item.image ?? "",
      quantity: item.quantity,
      price: item.price,
    })),
    cookId: o.cook?.cookId,
  };
}
