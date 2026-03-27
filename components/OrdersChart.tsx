"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { OrdersChartItem } from "@/lib/hooks/dashboard";

interface Props {
  chartData: OrdersChartItem[];
  fulfillmentTime?: number;
  loading?: boolean;
}

const TARGET_MINUTES = 45;

function transformChartData(raw: OrdersChartItem[]) {
  return raw.map((item) => {
    const entry: Record<string, any> = {
      time: new Date(item._id).toLocaleDateString("en-GB", {
        month: "short",
        day: "numeric",
      }),
    };
    for (const d of item.data) {
      entry[d.status] = d.count;
    }
    // ensure all keys exist so bars render correctly
    entry.delivered = entry.delivered ?? 0;
    entry.pending = entry.pending ?? 0;
    entry.cancelled = entry.cancelled ?? 0;
    entry.confirmed = entry.confirmed ?? 0;
    entry.picked_up = entry.picked_up ?? 0;
    return entry;
  });
}

function buildFulfillmentData(chartData: OrdersChartItem[], avgTime: number) {
  if (!chartData.length) return [];
  return chartData.map((item) => ({
    time: new Date(item._id).toLocaleDateString("en-GB", {
      month: "short",
      day: "numeric",
    }),
    avgTime: parseFloat(avgTime.toFixed(1)),
    target: TARGET_MINUTES,
  }));
}

const CustomOrderTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-[#F3F4F6]">
        <p className="font-semibold text-[#111827] mb-2">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} className="text-sm mb-1" style={{ color: p.fill }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomFulfillmentTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-[#F3F4F6]">
        <p className="font-semibold text-[#111827] mb-2">{label}</p>
        <p className="text-sm text-[#10B981] mb-1">
          Avg Fulfillment: {payload[0]?.value} min
        </p>
        <p className="text-sm text-[#9CA3AF]">
          Target: {payload[1]?.value} min
        </p>
      </div>
    );
  }
  return null;
};

export default function OrdersChart({ chartData, fulfillmentTime, loading }: Props) {
  const [activeTab, setActiveTab] = useState<"volume" | "fulfillment">("volume");

  const volumeData = transformChartData(chartData);
  const fulfillmentData = fulfillmentTime != null
    ? buildFulfillmentData(chartData, fulfillmentTime)
    : [];

  const totalOrders = chartData.reduce(
    (sum, item) => sum + item.data.reduce((s, d) => s + d.count, 0),
    0
  );
  const totalDelivered = chartData.reduce(
    (sum, item) =>
      sum + (item.data.find((d) => d.status === "delivered")?.count ?? 0),
    0
  );
  const completionRate =
    totalOrders > 0 ? ((totalDelivered / totalOrders) * 100).toFixed(1) : "—";

  const peakDay = chartData.reduce(
    (best, item) => {
      const total = item.data.reduce((s, d) => s + d.count, 0);
      return total > best.count ? { date: item._id, count: total } : best;
    },
    { date: "", count: 0 }
  );
  const peakLabel = peakDay.date
    ? new Date(peakDay.date).toLocaleDateString("en-GB", {
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#F3F4F6]">
      <div className="flex items-start justify-between mb-6">
        <div className="flex gap-6">
          <div className="w-[30%]">
            <h3 className="text-lg font-semibold text-[#111827] mb-1">
              Orders Activity
            </h3>
            <p className="text-sm text-[#6B7280]">Period performance</p>
          </div>

          <div className="flex gap-2 w-[55%]">
            <div>
              <div className="text-xs text-[#9CA3AF] mb-1 text-center">Peak Day</div>
              <div className="text-xs font-bold text-[#111827] text-center">
                {loading ? "—" : peakLabel}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#9CA3AF] mb-1 text-center">Total Orders</div>
              <div className="text-xs font-bold text-[#111827] text-center">
                {loading ? "—" : totalOrders}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#9CA3AF] mb-1 text-center">Completion Rate</div>
              <div className="text-xs font-bold text-[#10B981] text-center">
                {loading ? "—" : `${completionRate}%`}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#9CA3AF] mb-1 text-center">Avg Time</div>
              <div className="text-xs font-bold text-[#111827] text-center">
                {loading || fulfillmentTime == null
                  ? "—"
                  : `${fulfillmentTime.toFixed(0)} min`}
              </div>
            </div>
          </div>
        </div>

        <div className="h-16 border-l-2 border-[#E5E7EB] px-4" />

        <div className="w-[38%] bg-[#F7F7F7] py-1 px-1 rounded-full">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("volume")}
              className={`flex-1 py-3 text-sm font-medium transition-all rounded-full ${
                activeTab === "volume"
                  ? "bg-white text-[#111827] shadow-sm"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              Order Volume
            </button>
            <button
              onClick={() => setActiveTab("fulfillment")}
              className={`flex-1 py-3 text-sm font-medium transition-all rounded-full ${
                activeTab === "fulfillment"
                  ? "bg-white text-[#111827] shadow-sm"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              Fulfillment Time
            </button>
          </div>
        </div>
      </div>

      <div className="h-[380px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-[#9CA3AF] text-sm">
            Loading chart data...
          </div>
        ) : activeTab === "volume" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeData} barGap={2} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
              <Tooltip content={<CustomOrderTooltip />} cursor={{ fill: "transparent" }} />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="circle"
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    delivered: "Delivered",
                    pending: "Pending",
                    cancelled: "Cancelled",
                    confirmed: "Confirmed",
                    picked_up: "Picked Up",
                  };
                  return <span className="text-sm text-[#6B7280]">{labels[value] ?? value}</span>;
                }}
              />
              <Bar dataKey="delivered" name="delivered" fill="#219e02" radius={[4, 4, 0, 0]} maxBarSize={20} />
              <Bar dataKey="confirmed" name="confirmed" fill="#34c759" radius={[4, 4, 0, 0]} maxBarSize={20} />
              <Bar dataKey="picked_up" name="picked_up" fill="#86efac" radius={[4, 4, 0, 0]} maxBarSize={20} />
              <Bar dataKey="pending" name="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={20} />
              <Bar dataKey="cancelled" name="cancelled" fill="#f04343" radius={[4, 4, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fulfillmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                label={{ value: "Minutes", angle: -90, position: "insideLeft", fill: "#9CA3AF", fontSize: 12 }}
              />
              <Tooltip content={<CustomFulfillmentTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="line"
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    avgTime: "Avg Fulfillment Time",
                    target: `Target (${TARGET_MINUTES} min)`,
                  };
                  return <span className="text-sm text-[#6B7280]">{labels[value]}</span>;
                }}
              />
              <Line type="monotone" dataKey="avgTime" stroke="#10B981" strokeWidth={3} dot={{ fill: "#10B981", r: 5 }} activeDot={{ r: 7 }} />
              <Line type="monotone" dataKey="target" stroke="#D1D5DB" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "#D1D5DB", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
