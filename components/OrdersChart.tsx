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

const hourlyData = [
  { time: "12 AM", newOrders: 12, completed: 9, cancelled: 1 },
  { time: "2 AM", newOrders: 7, completed: 6, cancelled: 0 },
  { time: "4 AM", newOrders: 5, completed: 4, cancelled: 0 },
  { time: "6 AM", newOrders: 15, completed: 13, cancelled: 1 },
  { time: "8 AM", newOrders: 28, completed: 26, cancelled: 2 },
  { time: "10 AM", newOrders: 35, completed: 32, cancelled: 2 },
  { time: "12 PM", newOrders: 52, completed: 48, cancelled: 3 },
  { time: "2 PM", newOrders: 48, completed: 45, cancelled: 2 },
  { time: "4 PM", newOrders: 38, completed: 35, cancelled: 2 },
  { time: "6 PM", newOrders: 45, completed: 41, cancelled: 2 },
  { time: "8 PM", newOrders: 42, completed: 39, cancelled: 2 },
  { time: "10 PM", newOrders: 33, completed: 30, cancelled: 2 },
];

const fulfillmentData = [
  { time: "12 AM", avgTime: 42, target: 45 },
  { time: "2 AM", avgTime: 38, target: 45 },
  { time: "4 AM", avgTime: 45, target: 45 },
  { time: "6 AM", avgTime: 40, target: 45 },
  { time: "8 AM", avgTime: 37, target: 45 },
  { time: "10 AM", avgTime: 36, target: 45 },
  { time: "12 PM", avgTime: 41, target: 45 },
  { time: "2 PM", avgTime: 39, target: 45 },
  { time: "4 PM", avgTime: 35, target: 45 },
  { time: "6 PM", avgTime: 36, target: 45 },
  { time: "8 PM", avgTime: 37, target: 45 },
  { time: "10 PM", avgTime: 40, target: 45 },
];

// Custom tooltip for Order Volume
const CustomOrderTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-[#F3F4F6]">
        <p className="font-semibold text-[#111827] mb-2">{label}</p>
        <p className="text-sm text-[#EF4444] mb-1">
          Cancelled : {payload[0]?.value || 0}
        </p>
        <p className="text-sm text-[#10B981] mb-1">
          Completed : {payload[1]?.value || 0}
        </p>
        <p className="text-sm text-[#209d01]">
          New Orders : {payload[2]?.value || 0}
        </p>
      </div>
    );
  }
  return null;
};

// Custom tooltip for Fulfillment Time
const CustomFulfillmentTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-[#F3F4F6]">
        <p className="font-semibold text-[#111827] mb-2">{label}</p>
        <p className="text-sm text-[#10B981] mb-1">
          Avg Fulfillment Time : {payload[0]?.value || 0}
        </p>
        <p className="text-sm text-[#9CA3AF]">
          Target (45 min) : {payload[1]?.value || 45}
        </p>
      </div>
    );
  }
  return null;
};

export default function OrdersChart() {
  const [activeTab, setActiveTab] = useState<"volume" | "fulfillment">(
    "volume",
  );

  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#F3F4F6]">
      {/* Header */}
      {/* Header, Stats Summary, and Tabs in one horizontal line */}
      <div className="flex items-start justify-between mb-6">
        {/* Header */}
        <div className="flex gap-6">
          <div className="w-[30%] ">
            <h3 className="text-lg font-semibold text-[#111827] mb-1">
              Orders Activity
            </h3>
            <p className="text-sm text-[#6B7280]">Last 24 hours performance</p>
          </div>

          {/* Stats Summary */}
          <div className="flex gap-2 w-[55%]">
            <div>
              <div className="text-xs text-[#9CA3AF] mb-1 text-center">
                Peak Hour
              </div>
              <div className="text-xs font-bold text-[#111827] text-center">
                12:00 PM
              </div>
            </div>
            <div>
              <div className="text-xs text-[#9CA3AF] mb-1 text-center">
                Total Orders
              </div>
              <div className="text-xs font-bold text-[#111827] text-center">
                360
              </div>
            </div>
            <div>
              <div className="text-xs text-[#9CA3AF] mb-1 text-center">
                Completion Rate
              </div>
              <div className="text-xs font-bold text-[#10B981] text-center">
                92.3%
              </div>
            </div>
            <div className=" ">
              <div className="text-xs text-[#9CA3AF] mb-1 text-center">
                Avg Time
              </div>
              <div className="text-xs font-bold text-[#111827] text-center ">
                38 mins
              </div>
            </div>
          </div>
        </div>

        <div className="h-16 border-l-2 border-[#E5E7EB] px-4"></div>

        {/* Tabs */}
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

      {/* Chart */}
      <div className="h-[320px]">
        {activeTab === "volume" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData} barGap={0} barCategoryGap={0}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <Tooltip
                content={<CustomOrderTooltip />}
                cursor={{ fill: "transparent" }}
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="circle"
                formatter={(value) => {
                  const labels: any = {
                    cancelled: "Cancelled",
                    completed: "Completed",
                    newOrders: "New Orders",
                  };
                  return (
                    <span className="text-sm text-[#6B7280]">
                      {labels[value]}
                    </span>
                  );
                }}
              />
              <Bar
                dataKey="completed"
                fill="#219e02"
                radius={[4, 4, 0, 0]}
                maxBarSize={20}
              />
              <Bar
                dataKey="newOrders"
                fill="#34c759"
                radius={[4, 4, 0, 0]}
                maxBarSize={20}
              />
              <Bar
                dataKey="cancelled"
                fill="#f04343"
                radius={[4, 4, 0, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fulfillmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                label={{
                  value: "Minutes",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#9CA3AF",
                  fontSize: 12,
                }}
              />
              <Tooltip content={<CustomFulfillmentTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="line"
                formatter={(value) => {
                  const labels: any = {
                    avgTime: "Avg Fulfillment Time",
                    target: "Target (45 min)",
                  };
                  return (
                    <span className="text-sm text-[#6B7280]">
                      {labels[value]}
                    </span>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="avgTime"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#D1D5DB"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#D1D5DB", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
