import React, { useState } from "react";
import {
  Package,
  IndianRupee,
  Weight,
  CalendarDays,
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Trash2,
  Edit,
  Copy,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formateDateTime } from "../../../../services/service";
import { toast } from "react-toastify";

function ProductTable({
  allProducts = [],
  selectedIds = [],
  onToggleSelect,
  onSelectAll,
  onToggleMenuStatus,
  onDeleteProduct,
  menuToggleLoadingId,
}) {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState(null);

  const isAllSelected =
    allProducts.length > 0 && selectedIds.length === allProducts.length;
  const isSomeSelected =
    selectedIds.length > 0 && selectedIds.length < allProducts.length;

  const handleCopyId = (e, id) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Product ID copied!", { autoClose: 1500 });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-[300px] overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden border border-gray-200/90 rounded-2xl bg-white shadow-xs">
      <table className="w-full min-w-[850px] text-left text-sm border-collapse">
        {/* ================= TABLE HEAD ================= */}
        <thead className="border-b border-gray-200/90 bg-gray-50/80 text-gray-600 uppercase text-xs tracking-wider">
          <tr>
            {/* Selection Checkbox */}
            <th className="px-4 py-3.5 w-10 text-center whitespace-nowrap">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) input.indeterminate = isSomeSelected;
                }}
                onChange={onSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                title="Select all products"
              />
            </th>

            {/* Product info */}
            <th className="px-4 py-3.5 font-bold whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <Package size={15} className="text-gray-400" />
                <span>Product</span>
              </div>
            </th>

            {/* Product ID */}
            <th className="px-4 py-3.5 font-bold whitespace-nowrap">
              <span>Product ID</span>
            </th>

            {/* Pricing */}
            <th className="px-4 py-3.5 font-bold whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <IndianRupee size={15} className="text-gray-400" />
                <span>Price</span>
              </div>
            </th>

            {/* Stock Status */}
            <th className="px-4 py-3.5 font-bold whitespace-nowrap">
              <span>Stock Status</span>
            </th>

            {/* Weight / UOM */}
            <th className="px-4 py-3.5 font-bold whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <Weight size={15} className="text-gray-400" />
                <span>Weight</span>
              </div>
            </th>

            {/* Show in Menu Toggle Flag */}
            <th className="px-4 py-3.5 font-bold whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <Eye size={15} className="text-gray-400" />
                <span>Show in Menu</span>
              </div>
            </th>

            {/* Created At */}
            <th className="px-4 py-3.5 font-bold whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <CalendarDays size={15} className="text-gray-400" />
                <span>Created Date</span>
              </div>
            </th>

            {/* Actions */}
            <th className="px-4 py-3.5 text-right font-bold whitespace-nowrap">
              <span>Actions</span>
            </th>
          </tr>
        </thead>

        {/* ================= TABLE BODY ================= */}
        <tbody className="divide-y divide-gray-100">
          {allProducts.map((p) => {
            const isSelected = selectedIds.includes(p._id);
            const isVisibleInMenu = p.show_in_menu !== false;
            const isInStock = p.is_product_in_stock !== false;
            const isToggling = menuToggleLoadingId === p._id;

            return (
              <tr
                key={p._id}
                onClick={() => navigate(`/product/${p._id}`)}
                className={`cursor-pointer transition-colors duration-150 group ${
                  isSelected
                    ? "bg-emerald-50/60 hover:bg-emerald-50/90"
                    : "hover:bg-gray-50/80"
                }`}
              >
                {/* Checkbox */}
                <td
                  className="px-4 py-3.5 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(p._id)}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </td>

                {/* Product Info (Thumbnail + Name + Description) */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="w-11 h-11 rounded-xl bg-gray-100 border border-gray-200/80 shrink-0 overflow-hidden flex items-center justify-center p-0.5 group-hover:shadow-xs transition-shadow">
                      {p.product_url ? (
                        <img
                          src={p.product_url}
                          alt={p.product_name}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <Package size={18} className="text-gray-400" />
                      )}
                    </div>

                    {/* Titles */}
                    <div className="max-w-[200px] sm:max-w-[240px]">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-gray-800 text-sm truncate group-hover:text-emerald-700 transition-colors">
                          {p.product_name}
                        </p>
                        {p.is_offer_available === true &&
                          Number(p.product_offer_price) > 0 && (
                            <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-100 text-rose-700 border border-rose-200">
                              <Sparkles size={8} /> Offer
                            </span>
                          )}
                      </div>
                      <p
                        className="text-xs text-gray-600 truncate mt-0.5"
                        title={p.product_description || ""}
                      >
                        {p.product_description || "No description"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Product ID with copy button */}
                <td className="px-4 py-3.5 font-mono text-xs text-gray-600 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={(e) => handleCopyId(e, p._id)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors cursor-pointer"
                    title="Click to copy full Product ID"
                  >
                    <span>#{p._id?.slice(0, 8).toUpperCase()}</span>
                    {copiedId === p._id ? (
                      <Check size={12} className="text-emerald-600" />
                    ) : (
                      <Copy size={11} className="text-gray-400 opacity-60 group-hover:opacity-100" />
                    )}
                  </button>
                </td>

                {/* Pricing */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  {p.is_offer_available === true &&
                  Number(p.product_offer_price) > 0 ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-bold text-gray-900 text-sm">
                        ₹{p.product_offer_price}
                      </span>
                      <del className="text-xs text-gray-400 font-medium">
                        ₹{p.product_selling_price}
                      </del>
                    </div>
                  ) : (
                    <span className="font-bold text-gray-900 text-sm">
                      ₹{p.product_selling_price}
                    </span>
                  )}
                </td>

                {/* Stock Status Badge */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      isInStock
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200/60"
                        : "bg-red-100 text-red-800 border border-red-200/60"
                    }`}
                  >
                    {isInStock ? (
                      <CheckCircle2 size={12} className="text-emerald-600" />
                    ) : (
                      <AlertTriangle size={12} className="text-red-600" />
                    )}
                    {isInStock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>

                {/* Weight & UOM */}
                <td className="px-4 py-3.5 whitespace-nowrap font-medium text-gray-700 text-xs">
                  <span className="px-2 py-1 bg-gray-100 rounded-md">
                    {p.product_weight}{" "}
                    {p.product_weight_type !== "none" ? p.product_weight_type : ""}
                  </span>
                </td>

                {/* SHOW IN MENU TOGGLE SWITCH */}
                <td
                  className="px-4 py-3.5 whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={isToggling}
                        checked={isVisibleInMenu}
                        onChange={() => onToggleMenuStatus(p._id, !isVisibleInMenu)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${
                        isVisibleInMenu
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      {isVisibleInMenu ? (
                        <>
                          <Eye size={11} /> Listed
                        </>
                      ) : (
                        <>
                          <EyeOff size={11} /> Hidden
                        </>
                      )}
                    </span>
                  </div>
                </td>

                {/* Created At */}
                <td className="px-4 py-3.5 text-xs text-gray-600 whitespace-nowrap font-medium">
                  {formateDateTime(p?.createdAt, "date")}
                </td>

                {/* Action buttons */}
                <td
                  className="px-4 py-3.5 text-right whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => navigate(`/product/${p._id}`)}
                      className="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteProduct(p._id, p.product_name)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/product/${p._id}`)}
                      className="p-1 text-gray-300 hover:text-gray-600 cursor-pointer"
                    >
                      <ChevronRight size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
