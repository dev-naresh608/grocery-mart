import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { setStoreId } from "../store/cartSlice";
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
  const { user: currentUser, isAuthenticated: isLogin } = useSelector(
    (state) => state.auth
  );
  const storeId = useSelector((state) => state.cart.storeId);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [addressList, setAddressList] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const isCartEmpty = !currentUser?.myCart || currentUser.myCart.length === 0;

  // Retrieve delivery addresses
  useEffect(() => {
    const fetchAddress = async () => {
      if (!currentUser?._id) return;
      const data = await handleGetAddressApi(currentUser._id);
      if (data && data.success && data.addressList && data.addressList.length > 0) {
        setAddressList(data.addressList);
        setAddress(data.addressList[0]);
        dispatch(updateUser({ address: data.addressList[0] }));
      }
    };
    if (isLogin) {
      fetchAddress();
    }
  }, [isLogin, currentUser?._id, dispatch]);

  const cartItems = currentUser?.myCart || [];

  // Compute subtotal, tax, delivery fee and final price reactively
  const orderPriceDetails = calculateCartTotals(cartItems);

  // Update item quantity inside the cart
  const onCartItemQtyChange = async (e) => {
    const itemId = e.target.id;
    const itemQty = Number(e.target.value);

    const updatedCart = cartItems.map((item) => {
      if (item._id === itemId) {
        return { ...item, product_qty: itemQty };
      }
      return item;
    });

    dispatch(updateUser({ myCart: updatedCart }));

    if (isLogin && currentUser?._id) {
      try {
        await updateCartQtyApi(currentUser._id, itemId, itemQty);
      } catch (error) {
        console.error("Failed to update cart quantity in DB:", error);
      }
    }
  };

  // Delete product from the cart
  const onCartItemDeleteBtn = async (productId) => {
    const updatedCart = cartItems.filter((p) => p._id !== productId);
    dispatch(updateUser({ myCart: updatedCart }));

    if (isLogin && currentUser?._id) {
      try {
        await removeFromCartApi(currentUser._id, productId);
        toast.success("Item removed from cart");
      } catch (error) {
        console.error("Failed to remove cart item from DB:", error);
      }
    }
  };

  // Clear entire cart
  const handleClearCart = async () => {
    dispatch(updateUser({ myCart: [] }));
    dispatch(setStoreId(null));

    if (isLogin && currentUser?._id) {
      try {
        await clearCartApi(currentUser._id);
        toast.success("Cart cleared successfully");
      } catch (error) {
        console.error("Failed to clear cart in DB:", error);
      }
    }
  };

  // Change payment method
  const handlePaymentMethod = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Submit order placement request
  const handlePlaceOrder = () => {
    onCartPlaceOrder(
      currentUser,
      (updatedUser) => dispatch(updateUser(updatedUser)),
      storeId,
      orderPriceDetails,
      address,
      paymentMethod,
      navigate,
    );
  };

  return {
    currentUser,
    setCurrentUser: (updater) => dispatch(updateUser(updater)),
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
    orderPriceDetails,
    onCartItemQtyChange,
    onCartItemDeleteBtn,
    handleClearCart,
    handlePaymentMethod,
    handlePlaceOrder,
  };
};
