import React, { useState } from "react";
import { OrderHistoryContext } from "./context";

function OrderPriceContextProvider({ children }) {
  const [allOrderHistory, setAllOrderHistory] = useState([]);

  return (
    <OrderHistoryContext.Provider
      value={{ allOrderHistory, setAllOrderHistory }}
    >
      {children}
    </OrderHistoryContext.Provider>
  );
}

export default OrderPriceContextProvider;
