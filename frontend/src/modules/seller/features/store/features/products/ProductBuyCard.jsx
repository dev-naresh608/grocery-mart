import React, { useState, useMemo, useCallback, memo } from "react";
import { RatingStar, ProductImageLoader } from "@/components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { setStoreId, setGuestCart } from "@/modules/cart/store/cartSlice";
import { useModal, MODAL_TYPES } from "@/components";

import { useParams } from "react-router-dom";
import { ShoppingCartIcon, Loader2 } from "lucide-react";
import api from "@/configs/api";
import { addToCartApi, updateCartQtyApi, removeFromCartApi } from "@/modules/cart/services/cart.api";

function ProductBuyCard({
  name,
  src,
  price,
  id,
  is_product_in_stock,
  is_offer_available,
  offer_price,
  is_store_open = true,
}) {
  const dispatch = useDispatch();
  const { restId } = useParams();
  const { openModal } = useModal();
  const [isAdding, setIsAdding] = useState(false);

  const { user: currentUser, isAuthenticated: isLogin } = useSelector(
    (state) => state.auth
  );
  const storeId = useSelector((state) => state.cart.storeId);
  const guestCart = useSelector((state) => state.cart.guestCart || []);
  const currentUserRole = currentUser?.role || "customer";

  const cartItems = isLogin ? (currentUser?.myCart || []) : guestCart;

  // Helper to commit new cart state (logged in vs guest)
  const commitCartUpdate = useCallback(
    async (updatedCart, newStoreId) => {
      if (isLogin) {
        dispatch(updateUser({ myCart: updatedCart }));
        if (newStoreId !== undefined) {
          dispatch(setStoreId(newStoreId));
        }
      } else {
        dispatch(setGuestCart(updatedCart));
        if (newStoreId !== undefined) {
          dispatch(setStoreId(newStoreId));
        }
      }
    },
    [isLogin, dispatch]
  );

  // ============== ADD TO CART ====================
  const onAddToCart = useCallback(
    async (itemId) => {
      if (isAdding) return;

      if (is_store_open === false) {
        return toast.error("This store is currently closed and not accepting orders");
      }

      if (is_product_in_stock === false) {
        return toast.error("Product is currently out of stock");
      }

      setIsAdding(true);
      try {
        const { data } = await api.get(`/cart/${itemId}`);
        if (!data.success) {
          return toast.error(data.message);
        }

        const productToAdd = data.product;
        const newProduct = {
          ...productToAdd,
          product_qty: 1,
          store_id: restId,
        };

        // Store isolation check
        if (cartItems && cartItems.length > 0 && storeId && storeId !== restId) {
          openModal(MODAL_TYPES.CONFIRM, {
            title: "Replace cart items?",
            message:
              "Your cart contains items from another store. Do you want to clear your cart and add this item from the new store?",
            confirmText: "Clear & Add",
            cancelText: "Cancel",
            type: "warning",
            onConfirm: async () => {
              await commitCartUpdate([newProduct], restId);
              if (isLogin && currentUser?._id) {
                try {
                  await addToCartApi(currentUser._id, itemId, restId, 1);
                } catch (err) {
                  console.error("Failed to sync store switch to DB:", err);
                }
              }
              toast.success("Cart replaced with item from new store");
            },
          });
          return;
        }

        const isProductAlreadyExist = cartItems.some((p) => p._id === itemId);
        if (isProductAlreadyExist) {
          toast.info("Product is already in your cart");
          return;
        }

        const updatedCart = [...cartItems, newProduct];
        await commitCartUpdate(updatedCart, restId);

        if (isLogin && currentUser?._id) {
          try {
            await addToCartApi(currentUser._id, itemId, restId, 1);
          } catch (error) {
            console.error("Failed to sync add to cart with DB:", error);
          }
        }

        toast.success("Added to cart");
      } catch (error) {
        toast.error("Failed to add product to cart");
      } finally {
        setIsAdding(false);
      }
    },
    [
      isAdding,
      is_store_open,
      is_product_in_stock,
      restId,
      cartItems,
      storeId,
      openModal,
      commitCartUpdate,
      isLogin,
      currentUser?._id,
    ]
  );

  // ============== INCREASE QUANTITY ====================
  const onIncreaseQty = useCallback(
    async (itemId) => {
      const itemToUpdate = cartItems.find((item) => item._id === itemId);
      if (!itemToUpdate) return;
      const newQty = itemToUpdate.product_qty + 1;
      if (newQty > 10) {
        return toast.warning("Maximum limit is 10 items per product");
      }

      const updatedCart = cartItems.map((item) => {
        if (item._id === itemId) {
          return { ...item, product_qty: newQty };
        }
        return item;
      });

      await commitCartUpdate(updatedCart);

      if (isLogin && currentUser?._id) {
        try {
          await updateCartQtyApi(currentUser._id, itemId, newQty);
        } catch (error) {
          console.error("Failed to update quantity in DB:", error);
        }
      }
    },
    [cartItems, commitCartUpdate, isLogin, currentUser?._id]
  );

  // ============== DECREASE QUANTITY ====================
  const onDecreaseQty = useCallback(
    async (itemId) => {
      const itemToUpdate = cartItems.find((item) => item._id === itemId);
      if (!itemToUpdate) return;
      const newQty = itemToUpdate.product_qty - 1;

      let updatedCart;
      if (newQty > 0) {
        updatedCart = cartItems.map((item) => {
          if (item._id === itemId) {
            return { ...item, product_qty: newQty };
          }
          return item;
        });
        await commitCartUpdate(updatedCart);

        if (isLogin && currentUser?._id) {
          try {
            await updateCartQtyApi(currentUser._id, itemId, newQty);
          } catch (error) {
            console.error("Failed to update quantity in DB:", error);
          }
        }
      } else {
        updatedCart = cartItems.filter((item) => item._id !== itemId);
        const newStoreId = updatedCart.length === 0 ? null : storeId;
        await commitCartUpdate(updatedCart, newStoreId);

        if (isLogin && currentUser?._id) {
          try {
            await removeFromCartApi(currentUser._id, itemId);
            toast.success("Item removed from cart");
          } catch (error) {
            console.error("Failed to remove item from DB:", error);
          }
        } else {
          toast.success("Item removed from cart");
        }
      }
    },
    [cartItems, commitCartUpdate, storeId, isLogin, currentUser?._id]
  );

  // to see currentQty with useMemo
  const currentProduct = useMemo(() => {
    return cartItems.find((p) => p._id === id);
  }, [cartItems, id]);

  const currentQty = currentProduct?.product_qty || 0;

  // Offer calculation with useMemo
  const offerPercent = useMemo(() => {
    return price && offer_price ? Math.round(((price - offer_price) / price) * 100) : 0;
  }, [price, offer_price]);

  const offerBackgroundColor = useMemo(() => {
    return offerPercent >= 50 ? "bg-red-600" : offerPercent >= 30 ? "bg-blue-600" : "bg-red-600";
  }, [offerPercent]);

  return (
    <>
      <div className="relative bg-white border rounded-2xl shadow-md p-2 group overflow-hidden">
        <div className="flex bg-gray-200 rounded-2xl items-center justify-center">
          <ProductImageLoader src={src} alt={name}/>
        </div>

        <div className="px-2 my-2 space-y-1">
          <p className="font-bold text-xs sm:text-sm text-gray-900 truncate capitalize" title={name}>
            {name}
          </p>

          <RatingStar />

          <div className="flex items-center justify-between gap-2 mt-1">
            <div className="min-w-0 flex-1 font-semibold">
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-bold text-emerald-700">₹{price}</span>
                <span className="text-gray-400 text-[10px]">/per unit</span>
              </div>
            </div>

            {currentUserRole === "customer" &&
              (currentQty > 0 ? (
                <div className="flex items-center justify-around px-1.5 border border-green-600 rounded bg-green-100 text-green-700 h-7 w-16 [&>button]:active:scale-95">
                  <button
                    onClick={() => onDecreaseQty(id)}
                    className="font-bold"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="18px"
                      viewBox="0 -960 960 960"
                      width="18px"
                      fill="#15803D"
                    >
                      <path d="M200-440v-80h560v80H200Z" />
                    </svg>
                  </button>
                  <p>{currentQty}</p>

                  <button
                    onClick={() => onIncreaseQty(id)}
                    className="font-bold"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="18px"
                      viewBox="0 -960 960 960"
                      width="18px"
                      fill="#15803D"
                    >
                      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                    </svg>
                  </button>
                </div>
              ) : !is_store_open ? (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center transition-all duration-300 rounded-2xl z-10">
                  <span className="bg-amber-100 text-amber-800 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-xs border border-amber-200">
                    Store Closed
                  </span>
                </div>
              ) : is_product_in_stock ? (
                <button
                  type="button"
                  disabled={isAdding}
                  className={`flex items-center justify-center gap-1 border border-green-600 h-7 w-16 text-sm px-1.5 py-1 rounded transition-colors ${
                    isAdding
                      ? "bg-green-200 text-green-800 cursor-not-allowed opacity-80"
                      : "text-green-700 bg-green-100 hover:bg-green-200 cursor-pointer"
                  }`}
                  onClick={() => onAddToCart(id)}
                >
                  {isAdding ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <>
                      <ShoppingCartIcon size={16} />
                      <span className="text-xs font-semibold">Add</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center transition-all duration-300 rounded-2xl z-10">
                  <span className="bg-red-200 text-red-500 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md shadow-md transform scale-100 group-hover:scale-105 transition-transform">
                    Sold Out
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(ProductBuyCard);
