import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { defaultPP } from "@/assets";
import { NavLink } from "react-router-dom";
import { db } from "@/db";

function DriverDashboard() {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const handleDriveStatus = async () => {
    if (!currentUser) return;
    const newStatus = !currentUser.driver_status;
    dispatch(updateUser({ driver_status: newStatus }));
    if (currentUser.id) {
      try {
        const user = await db.localUserData.get(currentUser.id);
        if (user) {
          user.driver_status = newStatus;
          await db.localUserData.put(user);
        }
      } catch (err) {
        console.error("Failed updating driver_status in IndexedDB:", err);
      }
    }
  };

  return (
    <>
      <div className="flex-1 bg-gray-100 p-5">
        {/* ===== TOP DRIVER INFO ===== */}

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <img
                src={
                  currentUser?.imageUrl
                    ? currentUser.imageUrl
                    : defaultPP
                }
                alt=""
                className="w-20 h-20 rounded-full object-cover"
              />

              <div className="font-medium">
                <h1 className="text-2xl">{currentUser?.username || "Driver"}</h1>

                <p className="text-gray-500 mt-1">Delivery Driver</p>

                <div className="flex gap-3 mt-3">
                  {currentUser?.driver_status ? (
                    <>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        Active
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                        Offline
                      </span>
                    </>
                  )}

                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    4.8 Rating
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                  Status:
                </span>

                <label
                  onChange={() => handleDriveStatus()}
                  className="relative inline-flex items-center cursor-pointer"
                >
                  <input
                    defaultChecked={currentUser.driver_status}
                    type="checkbox"
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ===== DRIVER STATS ===== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div className="bg-white p-5 rounded-2xl shadow">
            <h3 className="text-gray-500 text-sm mb-2">Total Deliveries</h3>

            <h1 className="text-3xl font-bold">245</h1>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <h3 className="text-gray-500 text-sm mb-2">Today's Deliveries</h3>

            <h1 className="text-3xl font-bold">18</h1>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <h3 className="text-gray-500 text-sm mb-2">Earnings</h3>

            <h1 className="text-3xl font-bold">$3,250</h1>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <h3 className="text-gray-500 text-sm mb-2">Pending Orders</h3>

            <h1 className="text-3xl font-bold">5</h1>
          </div>
        </div>

        {/* ===== MAIN SECTION ===== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ===== DRIVER DETAILS ===== */}

          <div className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-xl font-semibold mb-5">Driver Details</h2>

            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm">Date of Birth</p>

                <h4 className="font-medium">12 March 2000</h4>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Aadhaar Number</p>

                <h4 className="font-medium">
                  XXXX XXXX{" "}
                  <span>
                    {currentUser.driver_aadhaar_number?.slice(8) || "3610"}
                  </span>
                </h4>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Vehicle Number</p>

                <h4 className="font-medium">
                  {currentUser.driver_vehicle_number}
                </h4>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Phone Number</p>

                <h4 className="font-medium">+91 {currentUser.phone}</h4>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Email</p>

                <h4 className="font-medium">{currentUser.email}</h4>
              </div>
            </div>
          </div>

          {/* ===== CURRENT DELIVERIES ===== */}

          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">Current Deliveries</h2>

              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">
                View All
              </button>
            </div>

            {/* ===== ORDER ===== */}

            <div className="border rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Order #1254</h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Pizza Burger Combo
                  </p>
                </div>

                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                  On The Way
                </span>
              </div>

              <div className="mt-4">
                <p className="text-gray-500 text-sm">Delivery Address</p>

                <h4 className="font-medium">Nikol, Ahmedabad</h4>
              </div>
            </div>

            {/* ===== ORDER ===== */}

            <div className="border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Order #1260</h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Pasta & Cold Coffee
                  </p>
                </div>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Picked Up
                </span>
              </div>

              <div className="mt-4">
                <p className="text-gray-500 text-sm">Delivery Address</p>

                <h4 className="font-medium">Chandkheda, Ahmedabad</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* // todo: Make Order requiest recieve container that open/close for every */}
      {/* one. */}

      {/* ===== NEW ORDER REQUEST MODAL ===== */}

      <div className="fixed hidden inset-0 bg-black/40 flex items-center justify-center p-3 z-50">
        {/* ===== MODAL ===== */}

        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-4 sm:p-5">
          {/* ===== TOP ===== */}

          <div className="flex items-start justify-between gap-4 border-b pb-3">
            {/* ===== LEFT ===== */}

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-green-600">
                🚚 New Order Request
              </h1>

              <p className="text-sm text-gray-500 mt-1">Accept before timeout</p>
            </div>

            {/* ===== RIGHT ===== */}

            <div className="text-right min-w-fit">
              <p className="text-red-500 font-bold text-lg">01:54</p>

              {/* ===== PROGRESS ===== */}

              <div className="w-20 bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden ml-auto">
                <div className="bg-red-500 h-1.5 w-[70%] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* ===== ORDER INFO ===== */}

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* ===== LEFT ===== */}

            <div>
              <h2 className="text-lg sm:text-xl font-bold">Order #1452</h2>

              <p className="text-sm text-gray-500 mt-1">Pizza • Burger • Coke</p>
            </div>

            {/* ===== RIGHT ===== */}

            <div className="sm:text-right">
              <h2 className="text-xl font-bold text-green-600">₹450</h2>

              <span className="inline-block mt-1 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                Paid Online
              </span>
            </div>
          </div>

          {/* ===== LOCATIONS ===== */}

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* ===== PICKUP ===== */}

            <div className="bg-orange-50 rounded-2xl p-3">
              <p className="text-xs text-gray-500">Pickup</p>

              <h3 className="font-semibold text-sm sm:text-base mt-1">
                Domino's Pizza, Nikol
              </h3>
            </div>

            {/* ===== DELIVERY ===== */}

            <div className="bg-blue-50 rounded-2xl p-3">
              <p className="text-xs text-gray-500">Deliver To</p>

              <h3 className="font-semibold text-sm sm:text-base mt-1">
                Chandkheda, Ahmedabad
              </h3>
            </div>
          </div>

          {/* ===== STATS ===== */}

          <div className="grid grid-cols-3 gap-3 mt-4">
            {/* ===== DISTANCE ===== */}

            <div className="bg-gray-100 rounded-2xl p-3 text-center">
              <p className="text-xs text-gray-500">Distance</p>

              <h3 className="font-bold mt-1 text-sm sm:text-base">4.5 KM</h3>
            </div>

            {/* ===== EARNING ===== */}

            <div className="bg-gray-100 rounded-2xl p-3 text-center">
              <p className="text-xs text-gray-500">Earnings</p>

              <h3 className="font-bold text-green-600 mt-1 text-sm sm:text-base">
                ₹85
              </h3>
            </div>

            {/* ===== ETA ===== */}

            <div className="bg-gray-100 rounded-2xl p-3 text-center">
              <p className="text-xs text-gray-500">ETA</p>

              <h3 className="font-bold mt-1 text-sm sm:text-base">18 Min</h3>
            </div>
          </div>

          {/* ===== NOTE ===== */}

          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-3">
            <p className="text-xs font-medium text-yellow-700">Customer Note</p>

            <p className="text-sm text-gray-700 mt-1">
              Please call before arriving.
            </p>
          </div>

          {/* ===== BUTTONS ===== */}

          <div className="flex gap-3 mt-5">
            {/* ===== REJECT ===== */}

            <button className="flex-1 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold py-3 rounded-2xl transition-all duration-300">
              Reject
            </button>

            {/* ===== ACCEPT ===== */}

            <button className="flex-1 bg-green-500 hover:bg-green-600 active:scale-95 text-white font-semibold py-3 rounded-2xl transition-all duration-300">
              Accept
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DriverDashboard;
