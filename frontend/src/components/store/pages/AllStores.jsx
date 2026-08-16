import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { defaultRest } from "@/assets";
import { EmptyStore, StoreCard } from "../..";
import api from "../../../configs/api";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

function AllStores() {
  const [AllStores, setAllStores] = useState([]);
  const { user: currentUser, isAuthenticated: isLogin } = useSelector(
    (state) => state.auth
  );
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    try {
      const getStores = async () => {
        const url = searchQuery
          ? `/stores?search=${encodeURIComponent(searchQuery)}`
          : "/stores";
        const { data } = await api.get(url);
        
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        setAllStores(data.result);
      };
      getStores();
    } catch (error) {
      console.log(error);
    }
  }, [currentUser, searchQuery]);

  return (
    <div className={`py-0 ${isLogin ? "" : "px-10 mt-4 mb-10 max-w-7xl mx-auto w-full"}`}>
      <nav className="flex mb-2" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm font-semibold">
          <li className="inline-flex items-center">
            <Link
              to={isLogin ? "/dashboard" : "/"}
              className="inline-flex items-center text-gray-500 hover:text-green-700 transition-colors"
            >
              Novexa
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="text-gray-400 mx-1.5">/</span>
              <span className="text-emerald-700 font-bold underline px-1.5x py-1 rounded-full border border-green-100">
                Stores
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {AllStores.length === 0 ? (
        <EmptyStore searchQuery={searchQuery}/>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
          {AllStores.map((r, i) => {
            return (
              <StoreCard
                key={i}
                defaultRest={defaultRest}
                name={r.store_name}
                address={r.store_address}
                id={r._id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AllStores;
