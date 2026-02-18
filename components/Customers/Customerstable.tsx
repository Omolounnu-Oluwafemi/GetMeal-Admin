"use client";

import { useState } from "react";
import { Check, MoreVertical } from "@/lib/icons";
import CustomerActionMenu from "@/components/Customers/Customeractionmenu";

export interface Customer {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  avatarColor: string;
  phone: string;
  email: string;
  city: string;
  orders: number;
  lastOrderDays: number;
  lastOrderDate: string;
  status: "Active" | "Suspended";
}

interface CustomersTableProps {
  customers: Customer[];
}

export default function CustomersTable({ customers }: CustomersTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(customers.map((c) => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, customerId]);
    } else {
      setSelectedCustomers(selectedCustomers.filter((id) => id !== customerId));
    }
  };

  const formatLastOrder = (days: number) => {
    if (days === 1) return "about 1 day ago";
    if (days < 30) return `${days} days ago`;
    return "about 1 month ago";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-5 text-left">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    selectedCustomers.length === customers.length &&
                    customers.length > 0
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="peer sr-only "
                />

                <div
                  className="
                    w-4 h-4 rounded-[4px]
                    border-2 border-gray-300 bg-[#f7f7f7]
                    flex items-center justify-center
                    transition-all duration-200
                    peer-checked:bg-[#219e02]
                    peer-checked:border-[#219e02]
                  "
                >
                  <Check strokeWidth={4} width={10} color="#fff" />
                </div>
              </label>
            </th>
            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              City
            </th>
            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Orders
            </th>
            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Order
            </th>
            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-5"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className="hover:bg-[#f9fafb] transition-colors cursor-pointer"
            >
              <td className="px-6 py-8">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCustomers.includes(customer.id)}
                    onChange={(e) =>
                      handleSelectCustomer(customer.id, e.target.checked)
                    }
                    className="peer sr-only"
                  />
                  <div
                    className="
                    w-4 h-4 rounded-[4px]
                    border-2 border-gray-300 bg-[#f7f7f7]
                    flex items-center justify-center
                    transition-all duration-200
                    peer-checked:bg-[#219e02]
                    peer-checked:border-[#219e02]
                  "
                  >
                    <Check strokeWidth={4} width={10} color="#fff" />
                  </div>
                </label>
              </td>

              {/* Name */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  {customer.avatar ? (
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: customer.avatarColor }}
                    >
                      {customer.initials}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900">
                    {customer.name}
                  </span>
                </div>
              </td>

              {/* Contact */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{customer.phone}</div>
                <div className="text-sm text-gray-500">{customer.email}</div>
              </td>

              {/* City */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{customer.city}</div>
              </td>

              {/* Orders */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {customer.orders}
                </div>
              </td>

              {/* Last Order */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatLastOrder(customer.lastOrderDays)}
                </div>
                <div className="text-sm text-gray-500">
                  {customer.lastOrderDate}
                </div>
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    customer.status === "Active"
                      ? "bg-[#F0FDF4] text-[#219e02]"
                      : "bg-[#FEF2F2] text-[#EF4444]"
                  }`}
                >
                  {customer.status}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right relative">
                <button
                  onClick={() =>
                    setOpenMenuId(
                      openMenuId === customer.id ? null : customer.id,
                    )
                  }
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>

                {/* Action Menu */}
                {openMenuId === customer.id && (
                  <CustomerActionMenu
                    customerId={customer.id}
                    customerName={customer.name}
                    onClose={() => setOpenMenuId(null)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
