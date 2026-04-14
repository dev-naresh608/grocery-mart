import React, { useState } from "react";
import CartProductContext from "./cartProductContext";


function CartProductContextProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  return (
    <CartProductContext.Provider value={{ cartItems, setCartItems}}>
      {children}
    </CartProductContext.Provider>
  );
}

export default CartProductContextProvider;
