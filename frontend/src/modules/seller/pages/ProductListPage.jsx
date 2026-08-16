import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { toast } from "react-toastify";

import {
  EmptyProducts,
  getAllProductsApi,
  ProductTable,
  searchProductsSvc,
} from "../index";
import { SectionCard, SearchBar } from "../../../index";

function ProductListPage() {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [isProductsAvail, setIsProductsAvail] = useState(false);
  const [allProducts, setAllProducts] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const sellerId = currentUser?.store_id || currentUser?._id;

  useEffect(() => {
    const fetchAllProducts = async () => {
      if (!sellerId) return;
      const data = await getAllProductsApi(sellerId);
      if (!data || !data.success) {
        setIsProductsAvail(false);
        if (data?.message) toast.error(data.message);
        return;
      }
      setAllProducts(data.result || []);
      dispatch(updateUser({ productList: data.result || [] }));
      if (data.result && data.result.length > 0) {
        setIsProductsAvail(true);
      } else {
        setIsProductsAvail(false);
      }
    };

    fetchAllProducts();
  }, [sellerId, dispatch]);

  const filteredProducts = useMemo(() => {
    return searchProductsSvc(allProducts, searchValue);
  }, [allProducts, searchValue]);

  if (!isProductsAvail) {
    return <EmptyProducts />;
  }

  return (
    <>
      {/* =========== FILTER HEADER============ */}
      <SearchBar
        placeholder="search products..."
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      {/* ================= PRODUCT LIST TABLE ================= */}
      <SectionCard>
        <ProductTable allProducts={filteredProducts} />
      </SectionCard>
    </>
  );
}

export default ProductListPage;
