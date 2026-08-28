import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import DashboardCards from "../../common/components/DashboardCards.jsx";
import { dashboardCards } from "../../common/configs/dashboardCards.js";
import { MiniProfileContainer } from "@/modules/profile";
import { ChevronRight, MapPin, Phone, ShoppingBag, ArrowRight, RotateCcw, Loader2, User } from "lucide-react";
import { useCustomerDashboard } from "../hooks/useCustomerDashboard.js";

// Status badge helper rendered in JSX component
const renderStatusBadge = (status) => {
  const normalized = status?.toLowerCase() || "pending";
  const displayLabel = status ? status.replace(/_/g, " ") : "Pending";

  if (["completed", "delivered"].includes(normalized)) {
    return (
      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
        {displayLabel}
      </span>
    );
  }
  if (["preparing", "confirmed", "processing", "pending"].includes(normalized)) {
    return (
      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
        {displayLabel}
      </span>
    );
  }
  if (["out_for_delivery", "shipped", "ready"].includes(normalized)) {
    return (
      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
        {displayLabel}
      </span>
    );
  }
  if (["rejected", "cancelled"].includes(normalized)) {
    return (
      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
        {displayLabel}
      </span>
    );
  }
  return (
    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
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

  const commonCss = "bg-white rounded-2xl border p-5 shadow";

  return (
    <div className="bg-white/40 p-7 space-y-5">
      {/* ===== TOP SECTION ===== */}
      <div className={commonCss}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 font-semibold text-xs">DASHBOARD</p>
            <p className="text-3xl font-semibold">
              Welcome back, {currentUser?.username ? currentUser.username.split(" ")[0] : "User"}
            </p>
            <p className="text-gray-500 mt-2">
              Explore your orders and favorite foods.
            </p>
          </div>

          <div className="border rounded-full border-orange-200 overflow-hidden">
            {currentUser?.imageUrl || currentUser?.profile_picture ? (
              <img
                src={currentUser.imageUrl || currentUser.profile_picture}
                alt="profile picture"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 flex items-center justify-center">
                <User size={32} strokeWidth={1.75} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== STATS CARDS ===== */}
      <DashboardCards cards={dashboardCards.customer} stats={customerStats} />

      {/* ===== MAIN CONTENT ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ===== RECENT ORDERS ===== */}
        <div className={`lg:col-span-2 ${commonCss}`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-semibold">Recent Orders</h2>

            {ordersList.length > 0 && (
              <NavLink
                to="/orders"
                className="flex items-center gap-1 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] transition-colors"
              >
                View all <ChevronRight size={13} />
              </NavLink>
            )}
          </div>

          {/* ORDER LIST / EMPTY STATE */}
          {loadingOrders ? (
            <div className="py-10 flex flex-col items-center justify-center text-gray-400">
              <div className="w-7 h-7 border-2 border-green-600 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-xs font-medium">Loading recent orders...</p>
            </div>
          ) : pastTwoOrders.length > 0 ? (
            <div className="space-y-4">
              {pastTwoOrders.map((order, idx) => (
                <div
                  key={order._id || idx}
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="border rounded-xl p-4 transition-all hover:border-gray-300 hover:shadow-sm cursor-pointer bg-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {getOrderTitle(order)}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {order.store_name ? `Ordered from ${order.store_name}` : "Food Order"}
                      </p>
                    </div>

                    {renderStatusBadge(order.order_status)}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-medium text-gray-800">{getOrderPrice(order)}</p>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={reorderingOrderId === order._id}
                        onClick={(e) => handleReorder(e, order, navigate)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        {reorderingOrderId === order._id ? (
                          <>
                            <Loader2 size={13} className="animate-spin" />
                            Reordering...
                          </>
                        ) : (
                          <>
                            <RotateCcw size={13} />
                            Reorder
                          </>
                        )}
                      </button>

                      <span className="text-xs text-gray-500 hover:text-green-700 font-medium flex items-center gap-0.5">
                        Details <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center flex flex-col items-center justify-center bg-gray-50/50">
              <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-3 shadow-inner">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">No orders placed yet</h3>
              <p className="text-gray-500 text-sm mt-1 max-w-sm">
                Looks like you haven't ordered anything yet. Start your first order now!
              </p>
              <NavLink
                to="/stores"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                Start your first order <ArrowRight size={14} />
              </NavLink>
            </div>
          )}
        </div>

        {/* ===== PROFILE / ADDRESS ===== */}
        <div className={commonCss}>
          <div className="pb-2 border-b">
            <MiniProfileContainer />
          </div>

          {/* Info rows */}
          <div className="space-y-4 mt-5 flex-1">
            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F5F5F4] flex items-center justify-center flex-shrink-0">
                <Phone size={10} className="text-[#78716C]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs text-[#A8A29E]">Phone</p>
                <p className="text-[14px] font-semibold text-[#1C1917]">
                  {currentUser?.phone ? `+91 ${currentUser.phone}` : "Not provided"}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F5F5F4] flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin size={10} className="text-[#78716C]" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#A8A29E]">Default Address</p>
                {isAddressAvailable ? (
                  <p className="text-[14px] text-[#1C1917] font-medium leading-snug mt-0.5">
                    {currentUserAddress}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddAddress}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#EF4444] hover:text-[#B91C1C] mt-1 transition-colors bg-transparent border-none p-0 cursor-pointer outline-none"
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
