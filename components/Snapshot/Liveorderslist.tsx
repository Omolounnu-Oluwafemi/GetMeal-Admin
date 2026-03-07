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

const statusStyles: Record<string, string> = {
  Cooking: "bg-blue-50 text-blue-600",
  Ready: "bg-[#F0FDF4] text-[#219e02]",
  Late: "bg-red-50 text-red-500",
};

export default function LiveOrdersList({
  orders,
  onViewAll,
}: LiveOrdersListProps) {
  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#F3F4F6]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div>
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-bold text-gray-900">{order.orderId}</span>
                <span className="text-sm text-gray-400">{order.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-medium text-gray-900">{order.customerName}</span>
                <span className="text-gray-400">{order.timeAgo}</span>
              </div>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${statusStyles[order.status] ?? "bg-gray-100 text-gray-600"}`}>
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
