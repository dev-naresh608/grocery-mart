import React from "react";
import { useSelector } from "react-redux";
import { GradientButton } from "../../../../components";
import {
  Banknote,
  Calendar,
  Clock,
  CreditCard,
  Store,
} from "lucide-react";
import { EmptyOrders } from "../../index";

function CustomerActiveOrders() {
  const { user: currentUser } = useSelector((state) => state.auth);

  if (
    !currentUser?.myCurrentOrders ||
    currentUser.myCurrentOrders.length === 0
  ) {
    return <EmptyOrders />;
  }

  // --------- Style --------------------------------
  const styleFlex =
    "text-xs flex items-center gap-1 text-nowrap bg-gray-100 px-2 py-1 rounded-2xl ";
  const formatDate = (rawDateStr) => {
    if (!rawDateStr) return "";

    // Split the DD/MM/YYYY string safely
    const [day, month, year] = rawDateStr.split("/");
    const dateObj = new Date(year, month - 1, day);

    // Format into: 22 May, 2026
    return dateObj
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .replace(/ (\d{4})$/, ", $1"); // Injects the comma before the year
  };
  return (
    <div className="space-y-3">
      {/* HEADER CARD */}
      <div>
        <GradientButton componentType="text">Current Orders</GradientButton>
      </div>

      {/* ORDERS */}
      {currentUser?.myCurrentOrders?.map((order, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl hover:shadow-md duration-150 transition-all border overflow-hidden"
        >
          {/* TOP */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b p-4">
            <div className="font-medium">
              <div className="text-sm flex flex-wrap gap-3 w-full text-gray-600">
                <span className={styleFlex}>
                  <Store size={17}/>
                  {order.store_name}
                </span>
                <span className={styleFlex}>
                  <Clock size={17}/>
                  {order?.orderTime}
                </span>
                <span className={styleFlex}>
                  <Calendar size={17}/>
                  {formatDate(order?.orderDate)}
                </span>
                <span
                  className={`capitalize w-max px-3 py-1 rounded-full text-sm font-medium ${order.orderStatus === "pending" ? "bg-yellow-100 text-yellow-700" : `${order.orderStatus === "preparing" ? "text-green-600 bg-green-100" : `${order.orderStatus === "completed" ? "font-bold text-green-800 bg-green-200" : "text-red-600 bg-red-100"}`}`}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <p className="text-xs/5 text-gray-500">
                📍{order.store_address}
              </p>
            </div>
          </div>

          {/* ITEMS */}
          <div className="p-4 space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index * 10}
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

                    <p className="text-xs text-gray-400">
                      Weight : {item.product_weight}
                      {`${item.product_weight_type === "none" ? "" : `${item.product_weight_type}`}`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-700">
                    $
                    {item.isOfferAvailable
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
                {order.paymentMethod === "cashOnDelivery" ? (
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
                ${order.priceDetails?.finalPrice}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CustomerActiveOrders;
