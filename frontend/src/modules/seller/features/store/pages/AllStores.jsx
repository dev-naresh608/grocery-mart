import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { defaultRest } from "@/assets";
import { EmptyStore, StoreCard } from "../components";
import api from "@/configs/api";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Filter, Check, X, Store as StoreIcon, Search, ChevronDown } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { user: currentUser, isAuthenticated: isLogin } = useSelector(
    (state) => state.auth
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const catParam = searchParams.get("category");

  const [cardSearch, setCardSearch] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sync category param from URL if present
  useEffect(() => {
    if (catParam) {
      const categoriesFromUrl = catParam
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      setSelectedCategories(categoriesFromUrl);
    } else {
      setSelectedCategories([]);
    }
  }, [catParam]);

  useEffect(() => {
    let isMounted = true;
    const getStores = async () => {
      setIsLoading(true);
      try {
        const url = searchQuery
          ? `/stores?search=${encodeURIComponent(searchQuery)}`
          : "/stores";
        const { data } = await api.get(url);

        if (!isMounted) return;
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        setAllStores(data.result || []);
      } catch (error) {
        if (isMounted) console.log(error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    getStores();
    return () => {
      isMounted = false;
    };
  }, [currentUser, searchQuery]);

  const toggleCategory = (catName) => {
    setSelectedCategories((prev) => {
      const exists = prev.includes(catName);
      const updated = exists
        ? prev.filter((c) => c !== catName)
        : [...prev, catName];

      const newParams = new URLSearchParams(searchParams);
      if (updated.length > 0) {
        newParams.set("category", updated.join(","));
      } else {
        newParams.delete("category");
      }
      setSearchParams(newParams);

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

  // Multi-category and independent card search filtering logic
  const filteredStores = allStores.filter((store) => {
    // 1. Card search filter
    const term = cardSearch.trim().toLowerCase();
    if (term) {
      const sType = (store.store_type || "").toLowerCase();
      const sName = (store.store_name || "").toLowerCase();
      const sAddress = (store.store_address || "").toLowerCase();
      const matchesCardSearch =
        sType.includes(term) || sName.includes(term) || sAddress.includes(term);
      if (!matchesCardSearch) return false;
    }

    // 2. Category filter
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
    <div className={`${isLogin ? "" : "px-4 sm:px-10 mb-10 max-w-7xl mx-auto w-full"}`}>
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

      {/* Header & Category Filter Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100/90 shadow-sm mb-5 space-y-3">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-green-50 text-green-700 border border-green-100 flex items-center justify-center shadow-xs">
                <StoreIcon className="w-4 h-4" />
              </div>
              Explore Stores
            </h1>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">
              Discover local stores & fresh groceries near you
            </p>
          </div>
        </div>

        {/* Search & Category Filter Dropdown - ON THE EXACT SAME LINE */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Inline Search Bar */}
          <div className="flex-1 flex items-center h-10 border border-gray-200/90 bg-gray-50/80 focus-within:bg-white focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/10 rounded-xl px-3 gap-2.5 transition-all duration-200">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={cardSearch}
              onChange={(e) => setCardSearch(e.target.value)}
              placeholder="Search stores by name, location, or product..."
              className="flex-1 bg-transparent text-xs sm:text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400"
            />
            {cardSearch && (
              <button
                type="button"
                onClick={() => setCardSearch("")}
                className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-200/60 transition-colors cursor-pointer border-none bg-transparent outline-none"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown Button */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
              className={`w-full sm:w-auto flex items-center justify-between gap-2.5 h-10 px-3.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer outline-none select-none border ${
                selectedCategories.length > 0
                  ? "bg-green-700 text-white border-green-700 shadow-xs ring-2 ring-green-600/30"
                  : "bg-white text-gray-700 border-gray-200 hover:border-green-500 hover:bg-green-50/40"
              }`}
            >
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {selectedCategories.length === 0
                    ? "All Categories"
                    : selectedCategories.length === 1
                    ? selectedCategories[0]
                    : `${selectedCategories.length} Categories`}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                  isCategoryDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isCategoryDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-30 transition-all duration-200">
                <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-gray-100 mb-1">
                  <span className="text-xs font-bold text-gray-800">Select Categories</span>
                  {selectedCategories.length > 0 && (
                    <button
                      type="button"
                      onClick={clearCategories}
                      className="text-[11px] font-semibold text-red-600 hover:underline cursor-pointer border-none bg-transparent outline-none"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto custom-scrollbar px-1.5 py-1 space-y-0.5">
                  {STORE_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.catName);
                    return (
                      <div
                        key={cat.catName}
                        onClick={() => toggleCategory(cat.catName)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors select-none ${
                          isSelected
                            ? "bg-green-50 text-green-800 font-semibold"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{cat.catIcon}</span>
                          <span>{cat.catName}</span>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-green-700 stroke-[2.5]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading Progress Bar */}
      {isLoading && (
        <div className="w-full bg-emerald-50 h-1.5 overflow-hidden rounded-full mb-6 border border-emerald-100/50">
          <div className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600 rounded-full animate-indeterminate"></div>
        </div>
      )}

      {/* Stores List / Skeletons / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="flex gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-sm animate-pulse"
            >
              {/* Image Skeleton */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-200 shrink-0"></div>

              {/* Content Skeleton */}
              <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-4 bg-gray-200 rounded-md w-3/5"></div>
                    <div className="h-3.5 bg-gray-200 rounded-md w-8"></div>
                  </div>
                  <div className="h-3 bg-emerald-100 rounded-md w-24"></div>
                  <div className="h-3 bg-gray-100 rounded-md w-4/5"></div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="h-3.5 bg-gray-200 rounded-md w-20"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-5"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredStores.length === 0 ? (
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
                is_store_open={r.is_store_open !== false}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AllStores;
