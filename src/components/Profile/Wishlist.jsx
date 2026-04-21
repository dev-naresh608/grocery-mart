import React, { useContext, useEffect } from "react";
import { CartProductContext, UserContext } from "../../contexts/context";
import { toast, ToastContainer } from "react-toastify";
import { ProductBuyCard } from "../index";

function Wishlist() {
  const { currentUser, setActiveTab } = useContext(UserContext);

  const { cartItems, setCartItems } = useContext(CartProductContext);
  useEffect(() => setActiveTab("wishlist"), []);

  if (!currentUser.hasOwnProperty("myWishlist")) {
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

  return (
    <div
      className="space-y-5 h-full max-h-[90vh] overflow-y-auto 
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  [&::-webkit-scrollbar-thumb]:rounded-full
  "
    >
       <div>
          <h2 className="text-xl font-semibold">Wishlist Products</h2>
          <p className="text-sm text-gray-500">You can add products to cart from here.</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
          <ToastContainer
            autoClose={500}
            closeOnClick
            draggable
            position="bottom-right"
          />
          {currentUser.myWishlist?.map((p, index) =>
             <ProductBuyCard
                name={p.name}
                src={p.src}
                price={p.price}
                id={p.id}
                key={index}
              />
          )}
        </div>
    </div>
  );
}

export default Wishlist;
