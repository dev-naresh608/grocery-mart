import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductBuyCard from "./ProductBuyCard";
import api from "@/configs/api";
import { Store, ArrowLeft, ArrowUpRight } from "lucide-react";

function AllProducts() {
  const { restId = null } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [totalProducts, setTotalProducts] = useState([]);
  const [storeInfo, setStoreInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const productsList = useSelector((state) => state.product.productsList);
  const { isAuthenticated: isLogin } = useSelector((state) => state.auth);

  useEffect(() => {
    let isMounted = true;
    const passedState = location.state;

    // 1. If store details were passed from StoreCard navigation, reuse them instantly!
    if (passedState && passedState.store_name) {
      const isClosed = passedState.is_store_open === false;
      if (isMounted) {
        setStoreInfo({
          store_name: passedState.store_name,
          store_address: passedState.store_address,
          store_type: passedState.store_type,
          is_store_open: !isClosed,
        });
      }

      // If store is closed, skip ALL network requests (0 API calls!)
      if (isClosed) {
        if (isMounted) {
          setTotalProducts([]);
          setIsLoading(false);
        }
        return;
      }
    }

    const fetchProductAndStore = async () => {
      if (!restId) {
        if (isMounted) {
          setTotalProducts(productsList || []);
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);

        // 2. Only fetch store details if NOT already passed in location.state (e.g. direct URL / browser refresh)
        if (!passedState || !passedState.store_name) {
          const storeRes = await api.get(`/stores/${restId}`);
          if (!isMounted) return;

          const currentStore = storeRes.data?.store || null;
          setStoreInfo(currentStore);

          if (currentStore && currentStore.is_store_open === false) {
            setTotalProducts([]);
            setIsLoading(false);
            return;
          }
        }

        // 3. Exactly 1 API call for store menu products!
        const productsRes = await api.get(`/stores/allproducts/${restId}`);
        if (!isMounted) return;

        if (productsRes.data?.success) {
          setTotalProducts(productsRes.data.result || []);
        } else {
          setTotalProducts([]);
        }
      } catch {
        if (isMounted) setTotalProducts([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProductAndStore();
    return () => {
      isMounted = false;
    };
  }, [productsList, restId, location.state]);

  const isStoreOpen = storeInfo ? storeInfo.is_store_open !== false : true;

  return (
    <div
      className={`py-0 min-h-screen ${
        isLogin ? "" : "px-4 sm:px-10 mt-4 mb-10 max-w-7xl mx-auto w-full"
      }`}
    >
      {/* Breadcrumbs */}
      <nav className="flex mb-5" aria-label="Breadcrumb">
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
          {storeInfo?.store_name && (
            <li>
              <div className="flex items-center">
                <span className="text-gray-400 mx-1.5">/</span>
                <span className="text-gray-600 font-medium">
                  {storeInfo.store_name}
                </span>
              </div>
            </li>
          )}
          <li aria-current="page">
            <div className="flex items-center">
              <span className="text-gray-400 mx-1.5">/</span>
              <span className="text-emerald-700 font-bold underline px-2 py-0.5 rounded-full border border-green-100">
                Menu
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Loading Progress Bar */}
      {isLoading && (
        <div className="w-full bg-emerald-50 h-1.5 overflow-hidden rounded-full mb-6 border border-emerald-100/50">
          <div className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600 rounded-full animate-indeterminate"></div>
        </div>
      )}

      {/* LOADING SKELETONS GRID */}
      {isLoading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,270px))] gap-5">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white border rounded-2xl shadow-md p-2 space-y-2 animate-pulse"
            >
              <div className="w-full h-36 bg-gray-200 rounded-2xl"></div>
              <div className="px-2 my-2 space-y-1.5">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                <div className="flex items-center justify-between mt-2 pt-1">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                  <div className="h-7 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !isStoreOpen ? (
        /* CLOSED STORE VIEW: Prevents browsing and avoids unnecessary product loading */
        <div className="bg-white rounded-3xl p-8 sm:p-14 text-center border border-gray-200/90 shadow-xs max-w-2xl mx-auto my-8">
          <div className="w-20 h-20 bg-amber-50 text-amber-600 border border-amber-200/80 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xs">
            <Store size={38} strokeWidth={1.8} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 mb-3 uppercase tracking-wider">
            Closed Currently
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {storeInfo?.store_name || "This Store"} is Currently Closed
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
            The seller has temporarily paused store operations and is not accepting new orders at this time. Menu items are unavailable until the store re-opens.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/stores")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <ArrowLeft size={16} />
              Browse Other Active Stores
            </button>
          </div>
        </div>
      ) : !totalProducts || totalProducts.length === 0 ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3 text-gray-400">
            <Store size={30} />
          </div>
          <h2 className="text-lg font-bold text-gray-700">
            No Menu Items Available
          </h2>
          <p className="text-sm text-gray-500 mt-1 max-w-sm">
            There are no products listed in this store menu right now.
          </p>
          <button
            type="button"
            onClick={() => navigate("/stores")}
            className="mt-5 text-sm font-semibold text-emerald-700 hover:underline cursor-pointer border-none bg-transparent"
          >
            ← Back to Stores
          </button>
        </div>
      ) : (
        /* ACTIVE STORE PRODUCTS GRID */
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,270px))] gap-5">
          {totalProducts?.map((p, index) => (
            <ProductBuyCard
              name={p.product_name}
              src={p.product_url}
              price={p.product_selling_price}
              id={p._id}
              key={p._id || index}
              is_product_in_stock={p.is_product_in_stock}
              is_offer_available={p.is_offer_available}
              offer_price={p.product_offer_price}
              is_store_open={isStoreOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllProducts;
