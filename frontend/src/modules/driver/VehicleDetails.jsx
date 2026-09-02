import React from "react";
import { useSelector } from "react-redux";
import { Car, FileText, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

function VehicleDetails() {
  const { user: currentUser } = useSelector((state) => state.auth);

  return (
    <div className="bg-white/40 p-2.5 sm:p-6 lg:p-7 space-y-4 max-w-4xl mx-auto font-sans pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-6 shadow-xs flex items-center gap-3 sm:gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
          <Car size={24} />
        </div>
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Driver Vehicle
          </span>
          <h1 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
            Vehicle & Registration
          </h1>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-200/60">
            <p className="text-xs font-semibold text-gray-400">Vehicle Number</p>
            <p className="text-base sm:text-lg font-black text-gray-900 mt-0.5">
              {currentUser?.driver_vehicle_number || "KA01XY1234"}
            </p>
          </div>

          <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-200/60">
            <p className="text-xs font-semibold text-gray-400">Vehicle Type</p>
            <p className="text-base sm:text-lg font-black text-gray-900 mt-0.5">
              Two-Wheeler / Bike
            </p>
          </div>

          <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-200/60">
            <p className="text-xs font-semibold text-gray-400">Aadhaar (ID)</p>
            <p className="text-base sm:text-lg font-black text-gray-900 mt-0.5">
              XXXX XXXX {String(currentUser?.driver_aadhaar_number || "").slice(-4) || "3610"}
            </p>
          </div>

          <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-200/60">
            <p className="text-xs font-semibold text-gray-400">Verification Status</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span className="text-sm font-bold text-emerald-700">Verified & Approved</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
          <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
          <span>Your vehicle documents are on file and approved for instant dispatch.</span>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;
