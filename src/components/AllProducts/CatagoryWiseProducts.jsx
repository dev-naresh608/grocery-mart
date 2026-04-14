import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ProductBuyCard } from "../index";
import {ProductContext} from "../../contexts/context";


function CatagoryWiseProducts() {

  const { productsList } = useContext(ProductContext)
  const { catagoryId } = useParams();
  const [selectedCatagoryProduct, setSelectedCatagoryProduct] = useState([]);
  const [catName, setCatName] = useState("");

  let products = [];
  let catagoryName = "";

  useEffect(() => {
    if (productsList?.length > 0) {
      products = productsList.filter((p) => p.id === catagoryId);
      catagoryName = products[0].name;
      setCatName(catagoryName);
      products = products.map((p) => p.products);
      setSelectedCatagoryProduct(products);
    }
  }, [productsList]);

  return (
    <>
      <section className="p-10">
        <p className="w-max rounded-2xl px-3 mb-5 text-xl font-semibold bg-gradient-to-r from-green-500 to-green-200">
          {catName}
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
          {selectedCatagoryProduct?.map((product) =>
            product?.map((p, index) => (
              <ProductBuyCard name={p.name} src ={p.src} price={p.price} id={p.id} key={index} />
            )),
          )}
        </div>
      </section>
    </>
  );

}

export default CatagoryWiseProducts;