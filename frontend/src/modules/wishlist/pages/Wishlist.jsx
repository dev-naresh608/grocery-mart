import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StoreCard } from "@/modules/seller";
import { defaultRest } from "@/assets";
import { getWishlistStoresApi } from "../services/wishlist.api";

function Wishlist() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [wishlistStores, setWishlistStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!currentUser?._id) {
        setLoading(false);
        return;
      }
      try {
        const data = await getWishlistStoresApi(currentUser._id);
        if (data.success) {
          setWishlistStores(data.stores || []);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist stores:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [currentUser?._id]);

  // Keep wishlistStores in sync with Redux currentUser.myWishlist
  useEffect(() => {
    if (currentUser?.myWishlist) {
      const savedIds = new Set(
        currentUser.myWishlist.map((item) =>
          typeof item === "object" ? item._id || item.id : item
        )
      );
      setWishlistStores((prevStores) =>
        prevStores.filter((store) => savedIds.has(store._id || store.id))
      );
    }
  }, [currentUser?.myWishlist]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (wishlistStores.length > 0) {
    return (
      <div
        className="space-y-5 h-full max-h-[90vh] overflow-y-auto 
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Favourite Stores
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-5">
          {wishlistStores.map((store) => (
            <StoreCard
              key={store._id}
              defaultRest={defaultRest}
              name={store.store_name}
              address={store.store_address}
              id={store._id}
              storeType={store.store_type || store.category || "General Store"}
              is_store_open={store.is_store_open !== false}
            />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-lg font-semibold text-gray-600">
          No Favourite Stores yet 🏪
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Start adding stores to your favourites to see them here
        </p>
      </div>
    );
  }
}

export default Wishlist;
