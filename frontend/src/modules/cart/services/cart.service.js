import { toast } from "react-toastify";
import { addOrderApi, getStoreApi, clearCartApi } from "./cart.api.service";
import { validateOrder } from "../utils/cartValidation";

export const onCartPlaceOrder = async (
  currentUser,
  setCurrentUser,
  storeId,
  orderPriceDetails,
  address,
  paymentMethod,
  navigate,
) => {
  try {

    // Run custom validation utility
    const validation = validateOrder(address, storeId, currentUser.myCart);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    // Get user and store details
    const user = currentUser;
    const storeData = await getStoreApi(storeId);

    if (!storeData || !storeData.success) {
      toast.error(storeData?.message || "Failed to fetch store details");
      return;
    }

    const store = storeData.store;
    if (!user || !store) {
      toast.error("Something went wrong");
      return;
    }

    const createdAt = new Date();
    const orderData = {
      items: currentUser?.myCart,
      createdAt,
      paymentMethod,
      storeId,
      isOrderActive: true,
      customerId: currentUser._id,
      store_name: store.store_name,
      email: currentUser.email,
      store_address: store.store_address,
      order_address: address,
      orderStatus: "pending",
      priceDetails: orderPriceDetails,
    };

    // Submit order creation request
    const response = await addOrderApi(orderData);

    if (!response || !response.success) {
      toast.error(response?.message || "Something went wrong while placing the order");
      return;
    }

    // Clear cart in DB and update user state
    try {
      if (currentUser?._id) {
        await clearCartApi(currentUser._id);
      }
    } catch (err) {
      console.error("Cart DB clear error:", err);
    }

    // Customer payload update with empty cart
    const updatedUser = {
      ...user,
      myCart: [],
      myOrders: user.myOrders ? [...user.myOrders, response.order || orderData] : [response.order || orderData],
    };

    setCurrentUser(updatedUser);

    toast.success(response.message || "Order placed successfully");

    setTimeout(() => {
      navigate("/orders");
    }, 800);
  } catch (error) {
    toast.error("Failed to place order");
    console.error("Place Order Error:", error);
  }
};
