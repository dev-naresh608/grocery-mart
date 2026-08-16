import React from "react";
import DeliveryAddress from "../address/DeliveryAddress";
import PaymentMethod from "../payment/PaymentMethod";
import PriceDetails from "./PriceDetails";
import CheckoutButton from "../common/CheckoutButton";

/**
 * OrderSummary - Side panel component composing Address, Payment, Pricing and Checkout buttons.
 */
export default function OrderSummary({
  setCurrentUser,
  userId,
  isLogin,
  addressList,
  address,
  setAddress,
  paymentMethod,
  handlePaymentMethod,
  orderPriceDetails,
  onPlaceOrder,
}) {
  return (
    <div className="w-full lg:w-[380px] rounded-2xl border p-5 shadow-sm bg-white">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Order Summary
      </h2>

      <hr className="mb-4" />

      {/* Address Selection Section */}
      <DeliveryAddress
        isLogin={isLogin}
        userId={userId}
        addressList={addressList}
        address={address}
        setAddress={setAddress}
        setCurrentUser={setCurrentUser}
      />

      {/* Payment Method Selector */}
      <PaymentMethod
        paymentMethod={paymentMethod}
        onChange={handlePaymentMethod}
      />

      {/* Price breakdown and Total */}
      <PriceDetails orderPriceDetails={orderPriceDetails} />

      {/* Checkout Action Button */}
      <CheckoutButton
        isLogin={isLogin}
        onPlaceOrder={onPlaceOrder}
      />
    </div>
  );
}
