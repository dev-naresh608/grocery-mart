import React, { useState } from "react";
import { WishlistContext } from "./context";

function WishlistContextProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  return (
    <WishlistContext.Provider value={{ wishlist, setWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistContextProvider;