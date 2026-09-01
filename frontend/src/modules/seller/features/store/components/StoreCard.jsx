import { MapPin, Star, Bookmark, ArrowUpRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateUser } from "@/modules/auth/store/authSlice";
import { toggleWishlistApi } from "@/modules/wishlist";

function StoreCard({ defaultRest, name, address, id, storeType, is_store_open = true }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated: isLogin } = useSelector(
    (state) => state.auth,
  );
  const currentUserRole = currentUser?.role || "customer";

  const isStoreSaved = Boolean(
    currentUser?.myWishlist?.some(
      (storeId) =>
        (typeof storeId === "object"
          ? storeId._id || storeId.id
          : storeId) === id,
    ),
  );

  const goToStore = () => {
    if (!is_store_open) {
      return toast.info(`"${name}" is currently closed and not accepting orders.`);
    }
    navigate(`/stores/menu/${id}`);
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

    if (!isLogin) {
      return toast.error("Login to save stores");
    }

    const currentWishlist = currentUser?.myWishlist || [];

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
      const data = await toggleWishlistApi(currentUser._id, id);
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
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goToStore}
      onKeyDown={handleCardKeyDown}
      className={`flex gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-2xl border transition-all duration-300 ease-out outline-none focus-visible:ring-2 focus-visible:ring-gray-300 ${
        is_store_open
          ? "border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          : "border-gray-200 bg-gray-50/50 opacity-75 cursor-not-allowed"
      }`}
    >
      <div className="relative shrink-0">
        <img
          src={defaultRest}
          alt={name}
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 ${
            !is_store_open ? "grayscale-[60%] opacity-80" : ""
          }`}
        />
        {!is_store_open && (
          <span className="absolute bottom-1 left-1 right-1 bg-red-600/90 backdrop-blur-xs text-white text-[9px] font-black text-center py-0.5 rounded uppercase tracking-wider shadow-xs">
            Closed
          </span>
        )}
      </div>

      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-sm sm:text-base font-medium text-gray-800 truncate">
              {name}
            </h2>
            <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 shrink-0">
              <Star size={14} fill="#166534" stroke="#166534" />
              4.3
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap mt-1">
            {storeType && (
              <span className="text-[11px] font-normal text-emerald-700/90 bg-emerald-50 px-2 py-0.5 rounded-md">
                {storeType}
              </span>
            )}
            {!is_store_open && (
              <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200/70">
                Closed
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1 mt-1.5 truncate">
            <MapPin size={14} className="shrink-0 text-gray-400" />
            {address}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          {is_store_open ? (
            <span className="flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-600 hover:text-emerald-700">
              Browse Store
              <ArrowUpRight size={16} />
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
              Closed Currently
            </span>
          )}

          {currentUserRole === "customer" && isLogin && (
            <button
              type="button"
              onClick={handleToggleSave}
              className="flex items-center gap-1 text-xs font-normal text-gray-400 hover:text-gray-700 transition-colors duration-200 cursor-pointer outline-none"
              aria-label={isStoreSaved ? "Remove from saved" : "Save store"}
            >
              <Bookmark
                size={16}
                strokeWidth={1.5}
                stroke={isStoreSaved ? "#374151" : "#9ca3af"}
                fill={isStoreSaved ? "#374151" : "transparent"}
                className="transition-colors duration-200"
              />
              {isStoreSaved ? "Saved" : "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default StoreCard;