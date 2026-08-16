import React from "react";
import { CopyIcon } from "lucide-react";
import { toast } from "react-toastify";
import { SectionCard, SectionLabel } from "../../../../index";

const handleCopyId = (value) => {
  window.navigator.clipboard
    .writeText(value)
    .then(() => toast.success("ID copied to clipboard"))
    .catch((err) => toast.error(err.message));
};

const InfoRow = ({ label, value }) => {
  return (
    <div className="pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
      <p className="text-gray-500 text-xs font-medium mb-1">{label}</p>
      <p className="text-xs font-semibold text-gray-700 flex items-center justify-between gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
        <span className="truncate select-all">{value || "N/A"}</span>
        {value && (
          <button
            onClick={() => handleCopyId(value)}
            className="text-gray-400 hover:text-green-700 p-1 hover:bg-white rounded transition-colors duration-150"
            title="Copy to clipboard"
          >
            <CopyIcon size={12} />
          </button>
        )}
      </p>
    </div>
  );
};

function ProductIdInfo({ product }) {
  if (!product) return null;

  return (
    <SectionCard className="p-6">
      <SectionLabel className="mb-4">System Identifiers</SectionLabel>
      <div className="space-y-3">
        <InfoRow label="Product ID" value={product._id} />
        <InfoRow label="Store ID" value={product.store_id} />
        <InfoRow label="Image Public ID" value={product.product_public_id} />
      </div>
    </SectionCard>
  );
}

export default ProductIdInfo;
