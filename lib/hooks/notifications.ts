import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type NotifType = "order" | "alert" | "system" | "payment" | "customer" | "cook";

export interface ApiNotification {
  _id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  data?: { userId?: string; cookId?: string };
}

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  createdAt: string;
  linkedUserId?: string;
  linkedCookId?: string;
}

interface NotificationsResponse {
  page: number;
  limit: number;
  totalCount: number;
  notifications: ApiNotification[];
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

function mapNotifType(type: string): NotifType {
  if (type === "order") return "order";
  if (type === "alert") return "alert";
  if (type === "system") return "system";
  if (type === "payment") return "payment";
  if (type === "customer") return "customer";
  if (type === "cook") return "cook";
  return "system";
}

export function mapNotification(n: ApiNotification): Notification {
  return {
    id: n._id,
    type: mapNotifType(n.type),
    title: n.title,
    description: n.body,
    time: formatRelativeTime(n.createdAt),
    read: n.isRead,
    createdAt: n.createdAt,
    linkedUserId: n.data?.userId,
    linkedCookId: n.data?.cookId,
  };
}

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get<NotificationsResponse>("/api/admin/notifications");
      return res.data.notifications.map(mapNotification);
    },
    staleTime: 30000,
  });
}
