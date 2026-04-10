"use client";

import { useRouter } from "next/navigation";
import { SearchResults } from "@/lib/hooks/search";
import { motion } from "framer-motion";

interface GlobalSearchDropdownProps {
  results: SearchResults | undefined;
  isLoading: boolean;
  query: string;
  onClose: () => void;
}

const AVATAR_COLORS = ["#219e02", "#2563EB", "#9333EA", "#D97706", "#DC2626"];

function getAvatarColor(id: string) {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function ResultRow({
  id,
  name,
  email,
  phone,
  badge,
  badgeColor,
  onClick,
}: {
  id: string;
  name: string;
  email: string;
  phone?: string;
  badge: string;
  badgeColor: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors rounded-xl"
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
        style={{ backgroundColor: getAvatarColor(id) }}
      >
        {getInitials(name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 truncate">{name}</span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${badgeColor}`}>
            {badge}
          </span>
        </div>
        <div className="text-xs text-gray-400 truncate">
          {email}{phone ? ` · ${phone}` : ""}
        </div>
      </div>
    </div>
  );
}

export default function GlobalSearchDropdown({
  results,
  isLoading,
  query,
  onClose,
}: GlobalSearchDropdownProps) {
  const router = useRouter();

  const navigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const users = results?.users ?? [];
  const cooks = results?.cooks ?? [];
  const orders = results?.orders ?? [];
  const total = users.length + cooks.length + orders.length;

  return (
    <motion.div
      className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl z-50 overflow-hidden max-h-[420px] overflow-y-auto"
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {isLoading ? (
        <div className="px-4 py-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-9 h-9 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : total === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-gray-400">
          No results for &ldquo;{query}&rdquo;
        </div>
      ) : (
        <div className="py-2">
          {users.length > 0 && (
            <div>
              <div className="px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Customers
              </div>
              {users.map((u) => (
                <ResultRow
                  key={u.id}
                  id={u.id}
                  name={u.name}
                  email={u.email}
                  phone={u.phone}
                  badge="Customer"
                  badgeColor="bg-blue-50 text-blue-600"
                  onClick={() => navigate(`/customers?openProfile=${u.id}`)}
                />
              ))}
            </div>
          )}

          {cooks.length > 0 && (
            <div className={users.length > 0 ? "mt-1 border-t border-gray-100 pt-1" : ""}>
              <div className="px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Cooks
              </div>
              {cooks.map((c) => (
                <ResultRow
                  key={c.id}
                  id={c.id}
                  name={c.name}
                  email={c.email}
                  phone={c.phone}
                  badge="Cook"
                  badgeColor="bg-[#F0FDF4] text-[#219e02]"
                  onClick={() => navigate(`/cooks?openProfile=${c.id}`)}
                />
              ))}
            </div>
          )}

          {orders.length > 0 && (
            <div className={(users.length > 0 || cooks.length > 0) ? "mt-1 border-t border-gray-100 pt-1" : ""}>
              <div className="px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Orders
              </div>
              {orders.map((o) => (
                <ResultRow
                  key={o.id}
                  id={o.id}
                  name={String(o.orderId ?? o.id)}
                  email={String(o.status ?? "")}
                  badge="Order"
                  badgeColor="bg-orange-50 text-orange-600"
                  onClick={() => navigate(`/orders?openOrder=${o.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
