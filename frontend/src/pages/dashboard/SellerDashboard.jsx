import React from "react";
import { useSelector } from "react-redux";
import { Store } from "lucide-react";
import DashboardCards from "./DashboardCards.jsx";
import { dashboardCards } from "./dashboardCards.js";

function SellerDashboard() {
  const { user: currentUser } = useSelector((state) => state.auth);

  // Set Seller Stats -------------------
  const sellerStats = {
    totalOrders: currentUser?.myOrders?.length || "0",
    revenue: `$${currentUser?.myRevanue?.length || "0"}`,
    products: currentUser?.productList?.length || "0",
    customers: currentUser?.myCustomers?.length || "0",
  };

  return (
    <>
      <div className="bg-white/40 p-7 space-y-5">
        {/* ===== HEADER ===== */}
        <div className="flex gap-4 items-center bg-white rounded-2xl p-5 border shadow-sm">
          <div>
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gray-200 text-gray-400">
              <Store />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <p className="text-xs text-gray-400 font-medium tracking-wider">
                SELLER DASHBOARD
              </p>
              {currentUser?.store_type && (
                <span className="text-[10px] font-semibold text-green-700 bg-green-50/80 px-2.5 py-0.5 rounded-full border border-green-100 uppercase tracking-wide">
                  {currentUser.store_type}
                </span>
              )}
            </div>
            <p className="text-2xl font-serif font-semibold text-gray-850 mt-1">
              {currentUser?.store_name || "My Store"}
            </p>
          </div>
        </div>
        {/* ===== CARDS ===== */}
        <DashboardCards cards={dashboardCards.seller} stats={sellerStats} />

        {/* ===== CHART + ORDERS ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* SALES CHART */}

          <div className="lg:col-span-2 min-h-[350px] rounded-xl border p-5 bg-white">
            <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
          </div>

          {/* RECENT ORDERS */}

          <div className="min-h-[350px] rounded-xl border p-5 bg-white">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          </div>
        </div>
      </div>
    </>
  );
}

export default SellerDashboard;
