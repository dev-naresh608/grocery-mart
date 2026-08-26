import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { closeCartDrawer } from "../store/cartSlice";
import { useCart } from "../hooks/useCart";
import {
  ShoppingCart,
  X,
  Trash2,
  MapPin,
  CreditCard,
  ArrowRight,
  ShoppingBasket,
  Plus,
  Minus,
  CheckCircle2,
} from "lucide-react";
import AddressSelector from "./address/AddressSelector";

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCartDrawerOpen = useSelector((state) => state.cart.isCartDrawerOpen);

  const {
    currentUser,
    isLogin,
    address,
    setAddress,
    addressList,
    paymentMethod,
    orderPriceDetails,
    onCartItemQtyChange,
    onCartItemDeleteBtn,
    handleClearCart,
    handlePaymentMethod,
    handlePlaceOrder,
    isCartEmpty,
  } = useCart();

  // Close drawer on ESC press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isCartDrawerOpen) {
        dispatch(closeCartDrawer());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartDrawerOpen, dispatch]);

  if (typeof document === "undefined") return null;

  const handleClose = () => {
    dispatch(closeCartDrawer());
  };

  const handleCheckoutOrder = () => {
    handlePlaceOrder();
    // Close drawer after starting order process
    dispatch(closeCartDrawer());
  };

  const cartItems = currentUser?.myCart || [];
  const itemCount = cartItems.length;

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
        isCartDrawerOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-full sm:w-[450px] md:w-[480px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isCartDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-green-700 text-white flex items-center justify-center shadow-md shadow-green-700/20">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none">Your Cart</h2>
              <p className="text-xs text-gray-500 mt-1">
                {itemCount} {itemCount === 1 ? "item" : "items"} selected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCartEmpty && (
              <button
                type="button"
                onClick={handleClearCart}
                className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-xl border border-red-200/80 transition-colors cursor-pointer outline-none"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer outline-none border-none"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        {isCartEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mb-4">
              <ShoppingBasket className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Your cart is empty</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              Looks like you haven't added anything to your cart yet. Explore stores and add items!
            </p>
            <button
              type="button"
              onClick={() => {
                handleClose();
                navigate("/stores");
              }}
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold text-sm px-6 py-3 rounded-2xl shadow-lg shadow-green-700/20 transition-all cursor-pointer border-none"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Cart Items List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Cart Items ({itemCount})
              </h3>
              <div className="space-y-3">
                {cartItems.map((item, index) => {
                  const finalPrice =
                    item.product_offer_price || item.product_selling_price || 0;
                  const itemSubtotal = (finalPrice * item.product_qty).toFixed(2);

                  return (
                    <div
                      key={item._id || index}
                      className="flex gap-3 bg-gray-50/70 p-3 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors"
                    >
                      <img
                        src={item.product_url}
                        alt={item.product_name}
                        className="w-16 h-16 rounded-xl object-contain bg-white p-1 border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-gray-900 truncate capitalize">
                            {item.product_name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => onCartItemDeleteBtn(item._id)}
                            className="text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer outline-none border-none bg-transparent"
                            aria-label={`Remove ${item.product_name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-lg px-2 py-0.5 text-xs font-semibold text-gray-700">
                            <span>Qty:</span>
                            <select
                              id={item._id}
                              value={item.product_qty}
                              onChange={onCartItemQtyChange}
                              className="bg-transparent outline-none font-bold text-gray-900 cursor-pointer"
                            >
                              {[...Array(10)].map((_, i) => (
                                <option key={i} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-bold text-gray-900">
                              ₹{itemSubtotal}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Address Section */}
            {isLogin && (
              <div className="pt-3 border-t border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-green-700" />
                  Delivery Address
                </h3>
                <AddressSelector
                  addressList={addressList}
                  selectedAddress={address}
                  onSelectAddress={setAddress}
                />
              </div>
            )}

            {/* Payment Method Section */}
            <div className="pt-3 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-green-700" />
                Payment Options
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    paymentMethod === "cashOnDelivery"
                      ? "border-green-600 bg-green-50/60 text-green-800 shadow-sm"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethodDrawer"
                    value="cashOnDelivery"
                    checked={paymentMethod === "cashOnDelivery"}
                    onChange={handlePaymentMethod}
                    className="accent-green-600"
                  />
                  Cash on Delivery
                </label>

                <label
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    paymentMethod === "online"
                      ? "border-green-600 bg-green-50/60 text-green-800 shadow-sm"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethodDrawer"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={handlePaymentMethod}
                    className="accent-green-600"
                  />
                  Online Payment
                </label>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="pt-3 border-t border-gray-100 space-y-2 bg-gray-50/80 p-3.5 rounded-2xl border">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-800">
                  ₹{orderPriceDetails?.subtotal?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>GST & Taxes</span>
                <span className="font-semibold text-gray-800">
                  ₹{orderPriceDetails?.taxPrice?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Delivery Charge</span>
                <span className="font-semibold text-gray-800">
                  ₹{orderPriceDetails?.shippingPrice?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200/80">
                <span>Total Amount</span>
                <span className="text-green-700">
                  ₹{orderPriceDetails?.finalPrice?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Drawer Footer / Place Order CTA */}
        {!isCartEmpty && (
          <div className="p-4 border-t border-gray-100 bg-white shadow-lg">
            <button
              type="button"
              onClick={handleCheckoutOrder}
              className="w-full flex items-center justify-between bg-green-700 hover:bg-green-800 text-white font-bold text-sm py-3.5 px-5 rounded-2xl shadow-lg shadow-green-700/25 transition-all cursor-pointer border-none active:scale-[0.99]"
            >
              <span>Place Order</span>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md font-extrabold">
                  ₹{orderPriceDetails?.finalPrice?.toFixed(2) || "0.00"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
