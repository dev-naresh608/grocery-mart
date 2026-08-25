import { MapPin, Star, Heart } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateUser } from "@/modules/auth/store/authSlice";
import { toggleWishlistApi } from "@/modules/profile/services/wishlist.api";

function StoreCard({ defaultRest, name, address, id }) {
  const dispatch = useDispatch();
  const { user: currentUser, isAuthenticated: isLogin } = useSelector(
    (state) => state.auth
  );
  const currentUserRole = currentUser?.role || "customer";

  const isStoreInWishlist = Boolean(
    currentUser?.myWishlist?.some((storeId) => storeId === id || storeId?._id === id)
  );

  const handleToggleWishlist = async () => {
    if (!isLogin) {
      return toast.error("Login to add stores to wishlist");
    }

    const currentWishlist = currentUser?.myWishlist || [];

    if (isStoreInWishlist) {
      // Optimistic remove
      const updated = currentWishlist.filter(
        (storeId) => storeId !== id && storeId?._id !== id
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
      toast.success(
        data.action === "added"
          ? "Store added to wishlist"
          : "Store removed from wishlist"
      );
    } catch (error) {
      // Revert on error
      dispatch(updateUser({ myWishlist: currentWishlist }));
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="relative flex gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 group">
      {/* Wishlist heart button */}
      {currentUserRole === "customer" && isLogin && (
        <button
          type="button"
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 bg-transparent border-none cursor-pointer outline-none"
          aria-label={isStoreInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={20}
            strokeWidth={1.5}
            stroke={isStoreInWishlist ? "#dd484f" : "#9ca3af"}
            fill={isStoreInWishlist ? "#dd484f" : "transparent"}
            className="transition-colors duration-200"
          />
        </button>
      )}

      <img
        src={defaultRest}
        alt="store image"
        className="w-28 h-28 rounded-xl object-cover"
      />

      <div className="flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-lg font-semibold">{name}</h2>

          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin size={16} strokeWidth={2.5} /> {address}
          </p>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Star fill="#166534" size={16} strokeWidth={1} /> 4.3
          </span>
        </div>

        <Link
          to={`/stores/allproducts/${id}`}
          className="font-semibold px-4 py-2 bg-black/10 rounded-full text-green-800 text-sm w-fit"
        >
          View Products
        </Link>
      </div>
    </div>
  );
}

export default StoreCard;
