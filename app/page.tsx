import StatCard from "@/components/StatCard";
import OrdersChart from "@/components/OrdersChart";
import SystemAlerts from "@/components/SystemAlerts";
import OrdersTable from "@/components/OrderStable";

export default function DashboardPage() {
  return (
    <div className="space-y-6 mt-[-4] ">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 ">
        <StatCard
          label="Active Cooks"
          value="45 / 156"
          subtitle="Total"
          trend={{
            value: 5.8,
            isPositive: true,
            comparedTo: "vs yesterday",
          }}
        />

        <StatCard
          label="Total Orders Today"
          value="360"
          trend={{
            value: 8.2,
            isPositive: true,
            comparedTo: "vs yesterday",
          }}
        />

        <StatCard
          label="Amount Made Today"
          value="₦33.0k"
          trend={{
            value: 12.9,
            isPositive: true,
            comparedTo: "vs yesterday",
          }}
        />

        <StatCard
          label="Cancellations Today"
          value="8"
          trend={{
            value: 12.5,
            isPositive: false,
            comparedTo: "vs yesterday",
          }}
        />

        <StatCard
          label="Refunds Today"
          value="₦34,500"
          trend={{
            value: 5.8,
            isPositive: false,
            comparedTo: "vs yesterday",
          }}
        />

        <StatCard
          label="GMV"
          value="₦2.1M"
          trend={{
            value: 18.3,
            isPositive: true,
            comparedTo: "vs yesterday",
          }}
        />
      </div>

      {/* Charts and Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <OrdersChart />
        </div>

        {/* System Alerts - Takes 1 column */}
        <div className="lg:col-span-1">
          <SystemAlerts />
        </div>
      </div>

      <OrdersTable />
    </div>
  );
}
