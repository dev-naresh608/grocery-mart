import React from "react";
import { IndianRupee, Tag, TrendingUp, Percent, AlertCircle } from "lucide-react";
import { SectionCard, SectionLabel } from "../../../../index";

function ProductPricingCard({
  isEditing,
  formData,
  onChange,
  product,
}) {
  const costPrice = isEditing ? Number(formData.product_cost_price) : Number(product?.product_cost_price);
  const sellingPrice = isEditing ? Number(formData.product_selling_price) : Number(product?.product_selling_price);
  const offerPrice = isEditing ? Number(formData.product_offer_price) : Number(product?.product_offer_price);
  const isOfferAvailable = isEditing ? formData.is_offer_available : product?.is_offer_available;

  // Calculate profit margin
  const profit = sellingPrice - costPrice;
  const profitPercentage = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;

  // Calculate discount if offer is available
  const discount = sellingPrice - offerPrice;
  const discountPercentage = sellingPrice > 0 ? (discount / sellingPrice) * 100 : 0;

  return (
    <SectionCard className="p-6">
      <SectionLabel className="mb-4">Pricing & Revenue</SectionLabel>

      <div className="space-y-4">
        {/* Cost Price */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <IndianRupee size={16} className="text-gray-400" />
            <span>Cost Price</span>
          </div>
          <div className="font-semibold text-sm">
            {isEditing ? (
              <div className="flex items-center border rounded-lg px-2 bg-white max-w-[120px]">
                <span className="text-gray-400 text-xs mr-1">₹</span>
                <input
                  type="number"
                  name="product_cost_price"
                  value={formData.product_cost_price}
                  onChange={onChange}
                  step="0.01"
                  min="0"
                  className="w-full py-1 text-xs outline-none bg-transparent"
                />
              </div>
            ) : (
              <span className="text-gray-800">₹{costPrice.toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* Selling Price */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <IndianRupee size={16} className="text-gray-400" />
            <span>Selling Price</span>
          </div>
          <div className="font-semibold text-sm">
            {isEditing ? (
              <div className="flex items-center border rounded-lg px-2 bg-white max-w-[120px]">
                <span className="text-gray-400 text-xs mr-1">₹</span>
                <input
                  type="number"
                  name="product_selling_price"
                  value={formData.product_selling_price}
                  onChange={onChange}
                  step="0.01"
                  min="0"
                  className="w-full py-1 text-xs outline-none bg-transparent"
                />
              </div>
            ) : (
              <span className="text-green-700">₹{sellingPrice.toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* Offer Available Toggle */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Percent size={16} className="text-gray-400" />
            <span>Offer Available</span>
          </div>
          <div>
            {isEditing ? (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_offer_available"
                  checked={isOfferAvailable}
                  onChange={(e) =>
                    onChange({
                      target: {
                        name: "is_offer_available",
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
                  isOfferAvailable ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                {isOfferAvailable ? "Yes" : "No"}
              </span>
            )}
          </div>
        </div>

        {/* Offer Price */}
        {(isOfferAvailable || isEditing) && (
          <div className={`flex justify-between items-center pb-3 border-b border-gray-100 transition-opacity duration-200 ${!isOfferAvailable && isEditing ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <Tag size={16} className="text-gray-400" />
              <span>Offer Price</span>
            </div>
            <div className="font-semibold text-sm">
              {isEditing ? (
                <div className="flex items-center border rounded-lg px-2 bg-white max-w-[120px]">
                  <span className="text-gray-400 text-xs mr-1">₹</span>
                  <input
                    type="number"
                    name="product_offer_price"
                    value={formData.product_offer_price}
                    onChange={onChange}
                    step="0.01"
                    min="0"
                    disabled={!isOfferAvailable}
                    className="w-full py-1 text-xs outline-none bg-transparent disabled:cursor-not-allowed"
                  />
                </div>
              ) : (
                <span className="text-amber-600">₹{offerPrice.toFixed(2)}</span>
              )}
            </div>
          </div>
        )}

        {/* Dynamic Financial Insights */}
        {!isEditing && (
          <div className="pt-2 space-y-2">
            {/* Profit Margin Info */}
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-green-50/50 border border-green-100">
              <div className="flex items-center gap-1.5 text-green-800 font-medium">
                <TrendingUp size={14} />
                <span>Est. Profit Margin</span>
              </div>
              <span className="font-bold text-green-700">
                ₹{profit.toFixed(2)} ({profitPercentage.toFixed(0)}%)
              </span>
            </div>

            {/* Offer Discount Info */}
            {isOfferAvailable && (
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-amber-50/50 border border-amber-100">
                <div className="flex items-center gap-1.5 text-amber-800 font-medium">
                  <Percent size={14} />
                  <span>Offer Discount</span>
                </div>
                <span className="font-bold text-amber-700">
                  -₹{discount.toFixed(2)} ({discountPercentage.toFixed(0)}% off)
                </span>
              </div>
            )}
          </div>
        )}

        {/* Validation Warnings in Edit Mode */}
        {isEditing && (
          <div className="text-[11px] text-gray-500 space-y-1 bg-gray-50 p-2.5 rounded-xl border">
            <div className="flex items-center gap-1">
              <AlertCircle size={12} className="text-amber-500" />
              <span>Selling Price should exceed Cost Price for profit.</span>
            </div>
            {isOfferAvailable && (
              <div className="flex items-center gap-1">
                <AlertCircle size={12} className="text-amber-500" />
                <span>Offer Price should be less than Selling Price.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </SectionCard>
  );
}

export default ProductPricingCard;
