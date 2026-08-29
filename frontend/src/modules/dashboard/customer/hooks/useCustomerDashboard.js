import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { setStoreId, setGuestCart, openCartDrawer } from "@/modules/cart/store/cartSlice";
import { getStoreApi, addToCartApi } from "@/modules/cart/services/cart.api";
import { useModal, MODAL_TYPES } from "@/components";
import { handleGetAddressApi } from "@/modules/address/services/address.service.api";
import { getAllOrdersSvc } from "@/modules/order/services/order.api.service";
import { sortOrderByDate } from "@/modules/order/services/orderFilterService";
import { toast } from "react-toastify";
import api from "@/configs/api";

export function useCustomerDashboard() {
  const dispatch = useDispatch();
  const { user: currentUser, isAuthenticated: isLogin } = useSelector((state) => state.auth);
  const storeId = useSelector((state) => state.cart.storeId);
  const guestCart = useSelector((state) => state.cart.guestCart || []);
  const { openModal } = useModal();

  const [ordersList, setOrdersList] = useState(currentUser?.myOrders || []);
  const [loadingOrders, setLoadingOrders] = useState(!currentUser?.myOrders);
  const [reorderingOrderId, setReorderingOrderId] = useState(null);

  let currentUserAddress = "";
  const isAddressAvailable = Boolean(currentUser?.myAddress);

  if (isAddressAvailable) {
    currentUserAddress = `${currentUser.myAddress.name || ""} ${currentUser.myAddress.phone || ""} ${currentUser.myAddress.street || ""} ${currentUser.myAddress.city || ""} ${currentUser.myAddress.state || ""}, ${currentUser.myAddress.pincode || ""} `;
  }

  // Load address only if not already present in Redux store
  useEffect(() => {
    const fetchAddress = async () => {
      if (!currentUser?._id || currentUser?.myAddress) return;
      try {
        const data = await handleGetAddressApi(currentUser._id);
        if (data && data.success && data.addressList && data.addressList.length > 0) {
          dispatch(updateUser({ myAddress: data.addressList[0] }));
        }
      } catch (error) {
        console.error("Failed to load address for dashboard:", error);
      }
    };
    fetchAddress();
  }, [currentUser?._id, currentUser?.myAddress, dispatch]);

  // Load orders from database only if not already present in Redux store
  useEffect(() => {
    if (currentUser?.myOrders) {
      const sorted = sortOrderByDate(currentUser.myOrders, "desc");
      setOrdersList(sorted);
      setLoadingOrders(false);
      return;
    }

    const fetchOrders = async () => {
      if (!currentUser?._id) return;
      try {
        setLoadingOrders(true);
        const res = await getAllOrdersSvc(currentUser._id, currentUser.role || "customer");
        if (res?.data?.success && res?.data?.allOrders) {
          const sorted = sortOrderByDate(res.data.allOrders, "desc");
          setOrdersList(sorted);
          dispatch(updateUser({ myOrders: res.data.allOrders }));
        }
      } catch (error) {
        console.error("Failed to load orders for dashboard:", error);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [currentUser?._id, currentUser?.role, currentUser?.myOrders, dispatch]);

  const handleAddAddress = () => {
    openModal(MODAL_TYPES.ADDRESS, {
      userId: currentUser?._id,
      setAddress: (newAddress) => {
        dispatch(updateUser({ myAddress: newAddress }));
      },
    });
  };

  // Helper function for title formatting
  const getOrderTitle = (order) => {
    if (Array.isArray(order?.order_items) && order.order_items.length > 0) {
      const firstItem = order.order_items[0]?.product_name || order.order_items[0]?.name;
      if (firstItem) {
        if (order.order_items.length > 1) {
          return `${firstItem} & ${order.order_items.length - 1} more item${order.order_items.length - 1 > 1 ? "s" : ""}`;
        }
        return firstItem;
      }
    }
    return `Order #${order?._id ? order._id.slice(0, 8).toUpperCase() : ""}`;
  };

  // Helper function for price formatting
  const getOrderPrice = (order) => {
    const price = order?.price_detail?.finalPrice ?? order?.priceDetails?.finalPrice ?? 0;
    return `$${price}`;
  };

  // Reorder functionality with full store & product validations
  const handleReorder = async (e, order, navigate) => {
    e.stopPropagation();

    if (!order || !order.store_id) {
      return toast.error("Unable to reorder: Store information is missing.");
    }

    const targetStoreId = order.store_id;
    setReorderingOrderId(order._id);

    try {
      // 1. Validate Store existence & status
      let storeRes;
      try {
        storeRes = await getStoreApi(targetStoreId);
      } catch (err) {
        toast.error("This store is no longer available.");
        setReorderingOrderId(null);
        return;
      }

      if (!storeRes || !storeRes.success || !storeRes.store) {
        toast.error(storeRes?.message || "This store is no longer available.");
        setReorderingOrderId(null);
        return;
      }

      const store = storeRes.store;
      if (store.is_active === false || store.status === "inactive" || store.status === "closed") {
        toast.error(`"${store.store_name || "Store"}" is currently inactive or closed.`);
        setReorderingOrderId(null);
        return;
      }

      // 2. Validate products availability in store
      const { data: productRes } = await api.get(`/stores/allproducts/${targetStoreId}`);
      if (!productRes || !productRes.success || !productRes.result) {
        toast.error("Failed to load products from this store.");
        setReorderingOrderId(null);
        return;
      }

      const availableProducts = productRes.result;
      const orderItems = order.order_items || [];

      if (!orderItems.length) {
        toast.error("No items found in this order.");
        setReorderingOrderId(null);
        return;
      }

      const itemsToAdd = [];
      let unavailableCount = 0;

      for (const orderItem of orderItems) {
        const orderItemId = orderItem._id || orderItem.product_id;
        const storeProduct = availableProducts.find(
          (p) => p._id === orderItemId || (orderItem.product_name && p.product_name === orderItem.product_name)
        );

        if (storeProduct && storeProduct.is_product_in_stock !== false) {
          itemsToAdd.push({
            ...storeProduct,
            product_qty: orderItem.product_qty || 1,
            store_id: targetStoreId,
          });
        } else {
          unavailableCount++;
        }
      }

      if (itemsToAdd.length === 0) {
        toast.error("None of the products from this order are currently available in the store.");
        setReorderingOrderId(null);
        return;
      }

      if (unavailableCount > 0) {
        toast.warning(`${unavailableCount} item(s) from this order are currently out of stock or unavailable.`);
      }

      // 3. Cart update and Store Isolation handling
      const currentCart = isLogin ? (currentUser?.myCart || []) : guestCart;
      const currentStoreId = storeId;

      const executeAdd = async () => {
        let updatedCart = [];

        if (currentCart.length > 0 && currentStoreId && currentStoreId !== targetStoreId) {
          updatedCart = itemsToAdd;
        } else {
          updatedCart = [...currentCart];
          for (const newItem of itemsToAdd) {
            const existingIndex = updatedCart.findIndex((p) => p._id === newItem._id);
            if (existingIndex > -1) {
              updatedCart[existingIndex] = {
                ...updatedCart[existingIndex],
                product_qty: updatedCart[existingIndex].product_qty + newItem.product_qty,
              };
            } else {
              updatedCart.push(newItem);
            }
          }
        }

        if (isLogin) {
          dispatch(updateUser({ myCart: updatedCart }));
        } else {
          dispatch(setGuestCart(updatedCart));
        }
        dispatch(setStoreId(targetStoreId));

        if (isLogin && currentUser?._id) {
          try {
            for (const item of itemsToAdd) {
              await addToCartApi(currentUser._id, item._id, targetStoreId, item.product_qty);
            }
          } catch (err) {
            console.error("Failed to sync reordered items to DB:", err);
          }
        }

        dispatch(openCartDrawer());
        toast.success("Items added to cart! Opening store page...");
        navigate(`/stores/allproducts/${targetStoreId}`);
      };

      if (currentCart.length > 0 && currentStoreId && currentStoreId !== targetStoreId) {
        openModal(MODAL_TYPES.CONFIRM, {
          title: "Replace cart items?",
          message: "Your cart contains items from another store. Do you want to clear your cart and replace it with items from this store?",
          confirmText: "Replace & Reorder",
          cancelText: "Cancel",
          type: "warning",
          onConfirm: async () => {
            await executeAdd();
            setReorderingOrderId(null);
          },
          onCancel: () => {
            setReorderingOrderId(null);
          },
        });
      } else {
        await executeAdd();
        setReorderingOrderId(null);
      }
    } catch (error) {
      console.error("Reorder failed:", error);
      toast.error("Failed to process reorder. Please try again.");
      setReorderingOrderId(null);
    }
  };

  const customerStats = {
    orders: ordersList?.length || 0,
    wishlist: currentUser?.myWishlist?.length || 0,
    rewardPoints:
      ordersList?.reduce(
        (total, order) =>
          total + Math.floor(((order?.price_detail?.finalPrice ?? order?.priceDetails?.finalPrice) || 0) / 10),
        0,
      ) || 0,
    savings: "$122",
  };

  const pastTwoOrders = ordersList.slice(0, 2);

  return {
    currentUser,
    currentUserAddress,
    isAddressAvailable,
    handleAddAddress,
    ordersList,
    loadingOrders,
    pastTwoOrders,
    customerStats,
    reorderingOrderId,
    handleReorder,
    getOrderTitle,
    getOrderPrice,
  };
}
