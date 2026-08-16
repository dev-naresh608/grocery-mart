import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductBuyCard from "./ProductBuyCard";

function SearchProduct() {
  const productsList = useSelector((state) => state.product.productsList);
  const { searchValue } = useParams();
  const totalProducts = (productsList || []).filter((p) =>
    p.product_name?.toLowerCase().includes((searchValue || "").toLowerCase().trim()),
  );

  if (totalProducts?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-lg font-semibold text-gray-600">
          No Products Found 📦
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          There is a no products are available.
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="p-10">
        <p className="w-max rounded-2xl px-3 mb-5 text-xl font-semibold bg-gradient-to-r from-green-500 to-green-200">
          Products
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5">
          {totalProducts?.map((p, index) => (
            <ProductBuyCard
              name={p.product_name}
              src={p.product_url}
              price={p.product_selling_price}
              id={p.product_id}
              key={index}
              isProductInStock={p.isProductInStock}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default SearchProduct;
