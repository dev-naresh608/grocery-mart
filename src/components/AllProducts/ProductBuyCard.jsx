import React, { useContext, useEffect, useState } from "react";
import RatingStart from "../RatingStar/RatingStar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ProductContext,
  CartProductContext,
  UserContext,
} from "../../contexts/context";
import ProductImageLoader from "./ProductImageLoader";

function ProductBuyCard({ price, id, src, name }) {
  const { isLogin } = useContext(UserContext);
  const { cartItems, setCartItems } = useContext(CartProductContext);
  const { productsList } = useContext(ProductContext);

  function onAddToCart(itemId) {
    if (!isLogin) {
      return toast.error("Login To Buy Items");
    }

    let productToAdd = productsList
      .map((product) => product.products)
      .flat()
      .find((p) => p.id === itemId);

    if (!productToAdd) return;

    const alreadyExist = cartItems.some((p) => p.id === itemId);

    if (alreadyExist) {
      // here i check bcoz in future i remove counter from all products card section.
      toast.error("Already Exist");
      return;
    }

    const newProduct = {
      ...productToAdd,
      qty: 1,
    };

    setCartItems([...cartItems, newProduct]);
    toast.success("Added");
  }

  const onIncreaseQty = (itemId) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === itemId && item.qty < 10) {
        return { ...item, qty: item.qty + 1 };
      }
      return item;
    });

    setCartItems(updatedCart);
  };

  const onDecreaseQty = (itemId) => {
    const updatedCart = cartItems
      .map((item) => {
        if (item.id === itemId) {
          return { ...item, qty: item.qty - 1 };
        }
        return item;
      })
      .filter((item) => item.qty > 0);

    setCartItems(updatedCart);
  };

  const currentProduct = cartItems.find((p) => p.id === id);
  const currentQty = currentProduct?.qty || 0;

  return (
    <>
      <div className="border border-black rounded-2xl shadow-md px-2 py-3">
        <div className="flex items-center justify-center">
          <ToastContainer
            autoClose={500}
            closeOnClick
            draggable
            position="bottom-right"
          />
          {/* <img
          loading="lazy"
            src={src}
            alt={name}
            className="object-contain w-[120px] h-[120px]"
          /> */}
          {/* for better ux. */}
          <ProductImageLoader src={src} alt={name} />
        </div>

        <div className="px-2 mb-3">
          <p className="w-28 whitespace-nowrap">{name}</p>

          <RatingStart />

          <div className="flex items-center justify-between mt-2">
            <p className="w-28 font-semibold">
              <span className="text-xl text-blue-700">${price} </span>
              <del className="text-gray-500">{price + 10}</del>
            </p>

            {currentQty > 0 ? (
              <div className="flex items-center space-x-2 border border-green-600 px-2 py-1 rounded-md bg-green-100 text-green-700">
                <button
                  onClick={() => onDecreaseQty(id)}
                  className="px-2 font-bold"
                >
                  -
                </button>

                <span>{currentQty}</span>

                <button
                  onClick={() => onIncreaseQty(id)}
                  className="px-2 font-bold"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                className="flex items-center space-x-1 border border-blue-600 px-2 py-1 rounded-md bg-blue-200 text-blue-600"
                onClick={() => onAddToCart(id)}
              >
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductBuyCard;
