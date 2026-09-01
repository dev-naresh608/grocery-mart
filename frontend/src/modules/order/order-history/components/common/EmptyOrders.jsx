import React from "react";
import { PackageOpen, ArrowRight, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

function EmptyOrders({
  currentUserRole = "customer",
  isSearchResult = false,
  searchValue = "",
  onClearSearch,
}) {
  const navigate = useNavigate();

  if (isSearchResult) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3 shadow-xs">
          <SearchX size={28} />
        </div>
        <h3 className="text-base font-bold text-gray-800">
          No matching orders found
        </h3>
        <p className="text-xs text-gray-500 mt-1 max-w-sm">
          No orders matched "{searchValue}". Try checking for spelling errors or clear the filter.
        </p>
        {onClearSearch && (
          <button
            type="button"
            onClick={onClearSearch}
            className="mt-4 px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
          >
            Clear Search Filter
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100/80 flex items-center justify-center mb-3 shadow-xs">
        <PackageOpen size={30} strokeWidth={2} />
      </div>

      <h3 className="text-base font-bold text-gray-800">
        {currentUserRole === "seller"
          ? "No Store Orders Yet"
          : currentUserRole === "driver"
          ? "No Deliveries Completed Yet"
          : "No Orders Placed Yet"}
      </h3>

      <p className="mt-1 text-xs text-gray-500 max-w-sm leading-relaxed">
        {currentUserRole === "seller"
          ? "You haven't received any orders yet. When customers purchase from your menu, orders will be recorded here."
          : currentUserRole === "driver"
          ? "You haven't completed any order deliveries yet."
          : "Looks like you haven't placed any orders yet. Start exploring fresh grocery items from local stores!"}
      </p>

      {currentUserRole === "customer" && (
        <button
          type="button"
          onClick={() => navigate("/stores")}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          Explore Stores
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}

export default EmptyOrders;
