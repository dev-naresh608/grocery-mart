import { MapPin, Star, Bookmark, ArrowUpRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateUser } from "@/modules/auth/store/authSlice";
import { toggleWishlistApi } from "@/modules/profile/services/wishlist.api";

function StoreCard({ defaultRest, name, address, id, storeType }) {
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
    navigate(`/stores/allproducts/${id}`);
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
      className="flex gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
    >
      <img
        src={defaultRest}
        alt={name}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0"
      />

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

          {storeType && (
            <span className="inline-block mt-1 text-[11px] font-normal text-emerald-700/90 bg-emerald-50 px-2 py-0.5 rounded-md">
              {storeType}
            </span>
          )}

          <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1 mt-1.5 truncate">
            <MapPin size={14} className="shrink-0 text-gray-400" />
            {address}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-600">
            Browse Store
            <ArrowUpRight size={16} />
          </span>

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