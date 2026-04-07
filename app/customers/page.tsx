"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Users,
  UserPlus,
  TrendingUp,
  ShoppingCart,
  UserMinus,
} from "@/lib/icons";
import CustomerStatsCard from "@/components/Customers/Customerstatscard";
import FilterBar from "@/components/Filterbar";
import CustomersFilterPanel from "@/components/Customers/Customersfilterpanel";
import CustomersTable, {
  Customer,
} from "@/components/Customers/Customerstable";
import CustomerProfileSidebar from "@/components/Customers/CustomerProfileSidebar";
import {
  SendEmailModal,
  AddNoteModal,
  SuspendUserModal,
  ReactivateModal,
} from "@/components/Customers/CustomerModals";
import { useCustomers, useCustomerById } from "@/lib/hooks/customers";
import { mapCustomer, mapCustomerDetail } from "@/lib/mappers/customers";
import { exportCSV } from "@/lib/exportCSV";
import PageLoader from "@/components/PageLoader";

type CustomerModal = "message" | "add-note" | "suspend" | "reactivate" | null;

function DirectCustomerProfile({ customerId, onClose }: { customerId: string; onClose: () => void }) {
  const { data } = useCustomerById(customerId);
  const [activeModal, setActiveModal] = useState<CustomerModal>(null);

  if (!data) return null;
  const customer = mapCustomerDetail(data);
  const closeModal = () => setActiveModal(null);

  return (
    <>
      <CustomerProfileSidebar
        customer={customer}
        onClose={onClose}
        onMessage={() => setActiveModal("message")}
        onAddNote={() => setActiveModal("add-note")}
        onSuspend={() => setActiveModal("suspend")}
        onReactivate={() => setActiveModal("reactivate")}
      />
      {activeModal === "message" && (
        <SendEmailModal customerId={customerId} customerName={customer.name} onClose={closeModal} />
      )}
      {activeModal === "add-note" && (
        <AddNoteModal customerId={customerId} customerName={customer.name} onClose={closeModal} />
      )}
      {activeModal === "suspend" && (
        <SuspendUserModal customerId={customerId} customerName={customer.name} onClose={closeModal} />
      )}
      {activeModal === "reactivate" && (
        <ReactivateModal customerId={customerId} customerName={customer.name} onClose={closeModal} />
      )}
    </>
  );
}

function CustomersPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [openProfileId, setOpenProfileId] = useState<string | null>(null);

  const profileParam = searchParams.get("openProfile");
  useEffect(() => {
    if (profileParam) setOpenProfileId(profileParam);
  }, [profileParam]);

  const handleCloseProfile = () => {
    setOpenProfileId(null);
    router.replace("/customers", { scroll: false });
  };
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    const filters: string[] = [];
    selectedStatus.forEach((s) => filters.push(`Status: ${s}`));
    selectedCities.forEach((c) => filters.push(`City: ${c}`));
    setActiveFilters(filters);
  }, [selectedStatus, selectedCities]);

  const { data, isLoading } = useCustomers({
    status: selectedStatus.length === 1 ? selectedStatus[0] : undefined,
    city: selectedCities[0],
    sortBy,
  });

  if (isLoading) return <PageLoader />;

  const stats = data?.stats;
  const customers: Customer[] = (data?.customers ?? []).map(mapCustomer);

  const handleClearFilters = () => {
    setSelectedStatus([]);
    setSelectedCities([]);
    setSortBy("newest");
    setActiveFilters([]);
  };

  const handleRemoveFilter = (filter: string) => {
    if (filter.startsWith("Status:")) {
      const s = filter.replace("Status: ", "");
      setSelectedStatus(selectedStatus.filter((x) => x !== s));
    } else if (filter.startsWith("City:")) {
      const c = filter.replace("City: ", "");
      setSelectedCities(selectedCities.filter((x) => x !== c));
    }
  };

  return (
    <div className="space-t-6 ">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-5">
        <CustomerStatsCard
          icon={Users}
          value={stats?.totalCustomers ?? 0}
          label="Total Customers"
          variant="default"
          loading={isLoading}
        />
        <CustomerStatsCard
          icon={UserPlus}
          value={stats?.newToday ?? 0}
          label="New Today"
          variant="default"
          loading={isLoading}
        />
        <CustomerStatsCard
          icon={TrendingUp}
          value={stats?.joinedLast7Days ?? 0}
          label="Joined Last 7 Days"
          variant="default"
          loading={isLoading}
        />
        <CustomerStatsCard
          icon={TrendingUp}
          value={stats?.joinedLast30Days ?? 0}
          label="Joined Last 30 Days"
          variant="default"
          loading={isLoading}
        />
        <CustomerStatsCard
          icon={UserMinus}
          value={customers.filter((c) => c.status === "Suspended").length}
          label="Suspended"
          variant="danger"
          loading={isLoading}
        />
        <CustomerStatsCard
          icon={ShoppingCart}
          value={stats?.noPurchases ?? 0}
          label="No Purchases Yet"
          variant="muted"
          loading={isLoading}
        />
      </div>

      {/* Customers Table */}
      <div className="overflow-hidden">
        <FilterBar
          showFilters={showFilters}
          activeFilters={activeFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onRemoveFilter={handleRemoveFilter}
          onExport={() =>
            exportCSV(
              "customers.csv",
              ["Name", "Email", "Phone", "City", "Status", "Orders", "Joined"],
              customers.map((c) => [c.name, c.email ?? "", c.phone ?? "", c.city ?? "", c.status, c.orders ?? 0, c.joinedAt ?? ""])
            )
          }
        />

        {showFilters && (
          <CustomersFilterPanel
            selectedStatus={selectedStatus}
            selectedCities={selectedCities}
            sortBy={sortBy}
            onStatusChange={setSelectedStatus}
            onCitiesChange={setSelectedCities}
            onSortChange={setSortBy}
            onClear={handleClearFilters}
          />
        )}

        <CustomersTable customers={customers} loading={isLoading} />
      </div>

      {openProfileId && (
        <DirectCustomerProfile customerId={openProfileId} onClose={handleCloseProfile} />
      )}
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Suspense>
      <CustomersPageContent />
    </Suspense>
  );
}
