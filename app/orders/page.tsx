"use client";

import {
  ShoppingCart,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "@/lib/icons";
import OrderStatsCard from "@/components/Order/Orderstatscard";
import OrdersTable from "@/components/OrderStable";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <OrderStatsCard
          icon={ShoppingCart}
          value={12}
          label="Total Orders"
          variant="default"
        />

        <OrderStatsCard
          icon={Package}
          value={0}
          label="Orders Today"
          variant="default"
        />

        <OrderStatsCard
          icon={Clock}
          value={7}
          label="Active Orders"
          variant="default"
        />

        <OrderStatsCard
          icon={CheckCircle}
          value={3}
          label="Completed"
          variant="success"
        />

        <OrderStatsCard
          icon={XCircle}
          value={1}
          label="Cancelled"
          variant="danger"
        />

        <OrderStatsCard
          icon={AlertCircle}
          value={1}
          label="At Risk"
          variant="warning"
        />
      </div>

      {/* Orders Table */}
      <OrdersTable />
    </div>
  );
}
