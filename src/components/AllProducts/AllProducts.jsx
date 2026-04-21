import React, { useContext, useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import ProductBuyCard from "./ProductBuyCard";
import { ProductContext, UserContext } from "../../contexts/context";
import { ToastContainer } from "react-toastify";
function AllProducts() {
  const [totalProducts, setTotalProducts] = useState([]);
  const { productsList } = useContext(ProductContext);
  const { setActiveTab } = useContext(UserContext);
  useEffect(() => setActiveTab("personalinformation"), []);
  useEffect(() => {
    if (productsList?.length > 0) {
      setTotalProducts(productsList.map((p) => p.products));
    }
  }, [productsList]);
  // console.log(totalProducts);

  return (
    <>
      <section className="p-10">
        <p className="w-max rounded-2xl px-3 mb-5 text-xl font-semibold bg-gradient-to-r from-green-500 to-green-200">
          All Products
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
          <ToastContainer
            autoClose={500}
            closeOnClick
            draggable
            position="bottom-right"
          />
          {totalProducts?.map((product) =>
            product?.map((p, index) => (
              <ProductBuyCard
                name={p.name}
                src={p.src}
                price={p.price}
                id={p.id}
                key={index}
              />
            )),
          )}
        </div>
      </section>
    </>
  );
}

export default AllProducts;
