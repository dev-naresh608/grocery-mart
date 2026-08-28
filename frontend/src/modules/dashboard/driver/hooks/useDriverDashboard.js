import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { toast } from "react-toastify";
import { getActiveOrdersApi } from "@/modules/order/active-orders/services/activeOrders.api";

export function useDriverDashboard() {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const handleDriveStatus = async () => {
    if (!currentUser) return;

    // Prevent deactivating status if driver has an active ongoing trip
    if (currentUser.driver_status) {
      const driverId = currentUser._id || currentUser.id;
      try {
        const data = await getActiveOrdersApi(driverId, "driver");
        const activeTrips = data?.activeOrders || [];
        if (currentUser.is_busy || activeTrips.length > 0) {
          toast.error("⚠️ Cannot go offline while you have an active delivery trip in progress!");
          return;
        }
      } catch (err) {
        if (currentUser.is_busy) {
          toast.error("⚠️ Cannot go offline while you have an active delivery trip in progress!");
          return;
        }
      }
    }

    const newStatus = !currentUser.driver_status;
    dispatch(updateUser({ driver_status: newStatus }));
    toast.info(`Status updated to ${newStatus ? "Active" : "Offline"}`);
  };

  return {
    currentUser,
    handleDriveStatus,
  };
}
