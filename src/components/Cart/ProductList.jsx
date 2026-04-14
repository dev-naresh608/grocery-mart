import React, { useContext, useEffect, useState } from "react";
import { CartProductContext } from "../../contexts/context";

function ProductList({ compact = false }) {
  const { cartItems, setCartItems } = useContext(CartProductContext);
  const [totalCartItem, setTotalCartItem] = useState([]);

  useEffect(() => {
    if (cartItems?.length > 0) {
      setTotalCartItem(cartItems);
    }
  }, [cartItems]);

  function onQtyChange(e) {
    const itemId = e.target.id;
    const itemQty = e.target.value;

    const updatedCart = cartItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, qty: itemQty };
      }
      return item;
    });
    setCartItems(updatedCart);
  }

  function onDeleteItemBtn(productId) {
    const updatedCart = cartItems.filter((p) => p.id !== productId);
    setCartItems(updatedCart);
  }

  return (
    <div
      className="space-y-3 max-h-[68vh] overflow-y-auto 
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-400
  [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      {cartItems.map((product, index) => (
        <div
          key={index}
          className={`flex items-center justify-between border rounded-xl p-3 shadow-sm hover:shadow-md transition ${
            compact ? "gap-2" : "gap-4"
          }`}
        >
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <div
              className={`${compact ? "h-16 w-16" : "h-24 w-24"} flex-shrink-0`}
            >
              <img
                className="w-full h-full object-contain"
                src={product.src}
                alt={product.name}
              />
            </div>

            <div className={`${compact ? "text-xs" : "text-sm"}`}>
              <h3 className="font-semibold capitalize">{product.name}</h3>

              {!compact && <p className="text-gray-500 text-xs">Weight: N/A</p>}

              <div className="mt-1 flex items-center gap-2">
                <span>Qty:</span>
                <select
                  className="border rounded px-1 py-0.5 text-xs bg-white outline-none"
                  defaultValue={product.qty}
                  onChange={(e) => onQtyChange(e)}
                  id={product.id}
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

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <span
              className={`font-semibold ${compact ? "text-sm" : "text-base"}`}
            >
              ${product.price}
            </span>

            <button onClick={() => onDeleteItemBtn(product.id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                className="fill-red-500 hover:fill-red-700"
              >
                <path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
