import React from "react";
import { useSelector } from "react-redux";
import { ProductBuyCard, GradientButton } from "../../../components";

function Wishlist() {
  const { user: currentUser } = useSelector((state) => state.auth);

  if (currentUser?.myWishlist?.length > 0) {
    return (
      <div
        className="space-y-5 h-full max-h-[90vh] overflow-y-auto 
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <div>
          <GradientButton
            className="cursor-text font-bold rounded-3xl"
          >
            Wishlist Products
          </GradientButton>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5">
          {currentUser.myWishlist.map((p, index) => (
            <ProductBuyCard
              name={p.product_name}
              src={p.product_url}
              price={p.product_selling_price}
              id={p._id}
              key={index}
              is_product_in_stock={p.is_product_in_stock}
            />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-lg font-semibold text-gray-600">
          No Wishlist Products yet 📦
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Start adding products in wishlist to see your products here
        </p>
      </div>
    );
  }
}

export default Wishlist;
