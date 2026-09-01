import React from "react";
import { Store, CheckCircle2, XCircle, Power, AlertCircle } from "lucide-react";
import DashboardCards from "../../common/components/DashboardCards.jsx";
import { dashboardCards } from "../../common/configs/dashboardCards.js";
import { useSellerDashboard } from "../hooks/useSellerDashboard.js";

function SellerDashboard() {
  const {
    currentUser,
    sellerStats,
    isStoreOpen,
    isTogglingStatus,
    handleToggleStoreStatus,
  } = useSellerDashboard();

  return (
    <div className="bg-white/40 p-4 sm:p-7 space-y-5 max-w-7xl mx-auto">
      {/* ===== HEADER WITH STORE STATUS TOGGLE ===== */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: Store Info */}
          <div className="flex items-center gap-3.5">
            <div className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100/80 shadow-xs shrink-0">
              <Store size={26} strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                  Seller Dashboard
                </span>
                {currentUser?.store_type && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 uppercase tracking-wide">
                    {currentUser.store_type}
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-0.5">
                {currentUser?.store_name || "My Store"}
              </h1>
            </div>
          </div>

          {/* Right: Interactive Store Status (Active / Deactive) Switch */}
          <div className="flex items-center gap-3 bg-gray-50/90 border border-gray-200/80 p-2.5 sm:px-4 sm:py-2.5 rounded-2xl self-start sm:self-auto">
            <div className="flex flex-col items-start sm:items-end">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isStoreOpen
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-red-500"
                  }`}
                />
                <span className="text-xs font-black text-gray-800 tracking-tight whitespace-nowrap">
                  {isStoreOpen ? "Store Active" : "Store Inactive"}
                </span>
              </div>
              <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">
                {isStoreOpen ? "Accepting new orders" : "Closed for orders"}
              </span>
            </div>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                disabled={isTogglingStatus}
                checked={isStoreOpen}
                onChange={() => handleToggleStoreStatus(!isStoreOpen)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 cursor-pointer disabled:opacity-50"></div>
            </label>
          </div>
        </div>

        {/* Informational Subtext */}
        {!isStoreOpen && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60">
            <AlertCircle size={15} className="shrink-0 text-amber-600" />
            <span>
              Your store is currently inactive. Customers cannot browse products or place orders until you reactivate it.
            </span>
          </div>
        )}
      </div>

      {/* ===== CARDS ===== */}
      <DashboardCards cards={dashboardCards.seller} stats={sellerStats} />

      {/* ===== CHART + ORDERS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* SALES CHART */}
        <div className="lg:col-span-2 min-h-[350px] rounded-2xl border border-gray-200/90 p-5 bg-white shadow-xs">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Sales Overview</h2>
          <div className="flex items-center justify-center h-52 text-gray-400 text-sm font-medium">
            Chart analytics will appear as you receive orders
          </div>
        </div>

        {/* RECENT ORDERS */}
        <div className="min-h-[350px] rounded-2xl border border-gray-200/90 p-5 bg-white shadow-xs">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h2>
          <div className="flex items-center justify-center h-52 text-gray-400 text-sm font-medium">
            No recent orders
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
