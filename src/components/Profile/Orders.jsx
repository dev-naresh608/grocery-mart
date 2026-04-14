import React, { useContext, useEffect } from "react";
import { CartProductContext, UserContext } from "../../contexts/context";
import { toast, ToastContainer } from "react-toastify";

function Orders() {
  const { currentUser, setActiveTab } = useContext(UserContext);
  const { cartItems, setCartItems } = useContext(CartProductContext);
  const allOrderHistory = currentUser.myOrders;

  useEffect(() => setActiveTab("orders"), []);

  if (!allOrderHistory || allOrderHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-lg font-semibold text-gray-600">
          No Orders Yet 📦
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Start shopping to see your orders here
        </p>
      </div>
    );
  }

  const handleReorder = (order) => {
    setCartItems(order.items);
    toast.success(
      "Items Are Added to Cart, Now You can order from cart successfully",
    );
  };
  return (
    <div
      className="space-y-5 max-h-[90vh] overflow-y-auto 
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      <div className="shadow-md rounded-2xl p-2">
        <p className="text-xl text-gray-600">Total Orders</p>
        <h3 className="text-xl font-semibold text-green-700">
          {currentUser.myOrders?.length === undefined
            ? "0"
            : `${currentUser.myOrders?.length}`}
        </h3>
      </div>

      {allOrderHistory.map((order, index) => (
        <div
          key={index}
          className="bg-white border rounded-2xl shadow-sm p-4 sm:p-5"
        >
          <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-3">
            <div>
              <p className="text-xs text-gray-500">Order ID</p>
              <p className="text-sm font-medium">{order.orderId}</p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500">Status</p>
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                {order.orderStatus}
              </span>
            </div>
          </div>

          {/* ITEMS */}
          <div className="mt-4 space-y-3">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-gray-50 rounded-xl p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14">
                    <img
                      src={item.src}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="text-sm">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500 text-xs">Qty: {item.qty}</p>
                  </div>
                </div>

                <span className="text-sm font-medium">${item.price}</span>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center mt-4 border-t pt-3">
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="font-semibold">${order.priceDetails?.finalPrice}</p>
            </div>

            <button
              onClick={() => handleReorder(order)}
              className="text-sm text-indigo-600 hover:underline"
            >
              Reorder
            </button>
          </div>
        </div>
      ))}
    <ToastContainer autoClose={500} pauseOnHover draggable> </ToastContainer>
    </div>
  );
}

export default Orders;