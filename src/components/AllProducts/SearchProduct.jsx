import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductBuyCard from "./ProductBuyCard";
import {ProductContext} from "../../contexts/context";

function SearchProduct() {
  const { productsList } = useContext(ProductContext)
  const { searchValue } = useParams();
  const [totalProducts, setTotalProducts] = useState([]);

  useEffect(() => {
    const filteredProducts = productsList
      .map((product) => product.products)
      .flat()
      .filter((p) =>  p.name.toLowerCase().includes(searchValue.toLowerCase()))
      setTotalProducts(filteredProducts)
  }, [searchValue]);

  return (
    <>
      <section className="p-10">
        <p className="w-max rounded-2xl px-3 mb-5 text-xl font-semibold bg-gradient-to-r from-green-500 to-green-200">
          Products
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
          {totalProducts?.map((p,index) =>
              <ProductBuyCard name={p.name} src ={p.src} price={p.price} id={p.id} key={index} />
          )}
        </div>
      </section>
    </>
  );
}

export default SearchProduct;
