import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { defaultPP } from "@/assets";
import { NavLink } from "react-router-dom";
import DashboardCards from "./DashboardCards.jsx";
import { dashboardCards } from "./dashboardCards.js";
import { MiniProfileContainer } from "@/modules/profile";
import { useModal, MODAL_TYPES } from "@/components";
import { ChevronRight, MapPin, Phone } from "lucide-react";
import { handleGetAddressApi } from "@/modules/address/services/address.service.api";

function CustomerDashboard() {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { openModal } = useModal();

  let currentUserAddress = "";
  const isAddressAvailable = Boolean(currentUser?.myAddress);

  if (isAddressAvailable) {
    currentUserAddress = `${currentUser.myAddress.name || ""} ${currentUser.myAddress.phone || ""} ${currentUser.myAddress.street || ""} ${currentUser.myAddress.city || ""} ${currentUser.myAddress.state || ""}, ${currentUser.myAddress.pincode || ""} `;
  }

  // Load latest address from database on dashboard load
  useEffect(() => {
    const fetchAddress = async () => {
      if (!currentUser?._id) return;
      try {
        const data = await handleGetAddressApi(currentUser._id);
        if (data && data.success && data.addressList && data.addressList.length > 0) {
          dispatch(updateUser({ myAddress: data.addressList[0] }));
        }
      } catch (error) {
        console.error("Failed to load address for dashboard:", error);
      }
    };
    fetchAddress();
  }, [currentUser?._id, dispatch]);

  const handleAddAddress = () => {
    openModal(MODAL_TYPES.ADDRESS, {
      userId: currentUser?._id,
      setAddress: (newAddress) => {
        dispatch(updateUser({ myAddress: newAddress }));
      },
    });
  };

  // Customer stats -------------------------------
  const customerStats = {
    orders: currentUser?.myOrders?.length || 0,
    wishlist: currentUser?.myWishlist?.length || 0,
    rewardPoints:
      currentUser?.myOrders?.reduce(
        (total, order) =>
          total + Math.floor(order.priceDetails?.finalPrice / 10),
        0,
      ) || 0,
    savings: "$122",
  };

  // Common Css -----------------
  const commonCss = "bg-white rounded-2xl border p-5 shadow";

  return (
    <>
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

            <div className="border rounded-full border-orange-200">
              <img
                src={
                  currentUser?.imageUrl
                    ? currentUser.imageUrl
                    : defaultPP
                }
                alt="profile picture"
                className="w-16 h-16 rounded-full"
              />
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

              <NavLink
                to="/orders"
                className="flex items-center gap-1 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] transition-colors"
              >
                View all <ChevronRight size={13} />
              </NavLink>
            </div>

            {/* ORDER */}

            <div className="border rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Cheese Burger Combo</h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Ordered from Burger Hub
                  </p>
                </div>

                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                  preparing
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="font-medium">$249</p>
              </div>
            </div>

            {/* ORDER */}

            <div className="border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Pasta & Cold Coffee</h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Ordered from Food Plaza
                  </p>
                </div>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  Delivered
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="font-medium">$320</p>
              </div>
            </div>
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
                  <MapPin
                    size={10}
                    className="text-[#78716C]"
                    strokeWidth={2}
                  />
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
    </>
  );
}

export default CustomerDashboard;
