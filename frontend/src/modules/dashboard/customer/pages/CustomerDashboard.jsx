import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import DashboardCards from "../../common/components/DashboardCards.jsx";
import { dashboardCards } from "../../common/configs/dashboardCards.js";
import { MiniProfileContainer } from "@/modules/profile";
import {
  ChevronRight,
  MapPin,
  Phone,
  ShoppingBag,
  ArrowRight,
  RotateCcw,
  Loader2,
  User,
} from "lucide-react";
import { useCustomerDashboard } from "../hooks/useCustomerDashboard.js";

// Status badge helper rendered in JSX component
const renderStatusBadge = (status) => {
  const normalized = status?.toLowerCase() || "pending";
  const displayLabel = status ? status.replace(/_/g, " ") : "Pending";

  if (["completed", "delivered"].includes(normalized)) {
    return (
      <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize">
        {displayLabel}
      </span>
    );
  }
  if (["preparing", "confirmed", "processing", "pending"].includes(normalized)) {
    return (
      <span className="bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize">
        {displayLabel}
      </span>
    );
  }
  if (["out_for_delivery", "shipped", "ready"].includes(normalized)) {
    return (
      <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize">
        {displayLabel}
      </span>
    );
  }
  if (["rejected", "cancelled"].includes(normalized)) {
    return (
      <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize">
        {displayLabel}
      </span>
    );
  }
  return (
    <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize">
      {displayLabel}
    </span>
  );
};

function CustomerDashboard() {
  const navigate = useNavigate();
  const {
    currentUser,
    currentUserAddress,
    isAddressAvailable,
    handleAddAddress,
    ordersList,
    loadingOrders,
    pastTwoOrders,
    customerStats,
    reorderingOrderId,
    handleReorder,
    getOrderTitle,
    getOrderPrice,
  } = useCustomerDashboard();

  const commonCss = "bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-xs";

  return (
    <div className="bg-white/40 p-2.5 sm:p-6 lg:p-7 space-y-3.5 sm:space-y-5 max-w-7xl mx-auto font-sans pb-24 md:pb-8">
      {/* ===== TOP WELCOME BANNER ===== */}
      <div className={commonCss}>
        <div className="flex items-center justify-between gap-2.5 sm:gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-gray-400 font-bold text-[10px] sm:text-xs uppercase tracking-wider">
              DASHBOARD
            </p>
            <h1 className="text-base sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight mt-0.5 break-words">
              Welcome back, {currentUser?.username ? currentUser.username.split(" ")[0] : "Customer"}
            </h1>
            <p className="text-[11px] sm:text-sm text-gray-500 mt-0.5 leading-snug">
              Explore your orders and favorite foods.
            </p>
          </div>

          {/* Profile Avatar (Never squishes with aspect-square & shrink-0) */}
          <div className="shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-orange-200/80 overflow-hidden aspect-square flex items-center justify-center shadow-2xs">
            {currentUser?.imageUrl || currentUser?.profile_picture ? (
              <img
                src={currentUser.imageUrl || currentUser.profile_picture}
                alt="profile picture"
                className="w-full h-full object-cover rounded-full aspect-square"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 flex items-center justify-center">
                <User size={24} className="sm:size-7" strokeWidth={1.75} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== STATS CARDS (2x2 on mobile, 4 cols on desktop) ===== */}
      <DashboardCards cards={dashboardCards.customer} stats={customerStats} />

      {/* ===== MAIN CONTENT GRID ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* ===== RECENT ORDERS ===== */}
        <div className={`lg:col-span-2 ${commonCss}`}>
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Orders</h2>

            {ordersList.length > 0 && (
              <NavLink
                to="/orders"
                className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                View all <ChevronRight size={13} />
              </NavLink>
            )}
          </div>

          {/* ORDER LIST / EMPTY STATE */}
          {loadingOrders ? (
            <div className="py-10 flex flex-col items-center justify-center text-gray-400">
              <Loader2 size={24} className="animate-spin text-emerald-600 mb-2" />
              <p className="text-xs font-medium">Loading recent orders...</p>
            </div>
          ) : pastTwoOrders.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {pastTwoOrders.map((order, idx) => (
                <div
                  key={order._id || idx}
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="border border-gray-200/80 rounded-xl p-3.5 sm:p-4 transition-all hover:border-gray-300 hover:shadow-xs cursor-pointer bg-white"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate">
                        {getOrderTitle(order)}
                      </h3>
                      <p className="text-gray-500 text-xs mt-0.5 truncate">
                        {order.store_name ? `Ordered from ${order.store_name}` : "Food Order"}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {renderStatusBadge(order.order_status)}
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 flex items-center justify-between pt-2 border-t border-gray-100">
                    <p className="font-bold text-sm sm:text-base text-gray-900">
                      {getOrderPrice(order)}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={reorderingOrderId === order._id}
                        onClick={(e) => handleReorder(e, order, navigate)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/70 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {reorderingOrderId === order._id ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            Reordering...
                          </>
                        ) : (
                          <>
                            <RotateCcw size={12} />
                            Reorder
                          </>
                        )}
                      </button>

                      <span className="text-xs text-gray-500 hover:text-emerald-700 font-medium flex items-center gap-0.5">
                        Details <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-gray-200 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center bg-gray-50/50">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-3 shadow-2xs">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800">No orders placed yet</h3>
              <p className="text-gray-500 text-xs sm:text-sm mt-1 max-w-sm">
                Looks like you haven't ordered anything yet. Start your first order now!
              </p>
              <NavLink
                to="/stores"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Start your first order <ArrowRight size={14} />
              </NavLink>
            </div>
          )}
        </div>

        {/* ===== PROFILE / ADDRESS ===== */}
        <div className={commonCss}>
          <div className="pb-3 border-b border-gray-100">
            <MiniProfileContainer />
          </div>

          {/* Info rows */}
          <div className="space-y-3.5 mt-4 flex-1">
            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Phone size={14} className="text-gray-500" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-gray-400 font-medium">Phone</p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                  {currentUser?.phone ? `+91 ${currentUser.phone}` : "Not provided"}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin size={14} className="text-gray-500" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-400 font-medium">Default Address</p>
                {isAddressAvailable ? (
                  <p className="text-xs sm:text-sm text-gray-800 font-medium leading-snug mt-0.5 line-clamp-2">
                    {currentUserAddress}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddAddress}
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 mt-1 transition-colors bg-transparent border-none p-0 cursor-pointer outline-none"
                  >
                    + Add address
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
