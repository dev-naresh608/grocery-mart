import React from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useModal, MODAL_TYPES } from "../../../../components";

export default function CheckoutButton({ isLogin, onPlaceOrder, isPlacingOrder }) {
  const { openModal } = useModal();

  if (isLogin) {
    return (
      <button
        type="button"
        disabled={isPlacingOrder}
        className={`w-full mt-6 bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg outline-none select-none ${
          isPlacingOrder
            ? "opacity-75 cursor-not-allowed bg-emerald-800"
            : "active:scale-95 cursor-pointer"
        }`}
        onClick={onPlaceOrder}
      >
        {isPlacingOrder ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            <span>Placing Order...</span>
          </>
        ) : (
          <span>Place Order</span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="flex items-center gap-2 px-3 w-full justify-center active:scale-95 mt-6 bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-xl font-bold transition shadow-md hover:shadow-lg outline-none cursor-pointer"
      onClick={() => openModal(MODAL_TYPES.LOGIN)}
    >
      Login to buy items
      <ArrowRight size={18} />
    </button>
  );
}
