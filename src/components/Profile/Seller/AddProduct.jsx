import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import {UserContext} from "../../../contexts/context"
function AddProduct() {
  const { activeTab,setActiveTab } = useContext(UserContext);
  return <h1>Add Products</h1>
}

export default AddProduct;
