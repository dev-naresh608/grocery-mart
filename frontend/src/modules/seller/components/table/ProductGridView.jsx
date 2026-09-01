import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Trash2,
  Edit,
  TrendingUp,
  Scale,
  Package,
} from "lucide-react";
import { formateDateTime } from "../../../../services/service";

function ProductGridView({
  products = [],
  selectedIds = [],
  onToggleSelect,
  onToggleMenuStatus,
  onDeleteProduct,
  menuToggleLoadingId,
}) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p) => {
        const isSelected = selectedIds.includes(p._id);
        const isVisibleInMenu = p.show_in_menu !== false;
        const isInStock = p.is_product_in_stock !== false;
        const isToggling = menuToggleLoadingId === p._id;

        return (
          <div
            key={p._id}
            className={`group relative flex flex-col justify-between bg-white rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-lg ${
              isSelected
                ? "border-emerald-500 ring-2 ring-emerald-500/20"
                : "border-gray-200/90 hover:border-gray-300"
            }`}
          >
            {/* Top Card Header with Checkbox & Menu Switch */}
            <div className="p-3.5 pb-2">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                {/* Select checkbox */}
                <label
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(p._id)}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    #{p._id?.slice(0, 8).toUpperCase()}
                  </span>
                </label>

                {/* Instant Menu Toggle Switch */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5"
                >
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={isToggling}
                      checked={isVisibleInMenu}
                      onChange={() => onToggleMenuStatus(p._id, !isVisibleInMenu)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                  <span
                    className={`text-[10px] font-bold ${
                      isVisibleInMenu ? "text-emerald-700" : "text-gray-400"
                    }`}
                  >
                    {isVisibleInMenu ? "Menu" : "Off"}
                  </span>
                </div>
              </div>

              {/* Product Image & Badges */}
              <div
                onClick={() => navigate(`/product/${p._id}`)}
                className="relative w-full h-36 bg-gray-50 rounded-xl overflow-hidden cursor-pointer flex items-center justify-center border border-gray-100 group-hover:bg-gray-100/70 transition-colors"
              >
                {p.product_url ? (
                  <img
                    src={p.product_url}
                    alt={p.product_name}
                    className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Package size={32} strokeWidth={1.5} />
                    <span className="text-[10px] mt-1">No Image</span>
                  </div>
                )}

                {/* Stock Status Pill on top of image */}
                <div className="absolute top-2 left-2">
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs backdrop-blur-xs ${
                      isInStock
                        ? "bg-emerald-500/90 text-white"
                        : "bg-red-500/90 text-white"
                    }`}
                  >
                    {isInStock ? (
                      <CheckCircle2 size={10} strokeWidth={3} />
                    ) : (
                      <AlertTriangle size={10} strokeWidth={3} />
                    )}
                    {isInStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Offer Price badge */}
                {p.is_offer_available === true &&
                  Number(p.product_offer_price) > 0 && (
                    <div className="absolute top-2 right-2">
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-xs">
                        <Sparkles size={9} />
                        Offer
                      </span>
                    </div>
                  )}
              </div>

              {/* Product Info */}
              <div
                onClick={() => navigate(`/product/${p._id}`)}
                className="mt-3 cursor-pointer"
              >
                <h3 className="font-bold text-gray-800 text-sm truncate group-hover:text-emerald-700 transition-colors">
                  {p.product_name}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-1 mt-0.5 min-h-[16px]">
                  {p.product_description || "No description provided"}
                </p>
              </div>
            </div>

            {/* Price & Bottom Bar */}
            <div className="p-3.5 pt-2 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
              {/* Pricing section */}
              <div className="flex items-baseline justify-between gap-1 mb-2">
                <div>
                  {p.is_offer_available === true &&
                  Number(p.product_offer_price) > 0 ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-gray-900">
                        ₹{p.product_offer_price}
                      </span>
                      <del className="text-xs text-gray-400 font-medium">
                        ₹{p.product_selling_price}
                      </del>
                    </div>
                  ) : (
                    <span className="text-lg font-black text-gray-900">
                      ₹{p.product_selling_price}
                    </span>
                  )}
                </div>
              </div>

              {/* Meta: Weight & Actions */}
              <div className="flex items-center justify-between text-xs text-gray-600 pt-1.5 border-t border-gray-200/60">
                <div className="flex items-center gap-1 font-medium">
                  <Scale size={12} className="text-gray-400" />
                  <span>
                    {p.product_weight}{" "}
                    {p.product_weight_type !== "none" ? p.product_weight_type : ""}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => navigate(`/product/${p._id}`)}
                    className="p-1 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                    title="View / Edit Product"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteProduct(p._id, p.product_name)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductGridView;
