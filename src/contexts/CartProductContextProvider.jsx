import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import CartProductContext from "./cartProductContext";
import banana from "../assets/products/banana.png";
import apple from "../assets/products/apple.png";

function CartProductContextProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartLength, setCartLength] = useState(0);

  return (
    <CartProductContext.Provider value={{ cartItems, setCartItems, cartLength, setCartLength}}>
      {children}
    </CartProductContext.Provider>
  );
}

export default CartProductContextProvider;
