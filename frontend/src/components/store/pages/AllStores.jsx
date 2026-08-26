import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { defaultRest } from "@/assets";
import { EmptyStore, StoreCard } from "../..";
import api from "../../../configs/api";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Filter, Check, X, Store as StoreIcon } from "lucide-react";

const STORE_CATEGORIES = [
  { catName: "Fruits & Vegetables", catIcon: "🥕" },
  { catName: "Dairy & Bakery", catIcon: "🍞" },
  { catName: "Snacks & Beverages", catIcon: "🥤" },
  { catName: "Rice, Atta & Pulses", catIcon: "🌾" },
  { catName: "Spices & Oils", catIcon: "🌶️" },
  { catName: "Packaged Foods", catIcon: "📦" },
  { catName: "Cleaning & Household", catIcon: "🧹" },
  { catName: "Personal Care", catIcon: "🧴" },
];

function AllStores() {
  const [allStores, setAllStores] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { user: currentUser, isAuthenticated: isLogin } = useSelector(
    (state) => state.auth
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const catParam = searchParams.get("category");

  // Sync category param from URL if present
  useEffect(() => {
    if (catParam) {
      const categoriesFromUrl = catParam
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      setSelectedCategories(categoriesFromUrl);
    }
  }, [catParam]);

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
        setAllStores(data.result || []);
      };
      getStores();
    } catch (error) {
      console.log(error);
    }
  }, [currentUser, searchQuery]);

  const toggleCategory = (catName) => {
    setSelectedCategories((prev) => {
      const exists = prev.includes(catName);
      const updated = exists
        ? prev.filter((c) => c !== catName)
        : [...prev, catName];
      return updated;
    });
  };

  const clearCategories = () => {
    setSelectedCategories([]);
    if (catParam) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("category");
      setSearchParams(newParams);
    }
  };

  // Multi-category store filtering logic
  const filteredStores = allStores.filter((store) => {
    if (selectedCategories.length === 0) return true;

    const sType = (store.store_type || "").toLowerCase();
    const sName = (store.store_name || "").toLowerCase();

    return selectedCategories.some((cat) => {
      const cLower = cat.toLowerCase();

      // Direct substring match on store_type
      if (sType.includes(cLower)) return true;

      // Match individual keywords (e.g. "fruits", "vegetables", "dairy", "bakery", "spices", "oils")
      const keywords = cLower
        .replace(/[&,]/g, " ")
        .split(/\s+/)
        .filter((k) => k.length > 2);

      return keywords.some((kw) => sType.includes(kw) || sName.includes(kw));
    });
  });

  return (
    <div className={`py-2 ${isLogin ? "" : "px-4 sm:px-10 mt-4 mb-10 max-w-7xl mx-auto w-full"}`}>
      {/* Breadcrumb */}
      <nav className="flex mb-3" aria-label="Breadcrumb">
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
              <span className="text-emerald-700 font-bold underline px-1.5 py-0.5 rounded-full border border-green-100">
                Stores
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header & Category Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <StoreIcon className="w-6 h-6 text-green-700" />
              Explore Stores
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Select one or more store categories to filter available stores
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold bg-green-50 text-green-800 px-3 py-1.5 rounded-full border border-green-200/80">
              {filteredStores.length} {filteredStores.length === 1 ? "Store" : "Stores"} Found
            </span>

            {selectedCategories.length > 0 && (
              <button
                type="button"
                onClick={clearCategories}
                className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full border border-red-200 transition-colors cursor-pointer outline-none"
              >
                <X className="w-3.5 h-3.5" />
                Clear Filters ({selectedCategories.length})
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Header Filter */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={clearCategories}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer outline-none ${
              selectedCategories.length === 0
                ? "bg-green-700 text-white shadow-md shadow-green-700/20 ring-2 ring-green-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200/80"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            All Categories
          </button>

          {STORE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategories.includes(cat.catName);
            return (
              <button
                key={cat.catName}
                type="button"
                onClick={() => toggleCategory(cat.catName)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer outline-none select-none ${
                  isSelected
                    ? "bg-green-700 text-white shadow-md shadow-green-700/20 border border-green-700 ring-2 ring-green-600 scale-[1.02]"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-green-400 hover:bg-green-50/50 hover:text-green-800 shadow-sm"
                }`}
              >
                <span className="text-sm">{cat.catIcon}</span>
                <span>{cat.catName}</span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 stroke-[3] text-white ml-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stores List */}
      {filteredStores.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm">
          <EmptyStore searchQuery={searchQuery} />
          {selectedCategories.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              No stores matched the selected categories:{" "}
              <span className="font-semibold text-gray-700">
                {selectedCategories.join(", ")}
              </span>
              . Try selecting different categories or{" "}
              <button
                type="button"
                onClick={clearCategories}
                className="text-green-700 font-bold underline bg-transparent border-none cursor-pointer"
              >
                clear filters
              </button>
              .
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
          {filteredStores.map((r, i) => {
            return (
              <StoreCard
                key={r._id || i}
                defaultRest={defaultRest}
                name={r.store_name}
                address={r.store_address}
                id={r._id}
                storeType={r.store_type}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AllStores;
