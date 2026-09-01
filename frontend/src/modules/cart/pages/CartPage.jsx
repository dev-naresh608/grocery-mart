import React from "react";
import { useCart } from "../hooks/useCart";
import {
  EmptyCart,
  CartItemCard,
  GoBackButton,
  OrderSummary,
} from "../components";

/**
 * CartPage - Container component orchestrating the cart view layout.
 */
export default function CartPage() {
  const {
    currentUser,
    setCurrentUser,
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

  if (isCartEmpty) {
    return <EmptyCart />;
  }

  return (
    <section className="bg-white rounded-2xl p-3 sm:p-5 shadow-xs">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Left Side - Shopping Cart & Item List */}
        <div className="flex-1 relative rounded-2xl border p-3 sm:p-4">
          <div className="flex justify-between items-end border-b pb-2 mb-3 px-1 sm:px-2 font-semibold">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="text-lg sm:text-2xl text-gray-900 font-bold">Shopping Cart</span>
              <button
                type="button"
                onClick={handleClearCart}
                className="text-xs bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 py-1 px-2.5 rounded-lg border border-red-200 duration-150 cursor-pointer focus:outline-none"
              >
                Clear Cart
              </button>
            </div>
            <span className="text-emerald-700 font-bold text-xs sm:text-sm">
              {currentUser.myCart?.length || 0} items
            </span>
          </div>

          {/* Table Headers */}
          <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-400 font-semibold text-xs uppercase tracking-wider px-2 py-1">
            <span>Product Details</span>
            <span>Subtotal</span>
            <span>Action</span>
          </div>

          {/* Cart Item Cards */}
          <div
            className="space-y-1 overflow-y-auto max-h-[60vh] pr-1
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-gray-50
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {currentUser?.myCart?.map((product, index) => (
              <CartItemCard
                key={product._id || index}
                product={product}
                onQtyChange={onCartItemQtyChange}
                onDelete={onCartItemDeleteBtn}
              />
            ))}
          </div>

          <div className="mt-4 pt-3 border-t">
            <GoBackButton navigation="/stores">Continue Shopping</GoBackButton>
          </div>
        </div>

        {/* Right Side - Order Summary Panel */}
        <OrderSummary
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          userId={currentUser._id}
          isLogin={isLogin}
          addressList={addressList}
          address={address}
          setAddress={setAddress}
          paymentMethod={paymentMethod}
          handlePaymentMethod={handlePaymentMethod}
          orderPriceDetails={orderPriceDetails}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>
    </section>
  );
}
