import React from "react";
import { Scale, Ruler, CheckCircle, Edit3 } from "lucide-react";
import { SectionCard, SectionLabel } from "@/components/common";

function ProductSpecsCard({
  isEditing,
  formData,
  onChange,
  product,
}) {
  const weight = isEditing ? formData.product_weight : product?.product_weight;
  const weightType = isEditing ? formData.product_weight_type : product?.product_weight_type;
  const isInStock = isEditing ? formData.is_product_in_stock : product?.is_product_in_stock;

  return (
    <SectionCard className="p-6">
      <SectionLabel className="mb-4">Specifications & Stock</SectionLabel>

      <div className="space-y-4">
        {/* Product Name */}
        {isEditing && (
          <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
            <label className="text-gray-500 text-xs font-semibold">Product Name</label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={onChange}
              required
              className="border rounded-lg px-3 py-1.5 text-xs outline-none bg-white w-full font-medium"
            />
          </div>
        )}

        {/* Weight */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Scale size={16} className="text-gray-400" />
            <span>Weight</span>
          </div>
          <div className="font-semibold text-sm">
            {isEditing ? (
              <input
                type="number"
                name="product_weight"
                value={formData.product_weight}
                onChange={onChange}
                className="border rounded-lg px-2 py-1 text-xs outline-none bg-white max-w-[100px]"
              />
            ) : (
              <span className="text-gray-800">{weight || "N/A"}</span>
            )}
          </div>
        </div>

        {/* Unit of Measure (UOM) */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Ruler size={16} className="text-gray-400" />
            <span>UOM</span>
          </div>
          <div className="font-semibold text-sm">
            {isEditing ? (
              <select
                name="product_weight_type"
                value={formData.product_weight_type}
                onChange={onChange}
                className="border rounded-lg px-2 py-1 text-xs outline-none bg-white w-[100px]"
              >
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="ltr">ltr</option>
                <option value="pcs">pcs</option>
                <option value="none">none</option>
              </select>
            ) : (
              <span className="text-gray-800 uppercase">{weightType || "none"}</span>
            )}
          </div>
        </div>

        {/* Stock Status Toggle */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <CheckCircle size={16} className="text-gray-400" />
            <span>In Stock</span>
          </div>
          <div>
            {isEditing ? (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_product_in_stock"
                  checked={isInStock}
                  onChange={(e) =>
                    onChange({
                      target: {
                        name: "is_product_in_stock",
                        value: e.target.checked,
                      },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-700"></div>
              </label>
            ) : (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  isInStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {isInStock ? "In Stock" : "Out of Stock"}
              </span>
            )}
          </div>
        </div>

        {/* Show in Menu Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold">
              <span>Show in Store Menu</span>
            </div>
            <span className="text-[11px] text-gray-400">
              Control if visible on buyer storefront
            </span>
          </div>
          <div>
            {isEditing ? (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="show_in_menu"
                  checked={formData.show_in_menu !== false}
                  onChange={(e) =>
                    onChange({
                      target: {
                        name: "show_in_menu",
                        value: e.target.checked,
                      },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            ) : (
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  product?.show_in_menu !== false
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
                }`}
              >
                {product?.show_in_menu !== false ? "Visible in Menu" : "Hidden"}
              </span>
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

export default ProductSpecsCard;
