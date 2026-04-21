import React, { useContext, useEffect, useState } from "react";
import RatingStart from "../RatingStar/RatingStar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ProductContext,
  CartProductContext,
  UserContext,
  WishlistContext,
} from "../../contexts/context";
import ProductImageLoader from "./ProductImageLoader";

function ProductBuyCard({ price, id, src, name }) {
  const { isLogin } = useContext(UserContext);
  const { cartItems, setCartItems } = useContext(CartProductContext);
  const { productsList } = useContext(ProductContext);
  const {
    currentUserRole,
    currentUser,
    setCurrentUser,
    userData,
    setUserData,
  } = useContext(UserContext);
  const { wishlist, setWishlist } = useContext(WishlistContext);

  function onAddToCart(itemId) {
    if (!isLogin) {
      return toast.error("Login To Buy Items");
    }

    const productToAdd = productsList
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

  const onAddToWishlist = (itemId,name) => {
    if (!isLogin) {
      return toast.error("Login To Add Items in Wishlist");
    }
    const productToAdd = productsList
      .map((product) => product.products)
      .flat()
      .find((p) => p.name === name);

    if (!productToAdd) return;

    const oldUserData = JSON.parse(localStorage.getItem("localUserData")) || [];

    const dataExceptCurrentUser = oldUserData.filter(
      (user) => user.id !== currentUser.id,
    );

    let updateCurrentUser = [];
    let alreadyExist = false;

    if (currentUser.hasOwnProperty("myWishlist")) {
      alreadyExist = currentUser.myWishlist.some((p) => p.name === name);
      if (alreadyExist) {
        const productToRemove = productToAdd;
        const newWishlist = currentUser.myWishlist.filter(
          (p) => p.name !== name,
        );
        setWishlist(newWishlist);

        if (newWishlist.length > 0) {
          updateCurrentUser = {
            ...currentUser,
            myWishlist: newWishlist,
          };
        } else {
          delete currentUser.myWishlist;
          setCurrentUser(currentUser);
          updateCurrentUser = {
            ...currentUser,
          };
        }
        toast.success("removed successfully");
      } else {
        const newWishlist = [...currentUser.myWishlist, productToAdd];
        setWishlist(newWishlist);
        updateCurrentUser = {
          ...currentUser,
          myWishlist: newWishlist,
        };
        toast.success("added to wishlist");
      }
    } else {
      const newWishlist = [...wishlist, productToAdd];
      setWishlist(newWishlist);
      updateCurrentUser = {
        ...currentUser,
        myWishlist: newWishlist,
      };
      toast.success("added to wishlist");
    }

    setCurrentUser(updateCurrentUser);
    const newData = [...dataExceptCurrentUser, updateCurrentUser];
    localStorage.setItem("localUserData", JSON.stringify(newData));
    setUserData(newData);
  };

  const currentProduct = cartItems.find((p) => p.id === id);
  const currentQty = currentProduct?.qty || 0;

  let isItemInWishlist = false;

  if (currentUser.hasOwnProperty("myWishlist")) {
    isItemInWishlist = currentUser.myWishlist.some((p) => p.name === name);
  }

  return (
    <>
      <div className="relative border border-black rounded-2xl shadow-md px-2 py-3 group">
        {currentUserRole === "customer" && isLogin && (
          <div className={`${isItemInWishlist? "bg-[#f3d8d9]": ""} w-max h-max absolute rounded-full p-2 items-center justify-center 
          hidden group-hover:flex right-3 transition-all duration-300`}>
            <button onClick={() => onAddToWishlist(id,name)}>
              <svg
                xmlns="http://w3.org"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill={isItemInWishlist ? "#dd484f" : "transparent"}
                stroke="#c28a90"
                strokeWidth="20"
                style={{
                  paintOrder: "stroke",
                }}
              >
                <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex items-center justify-center">
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
              {/* <span className="text-xl text-blue-700">${price} </span>
              <del className="text-gray-500">{(price + Math.ceil((price/10)))}</del> */}
              <span className="text-xl text-blue-700">${price}</span><span className="text-gray-500 text-sm">/pre kg</span>
            </p>

            {currentUserRole === "customer" &&
              (currentQty > 0 ? (
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
                // <button
                //   className="flex items-center space-x-1 border border-blue-600 px-2 py-1 rounded-md bg-blue-200 text-blue-600"
                //   onClick={() => onAddToCart(id)}
                // >
                //   <span>Add</span>
                // </button>
                <button
                  className="flex items-center cursor-pointer justify-center gap-1  border border-green-600 text-sm px-1.5 py-1 text-green-700 bg-green-100 rounded"
                  onClick={() => onAddToCart(id)}
                >
                  <img
                    className="w-3.5"
                    alt="cart_icon"
                    src="data:image/svg+xml,%3csvg%20width='14'%20height='14'%20viewBox='0%200%2014%2014'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_3333_269)'%3e%3cpath%20d='M0.583008%200.583008H2.91634L4.47967%208.39384C4.53302%208.6624%204.67912%208.90365%204.89241%209.07535C5.1057%209.24705%205.37258%209.33825%205.64634%209.33301H11.3163C11.5901%209.33825%2011.857%209.24705%2012.0703%209.07535C12.2836%208.90365%2012.4297%208.6624%2012.483%208.39384L13.4163%203.49967H3.49967M5.83301%2012.2497C5.83301%2012.5718%205.57184%2012.833%205.24967%2012.833C4.92751%2012.833%204.66634%2012.5718%204.66634%2012.2497C4.66634%2011.9275%204.92751%2011.6663%205.24967%2011.6663C5.57184%2011.6663%205.83301%2011.9275%205.83301%2012.2497ZM12.2497%2012.2497C12.2497%2012.5718%2011.9885%2012.833%2011.6663%2012.833C11.3442%2012.833%2011.083%2012.5718%2011.083%2012.2497C11.083%2011.9275%2011.3442%2011.6663%2011.6663%2011.6663C11.9885%2011.6663%2012.2497%2011.9275%2012.2497%2012.2497Z'%20stroke='%234FBF8B'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_3333_269'%3e%3crect%20width='14'%20height='14'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
                  ></img>
                  Add
                </button>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductBuyCard;
