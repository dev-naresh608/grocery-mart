import React, { useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import ProductList from "./ProductList";
import {
  CartProductContext,
  AddressContext,
  OrderHistoryContext,
  UserContext,
} from "../../contexts/context";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function Cart({ variant = "full" }) {
  const navigate = useNavigate();
  const isCompact = variant === "compact";

  const { cartItems, setCartItems, cartLength, setCartLength } =
    useContext(CartProductContext);
  const { address } = useContext(AddressContext);

  const { allOrderHistory, setAllOrderHistory } =
    useContext(OrderHistoryContext);

  const { userData, setUserData, currentUser, setCurrentUser, setActiveTab } =
    useContext(UserContext);
  useEffect(() => setActiveTab("cart"), []);

  const [totalPrice, setTotalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [taxPrice, setTaxPrice] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(0);

  let paymentMethod = "cashOnDelivery";

  let currentUserAddress = "";
  const isAddressAvailable = currentUser.hasOwnProperty("myAddress");

  if (isAddressAvailable) {
    currentUserAddress = `${currentUser.myAddress.name} ${currentUser.myAddress.phone} ${currentUser.myAddress.street} ${currentUser.myAddress.city} ${currentUser.myAddress.state}, ${currentUser.myAddress.pincode} `;
  }

  useEffect(() => {
    setCartLength(cartItems?.length);

    if (cartItems?.length > 0) {
      const price = cartItems.reduce((acc, product) => {
        return acc + product.price * product.qty;
      }, 0);

      setTotalPrice(price);
      const tax = (price * 0.02).toFixed(2);
      setTaxPrice(tax);
      setFinalPrice(price + price * 0.02);
    }
  }, [cartItems, setCartItems, setCartLength, cartLength]);

  if (cartItems?.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center text-center py-16">
        <h2 className="text-lg font-semibold text-gray-600">
          Your Cart is Empty 🛒
        </h2>
        <button
          onClick={() => navigate("/allproducts")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Continue Shopping
        </button>
      </section>
    );
  }

  const handlePaymentMethod = (e) => {
    paymentMethod = e.target.value;
  };

  const onPlaceOrder = () => {
    if (!isAddressAvailable) alert("add address");
    else {
      const orderPriceDetails = {
        price: totalPrice,
        shippingPrice: shippingPrice,
        taxPrice: taxPrice,
        finalPrice: finalPrice,
      };

      let updateCurrentUser = {};
      const orderId = uuid();

      if (isAddressAvailable) {
        updateCurrentUser = {
          ...currentUser,
          myOrders: [
            ...currentUser.myOrders,
            {
              items: cartItems,
              priceDetails: orderPriceDetails,
              paymentMethod: paymentMethod,
              orderStatus: "pending",
              orderId: orderId,
            },
          ],
        };
      } else {
        updateCurrentUser = {
          ...currentUser,
          myAddress: address,
          myOrders: [
            {
              items: cartItems,
              priceDetails: orderPriceDetails,
              paymentMethod: paymentMethod,
              orderStatus: "pending",
              orderId: orderId,
            },
          ],
        };
      }

      setCurrentUser(updateCurrentUser);

      const data = userData.filter((u) => u.id !== currentUser.id);
      const newUserData = [...data, updateCurrentUser];

      setUserData(newUserData);
      localStorage.setItem("localUserData", JSON.stringify(newUserData));

      const order = {
        name: address.name,
        phone: address.phone,
        email: currentUser.email,
        items: cartItems,
        priceDetails: orderPriceDetails,
        paymentMethod: paymentMethod,
        orderStatus: "pending",
        orderId: orderId,
      };

      setAllOrderHistory([...allOrderHistory, order]);
      localStorage.setItem(
        "allOrderHistory",
        JSON.stringify([...allOrderHistory, order]),
      );

      toast.success("Order Placed Successfully");
      setActiveTab("orders");
      setTimeout(() => {
        setCartItems([]);
        navigate("/profile/orderhistory");
      }, 1000);
    }
  };

  return (
    <>
      <section
        className={
          isCompact ? "w-full" : "max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 py-6"
        }
      >
        <div
          className={
            isCompact
              ? "bg-white rounded-2xl border shadow-sm p-4"
              : "flex flex-col lg:flex-row gap-6"
          }
        >
          {/* LEFT - CART ITEMS */}
          <div
            className={
              isCompact
                ? ""
                : "flex-1 bg-white rounded-2xl border p-5 shadow-sm"
            }
          >
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <h2
                className={
                  isCompact
                    ? "text-base font-semibold"
                    : "text-xl font-semibold"
                }
              >
                Shopping Cart
              </h2>

              <span className="text-indigo-600 text-sm">
                {cartItems.length} items
              </span>
            </div>

            <div className={isCompact ? "max-h-[300px] overflow-y-auto" : ""}>
              <ProductList compact={isCompact} />
            </div>
          </div>

          {/* FULL MODE SUMMARY */}
          {!isCompact && (
            <div className="w-full lg:w-[380px] bg-white rounded-2xl border p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>

              <hr className="mb-4" />

              {!isAddressAvailable ? (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-center text-sm">
                  <button
                    className="font-medium hover:underline"
                    onClick={() => navigate("/addressform")}
                  >
                    + Add Address
                  </button>
                </div>
              ) : (
                <div className="mb-5">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Delivery Address
                    </p>

                    <button
                      className="text-indigo-500 text-sm font-medium hover:underline"
                      onClick={() => navigate("/addressform")}
                    >
                      Change
                    </button>
                  </div>

                  <div className="mt-2 bg-gray-50 rounded-xl p-3 text-sm text-gray-700 leading-relaxed">
                    {currentUserAddress}
                  </div>
                </div>
              )}

              {/* PAYMENT */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide">
                  Payment Method
                </p>

                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  onChange={handlePaymentMethod}
                >
                  <option value="cashOnDelivery">Cash On Delivery</option>
                  <option value="online">Online</option>
                </select>
              </div>

              <hr className="mb-4" />

              {/* PRICE DETAILS */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Price</span>
                  <span className="font-medium">${totalPrice}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Fee</span>
                  <span className="text-green-500 font-medium">Free</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax (2%)</span>
                  <span className="font-medium">${taxPrice}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-5 text-base font-semibold text-gray-800 border-t pt-3">
                <span>Total</span>
                <span>${finalPrice}</span>
              </div>

              <button
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium transition"
                onClick={onPlaceOrder}
              >
                Place Order
              </button>
            </div>
          )}

          <ToastContainer autoClose={500} pauseOnHover={false} />
          {/* COMPACT MODE */}
          {isCompact && (
            <div className="mt-4 border-t pt-3 text-sm">
              <div className="flex justify-between">
                <span>Total</span>
                <span>${finalPrice}</span>
              </div>

              <button
                className="w-full mt-3 bg-indigo-600 text-white py-2 rounded-lg"
                onClick={() => navigate("/cart")}
              >
                View Full Cart →
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Cart;
