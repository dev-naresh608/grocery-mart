import React from "react";
import { IndianRupee, TrendingUp, Calendar, CheckCircle2, ArrowUpRight } from "lucide-react";

function Earnings() {
  const earningBreakdown = [
    { title: "Today's Earnings", amount: "₹650", trips: "4 trips completed" },
    { title: "This Week", amount: "₹2,100", trips: "14 trips completed" },
    { title: "This Month", amount: "₹3,250", trips: "22 trips completed" },
    { title: "Total Lifetime", amount: "₹34,800", trips: "245 trips completed" },
  ];

  return (
    <div className="bg-white/40 p-2.5 sm:p-6 lg:p-7 space-y-4 max-w-4xl mx-auto font-sans pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-6 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <IndianRupee size={24} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Payouts & Revenue
            </span>
            <h1 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
              Driver Earnings
            </h1>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
          <TrendingUp size={13} /> Direct Payout Active
        </span>
      </div>

      {/* Grid of Earnings */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {earningBreakdown.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-gray-200/90 p-3.5 sm:p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-gray-500">{item.title}</p>
              <h2 className="text-xl sm:text-3xl font-black text-gray-900 mt-1">
                {item.amount}
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-2 font-medium">
              {item.trips}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Earnings;
