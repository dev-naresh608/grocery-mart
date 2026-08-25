import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Bike,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  Bell,
  Check,
  X,
  Store,
  Clock,
  Navigation,
  Lock,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getActiveOrdersApi,
  updateOrderStatusApi,
  getAvailableDriverRequestsApi,
  driverAcceptOrderApi,
  driverRejectOrderApi,
} from "../../services/activeOrders.api";

function DriverActiveOrders() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [activeOrders, setActiveOrders] = useState([]);
  const [availableRequests, setAvailableRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const driverId = currentUser?._id || currentUser?.id;

  const fetchDriverData = async () => {
    if (!driverId) {
      setLoading(false);
      return;
    }
    try {
      // Fetch assigned active orders
      const activeData = await getActiveOrdersApi(driverId, "driver");
      if (activeData && activeData.success) {
        setActiveOrders(activeData.activeOrders || []);
      }

      // Fetch broadcasted available requests
      const requestData = await getAvailableDriverRequestsApi(driverId);
      if (requestData && requestData.success) {
        setAvailableRequests(requestData.requests || []);
      }
    } catch (error) {
      console.error("Failed to fetch driver orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverData();
    const interval = setInterval(fetchDriverData, 4000);
    return () => clearInterval(interval);
  }, [driverId]);

  // Handle Accept Request
  const handleAcceptRequest = async (orderId) => {
    try {
      const data = await driverAcceptOrderApi(orderId, driverId);
      if (data.success) {
        toast.success("Delivery request accepted! 🚚");
        fetchDriverData();
      } else {
        toast.error(data.message || "Could not accept order");
      }
    } catch (error) {
      toast.error("Failed to accept delivery request");
    }
  };

  // Handle Reject Request
  const handleRejectRequest = async (orderId) => {
    try {
      const data = await driverRejectOrderApi(orderId, driverId);
      if (data.success) {
        toast.info("Delivery request declined");
        fetchDriverData();
      }
    } catch (error) {
      toast.error("Failed to decline request");
    }
  };

  // Handle Update Status to Delivered
  const handleUpdateStatus = async (orderId, status) => {
    try {
      const data = await updateOrderStatusApi(orderId, status);
      if (data && data.success) {
        toast.success(`Order marked as ${status}`);
        fetchDriverData();
      } else {
        toast.error(data?.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-9 h-9 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Driver Delivery Portal</h1>
          <p className="text-sm text-gray-500 mt-0.5">Real-time delivery requests & assigned trips</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${
          activeOrders.length > 0
            ? "bg-amber-50 text-amber-800 border-amber-200"
            : "bg-blue-50 text-blue-700 border-blue-100"
        }`}>
          <Bike size={18} />
          <span>{activeOrders.length > 0 ? "Busy (Active Trip: 1/1 Max)" : "Available for Requests"}</span>
        </div>
      </div>

      {/* NEW BROADCASTED DELIVERY REQUESTS SECTION */}
      {availableRequests.length > 0 && (
        <div className="bg-amber-500/10 border-2 border-amber-400 p-5 rounded-2xl space-y-4 shadow-sm animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-lg">
              <Bell size={22} className="animate-bounce text-amber-600" />
              <span>New Delivery Request Available! ({availableRequests.length})</span>
            </div>
            <span className="text-xs bg-amber-500 text-white font-bold px-3 py-1 rounded-full">
              Accept Fast
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRequests.map((req) => {
              const reqId = req._id;
              const storeName = req.store_name || "Store";
              const storeAddr = typeof req.store_address === "object" ? `${req.store_address.street || ""} ${req.store_address.city || ""}` : req.store_address;
              const custAddr = typeof req.order_address === "object" ? `${req.order_address.street || ""} ${req.order_address.city || ""}` : req.order_address;
              const finalPrice = req.price_detail?.finalPrice || req.priceDetails?.finalPrice || 0;

              return (
                <div key={reqId} className="bg-white rounded-xl border border-amber-200 p-4 shadow space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-gray-900 text-sm">Order #{String(reqId).slice(-6).toUpperCase()}</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded font-bold text-xs">
                      Payout: ₹{finalPrice}
                    </span>
                  </div>

                  {/* LOCATION & METRICS (STORE, CUSTOMER, DISTANCE, ETA) */}
                  <div className="space-y-2 text-xs text-gray-600 bg-gray-50/80 p-3 rounded-lg border border-gray-100">
                    <p className="flex items-start gap-1.5">
                      <Store size={15} className="text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Pickup Store:</strong> {storeName} ({storeAddr})</span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <MapPin size={15} className="text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Deliver to:</strong> {custAddr}</span>
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-200/60 font-semibold text-gray-700">
                      <div className="flex items-center gap-1 bg-white p-1.5 rounded border border-gray-200">
                        <Navigation size={13} className="text-blue-500" />
                        <span>Distance: ~3.8 KM</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white p-1.5 rounded border border-gray-200">
                        <Clock size={13} className="text-amber-500" />
                        <span>ETA: ~14 Mins</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleRejectRequest(reqId)}
                      className="flex-1 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <X size={15} /> Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAcceptRequest(reqId)}
                      className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Check size={15} /> Accept Delivery
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ASSIGNED ACTIVE DELIVERIES LIST */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-3">Assigned Active Deliveries</h2>

        {activeOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <Bike size={60} className="text-gray-300 mb-3" />
            <h3 className="text-base font-semibold text-gray-700">No Active Trip Assigned</h3>
            <p className="text-xs text-gray-500 mt-1">Accept new delivery requests above to start trips.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeOrders.map((order) => {
              const orderId = order._id || order.orderId;
              const status = order.order_status || "processing";
              const customerName = order.customer_name || "Customer";
              const customerPhone = order.customer_phone || "";
              const customerAddress = typeof order.order_address === "object"
                ? `${order.order_address.street || ""} ${order.order_address.city || ""}`
                : order.order_address;
              const isReadyForPickup = status === "ready" || status === "shipped" || status === "out_for_delivery";
              const isOutForDelivery = status === "shipped" || status === "out_for_delivery";

              return (
                <div key={orderId} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-bold text-base text-gray-900">Order #{String(orderId).slice(-6).toUpperCase()}</h3>
                      <p className="text-xs text-gray-500">Store: {order.store_name}</p>
                    </div>
                    <span className={`capitalize px-3 py-1 text-xs font-semibold rounded-full ${
                      isOutForDelivery
                        ? "bg-blue-100 text-blue-800"
                        : isReadyForPickup
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {isOutForDelivery
                        ? "Out for Delivery 🚚"
                        : isReadyForPickup
                        ? "Ready for Pickup 📦"
                        : "Store Preparing 👨‍🍳"}
                    </span>
                  </div>

                  {/* LOCATIONS */}
                  <div className="space-y-2 text-xs text-gray-700">
                    <p className="flex items-start gap-2">
                      <Store size={15} className="text-amber-600 mt-0.5 shrink-0" />
                      <span><strong>Pickup Store:</strong> {order.store_name} ({typeof order.store_address === "object" ? `${order.store_address.street || ""} ${order.store_address.city || ""}` : order.store_address})</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin size={15} className="text-blue-600 mt-0.5 shrink-0" />
                      <span><strong>Deliver Address:</strong> {customerAddress}</span>
                    </p>
                  </div>

                  {/* UNLOCK CUSTOMER DETAILS ONLY WHEN STORE MARKS READY / OUT FOR DELIVERY */}
                  <div className="pt-1">
                    {isReadyForPickup ? (
                      <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 p-2.5 rounded-xl text-xs space-y-1">
                        <p className="flex items-center gap-1.5 font-bold">
                          <User size={14} className="text-emerald-700" />
                          <span>Customer: {customerName}</span>
                        </p>
                        {customerPhone && (
                          <p className="flex items-center gap-1.5 text-emerald-700 font-semibold pl-5">
                            <Phone size={13} />
                            <span>Contact: +91 {customerPhone}</span>
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-amber-50 text-amber-800 border border-amber-200 p-2.5 rounded-xl text-xs flex items-center gap-2">
                        <Lock size={15} className="text-amber-600 shrink-0" />
                        <span>Customer name & phone number will be unlocked once store marks order Ready for Pickup.</span>
                      </div>
                    )}
                  </div>

                  {/* FOOTER ACTION */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <p className="font-bold text-lg text-emerald-700">
                      ₹{order.price_detail?.finalPrice || order.priceDetails?.finalPrice || 0}
                    </p>
                    {isOutForDelivery ? (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(orderId, "delivered")}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow cursor-pointer animate-bounce"
                      >
                        <CheckCircle2 size={16} /> Mark Delivered
                      </button>
                    ) : isReadyForPickup ? (
                      <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1.5">
                        <span>📦 Waiting for store handoff...</span>
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5 animate-pulse">
                        <span>👨‍🍳 Waiting for store to prepare...</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default DriverActiveOrders;
