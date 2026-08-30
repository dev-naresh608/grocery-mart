import React from "react";
import { User } from "lucide-react";
import { useDriverDashboard } from "../hooks/useDriverDashboard.js";

function DriverDashboard() {
  const { currentUser, handleDriveStatus } = useDriverDashboard();

  return (
    <>
      <div className="flex-1 bg-gray-100 p-5">
        {/* ===== TOP DRIVER INFO ===== */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              {currentUser?.imageUrl || currentUser?.profile_picture ? (
                <img
                  src={currentUser.imageUrl || currentUser.profile_picture}
                  alt="Driver profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 flex items-center justify-center">
                  <User size={40} strokeWidth={1.75} />
                </div>
              )}

              <div className="font-medium">
                <h1 className="text-2xl">{currentUser?.username || "Driver"}</h1>
                <p className="text-gray-500 mt-1">Delivery Driver</p>

                <div className="flex gap-3 mt-3">
                  {currentUser?.driver_status ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      Active
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                      Offline
                    </span>
                  )}

                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    4.8 Rating
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Status:</span>

                <label
                  onChange={() => handleDriveStatus()}
                  className="relative inline-flex items-center cursor-pointer"
                >
                  <input
                    checked={Boolean(currentUser?.driver_status)}
                    readOnly
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
            <h1 className="text-3xl font-bold">₹3,250</h1>
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
                    {String(currentUser?.driver_aadhaar_number || "").slice(8) || "3610"}
                  </span>
                </h4>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Vehicle Number</p>
                <h4 className="font-medium">
                  {currentUser?.driver_vehicle_number || "Not assigned"}
                </h4>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Phone Number</p>
                <h4 className="font-medium">+91 {currentUser?.phone || "-"}</h4>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <h4 className="font-medium">{currentUser?.email || "-"}</h4>
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
                  <p className="text-gray-500 text-sm mt-1">Pizza Burger Combo</p>
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
                  <p className="text-gray-500 text-sm mt-1">Pasta & Cold Coffee</p>
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
    </>
  );
}

export default DriverDashboard;
