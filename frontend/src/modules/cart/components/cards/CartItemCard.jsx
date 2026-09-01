import React from "react";

export default function CartItemCard({ product, onQtyChange, onDelete }) {
  const isOfferActive =
    product.is_offer_available === true &&
    Number(product.product_offer_price) > 0;

  const unitPrice = isOfferActive
    ? Number(product.product_offer_price)
    : Number(product.product_selling_price || 0);

  const subtotal = (unitPrice * (Number(product.product_qty) || 1)).toFixed(2);

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr] px-2 pb-3 border-b border-gray-100 last:border-0 pt-3 items-center">
      {/* Product Details Column */}
      <div className="flex items-center gap-2">
        <div className="group h-20 w-20 flex items-center justify-center rounded-2xl border bg-gray-100/60 overflow-hidden shrink-0">
          <img
            className="group-hover:scale-105 duration-150 w-14 h-14 object-contain"
            src={product.product_url}
            alt={product.product_name}
          />
        </div>
        <div className="text-sm px-2 min-w-0">
          <h3 className="font-semibold capitalize text-gray-800 truncate">
            {product.product_name}
          </h3>
          <p className="text-gray-500 text-xs">
            Weight: {product.product_weight}
            <span className="text-[10px]">
              {product.product_weight_type === "none"
                ? " N/A"
                : ` ${product.product_weight_type}`}
            </span>
          </p>

          {/* Unit Price with Offer comparison */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs font-bold text-gray-900">
              ₹{unitPrice}
            </span>
            {isOfferActive && product.product_selling_price && (
              <del className="text-[11px] text-gray-400">
                ₹{product.product_selling_price}
              </del>
            )}
          </div>

          <div className="mt-1 font-semibold text-gray-500 flex items-center gap-1">
            <span className="text-xs">Qty:</span>
            <select
              className="border rounded px-1 py-0.5 text-xs bg-white outline-none focus:border-indigo-500 cursor-pointer"
              value={product.product_qty}
              onChange={onQtyChange}
              id={product._id}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Subtotal Column */}
      <div className="flex items-center">
        <span className="font-semibold text-gray-800 text-sm">
          ₹{subtotal}
        </span>
      </div>

      {/* Action Column */}
      <div className="flex items-center">
        <button
          onClick={() => onDelete(product._id)}
          className="text-red-500 hover:text-red-700 transition duration-150 p-1 rounded hover:bg-red-50 cursor-pointer"
          aria-label={`Remove ${product.product_name} from cart`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="22px"
            viewBox="0 -960 960 960"
            width="22px"
            className="fill-current"
          >
            <path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
