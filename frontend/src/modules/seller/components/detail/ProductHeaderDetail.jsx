import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  Edit2,
  Save,
  X,
  Package,
  CheckCircle2,
  AlertCircle,
  Percent,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { SectionCard } from "../../../../index";

function ProductHeaderDetail({
  productName,
  isEditing,
  setIsEditing,
  saving,
  onSave,
  onCancel,
  isInStock,
  isOfferAvailable,
  showInMenu,
  onDelete,
}) {
  const navigate = useNavigate();

  return (
    <SectionCard className="p-6">
      <div className="flex flex-col gap-4">
        {/* Back to Products navigation */}
        <div>
          <button
            onClick={() => navigate("/product-list")}
            className="flex items-center gap-1.5 text-green-700 hover:text-green-800 font-semibold transition-colors duration-150"
          >
            <ArrowLeftIcon size={18} strokeWidth={2.5} />
            <span className="text-sm">Back to Products</span>
          </button>
        </div>

        {/* Title, Badges and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Package className="text-green-700" size={24} />
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                {isEditing ? (
                  <span className="text-gray-500">
                    Editing <span className="text-gray-800">{productName || "Product"}</span>
                  </span>
                ) : (
                  productName || "Product Detail"
                )}
              </h1>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 text-xs">
              {/* Menu status badge */}
              {showInMenu !== false ? (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Eye size={12} />
                  Listed in Menu
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                  <EyeOff size={12} />
                  Hidden from Menu
                </span>
              )}

              {isInStock ? (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-green-100 text-green-800">
                  <CheckCircle2 size={12} />
                  In Stock
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-red-100 text-red-800">
                  <AlertCircle size={12} />
                  Out of Stock
                </span>
              )}

              {isOfferAvailable && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800">
                  <Percent size={12} />
                  Active Offer
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isEditing ? (
              <>
                <button
                  onClick={onCancel}
                  disabled={saving}
                  className="flex items-center justify-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-150 w-1/2 sm:w-auto disabled:opacity-50"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="flex items-center justify-center gap-1 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg text-sm font-semibold transition-colors duration-150 w-1/2 sm:w-auto disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-500 border border-blue-300 rounded-lg text-sm font-semibold transition-colors duration-150 w-1/2 sm:w-auto"
                >
                  <Edit2 size={16} />
                  Edit Product
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-red-100 hover:bg-red-200 border border-red-300 text-red-500 rounded-lg text-sm font-semibold transition-colors duration-150 w-1/2 sm:w-auto"
                >
                  <Trash2 size={16} />
                  Delete Product
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

export default ProductHeaderDetail;
