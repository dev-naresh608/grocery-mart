import React, { useContext, useEffect, useState } from "react";
import RatingStart from "../RatingStar/RatingStar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ProductContext,
  CartProductContext,
  UserContext,
  CartProductContextProvider,
} from "../../contexts/context";

function ProductBuyCard({ price, id, src, name }) {
  const { currentUser, isLogin } = useContext(UserContext);
  const { cartItems, setCartItems } = useContext(CartProductContext);
  const { productsList } = useContext(ProductContext);
  const { cartLength,setCartLength } = useContext(CartProductContext);

  function onAddToCart(itemId) {
    if (!isLogin) {
      return alert("Login To Buy Items");
    }
    let productToAdd = productsList
      .map((product) => product.products)
      .flat()
      .find((p) => p.id === itemId);

    productToAdd = {
      ...productToAdd,
      qty: 1,
    };
    if (!productToAdd) return;

    const isProductAlreadyExistInCart = () => {
      return cartItems.some((p) => p.id === itemId);
    };

    if (isProductAlreadyExistInCart()) {
      toast.error("Already Exist");
    } else {
      toast.success("Added");
      setCartItems([...cartItems, productToAdd]);
    }
  }
  useEffect(() => {
    setCartLength(cartItems.length)
  }, [cartItems]);

  return (
    <>
      <div>
        <div className="border border-black rounded-2xl shadow-md px-2 py-3">
          <div className="flex items-center justify-center">
            <ToastContainer
              autoClose={1000}
              position="bottom-right"
              pauseOnHover={false}
            />
            <img
              src={src}
              className="object-contain w-[120px] h-[120px]"
              alt={name}
            />
          </div>
          <div className="px-2 mb-3">
            <div>
              <p className="w-28 whitespace-nowrap">{name}</p>
            </div>
            <RatingStart />
            <div className="flex items-center justify-between">
              <div>
                <p className="w-28 font-semibold">
                  <span className="text-xl text-blue-700">${price} </span>
                  <del className="text-gray-500">{price + 10}</del>
                </p>
              </div>
              <button
                className="flex items-center space-x-1 border border-blue-600 px-2 rounded-md bg-blue-200 text-blue-600"
                onClick={() => onAddToCart(id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  data-fg-d5jy27="1.12:1.4176:/src/app/components/Header.tsx:51:15:2195:36:e:ShoppingCart::::::BPYc"
                >
                  <circle cx="8" cy="21" r="1"></circle>
                  <circle cx="19" cy="21" r="1"></circle>
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                </svg>
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductBuyCard;
