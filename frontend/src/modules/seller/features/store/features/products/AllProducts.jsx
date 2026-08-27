import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductBuyCard from "./ProductBuyCard";
import api from "@/configs/api";
import { toast } from "react-toastify";

function AllProducts() {
  const { restId = null } = useParams();
  const [totalProducts, setTotalProducts] = useState([]);
  const productsList = useSelector((state) => state.product.productsList);
  const { isAuthenticated: isLogin } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      if (!restId) {
        if (isMounted) setTotalProducts(productsList || []);
        return;
      }
      try {
        const { data } = await api.get(`/stores/allproducts/${restId}`);
        if (!isMounted) return;
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        setTotalProducts(data.result || []);
      } catch {
        if (isMounted) setTotalProducts([]);
      }
    };
    fetchProduct();
    return () => { isMounted = false; };
  }, [productsList, restId]);

  if (!totalProducts || totalProducts.length === 0)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-16 text-center">
        <h2 className="text-lg font-semibold text-gray-600">
          No Products Yet 📦
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          There is a no products available on this app.
        </p>
      </div>
    );

  return (
    <div
      className={`py-0 min-h-screen ${isLogin ? "" : "px-10 mt-4 mb-10 max-w-7xl mx-auto w-full"}`}
    >
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm font-semibold">
          <li className="inline-flex items-center">
            <Link
              to={isLogin ? "/dashboard" : "/"}
              className="inline-flex items-center text-gray-500 hover:text-green-700 transition-colors"
            >
              Novexa
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="text-gray-400 mx-1.5">/</span>
              <Link
                to="/stores"
                className="text-gray-500 hover:text-green-700 transition-colors"
              >
                Stores
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="text-gray-400 mx-1.5">/</span>
              <span className="text-emerald-700 font-bold underline px-1.5x py-1 rounded-full border border-green-100">
                All Products
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,270px))] gap-5">
        {totalProducts?.map((p, index) => (
          <ProductBuyCard
            name={p.product_name}
            src={p.product_url}
            price={p.product_selling_price}
            id={p._id}
            key={index}
            is_product_in_stock={p.is_product_in_stock}
            is_offer_available={p.is_offer_available}
            offer_price={p.product_offer_price}
          />
        ))}
      </div>
    </div>
  );
}

export default AllProducts;
