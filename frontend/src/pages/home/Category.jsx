import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleShowAllCategoryEnable,
  updateCategoriesForScreen,
} from "@/modules/category/store/categorySlice";
import { ArrowRight, Grid } from "lucide-react";

function Category() {
  const dispatch = useDispatch();
  const {
    showCategoriesAsScreen,
    showCatBtnText,
    showAllCategoryEnable,
    categories,
  } = useSelector((state) => state.category);

  useEffect(() => {
    const updateCategories = () => {
      const width = Math.floor(window.innerWidth / 250);
      dispatch(updateCategoriesForScreen(width));
    };

    updateCategories();

    window.addEventListener("resize", updateCategories);
    return () => window.removeEventListener("resize", updateCategories);
  }, [dispatch, showAllCategoryEnable]);

  const cardColors = [
    "bg-red-50",
    "bg-purple-50",
    "bg-orange-50",
    "bg-green-50",
    "bg-yellow-50",
    "bg-teal-50",
    "bg-cyan-50",
    "bg-red-50",
    "bg-blue-50",
    "bg-indigo-50",
  ];

  const iconColors = [
    "bg-red-100 text-red-600",
    "bg-orange-100 text-orange-600",
    "bg-yellow-100 text-yellow-600",
    "bg-green-100 text-green-600",
    "bg-teal-100 text-teal-600",
    "bg-cyan-100 text-cyan-600",
    "bg-blue-100 text-blue-600",
    "bg-indigo-100 text-indigo-600",
    "bg-purple-100 text-purple-600",
    "bg-pink-100 text-pink-600",
  ];

  const handleToggle = () => {
    dispatch(toggleShowAllCategoryEnable());
  };

  return (
    <section className="px-4 sm:px-6 lg:px-10 py-12 max-w-6xl mx-auto font-sans">
      {/* Category Section Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1 rounded-full mb-3 shadow-sm shadow-green-700/5">
            <Grid className="w-3.5 h-3.5" />
            Browse by Category
          </span>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-green-600 hover:text-green-700 hover:underline transition-colors duration-200 cursor-pointer outline-none bg-transparent border-none"
        >
          {showCatBtnText}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {(showCategoriesAsScreen || categories)?.map((product, index) => (
          <Link
            to={`/categories/categoryWiseProducts/${product.catName}`}
            key={index}
            className={`group relative flex flex-col justify-center rounded-3xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 ${
              cardColors[index % cardColors.length]
            }`}
          >
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/30 group-hover:to-white/10 rounded-3xl transition-all duration-300" />

            {/* Icon */}
            <div
              className={`relative w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-4 transition-transform duration-300 group-hover:scale-110 ${
                iconColors[index % iconColors.length]
              }`}
            >
              {product.catIcon}
            </div>

            {/* Category Name */}
            <p className="relative font-semibold text-sm text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
              {product.catName}
            </p>
          </Link>
        ))}
      </div>

      {/* Mobile-only Show All/Less Button */}
      <div className="text-center sm:hidden mt-8">
        <button
          type="button"
          onClick={handleToggle}
          className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-300 hover:border-green-400 hover:bg-green-50 hover:text-green-700 cursor-pointer outline-none shadow-sm"
        >
          {showCatBtnText}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

export default Category;
