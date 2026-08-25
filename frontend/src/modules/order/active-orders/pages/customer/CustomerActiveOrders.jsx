import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Banknote,
  Calendar,
  Clock,
  CreditCard,
  Store,
} from "lucide-react";
import { EmptyOrders } from "@/modules/order/order-history/components";
import { getActiveOrdersApi } from "../../services/activeOrders.api";

function CustomerActiveOrders() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveOrders = async () => {
      if (!currentUser?._id && !currentUser?.id) {
        setLoading(false);
        return;
      }
      const userId = currentUser._id || currentUser.id;
      try {
        const data = await getActiveOrdersApi(userId, "customer");
        if (data && data.success) {
          setActiveOrders(data.activeOrders || []);
        } else if (currentUser?.myCurrentOrders) {
          setActiveOrders(currentUser.myCurrentOrders);
        }
      } catch (error) {
        console.error("Failed to fetch active orders:", error);
        if (currentUser?.myCurrentOrders) {
          setActiveOrders(currentUser.myCurrentOrders);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchActiveOrders();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!activeOrders || activeOrders.length === 0) {
    return <EmptyOrders />;
  }

  // --------- Style --------------------------------
  const styleFlex =
    "text-xs flex items-center gap-1 text-nowrap bg-gray-100 px-2 py-1 rounded-2xl ";
  const formatDate = (rawDateStr, createdAt) => {
    if (!rawDateStr && !createdAt) return "";
    if (createdAt) {
      return new Date(createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    const [day, month, year] = rawDateStr.split("/");
    const dateObj = new Date(year, month - 1, day);

    return dateObj
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .replace(/ (\d{4})$/, ", $1");
  };

  return (
    <div className="space-y-3">
      {/* HEADER CARD */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Current Orders</h1>
      </div>

      {/* ORDERS */}
      {activeOrders.map((order, index) => {
        const storeName = order.store_name || order.storeName;
        const storeAddress = order.store_address || order.storeAddress;
        const status = order.order_status || order.orderStatus || "pending";
        const items = order.order_items || order.items || [];
        const paymentMethod = order.payment_method || order.paymentMethod || "cashOnDelivery";
        const finalPrice = order.price_detail?.finalPrice || order.priceDetails?.finalPrice || 0;
        const timeStr = order.orderTime || (order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "");

        return (
          <div
            key={order._id || order.orderId || index}
            className="bg-white rounded-2xl hover:shadow-md duration-150 transition-all border overflow-hidden"
          >
            {/* TOP */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b p-4">
              <div className="font-medium">
                <div className="text-sm flex flex-wrap gap-3 w-full text-gray-600">
                  <span className={styleFlex}>
                    <Store size={17} />
                    {storeName}
                  </span>
                  {timeStr && (
                    <span className={styleFlex}>
                      <Clock size={17} />
                      {timeStr}
                    </span>
                  )}
                  <span className={styleFlex}>
                    <Calendar size={17} />
                    {formatDate(order?.orderDate, order?.createdAt)}
                  </span>
                  <span
                    className={`capitalize w-max px-3 py-1 rounded-full text-sm font-semibold ${
                      status === "pending"
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        : status === "preparing" || status === "processing" || status === "confirmed"
                        ? "text-emerald-700 bg-emerald-100 border border-emerald-200"
                        : status === "shipped" || status === "ready" || status === "out_for_delivery"
                        ? "text-blue-700 bg-blue-100 border border-blue-200"
                        : status === "completed" || status === "delivered"
                        ? "font-bold text-green-800 bg-green-200"
                        : "text-red-700 bg-red-100 border border-red-200"
                    }`}
                  >
                    {status === "ready"
                      ? "Ready for Pickup"
                      : status === "out_for_delivery" || status === "shipped"
                      ? "Out for Delivery 🚚"
                      : status}
                  </span>
                </div>

                {storeAddress && (
                  <p className="text-xs/5 text-gray-500 mt-1">
                    📍{typeof storeAddress === "object" ? `${storeAddress.street || ""} ${storeAddress.city || ""}` : storeAddress}
                  </p>
                )}

                {/* LIVE DRIVER ALLOCATION & DRIVER INFO BANNER */}
                {order.driver_allocation_status === "assigned" && order.driver_details && (status === "ready" || status === "shipped" || status === "out_for_delivery") ? (
                  <div className="mt-2 text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                      <span>🚚 Driver Assigned: {order.driver_details.driver_name}</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 font-normal">
                      📞 Contact: +91 {order.driver_details.driver_phone} • 🛵 Vehicle: {order.driver_details.vehicle_number}
                    </p>
                  </div>
                ) : (status === "preparing" || status === "processing" || status === "pending") && status !== "rejected" && status !== "cancelled" ? (
                  <div className="mt-2 text-xs font-medium text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5 animate-pulse">
                    <span>👨‍🍳 Store is preparing your food... (Driver info unlocks when ready for pickup)</span>
                  </div>
                ) : null}

                {(status === "rejected" || status === "cancelled") && (
                  <div className="mt-2 text-xs font-semibold text-red-600 bg-red-50 p-2 rounded-xl border border-red-100 flex items-center gap-1.5">
                    <span>⚠️ Order was {status}. If you paid online, your refund will be processed shortly.</span>
                  </div>
                )}
              </div>
            </div>

            {/* ITEMS */}
            <div className="p-4 space-y-4">
              {items.map((item, itemIdx) => (
                <div
                  key={item._id || itemIdx}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 border cursor-pointer rounded-xl bg-gray-100 overflow-hidden group p-1.5 hover:scale-105 duration-100">
                      <img
                        src={item.product_url}
                        alt={item.product_name}
                        className="w-full h-full object-contain group-hover:scale-105 duration-150"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {item.product_name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Qty : {item.product_qty}
                      </p>

                      {item.product_weight && (
                        <p className="text-xs text-gray-400">
                          Weight : {item.product_weight}
                          {item.product_weight_type === "none" ? "" : ` ${item.product_weight_type}`}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-700">
                      ₹
                      {item.isOfferAvailable || item.is_offer_available
                        ? item.product_offer_price
                        : item.product_selling_price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="border-t p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="font-semibold text-gray-700 text-sm [&>p]:flex [&>p]:gap-1 [&>p]:items-center">
                  {paymentMethod === "cashOnDelivery" || paymentMethod === "cash" ? (
                    <p>
                      <Banknote size={20} /> <span>Cash</span>
                    </p>
                  ) : (
                    <p>
                      <CreditCard size={20} /> <span>Online</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Total Amount</p>

                <p className="text-xl font-bold text-green-600">
                  ₹{finalPrice}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CustomerActiveOrders;
