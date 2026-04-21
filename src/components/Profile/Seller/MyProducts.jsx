import React, { useContext } from "react";
import { UserContext } from "../../../contexts/context";
import { useNavigate } from "react-router-dom";

function MyProducts() {
  const navigate = useNavigate();
  const { cartItems, currentUser, activeTab, setActiveTab } =
    useContext(UserContext);
  if (
    currentUser?.MyProducts?.length === 0 ||
    !currentUser.hasOwnProperty("myProducts")
  ) {
    return (
      <section className="flex flex-col items-center justify-center text-center py-16">
        <h2 className="text-lg font-semibold text-gray-600">Add Products</h2>
        <button
          onClick={() => navigate("/seller/addproducts")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Continue to Add Products
        </button>
      </section>
    );
  }

  return (
    <>
      <h1>Selller products</h1>
      <h2 className="text-lg font-semibold text-gray-600">Add Products</h2>
      <button
        onClick={() => navigate("/seller/addproducts")}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
      ></button>
    </>
  );
}

export default MyProducts;
