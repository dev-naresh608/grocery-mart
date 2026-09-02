import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { StoreCard } from "../components";
import { defaultRest } from "@/assets";
import { Store } from "lucide-react";

function CategoryWiseProducts() {
  const storeLisst = useSelector((state) => state.product.storeList);
  const { catName } = useParams();

  const selectedCategoryProduct = (storeLisst || []).filter(
    (r) => r.store_type && catName?.includes(r.store_type),
  );

  if (selectedCategoryProduct.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Store size={120} className="text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-600">
            No Stores Yet
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            There is a no Stores available on this category.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="text-2xl font-semibold">Stores as per category: </p>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-5">
        {selectedCategoryProduct.map((r, i) => {
          return (
            <StoreCard
              key={r._id || r.id || i}
              defaultRest={defaultRest}
              name={r.store_name}
              address={r.store_address}
              id={r._id || r.id}
              storeType={r.store_type}
              is_store_open={r.is_store_open !== false}
            />
          );
        })}
      </div>
    </>
  );
}

export default CategoryWiseProducts;
