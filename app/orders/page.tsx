"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "@/lib/icons";
import { toast } from "sonner";
import OrderStatsCard from "@/components/Order/Orderstatscard";
import OrdersTable, { Order } from "@/components/OrderStable";
import OrderDetailsSidebar from "@/components/Order/Orderdetailssidebar";
import {
  useOrders,
  useAtRiskOrders,
  useOrderById,
  useCancelOrder,
  useRefundOrder,
} from "@/lib/hooks/orders";
import { mapOrder, mapAtRiskOrder, mapFilterOrder } from "@/lib/mappers/orders";
import PageLoader from "@/components/PageLoader";

function DirectOrderView({
  orderId,
  onClose,
  onCancelOrder,
  onIssueRefund,
}: {
  orderId: string;
  onClose: () => void;
  onCancelOrder: (id: string) => void;
  onIssueRefund: (id: string) => void;
}) {
  const { data } = useOrderById(orderId);
  if (!data) return null;
  const order = mapFilterOrder(data);

  return (
    <OrderDetailsSidebar
      order={order}
      onClose={onClose}
      onCancelOrder={() => { onCancelOrder(orderId); onClose(); }}
      onIssueRefund={() => { onIssueRefund(orderId); onClose(); }}
    />
  );
}

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const orderParam = searchParams.get("openOrder");
  useEffect(() => {
    if (orderParam) setOpenOrderId(orderParam);
  }, [orderParam]);

  const handleCloseOrder = () => {
    setOpenOrderId(null);
    router.replace("/orders", { scroll: false });
  };

  const { data: ordersData, isLoading: ordersLoading } = useOrders(page);
  const { data: atRiskData, isLoading: atRiskLoading } = useAtRiskOrders();

  const orders: Order[] = (ordersData?.orders ?? []).map(mapOrder);
  const atRiskOrders: Order[] = (atRiskData ?? []).map(mapAtRiskOrder);

  const isLoading = ordersLoading || atRiskLoading;

  const cancelOrder = useCancelOrder();
  const refundOrder = useRefundOrder();

  if (isLoading) return <PageLoader />;

  const today = new Date().toDateString();
  const totalOrders = ordersData?.total ?? orders.length;
  const ordersToday = (ordersData?.orders ?? []).filter(
    (o) => new Date(o.createdAt).toDateString() === today,
  ).length;
  const activeOrders = orders.filter(
    (o) => o.tabKey === "new" || o.tabKey === "active-cooks",
  ).length;
  const completedOrders = orders.filter((o) => o.tabKey === "completed").length;
  const cancelledOrders = orders.filter((o) => o.tabKey === "cancelled").length;
  const atRiskCount = atRiskOrders.length;

  const handleCancelOrder = (id: string) => {
    cancelOrder.mutate(id, {
      onSuccess: (data) => {
        toast.success(data?.message ?? "Order cancelled successfully");
      },
      onError: (err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data
            ?.message ?? "Failed to cancel order";
        toast.error(msg);
      },
    });
  };

  const handleIssueRefund = (id: string) => {
    refundOrder.mutate(id, {
      onSuccess: (data) => {
        toast.success(data?.message ?? "Refund issued successfully");
      },
      onError: (err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data
            ?.message ?? "Failed to issue refund";
        toast.error(msg);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <OrderStatsCard
          icon={ShoppingCart}
          value={totalOrders}
          label="Total Orders"
          variant="default"
          loading={isLoading}
        />
        <OrderStatsCard
          icon={Package}
          value={ordersToday}
          label="Orders Today"
          variant="default"
          loading={isLoading}
        />
        <OrderStatsCard
          icon={Clock}
          value={activeOrders}
          label="Active Orders"
          variant="default"
          loading={isLoading}
        />
        <OrderStatsCard
          icon={CheckCircle}
          value={completedOrders}
          label="Completed"
          variant="success"
          loading={isLoading}
        />
        <OrderStatsCard
          icon={XCircle}
          value={cancelledOrders}
          label="Cancelled"
          variant="danger"
          loading={isLoading}
        />
        <OrderStatsCard
          icon={AlertCircle}
          value={atRiskCount}
          label="At Risk"
          variant="warning"
          loading={isLoading}
        />
      </div>

      {/* Orders Table */}
      <OrdersTable
        orders={orders}
        atRiskOrders={atRiskOrders}
        loading={isLoading}
        onCancelOrder={handleCancelOrder}
        onIssueRefund={handleIssueRefund}
        page={page}
        totalPages={ordersData?.pages ?? 1}
        total={ordersData?.total ?? 0}
        pageSize={10}
        onPageChange={setPage}
      />

      {openOrderId && (
        <DirectOrderView
          orderId={openOrderId}
          onClose={handleCloseOrder}
          onCancelOrder={handleCancelOrder}
          onIssueRefund={handleIssueRefund}
        />
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersPageContent />
    </Suspense>
  );
}
