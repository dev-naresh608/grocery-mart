import React from "react";
import { Store, ChevronDown, MapPin } from "lucide-react";

export default function SellerFields({ formData, onChange, categories }) {
  return (
    <div className="space-y-4">
      {/* STORE NAME */}
      <div>
        <p className="text-[#989da4] text-sm font-semibold">Store Name</p>

        <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
          <Store className="text-gray-400" size={20} />

          <input
            required
            type="text"
            name="store_name"
            value={formData.store_name}
            placeholder="Enter store name..."
            onChange={onChange}
            className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 text-sm"
          />
        </div>
      </div>

      {/* STORE CATEGORY */}
      <div>
        <p className="text-[#989da4] text-sm font-semibold">Store Category</p>

        <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
          <ChevronDown className="text-gray-400" size={20} />

          <select
            name="store_type"
            value={formData.store_type}
            onChange={onChange}
            required
            className="w-full bg-transparent outline-none text-gray-600 text-sm"
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* STORE ADDRESS */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <MapPin size={15} className="text-gray-400" />
          <p className="text-[#989da4] text-sm font-semibold">Store Address</p>
        </div>

        <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-3">
          <textarea
            required
            name="store_address"
            value={formData.store_address}
            placeholder="Enter store address (e.g. Shop 12, Main Market, Indiranagar, Bengaluru)..."
            onChange={onChange}
            rows={3}
            className="w-full resize-none bg-transparent outline-none text-gray-600 placeholder:text-gray-400 text-sm"
          />
        </div>
      </div>
    </div>
  );
}