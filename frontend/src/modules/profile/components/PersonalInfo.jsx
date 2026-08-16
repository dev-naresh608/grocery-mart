import React from "react";
import { usePersonalInfo } from "../hooks";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";

// ─── Info card ────────────────────────────────────────────────────────────────
const InfoCard = ({ icon: CardIcon, label, value, accent = "#6366F1" }) => (
  <div className="bg-white rounded-2xl border border-[#E7E5E4] p-4 flex items-center gap-3 hover:shadow-md transition-shadow duration-200">
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: accent + "18" }}
    >
      {CardIcon && <CardIcon size={16} style={{ color: accent }} strokeWidth={2} />}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-[#A8A29E] font-medium">{label}</p>
      <p className="text-sm font-semibold text-[#1C1917] truncate">
        {value || "—"}
      </p>
    </div>
  </div>
);

function PersonalInfo() {
  const {
    currentUser,
    lastUsedAddress,
    loading,
    totalOrders,
    setActiveTab,
    navigate,
  } = usePersonalInfo();

  return (
    <div className=" p-2 space-y-6 font-sans">
      {/* ── Header ── */}
      <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5">
        <h2 className="text-lg font-semibold text-[#1C1917]">
          Personal Information
        </h2>
        <p className="text-xs text-[#A8A29E] mt-0.5">
          Manage your personal details
        </p>
      </div>

      {/* ── Info grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <InfoCard
          icon={User}
          label="Username"
          value={currentUser.username}
          accent="#6366F1"
        />
        <InfoCard
          icon={Mail}
          label="Email"
          value={currentUser.email}
          accent="#10B981"
        />
        {currentUser.phone && (
          <InfoCard
            icon={Phone}
            label="Phone"
            value={`+91 ${currentUser.phone}`}
            accent="#F59E0B"
          />
        )}
      </div>

      {/* ── Orders summary ── */}
      {currentUser.role === "customer" && (
        <div className="bg-[#FAFAF9] border border-[#E7E5E4] rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <ShoppingBag
                size={16}
                className="text-amber-500"
                strokeWidth={2}
              />
            </div>
            <div>
              <p className="text-xs text-[#A8A29E]">Total Orders</p>
              <p className="text-xl font-semibold text-[#1C1917]">
                {totalOrders}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab("orders");
              navigate("/orders");
            }}
            className="flex items-center gap-1 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            View Orders <ChevronRight size={13} />
          </button>
        </div>
      )}

      {/* ── Address section ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#1C1917]">
            Last Used Address
          </h3>
          <button
            onClick={() => {
              setActiveTab("setting");
              navigate("/profile/setting");
            }}
            className="text-xs font-semibold text-[#EF4444] hover:text-[#B91C1C] transition-colors bg-transparent border-none p-0 cursor-pointer outline-none"
          >
            Manage Addresses
          </button>
        </div>

        {loading ? (
          <div className="text-center py-6 text-sm text-gray-500 font-sans">
            Loading...
          </div>
        ) : lastUsedAddress ? (
          <div className="bg-[#FAFAF9] border border-[#E7E5E4] rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F5F5F4] flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin size={15} className="text-[#78716C]" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                {lastUsedAddress.name && (
                  <p className="text-sm font-semibold text-[#1C1917]">
                    {lastUsedAddress.name}
                  </p>
                )}
                {lastUsedAddress.phone && (
                  <p className="text-xs text-[#78716C] mt-0.5">
                    +91 {lastUsedAddress.phone}
                  </p>
                )}
                <p className="text-sm text-[#78716C] mt-1 leading-snug font-sans">
                  {`${lastUsedAddress.street}, ${lastUsedAddress.city}, ${lastUsedAddress.state} – ${lastUsedAddress.pincode}`}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#FAFAF9] border border-dashed border-[#E7E5E4] rounded-2xl p-6 text-center">
            <div className="w-10 h-10 rounded-xl bg-[#F5F5F4] flex items-center justify-center mx-auto mb-3">
              <MapPin size={18} className="text-[#A8A29E]" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-[#78716C] font-medium font-sans">
              No address saved yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonalInfo;
