import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { db } from "../../../../db";
import { CreditCard, Phone, ShoppingBag, Timer, User } from "lucide-react";
import { toast } from "react-toastify";

function ActiveOrders() {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [sortedOrders, setSortedOrders] = useState([]);

  // ================= COMMON STYLE =================
  const commonCss =
    "flex items-center text-xs gap-1.5 text-gray-600 font-semibold";

  // ================= TODAY DATE =================
  const today = new Date().toLocaleDateString("en-GB");

  // ================= CONVERT DATE TIME =================
  const convertDateAndTime = (orderDate, orderTime) => {
    const [day, month, year] = orderDate.split("/");

    return new Date(`${year}-${month}-${day} ${orderTime}`).getTime();
  };

  // ================= SORT ORDERS =================
  useEffect(() => {
    let isMounted = true;
    const fetchAndSortOrders = async () => {
      if (!currentUser?.id) return;
      try {
        const user = await db.localUserData.get(currentUser.id);
        const todayOrders =
          user?.myCurrentOrders?.filter((order) => order.orderDate === today) ||
          [];

        const sorted = [...todayOrders].sort(
          (a, b) =>
            convertDateAndTime(b.orderDate, b.orderTime) -
            convertDateAndTime(a.orderDate, a.orderTime),
        );

        if (isMounted) {
          setSortedOrders(sorted);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAndSortOrders();
    return () => {
      isMounted = false;
    };
  }, [currentUser?.id, today]);

  // ================= ORDER STATUS STYLE =================
  const getOrderStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "preparing":
        return "text-green-600 bg-green-100";

      case "completed":
        return "font-bold text-green-800 bg-white";

      case "rejected":
        return "text-red-600 bg-red-100";

      default:
        return "";
    }
  };

  // ================= VALIDATION =================
  const isOrderAvail = sortedOrders.length > 0;

  if (!isOrderAvail) {
    return (
      <div className="flex flex-col items-center text-gray-400 py-16 text-center">
        <p>
          <ShoppingBag size={150} strokeWidth={1} />
        </p>

        <p className="text-3xl font-semibold">No Orders Yet</p>
      </div>
    );
  }

  // ================= CHANGE ORDER STATUS =================
  const changeOrderStatus = async (actionType, orderId, orderStatus) => {
    try {
      const user = await db.localUserData.get(currentUser.id);

      const allUserData = await db.localUserData.toArray();

      // ================= UPDATE STORE ORDER =================
      const updatedStoreOrders = user.myOrders.map((order) =>
        order.orderId === orderId
          ? {
              ...order,
              orderStatus,
            }
          : order,
      );

      // ================= FIND ORDER =================
      const currentOrder = updatedStoreOrders.find(
        (order) => order.orderId === orderId,
      );

      // ================= FIND CUSTOMER =================
      const customerWhoOrder = allUserData.find(
        (customer) => customer.id === currentOrder.customerId,
      );

      // ================= UPDATE CUSTOMER ORDER =================
      const updatedCustomerOrders = customerWhoOrder?.myOrders?.map((order) =>
        order.orderId === orderId
          ? {
              ...order,
              orderStatus,
            }
          : order,
      );

      // ================= CUSTOMER PROCESS STATUS =================
      if (actionType === "completed" || actionType === "reject") {
        customerWhoOrder.isAnyOrderOnProcess = false;
      }

      // ================= UPDATE DATABASE =================
      await db.localUserData.put({
        ...user,
        myOrders: updatedStoreOrders,
      });

      await db.localUserData.put({
        ...customerWhoOrder,
        myOrders: updatedCustomerOrders,
      });

      // ================= UPDATE REDUX STORE =================
      const updatedUser = await db.localUserData.get(currentUser.id);
      if (updatedUser) {
        dispatch(updateUser(updatedUser));
      }

      toast.success(`Order ${orderStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    }
  };

  // ================= ASSIGN DRIVER =================
  const handleAssignDriver = async () => {
    // Assign driver logic here
  };

  // ================= ACCEPT =================
  const onOrderAccept = async (orderId) => {
    const orderStatus = "preparing";

    await changeOrderStatus("accept", orderId, orderStatus);

    handleAssignDriver(orderId);
  };

  // ================= REJECT =================
  const onOrderReject = async (orderId) => {
    const sureToCancelOrder = confirm("Are you sure to cancel order ?");

    if (!sureToCancelOrder) return;

    const orderStatus = "rejected";

    changeOrderStatus("reject", orderId, orderStatus);
  };

  // ================= COMPLETE =================
  const onOrderComplete = async (orderId) => {
    const orderStatus = "completed";

    changeOrderStatus("completed", orderId, orderStatus);
  };

  return (
    <>
      <div className="space-y-2">
        {/* TODAY ORDERS */}
        <div className="bg-white rounded-xl border font-semibold border border-gray-300 shadow p-3">
          <p className="text-xl">Today Orders</p>

          <p>{sortedOrders.length}</p>
        </div>

        {/* ORDERS */}
        <div
          className="space-y-4 overflow-y-auto pr-2
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-thumb]:bg-gray-400
          [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          {sortedOrders.map((order) => (
            <div
              key={order.orderId}
              className="border border-gray-300 rounded-xl p-4 bg-white shadow-sm"
            >
              {/* HEADER */}
              <div className="flex items-start justify-between border-b pb-3">
                {/* ORDER INFO */}
                <div>
                  <p className="flex gap-2 mb-1 text-gray-600 items-center font-semibold text-xl">
                    <span>Order #{order.orderId.slice(0, 8)}</span>
                  </p>

                  <div className="space-y-0.5">
                    <span className={commonCss}>
                      <Timer size={18} />
                      {order.orderTime}
                    </span>

                    <span className={commonCss}>
                      <Phone size={16} />
                      {order.phone}
                    </span>

                    <span className={commonCss}>
                      <User size={18} />
                      {order.name}
                    </span>
                  </div>
                </div>

                {order.orderStatus !== "rejected" && (
                  <span
                    className={`capitalize px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusStyle(
                      order.orderStatus,
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                )}
              </div>

              {/* ORDER ITEMS */}
              <div className="mt-4 space-y-4">
                {order.items.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border rounded-lg p-3"
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-3">
                      <div className="h-15 w-15 hover:scale-105 duration-150 flex items-center justify-center bg-gray-200/50 border rounded-md overflow-hidden">
                        <img
                          className="h-12 w-12 object-contain"
                          src={product.product_url}
                          alt={product.product_name}
                        />
                      </div>

                      <div>
                        <p className="font-semibold capitalize">
                          {product.product_name}
                        </p>

                        <p className="text-sm font-semibold">
                          ${product.product_selling_price}
                          {" ⨯ "}
                          {product.product_qty}
                          {" = $"}
                          {(
                            product.product_selling_price * product.product_qty
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="text-right">
                      <p className="font-semibold text-lg"></p>
                    </div>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="flex items-center justify-between pt-4">
                <div>
                  <span className={commonCss}>
                    <CreditCard size={18} />
                    {order.paymentMethod}
                  </span>

                  <p className="text-sm text-gray-500">Total Amount</p>

                  <p className="font-bold text-xl">
                    ${order.priceDetails.finalPrice}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {order.orderStatus !== "rejected" ? (
                    <>
                      <button
                        onClick={() => onOrderReject(order.orderId)}
                        className="px-5 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition"
                      >
                        ✘
                      </button>

                      {order.orderStatus !== "preparing" && (
                        <button
                          onClick={() => onOrderAccept(order.orderId)}
                          className="px-5 py-2 rounded-lg bg-green-200 border border-green-400 text-green-600 hover:bg-green-700 hover:text-white transition"
                        >
                          ✔
                        </button>
                      )}
                    </>
                  ) : (
                    <span
                      className={`capitalize px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusStyle(
                        order.orderStatus,
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  )}

                  <button
                    onClick={() => onOrderComplete(order.orderId)}
                    className="px-5 py-2 rounded-lg font-semibold bg-green-100 border border-green-400 text-green-600 hover:bg-green-700 hover:text-white transition"
                  >
                    Complete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ActiveOrders;
