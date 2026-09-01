import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleShowAllCategoryEnable,
  updateCategoriesForScreen,
} from "@/modules/category/store/categorySlice";
import { ArrowRight, Grid, ChevronDown, ChevronUp } from "lucide-react";

function Category() {
  const dispatch = useDispatch();
  const {
    showCategoriesAsScreen,
    showCatBtnText,
    showAllCategoryEnable,
    categories,
    screenWidth,
  } = useSelector((state) => state.category);

  useEffect(() => {
    const updateCategories = () => {
      dispatch(updateCategoriesForScreen(window.innerWidth));
    };

    updateCategories();

    window.addEventListener("resize", updateCategories);
    return () => window.removeEventListener("resize", updateCategories);
  }, [dispatch, showAllCategoryEnable]);

  const cardColors = [
    "bg-amber-50/70 hover:bg-amber-50 border-amber-100/80",
    "bg-purple-50/70 hover:bg-purple-50 border-purple-100/80",
    "bg-orange-50/70 hover:bg-orange-50 border-orange-100/80",
    "bg-emerald-50/70 hover:bg-emerald-50 border-emerald-100/80",
    "bg-rose-50/70 hover:bg-rose-50 border-rose-100/80",
    "bg-teal-50/70 hover:bg-teal-50 border-teal-100/80",
    "bg-sky-50/70 hover:bg-sky-50 border-sky-100/80",
    "bg-indigo-50/70 hover:bg-indigo-50 border-indigo-100/80",
  ];

  const iconColors = [
    "bg-amber-100/80 text-amber-700",
    "bg-purple-100/80 text-purple-700",
    "bg-orange-100/80 text-orange-700",
    "bg-emerald-100/80 text-emerald-700",
    "bg-rose-100/80 text-rose-700",
    "bg-teal-100/80 text-teal-700",
    "bg-sky-100/80 text-sky-700",
    "bg-indigo-100/80 text-indigo-700",
  ];

  const handleToggle = () => {
    dispatch(toggleShowAllCategoryEnable());
  };

  const isToggleNeeded =
    categories.length > showCategoriesAsScreen.length || showAllCategoryEnable;

  return (
    <section className="px-4 sm:px-6 lg:px-10 py-10 max-w-7xl mx-auto font-sans">
      {/* Category Section Header */}
      <div className="flex items-end justify-between mb-6 sm:mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full mb-2 border border-emerald-100 shadow-xs">
            <Grid className="w-3.5 h-3.5 text-emerald-600" />
            Explore by Category
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Popular Categories
          </h2>
        </div>

        {/* Desktop / Tablet Show All Button */}
        {isToggleNeeded && (
          <button
            type="button"
            onClick={handleToggle}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors duration-200 cursor-pointer outline-none bg-transparent border-none"
          >
            {showCatBtnText}
            {showAllCategoryEnable ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Responsive Grid of Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-5">
        {(showCategoriesAsScreen || categories)?.map((product, index) => (
          <Link
            to={`/stores?category=${encodeURIComponent(product.catName)}`}
            key={index}
            className={`group relative flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 border cursor-pointer ${
              cardColors[index % cardColors.length]
            }`}
          >
            {/* Icon Container */}
            <div
              className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-2xs mb-3 transition-transform duration-200 group-hover:scale-110 ${
                iconColors[index % iconColors.length]
              }`}
            >
              {product.catIcon}
            </div>

            {/* Category Name */}
            <p className="font-bold text-xs sm:text-sm text-gray-800 group-hover:text-emerald-800 transition-colors duration-200 line-clamp-1">
              {product.catName}
            </p>
          </Link>
        ))}
      </div>

      {/* Mobile-only Show All/Less Button */}
      {isToggleNeeded && (
        <div className="text-center sm:hidden mt-6">
          <button
            type="button"
            onClick={handleToggle}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 cursor-pointer outline-none shadow-xs"
          >
            {showCatBtnText}
            {showAllCategoryEnable ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>
      )}
    </section>
  );
}

export default Category;
