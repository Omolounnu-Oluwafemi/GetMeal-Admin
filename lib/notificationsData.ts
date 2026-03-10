export type NotifType = "order" | "alert" | "system" | "payment";

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export const notifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "New Order #ORD-2847",
    description:
      "Customer Adebayo Okonkwo placed an order in Lekki zone for Jollof Rice with Chicken. Order value: ₦4,500.",
    time: "2 mins ago",
    read: false,
  },
  {
    id: "2",
    type: "alert",
    title: "Low Cook Availability",
    description:
      "Only 2 cooks online in Ikeja/Maryland zone. Consider sending nudge notification to bring more cooks online during peak hours.",
    time: "15 mins ago",
    read: false,
  },
  {
    id: "3",
    type: "order",
    title: "Order Cancelled #ORD-2843",
    description:
      "Customer requested cancellation – Reason: Cook took too long to accept. Refund of ₦3,200 has been initiated via Paystack.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "4",
    type: "system",
    title: "High Demand Alert",
    description:
      "Orders increased by 35% in Victoria Island area compared to yesterday. Current orders/hr: 42. Consider promoting more cooks in this zone.",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "payment",
    title: "Payment Successful",
    description:
      "Payment of ₦45,000 received via Paystack for order #ORD-2840. Transaction ID: TXN-9847562.",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "6",
    type: "alert",
    title: "Cook Account Suspended",
    description:
      "Cook Ngozi Eze (ID: COOK-4523) suspended due to multiple complaints. Total complaints: 5 in last 7 days. Account requires review.",
    time: "5 hours ago",
    read: true,
  },
  {
    id: "7",
    type: "order",
    title: "Order Completed #ORD-2839",
    description:
      "Order delivered successfully to customer Chioma Adeyemi in Surulere zone. Rating: 5 stars.",
    time: "6 hours ago",
    read: true,
  },
  {
    id: "8",
    type: "system",
    title: "New Cook Registration",
    description:
      "New cook Tunde Bakare registered in Yaba zone. Profile pending verification.",
    time: "8 hours ago",
    read: true,
  },
  {
    id: "9",
    type: "payment",
    title: "Database Backup Completed",
    description:
      "Daily database backup completed successfully at 2:00 AM. Size: 2.4 GB.",
    time: "10 hours ago",
    read: true,
  },
  {
    id: "10",
    type: "alert",
    title: "Payment Failed",
    description:
      "Payment of ₦6,800 failed via OPay for order #ORD-2838. Customer notified to retry payment.",
    time: "12 hours ago",
    read: true,
  },
];
