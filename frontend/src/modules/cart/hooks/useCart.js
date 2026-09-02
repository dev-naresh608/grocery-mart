import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { setStoreId, setGuestCart, clearGuestCart } from "../store/cartSlice";
import { useModal, MODAL_TYPES } from "@/components";
import { toast } from "react-toastify";
import { calculateCartTotals } from "../utils/cartCalculation";
import { onCartPlaceOrder } from "../services/cart.service";
import { handleGetAddressApi } from "../../address/services/address.service.api";
import {
  updateCartQtyApi,
  removeFromCartApi,
  clearCartApi,
} from "../services/cart.api";

/**
 * Custom hook encapsulating cart business logic, reactive state, and item manipulation services.
 */
export const useCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openModal } = useModal();

  const { user: currentUser, isAuthenticated: isLogin } = useSelector(
    (state) => state.auth
  );
  const storeId = useSelector((state) => state.cart.storeId);
  const guestCart = useSelector((state) => state.cart.guestCart || []);

  const isCartDrawerOpen = useSelector((state) => state.cart.isCartDrawerOpen);
  const locationPath = typeof window !== "undefined" ? window.location.pathname : "";
  const isCartRoute = locationPath.includes("/cart");

  const [address, setAddress] = useState(currentUser?.myAddress || "");
  const [addressList, setAddressList] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const cartItems = isLogin ? (currentUser?.myCart || []) : guestCart;
  const isCartEmpty = !cartItems || cartItems.length === 0;

  // Retrieve delivery addresses only when needed (cart drawer open or on cart page)
  useEffect(() => {
    const cachedAddress = currentUser?.myAddress;
    if (cachedAddress && !address) {
      setAddress(cachedAddress);
    }

    const fetchAddress = async () => {
      if (!currentUser?._id || addressList) return;
      if (!isCartDrawerOpen && !isCartRoute) return;

      try {
        const data = await handleGetAddressApi(currentUser._id);
        if (data && data.success && data.addressList && data.addressList.length > 0) {
          setAddressList(data.addressList);
          setAddress(data.addressList[0]);
          dispatch(
            updateUser({
              myAddress: data.addressList[0],
            })
          );
        }
      } catch (err) {
        console.error("Failed to fetch address in useCart:", err);
      }
    };

    if (isLogin && (isCartDrawerOpen || isCartRoute)) {
      fetchAddress();
    }
  }, [
    isLogin,
    isCartDrawerOpen,
    isCartRoute,
    currentUser?._id,
    currentUser?.myAddress,
    address,
    addressList,
    dispatch,
  ]);

  // Compute subtotal, tax, delivery fee and final price reactively with useMemo
  const orderPriceDetails = useMemo(() => {
    return calculateCartTotals(cartItems);
  }, [cartItems]);

  // Update item quantity inside the cart
  const onCartItemQtyChange = useCallback(
    async (e) => {
      const itemId = e.target.id;
      const itemQty = Number(e.target.value);

      const updatedCart = cartItems.map((item) => {
        if (item._id === itemId) {
          return { ...item, product_qty: itemQty };
        }
        return item;
      });

      if (isLogin) {
        dispatch(updateUser({ myCart: updatedCart }));
        if (currentUser?._id) {
          try {
            await updateCartQtyApi(currentUser._id, itemId, itemQty);
          } catch (error) {
            console.error("Failed to update cart quantity in DB:", error);
          }
        }
      } else {
        dispatch(setGuestCart(updatedCart));
      }
    },
    [cartItems, isLogin, currentUser?._id, dispatch]
  );

  // Delete product from the cart
  const onCartItemDeleteBtn = useCallback(
    async (productId) => {
      const updatedCart = cartItems.filter((p) => p._id !== productId);

      if (isLogin) {
        dispatch(updateUser({ myCart: updatedCart }));
        if (updatedCart.length === 0) {
          dispatch(setStoreId(null));
        }
        if (currentUser?._id) {
          try {
            await removeFromCartApi(currentUser._id, productId);
            toast.success("Item removed from cart");
          } catch (error) {
            console.error("Failed to remove cart item from DB:", error);
          }
        }
      } else {
        dispatch(setGuestCart(updatedCart));
        if (updatedCart.length === 0) {
          dispatch(setStoreId(null));
        }
        toast.success("Item removed from cart");
      }
    },
    [cartItems, isLogin, currentUser?._id, dispatch]
  );

  // Clear entire cart
  const handleClearCart = useCallback(async () => {
    dispatch(setStoreId(null));

    if (isLogin) {
      dispatch(updateUser({ myCart: [] }));
      if (currentUser?._id) {
        try {
          await clearCartApi(currentUser._id);
          toast.success("Cart cleared successfully");
        } catch (error) {
          console.error("Failed to clear cart in DB:", error);
        }
      }
    } else {
      dispatch(clearGuestCart());
      toast.success("Cart cleared successfully");
    }
  }, [isLogin, currentUser?._id, dispatch]);

  // Change payment method
  const handlePaymentMethod = useCallback((e) => {
    setPaymentMethod(e.target.value);
  }, []);

  // Submit order placement request with double-click prevention & loader
  const handlePlaceOrder = useCallback(async () => {
    if (isPlacingOrder) return;

    if (!isLogin) {
      toast.info("Please log in to place your order");
      openModal(MODAL_TYPES.LOGIN);
      return;
    }

    setIsPlacingOrder(true);
    try {
      await onCartPlaceOrder(
        currentUser,
        (updatedUser) => dispatch(updateUser(updatedUser)),
        storeId,
        orderPriceDetails,
        address,
        paymentMethod,
        navigate,
        dispatch,
      );
    } finally {
      setIsPlacingOrder(false);
    }
  }, [
    isPlacingOrder,
    isLogin,
    openModal,
    currentUser,
    storeId,
    orderPriceDetails,
    address,
    paymentMethod,
    navigate,
    dispatch,
  ]);

  const effectiveUser = useMemo(() => {
    return isLogin
      ? currentUser
      : { role: "customer", myCart: guestCart };
  }, [isLogin, currentUser, guestCart]);

  return {
    currentUser: effectiveUser,
    setCurrentUser: (updater) => isLogin && dispatch(updateUser(updater)),
    isLogin,
    storeId,
    setStoreId: (id) => dispatch(setStoreId(id)),
    address,
    setAddress,
    addressList,
    paymentMethod,
    isAddressFormOpen,
    setIsAddressFormOpen,
    isCartEmpty,
    isPlacingOrder,
    orderPriceDetails,
    onCartItemQtyChange,
    onCartItemDeleteBtn,
    handleClearCart,
    handlePaymentMethod,
    handlePlaceOrder,
  };
};
