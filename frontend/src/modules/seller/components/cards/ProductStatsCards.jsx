import React from "react";
import {
  Package,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

function ProductStatsCards({ stats, activeFilter, onFilterChange }) {
  const cards = [
    {
      id: "all",
      title: "Total Products",
      value: stats.total || 0,
      subtext: "Total in catalog",
      icon: Package,
      bgGradient: "from-indigo-50/70 to-indigo-100/30",
      borderColor: "border-indigo-100",
      activeBorder: "border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/90",
      iconBg: "bg-indigo-600 text-white",
    },
    {
      id: "in_menu",
      title: "Listed in Menu",
      value: stats.inMenu || 0,
      badge: `${stats.inMenuPercent || 0}%`,
      subtext: "Visible in store",
      icon: Eye,
      bgGradient: "from-emerald-50/70 to-emerald-100/30",
      borderColor: "border-emerald-100",
      activeBorder: "border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/90",
      iconBg: "bg-emerald-600 text-white",
    },
    {
      id: "hidden",
      title: "Hidden",
      value: stats.hidden || 0,
      subtext: "Unlisted from store",
      icon: EyeOff,
      bgGradient: "from-slate-50/70 to-slate-100/30",
      borderColor: "border-slate-100",
      activeBorder: "border-slate-600 ring-2 ring-slate-500/20 bg-slate-50/90",
      iconBg: "bg-slate-700 text-white",
    },
    {
      id: "in_stock",
      title: "In Stock",
      value: stats.inStock || 0,
      subtext: "Ready to order",
      icon: CheckCircle2,
      bgGradient: "from-blue-50/70 to-blue-100/30",
      borderColor: "border-blue-100",
      activeBorder: "border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/90",
      iconBg: "bg-blue-600 text-white",
    },
    {
      id: "out_of_stock",
      title: "Out of Stock",
      value: stats.outOfStock || 0,
      subtext: "Needs restock",
      icon: AlertTriangle,
      bgGradient: "from-amber-50/70 to-amber-100/30",
      borderColor: "border-amber-100",
      activeBorder: "border-amber-600 ring-2 ring-amber-500/20 bg-amber-50/90",
      iconBg: "bg-amber-500 text-white",
    },
    {
      id: "offers_only",
      title: "Offers",
      value: stats.hasOffers || 0,
      subtext: "Active deals",
      icon: Sparkles,
      bgGradient: "from-rose-50/70 to-rose-100/30",
      borderColor: "border-rose-100",
      activeBorder: "border-rose-600 ring-2 ring-rose-500/20 bg-rose-50/90",
      iconBg: "bg-rose-500 text-white",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
      {cards.map((c) => {
        const Icon = c.icon;
        const isActive = activeFilter === c.id;

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onFilterChange(c.id)}
            className={`flex flex-col justify-between text-left p-2.5 sm:p-3 rounded-xl border transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs hover:-translate-y-0.5 ${
              isActive
                ? c.activeBorder
                : `bg-white hover:bg-gradient-to-b ${c.bgGradient} ${c.borderColor}`
            }`}
          >
            {/* Header: Title & Icon in 1 line */}
            <div className="flex items-center justify-between gap-1 w-full">
              <span className="text-[11px] font-semibold text-gray-500 whitespace-nowrap truncate">
                {c.title}
              </span>
              <div
                className={`w-5 h-5 rounded-lg flex items-center justify-center shadow-2xs shrink-0 ${c.iconBg}`}
              >
                <Icon size={11} strokeWidth={2.5} />
              </div>
            </div>

            {/* Value & Badge */}
            <div className="flex items-baseline justify-between gap-1 my-0.5">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
                {c.value}
              </span>
              {c.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200/80 whitespace-nowrap">
                  {c.badge}
                </span>
              )}
            </div>

            {/* Subtext */}
            <div>
              <p className="text-[10px] text-gray-400 font-medium whitespace-nowrap truncate">
                {c.subtext}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ProductStatsCards;
