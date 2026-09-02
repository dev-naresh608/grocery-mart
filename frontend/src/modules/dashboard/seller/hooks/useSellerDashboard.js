import { useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { toast } from "react-toastify";
import { toggleStoreStatusApi } from "@/modules/seller/services/product.api.service";

export function useSellerDashboard() {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const isStoreOpen = currentUser?.is_store_open !== false;
  const storeId = currentUser?.store_id || currentUser?._id;

  const handleToggleStoreStatus = useCallback(
    async (newStatus) => {
      if (!storeId) {
        return toast.error("Store information not found");
      }

      try {
        setIsTogglingStatus(true);
        const res = await toggleStoreStatusApi(storeId, newStatus);

        if (res && res.success) {
          dispatch(updateUser({ is_store_open: Boolean(res.is_store_open) }));
          toast.success(
            res.message ||
              (newStatus
                ? "Store is now Active & accepting orders!"
                : "Store is now Inactive / Closed.")
          );
        } else {
          toast.error(res?.message || "Failed to update store status");
        }
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to update store status";
        toast.error(errorMsg);
      } finally {
        setIsTogglingStatus(false);
      }
    },
    [storeId, dispatch]
  );

  // Set Seller Stats safely with useMemo
  const sellerStats = useMemo(() => {
    const revenueValue = typeof currentUser?.myRevenue === "number"
      ? currentUser.myRevenue
      : typeof currentUser?.myRevanue === "number"
      ? currentUser.myRevanue
      : Array.isArray(currentUser?.myRevanue)
      ? currentUser.myRevanue.reduce((acc, curr) => acc + (Number(curr?.price || curr) || 0), 0)
      : 0;

    return {
      totalOrders: currentUser?.myOrders?.length || "0",
      revenue: `₹${revenueValue.toFixed ? revenueValue.toFixed(2) : revenueValue}`,
      products: currentUser?.productList?.length || "0",
      customers: currentUser?.myCustomers?.length || "0",
    };
  }, [currentUser?.myOrders, currentUser?.myRevenue, currentUser?.myRevanue, currentUser?.productList, currentUser?.myCustomers]);

  return {
    currentUser,
    sellerStats,
    isStoreOpen,
    isTogglingStatus,
    handleToggleStoreStatus,
  };
}
