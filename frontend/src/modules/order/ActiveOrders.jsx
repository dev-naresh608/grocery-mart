import React from "react";
import { useSelector } from "react-redux";
import {
  CustomerActiveOrders,
  SellerActiveOrders,
  DriverActiveOrders,
} from "./pages";

function ActiveOrders() {
  const { user: currentUser } = useSelector((state) => state.auth);

  if (currentUser?.role === "customer") {
    return <CustomerActiveOrders />;
  } else if (currentUser?.role === "seller") {
    return <SellerActiveOrders />;
  } else {
    return <DriverActiveOrders />;
  }
}

export default ActiveOrders;