"use client";

interface LiveOrder {
  id: string;
  orderId: string;
  location: string;
  customerName: string;
  timeAgo: string;
  status: "Cooking" | "Ready" | "Late";
  statusColor: string;
}

interface LiveOrdersListProps {
  orders: LiveOrder[];
  onViewAll: () => void;
}

export default function LiveOrdersList({
  orders,
  onViewAll,
}: LiveOrdersListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Cooking":
        return "text-blue-600";
      case "Ready":
        return "text-green-600";
      case "Late":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#F3F4F6]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm font-semibold text-gray-900 uppercase mb-1">
            LIVE ORDERS
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {orders.length} active
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm text-[#219e02] hover:underline font-medium"
        >
          View all
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {order.orderId}
                </span>
                <span className="text-sm text-gray-500">{order.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-900">{order.customerName}</span>
                <span className="text-gray-400">{order.timeAgo}</span>
              </div>
            </div>
            <span
              className={`text-sm font-medium ${getStatusColor(order.status)}`}
            >
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
