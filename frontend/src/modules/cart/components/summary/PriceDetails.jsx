import React from "react";


export default function PriceDetails({ orderPriceDetails }) {
  const { subTotal = 0, taxPrice = 0, finalPrice = 0, deliveryCharge = 0 } = orderPriceDetails || {};

  return (
    <div className="mt-4 border-t pt-4">
      {/* Price breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium">₹{Number(subTotal).toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Shipping Fee</span>
          {deliveryCharge === 0 ? (
            <span className="text-green-500 font-semibold">Free</span>
          ) : (
            <span className="font-medium">₹{Number(deliveryCharge).toFixed(2)}</span>
          )}
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tax (2%)</span>
          <span className="font-medium">₹{Number(taxPrice).toFixed(2)}</span>
        </div>
      </div>

      {/* Total amount */}
      <div className="flex justify-between items-center mt-5 text-base font-bold text-gray-800 border-t pt-3">
        <span>Total</span>
        <span>₹{Number(finalPrice).toFixed(2)}</span>
      </div>
    </div>
  );
}
