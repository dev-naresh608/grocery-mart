import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Clock,
  Phone,
  User,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Package,
  ShoppingCart,
  CreditCard,
  AlertCircle,
  Flame,
  Bike,
  RotateCw,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getActiveOrdersApi,
  updateOrderStatusApi,
  retryDriverAllocationApi,
} from "../../services/activeOrders.api";

function SellerActiveOrders() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH ACTIVE ORDERS =================
  const fetchActiveOrders = async () => {
    if (!currentUser?._id && !currentUser?.id) {
      setLoading(false);
      return;
    }
    const userId = currentUser._id || currentUser.id;
    try {
      const data = await getActiveOrdersApi(userId, "seller");
      if (data && data.success) {
        setActiveOrders(data.activeOrders || []);
      }
    } catch (error) {
      console.error("Failed to fetch active seller orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveOrders();
    const interval = setInterval(fetchActiveOrders, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // ================= CHANGE ORDER STATUS =================
  const changeOrderStatus = async (orderId, newStatus) => {
    try {
      const data = await updateOrderStatusApi(orderId, newStatus);
      if (data && data.success) {
        if (
          newStatus === "delivered" ||
          newStatus === "completed" ||
          newStatus === "rejected"
        ) {
          toast.success(
            `Order #${String(orderId).slice(-6)} completed & moved to Order History`,
          );
        } else {
          toast.success(`Order status updated to ${newStatus}`);
        }
        fetchActiveOrders();
      } else {
        toast.error(data?.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status");
    }
  };

  const onOrderAccept = async (orderId) => {
    await changeOrderStatus(orderId, "preparing");
  };

  const onOrderReject = async (orderId) => {
    const sure = window.confirm("Are you sure you want to reject this order?");
    if (!sure) return;
    await changeOrderStatus(orderId, "rejected");
  };

  const onMarkReady = async (order) => {
    if (!order?.driver_id || order?.driver_allocation_status !== "assigned") {
      toast.error("⚠️ Cannot mark order ready until a driver accepts and is assigned!");
      return;
    }
    const orderId = order._id || order.orderId;
    await changeOrderStatus(orderId, "ready");
  };

  const onCompleteHandoff = async (order) => {
    if (!order?.driver_id || order?.driver_allocation_status !== "assigned") {
      toast.error("⚠️ Cannot hand over order without an assigned driver!");
      return;
    }
    const orderId = order._id || order.orderId;
    await changeOrderStatus(orderId, "out_for_delivery");
  };

  const onRetryDriver = async (orderId) => {
    try {
      const data = await retryDriverAllocationApi(orderId);
      if (data.success) {
        toast.info("Retrying driver allocation...");
        fetchActiveOrders();
      }
    } catch (error) {
      toast.error("Failed to retry driver search");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-9 h-9 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Filter orders into Kanban Columns
  const pendingOrders = activeOrders.filter(
    (o) => (o.order_status || o.orderStatus) === "pending",
  );
  const preparingOrders = activeOrders.filter((o) => {
    const status = o.order_status || o.orderStatus;
    return status === "preparing" || status === "processing";
  });
  const readyOrders = activeOrders.filter((o) => {
    const status = o.order_status || o.orderStatus;
    return status === "ready" || status === "confirmed" || status === "shipped";
  });

  const columns = [
    {
      id: "pending",
      title: "New Orders",
      count: pendingOrders.length,
      orders: pendingOrders,
      headerBg: "bg-amber-500/10 text-amber-700 border-amber-200",
      badgeBg: "bg-amber-500 text-white",
      dotColor: "bg-amber-500",
      icon: AlertCircle,
    },
    {
      id: "preparing",
      title: "In Preparation",
      count: preparingOrders.length,
      orders: preparingOrders,
      headerBg: "bg-blue-500/10 text-blue-700 border-blue-200",
      badgeBg: "bg-blue-600 text-white",
      dotColor: "bg-blue-500",
      icon: Flame,
    },
    {
      id: "ready",
      title: "Ready / Out for Delivery",
      count: readyOrders.length,
      orders: readyOrders,
      headerBg: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
      badgeBg: "bg-emerald-600 text-white",
      dotColor: "bg-emerald-500",
      icon: Bike,
    },
  ];

  return (
    <div className="space-y-6">
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Order Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Kanban Board • Auto-syncing driver allocation in real time
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold border border-emerald-100">
            <ShoppingCart size={18} />
            <span>Live Orders: {activeOrders.length}</span>
          </div>
        </div>
      </div>

      {/* KANBAN BOARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {columns.map((column) => {
          const ColumnIcon = column.icon;

          return (
            <div
              key={column.id}
              className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-4 flex flex-col min-h-[550px] shadow-sm"
            >
              {/* COLUMN HEADER */}
              <div
                className={`flex items-center justify-between p-3 rounded-xl border ${column.headerBg} mb-4`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${column.dotColor} animate-pulse`}
                  />
                  <ColumnIcon size={16} />
                  <span>{column.title}</span>
                </div>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold ${column.badgeBg}`}
                >
                  {column.count}
                </span>
              </div>

              {/* ORDERS LIST IN COLUMN */}
              <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[70vh] pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                {column.orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400 border border-dashed border-gray-200 rounded-xl bg-white/50">
                    <Package
                      size={36}
                      strokeWidth={1.5}
                      className="mb-2 text-gray-300"
                    />
                    <p className="text-xs font-semibold">
                      No orders in this column
                    </p>
                  </div>
                ) : (
                  column.orders.map((order) => {
                    const orderId = order._id || order.orderId;
                    const items = order.order_items || order.items || [];
                    const customerName =
                      order.customer_name || order.name || "Customer";
                    const customerPhone =
                      order.customer_phone || order.phone || "";
                    const paymentMethod =
                      order.payment_method || order.paymentMethod || "cash";
                    const finalPrice =
                      order.price_detail?.finalPrice ||
                      order.priceDetails?.finalPrice ||
                      0;
                    const timeDisplay =
                      order.orderTime ||
                      (order.createdAt
                        ? new Date(order.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "");
                    const driverAllocStatus = order.driver_allocation_status;
                    const driverDetails = order.driver_details;

                    return (
                      <div
                        key={orderId}
                        className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-sm hover:shadow-md transition-all duration-200 space-y-3 group"
                      >
                        {/* CARD TOP BAR */}
                        <div className="flex items-start justify-between border-b border-gray-100 pb-2.5">
                          <div>
                            <span className="font-bold text-gray-900 text-sm tracking-tight block">
                              #{String(orderId).slice(-6).toUpperCase()}
                            </span>
                            {timeDisplay && (
                              <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                                <Clock size={12} /> {timeDisplay}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                            ₹{finalPrice}
                          </span>
                        </div>

                        {/* DRIVER ALLOCATION REAL-TIME STATUS BADGE (IN PREPARATION COLUMN) */}
                        {column.id === "preparing" && (
                          <div className="text-xs">
                            {driverAllocStatus === "assigned" &&
                            driverDetails ? (
                              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-2 rounded-lg font-semibold space-y-0.5">
                                <div className="flex items-center gap-1">
                                  <Bike
                                    size={14}
                                    className="text-emerald-600"
                                  />
                                  <span>
                                    Driver Assigned: {driverDetails.driver_name}
                                  </span>
                                </div>
                                <p className="text-[11px] text-emerald-600 font-normal pl-5">
                                  📞 {driverDetails.driver_phone} • 🛵{" "}
                                  {driverDetails.vehicle_number}
                                </p>
                              </div>
                            ) : driverAllocStatus === "no_driver_available" ? (
                              <div className="bg-red-50 text-red-700 border border-red-200 p-2 rounded-lg font-semibold flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                  <AlertCircle size={14} /> No driver available
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onRetryDriver(orderId)}
                                  className="text-[11px] underline font-bold flex items-center gap-1 hover:text-red-900 cursor-pointer"
                                >
                                  <RotateCw size={11} /> Retry
                                </button>
                              </div>
                            ) : (
                              <div className="bg-blue-50 text-blue-700 border border-blue-200 p-2 rounded-lg font-semibold flex items-center gap-1.5 animate-pulse">
                                <Search
                                  size={14}
                                  className="animate-spin text-blue-600"
                                />
                                <span>Finding nearby driver...</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* CUSTOMER INFO */}
                        <div className="space-y-1 text-xs text-gray-600">
                          <p className="flex items-center gap-1.5 font-semibold text-gray-800">
                            <User size={13} className="text-gray-400" />
                            <span className="truncate">{customerName}</span>
                          </p>
                          {customerPhone && (
                            <p className="flex items-center gap-1.5 text-gray-500">
                              <Phone size={13} className="text-gray-400" />
                              <span>{customerPhone}</span>
                            </p>
                          )}
                        </div>

                        {/* ORDER ITEMS MINI SUMMARY */}
                        <div className="bg-gray-50 rounded-lg p-2.5 space-y-2 border border-gray-100">
                          {items.map((prod, idx) => (
                            <div
                              key={prod._id || idx}
                              className="flex items-center gap-2 text-xs"
                            >
                              {prod.product_url && (
                                <img
                                  src={prod.product_url}
                                  alt=""
                                  className="w-7 h-7 object-contain bg-white rounded border p-0.5 shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0 flex items-center justify-between">
                                <span className="font-medium text-gray-700 truncate">
                                  {prod.product_name}
                                </span>
                                <span className="text-gray-500 font-bold ml-1">
                                  x{prod.product_qty}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* PAYMENT METHOD BADGE */}
                        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-gray-600 capitalize">
                            <CreditCard size={12} />
                            {paymentMethod === "cashOnDelivery" ||
                            paymentMethod === "cash"
                              ? "Cash"
                              : "Online"}
                          </span>
                        </div>

                        {/* KANBAN ACTION BUTTONS */}
                        <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                          {column.id === "pending" && (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => onOrderReject(orderId)}
                                className="flex-1 py-1.5 px-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <XCircle size={14} /> Reject
                              </button>

                              <button
                                type="button"
                                onClick={() => onOrderAccept(orderId)}
                                className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                              >
                                Accept <ArrowRight size={14} />
                              </button>
                            </div>
                          )}

                          {column.id === "preparing" && (
                            <div className="space-y-2">
                              {driverAllocStatus === "assigned" ? (
                                <button
                                  type="button"
                                  onClick={() => onMarkReady(order)}
                                  className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <Flame size={15} /> Mark Ready for Pickup{" "}
                                  <ArrowRight size={14} />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => onMarkReady(order)}
                                  className="w-full py-2 px-3 rounded-lg bg-gray-200 text-gray-400 text-xs font-semibold cursor-not-allowed flex items-center justify-center gap-1.5"
                                  title="Waiting for driver assignment before marking ready"
                                >
                                  <Flame size={15} /> Mark Ready (Waiting for Driver)
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => onOrderReject(orderId)}
                                className="w-full py-1.5 px-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <XCircle size={13} /> Reject Order
                              </button>
                            </div>
                          )}

                          {column.id === "ready" && (
                            <button
                              type="button"
                              onClick={() => onCompleteHandoff(order)}
                              disabled={driverAllocStatus !== "assigned"}
                              className={`w-full py-2 px-3 rounded-lg text-white text-xs font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 ${
                                driverAllocStatus === "assigned"
                                  ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                            >
                              <Bike size={15} /> Hand Over to Driver (Out for Delivery)
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SellerActiveOrders;
