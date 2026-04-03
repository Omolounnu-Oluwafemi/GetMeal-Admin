"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChefHat,
  ShoppingCart,
  DollarSign,
  XCircle,
  RefreshCw,
  TrendingUp,
} from "@/lib/icons";
import CookStatsCard from "@/components/Cooks/Cookstatscard";
import FilterBar from "@/components/Filterbar";
import CooksFilterPanel from "@/components/Cooks/Cooksfilterpanel";
import CooksTable, { Cook } from "@/components/Cooks/Cookstable";
import CookProfileSidebar from "@/components/Cooks/CookProfileSidebar";
import {
  SendEmailModal,
  AddNoteModal,
  SuspendCookModal,
  ReactivateCookModal,
} from "@/components/Cooks/CookModals";
import { useCookStats, useCooks, useCookById } from "@/lib/hooks/cooks";
import { mapCook } from "@/lib/mappers/cooks";
import PageLoader from "@/components/PageLoader";
import AddCookModal from "@/components/Cooks/AddCookModal";
import AddMealModal from "@/components/Cooks/AddMealModal";


function formatNaira(value: number): string {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${Math.round(value / 1_000)}k`;
  return `₦${value}`;
}


type ProfileModal = "message" | "add-note" | "suspend" | "reactivate" | null;

function DirectCookProfile({ cookId, onClose }: { cookId: string; onClose: () => void }) {
  const { data } = useCookById(cookId);
  const [activeModal, setActiveModal] = useState<ProfileModal>(null);

  if (!data) return null;
  const cook = mapCook(data);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <CookProfileSidebar
        cook={cook}
        onClose={onClose}
        onMessage={() => setActiveModal("message")}
        onAddNote={() => setActiveModal("add-note")}
        onSuspend={() => setActiveModal("suspend")}
        onReactivate={() => setActiveModal("reactivate")}
      />
      {activeModal === "message" && (
        <SendEmailModal cookId={cookId} cookName={cook.name} onClose={closeModal} />
      )}
      {activeModal === "add-note" && (
        <AddNoteModal cookId={cookId} cookName={cook.name} onClose={closeModal} />
      )}
      {activeModal === "suspend" && (
        <SuspendCookModal cookId={cookId} cookName={cook.name} onClose={closeModal} />
      )}
      {activeModal === "reactivate" && (
        <ReactivateCookModal cookId={cookId} cookName={cook.name} onClose={closeModal} />
      )}
    </>
  );
}

function CooksPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [showAddCook, setShowAddCook] = useState(false);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [openProfileId, setOpenProfileId] = useState<string | null>(null);

  const profileParam = searchParams.get("openProfile");
  useEffect(() => {
    if (profileParam) setOpenProfileId(profileParam);
  }, [profileParam]);

  const handleCloseProfile = () => {
    setOpenProfileId(null);
    router.replace("/cooks", { scroll: false });
  };

  useEffect(() => {
    const filters: string[] = [];
    selectedStatus.forEach((status) => filters.push(`Status: ${status}`));
    selectedCities.forEach((city) => filters.push(`City: ${city}`));
    setActiveFilters(filters);
  }, [selectedStatus, selectedCities]);

  const { data: statsData, isLoading: statsLoading } = useCookStats();
  const { data: cooksData, isLoading: cooksLoading } = useCooks({
    status: selectedStatus.length === 1 ? selectedStatus[0] : undefined,
    city: selectedCities[0],
    sortBy,
  });

  if (statsLoading || cooksLoading) return <PageLoader />;

  const stats = statsData;
  const cooks: Cook[] = (cooksData ?? []).map(mapCook);

  const handleClearFilters = () => {
    setSelectedStatus([]);
    setSelectedCities([]);
    setSortBy("newest");
    setActiveFilters([]);
  };

  const handleRemoveFilter = (filter: string) => {
    if (filter.startsWith("Status:")) {
      const status = filter.replace("Status: ", "");
      setSelectedStatus(selectedStatus.filter((s) => s !== status));
    } else if (filter.startsWith("City:")) {
      const city = filter.replace("City: ", "");
      setSelectedCities(selectedCities.filter((c) => c !== city));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-5">
        <CookStatsCard icon={ChefHat} value={stats?.activeCooks ?? 0} label="Active Cooks" variant="default" loading={statsLoading} />
        <CookStatsCard icon={ShoppingCart} value={stats?.totalOrders ?? 0} label="Total Orders Today" variant="default" loading={statsLoading} />
        <CookStatsCard icon={DollarSign} value={stats ? formatNaira(stats.amountToday) : "—"} label="Amount Today" variant="default" loading={statsLoading} />
        <CookStatsCard icon={XCircle} value={stats?.cancellations ?? 0} label="Cancellations Today" variant="default" loading={statsLoading} />
        <CookStatsCard icon={RefreshCw} value={stats?.refunds ?? 0} label="Refunds Today" variant="default" loading={statsLoading} />
        <CookStatsCard icon={TrendingUp} value={stats ? formatNaira(stats.GMV) : "—"} label="GMV" variant="default" loading={statsLoading} />
      </div>

      <div className="overflow-hidden">
        <div className="flex items-center gap-2 justify-end px-1 mb-2">
          <button
            onClick={() => setShowAddMeal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-[#219e02] text-[#219e02] rounded-lg text-sm font-medium hover:bg-[#f0fdf4] transition-colors"
          >
            + Create Meal
          </button>
          <button
            onClick={() => setShowAddCook(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#219e02] text-white rounded-lg text-sm font-medium hover:bg-[#1a7d01] transition-colors"
          >
            + Add Cook
          </button>
        </div>
        <FilterBar
          showFilters={showFilters}
          activeFilters={activeFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onRemoveFilter={handleRemoveFilter}
          onExport={() => {}}
        />
        {showFilters && (
          <CooksFilterPanel
            selectedStatus={selectedStatus}
            selectedCities={selectedCities}
            sortBy={sortBy}
            onStatusChange={setSelectedStatus}
            onCitiesChange={setSelectedCities}
            onSortChange={setSortBy}
            onClear={handleClearFilters}
          />
        )}
        <CooksTable cooks={cooks} loading={cooksLoading} />
      </div>

      {showAddCook && <AddCookModal onClose={() => setShowAddCook(false)} />}
      {showAddMeal && <AddMealModal onClose={() => setShowAddMeal(false)} />}

      {openProfileId && (
        <DirectCookProfile cookId={openProfileId} onClose={handleCloseProfile} />
      )}
    </div>
  );
}

export default function CooksPage() {
  return (
    <Suspense>
      <CooksPageContent />
    </Suspense>
  );
}
