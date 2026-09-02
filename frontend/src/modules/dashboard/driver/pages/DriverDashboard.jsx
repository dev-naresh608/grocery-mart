import React from "react";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Car,
  FileText,
  Truck,
  IndianRupee,
  CheckCircle,
  Clock,
  ArrowRight,
  Star,
} from "lucide-react";
import { useDriverDashboard } from "../hooks/useDriverDashboard.js";
import { NavLink } from "react-router-dom";

function DriverDashboard() {
  const { currentUser, handleDriveStatus } = useDriverDashboard();

  const driverStats = [
    {
      title: "Total Deliveries",
      value: "245",
      info: "All time",
      icon: Truck,
      bg: "#eef2ff",
      color: "#4338ca",
    },
    {
      title: "Today's Deliveries",
      value: "18",
      info: "Today",
      icon: CheckCircle,
      bg: "#ecfdf5",
      color: "#16a34a",
    },
    {
      title: "Total Earnings",
      value: "₹3,250",
      info: "This month",
      icon: IndianRupee,
      bg: "#f0fdf4",
      color: "#15803d",
    },
    {
      title: "Pending Orders",
      value: "5",
      info: "Need pickup",
      icon: Clock,
      bg: "#fef2f2",
      color: "#dc2626",
    },
  ];

  const commonCardCss =
    "bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-xs";

  return (
    <div className="bg-white/40 p-2.5 sm:p-6 lg:p-7 space-y-3.5 sm:space-y-5 max-w-7xl mx-auto font-sans pb-24 md:pb-8">
      {/* ===== TOP DRIVER INFO BANNER ===== */}
      <div className={commonCardCss}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 sm:gap-4">
          {/* Driver Profile Info */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-orange-200/80 overflow-hidden aspect-square flex items-center justify-center shrink-0 shadow-2xs">
              {currentUser?.imageUrl || currentUser?.profile_picture ? (
                <img
                  src={currentUser.imageUrl || currentUser.profile_picture}
                  alt="Driver profile"
                  className="w-full h-full object-cover rounded-full aspect-square"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 flex items-center justify-center">
                  <User size={26} className="sm:size-8" strokeWidth={1.75} />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                  Driver Dashboard
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                  <Star size={10} className="fill-amber-500 text-amber-500" /> 4.8 Rating
                </span>
              </div>

              <h1 className="text-base sm:text-2xl font-black text-gray-900 tracking-tight mt-0.5 truncate">
                {currentUser?.username || "Delivery Driver"}
              </h1>

              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    currentUser?.driver_status
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      currentUser?.driver_status
                        ? "bg-emerald-600 animate-pulse"
                        : "bg-red-500"
                    }`}
                  />
                  {currentUser?.driver_status ? "Active & Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          {/* Status Switch Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-3 bg-gray-50/90 border border-gray-200/80 p-2.5 sm:px-4 sm:py-2.5 rounded-2xl shrink-0 self-stretch sm:self-auto">
            <div className="flex flex-col items-start sm:items-end">
              <span className="text-xs font-black text-gray-800 tracking-tight">
                {currentUser?.driver_status ? "Receiving Orders" : "Duty Paused"}
              </span>
              <span className="text-[10px] font-medium text-gray-400">
                {currentUser?.driver_status
                  ? "Available for delivery"
                  : "Go online to get trips"}
              </span>
            </div>

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
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 cursor-pointer"></div>
            </label>
          </div>
        </div>
      </div>

      {/* ===== 2x2 STATS CARDS GRID ON MOBILE, 4 COLS ON DESKTOP ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {driverStats.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-200/90 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className="flex items-center justify-center h-9 w-9 sm:h-12 sm:w-12 rounded-xl shrink-0 aspect-square shadow-2xs"
                  style={{
                    backgroundColor: card.bg,
                    color: card.color,
                  }}
                >
                  <Icon size={18} className="sm:size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] sm:text-xs font-semibold text-gray-500 leading-tight truncate">
                    {card.title}
                  </p>
                  <h2 className="text-base sm:text-2xl font-black text-gray-900 mt-0.5 tracking-tight truncate">
                    {card.value}
                  </h2>
                </div>
              </div>

              {card.info && (
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2 truncate">
                  {card.info}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* ===== MAIN SECTION GRID ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-5">
        {/* ===== DRIVER DETAILS ===== */}
        <div className={commonCardCss}>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center justify-between">
            <span>Driver Details</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200/60">
              Verified
            </span>
          </h2>

          <div className="space-y-3 mt-3.5">
            {/* DOB */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Calendar size={14} className="text-gray-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium">Date of Birth</p>
                <p className="text-xs sm:text-sm font-bold text-gray-900">
                  {currentUser?.driver_dob || "12 March 2000"}
                </p>
              </div>
            </div>

            {/* Aadhaar */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <FileText size={14} className="text-gray-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium">Aadhaar Number</p>
                <p className="text-xs sm:text-sm font-bold text-gray-900">
                  XXXX XXXX{" "}
                  <span>
                    {String(currentUser?.driver_aadhaar_number || "").slice(-4) || "3610"}
                  </span>
                </p>
              </div>
            </div>

            {/* Vehicle */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Car size={14} className="text-gray-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium">Vehicle Number</p>
                <p className="text-xs sm:text-sm font-bold text-gray-900">
                  {currentUser?.driver_vehicle_number || "KA01XY1234"}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Phone size={14} className="text-gray-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium">Phone</p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                  +91 {currentUser?.phone || "Not provided"}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Mail size={14} className="text-gray-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium">Email</p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                  {currentUser?.email || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== CURRENT DELIVERIES ===== */}
        <div className={`lg:col-span-2 ${commonCardCss}`}>
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-gray-100">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Current Deliveries</h2>
            <NavLink
              to="/active-orders"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              View Active Trips <ArrowRight size={13} />
            </NavLink>
          </div>

          {/* Sample Active Deliveries */}
          <div className="space-y-3">
            <div className="border border-gray-200/80 rounded-xl p-3 sm:p-4 bg-white hover:border-gray-300 transition-all shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-gray-900">Order #1254</h3>
                  <p className="text-gray-500 text-xs mt-0.5">Fresh Grocery & Fruits Basket</p>
                </div>
                <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                  On The Way
                </span>
              </div>

              <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium">Delivery: Indiranagar 100ft Rd</span>
                <span className="font-bold text-gray-800">₹240</span>
              </div>
            </div>

            <div className="border border-gray-200/80 rounded-xl p-3 sm:p-4 bg-white hover:border-gray-300 transition-all shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-gray-900">Order #1260</h3>
                  <p className="text-gray-500 text-xs mt-0.5">Organic Vegetables Pack</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                  Picked Up
                </span>
              </div>

              <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium">Delivery: Koramangala 4th Block</span>
                <span className="font-bold text-gray-800">₹180</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard;
