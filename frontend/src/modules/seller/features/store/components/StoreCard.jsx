import React, { useState, memo } from "react";
import { MapPin, Star, Bookmark, ArrowUpRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateUser } from "@/modules/auth/store/authSlice";
import { toggleWishlistApi } from "@/modules/wishlist";

function StoreCard({
  defaultRest,
  name,
  address,
  id,
  storeType,
  is_store_open = true,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const isLogin = useSelector((state) => state.auth.isAuthenticated);
  const currentUserRole = useSelector((state) => state.auth.user?.role || "customer");
  const currentUserId = useSelector((state) => state.auth.user?._id);
  const currentWishlist = useSelector((state) => state.auth.user?.myWishlist || []);

  const isStoreSaved = Boolean(
    currentWishlist.some(
      (storeId) =>
        (typeof storeId === "object" ? storeId._id || storeId.id : storeId) ===
        id,
    ),
  );

  const goToStore = () => {
    navigate(`/stores/menu/${id}`, {
      state: {
        is_store_open,
        store_name: name,
        store_address: address,
        store_type: storeType,
      },
    });
  };

  const handleCardKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToStore();
    }
  };

  const handleToggleSave = async (e) => {
    // Prevent the click from bubbling up and triggering card navigation
    e.stopPropagation();

    if (isSaving) return;

    if (!isLogin || !currentUserId) {
      return toast.error("Login to save stores");
    }

    setIsSaving(true);

    if (isStoreSaved) {
      // Optimistic remove
      const updated = currentWishlist.filter(
        (storeId) =>
          (typeof storeId === "object"
            ? storeId._id || storeId.id
            : storeId) !== id,
      );
      dispatch(updateUser({ myWishlist: updated }));
    } else {
      // Optimistic add
      dispatch(updateUser({ myWishlist: [...currentWishlist, id] }));
    }

    try {
      const data = await toggleWishlistApi(currentUserId, id);
      if (!data.success) {
        // Revert on failure
        dispatch(updateUser({ myWishlist: currentWishlist }));
        return toast.error(data.message);
      }
      if (data.myWishlist) {
        dispatch(updateUser({ myWishlist: data.myWishlist }));
      }
      toast.success(data.action === "added" ? "Store saved" : "Store removed");
    } catch (error) {
      // Revert on error
      dispatch(updateUser({ myWishlist: currentWishlist }));
      toast.error("Failed to update saved stores");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goToStore}
      onKeyDown={handleCardKeyDown}
      className="group flex items-center gap-3 sm:gap-4 bg-white p-3 sm:p-3.5 rounded-2xl border border-gray-100 shadow-xs hover:border-gray-200 hover:shadow-md transition-all duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 select-none cursor-pointer"
    >
      {/* Store Image */}
      <div className="relative shrink-0 w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
        <img
          src={defaultRest}
          alt={name}
          className="w-full h-full object-cover aspect-square rounded-xl"
        />
        {!is_store_open && (
          <span className="absolute bottom-1 left-1 right-1 bg-red-600 text-white text-[9px] font-black text-center py-0.5 rounded uppercase tracking-wider shadow-xs">
            Closed
          </span>
        )}
      </div>

      {/* Store Information */}
      <div className="flex flex-col justify-between flex-1 min-w-0 h-full py-0.5">
        <div>
          {/* Header Row: Name & Rating */}
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors truncate">
              {name}
            </h2>
            <span className="flex items-center gap-1 text-xs font-semibold text-gray-600 shrink-0">
              <Star size={13} fill="#166534" stroke="#166534" />
              4.3
            </span>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap mt-1">
            {storeType && (
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {storeType}
              </span>
            )}
            {!is_store_open && (
              <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200/70">
                Closed
              </span>
            )}
          </div>

          {/* Address */}
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1 truncate">
            <MapPin size={13} className="shrink-0 text-gray-400" />
            <span className="truncate">{address}</span>
          </p>
        </div>

        {/* Footer Action Row */}
        <div className="flex items-center justify-between mt-2 pt-1">
          {is_store_open ? (
            <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-600 group-hover:text-emerald-700 transition-colors">
              Browse Store
              <ArrowUpRight size={15} />
            </span>
          ) : (
            <span className="text-xs font-semibold text-red-600">
              Closed
            </span>
          )}

          {currentUserRole === "customer" && isLogin && (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleToggleSave}
              className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer outline-none bg-transparent border-none p-0 disabled:opacity-50"
              aria-label={isStoreSaved ? "Remove from saved" : "Save store"}
            >
              {isSaving ? (
                <Loader2 size={13} className="animate-spin text-emerald-600" />
              ) : (
                <Bookmark
                  size={15}
                  strokeWidth={1.5}
                  stroke={isStoreSaved ? "#15803d" : "#9ca3af"}
                  fill={isStoreSaved ? "#15803d" : "transparent"}
                />
              )}
              <span className={isStoreSaved ? "text-emerald-700 font-semibold" : ""}>
                {isStoreSaved ? "Saved" : "Save"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(StoreCard);
