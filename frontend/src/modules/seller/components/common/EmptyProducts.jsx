import React from "react";
import { useNavigate } from "react-router-dom";
import { PackagePlus, Sparkles, ArrowRight } from "lucide-react";

function EmptyProducts({ title, message, onAction, actionText }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-3xl border border-gray-200/80 shadow-xs max-w-2xl mx-auto my-8">
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner border border-emerald-100">
          <PackagePlus size={36} strokeWidth={1.75} />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center border-2 border-white shadow-xs">
          <Sparkles size={14} />
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 tracking-tight">
        {title || "No Products in Catalog Yet"}
      </h3>
      <p className="text-sm text-gray-500 max-w-md mt-2 leading-relaxed">
        {message ||
          "Start building your store inventory by adding your first product with prices, weight, images, and menu visibility."}
      </p>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={onAction || (() => navigate("/addproducts"))}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all duration-150 cursor-pointer"
        >
          <span>{actionText || "+ Add First Product"}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default EmptyProducts;
