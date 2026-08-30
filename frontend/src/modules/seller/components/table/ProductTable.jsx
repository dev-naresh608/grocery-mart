import React from "react";
import { Hash, Package, IndianRupee, Weight, Ruler, Scale, CalendarDays, ChevronRight } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { formateDateTime } from "../../../../services/service";

function ProductTable({ allProducts }) {
  // console.log(allProducts);
  const navigate = useNavigate();

  // ======================== TABLE HEADER ====================
  const TABLE_HEADER_CONFIG = [
    { colLabel: "ProductId", icon: Hash },
    { colLabel: "Name", icon: Package },
    { colLabel: "Cost Price", icon: IndianRupee },
    { colLabel: "Selling Price", icon: IndianRupee },
    { colLabel: "Weight", icon: Weight },
    { colLabel: "UOM", icon: Ruler },
    { colLabel: "Created At", icon: CalendarDays },
  ];

  const renderTableHeader = (label) => {
    const Icon = label?.icon;

    return (
      <th key={label.colLabel} className="p-4">
        <div className="flex items-center gap-1">
          <Icon size={17} />
          {label?.colLabel}
        </div>
      </th>
    );
  };

  return (
    <div className="min-h-[300px] overflow-hidden border rounded-lg">
      <table className="w-full text-left text-sm">
        {/* TABLE HEAD */}
        <thead className="border-b bg-gray-50 text-gray-500">
          <tr>
            {TABLE_HEADER_CONFIG.map((label) => renderTableHeader(label))}
            <th> </th>
          </tr>
        </thead>

        {/* TABLE BODY */}
        <tbody>
          {allProducts?.map((p) => (
            <tr
              key={p._id}
              onClick={() => navigate(`/product/${p._id}`)}
              className="cursor-pointer border-b transition-colors duration-150 hover:bg-gray-100/70"
            >
              {/* PRODUCT ID */}
              <td className="p-4 font-medium text-gray-600">
                #{p._id?.slice(0, 8).toUpperCase()}
              </td>

              {/* NAME */}
              <td className="p-4">
                <p className="font-medium text-gray-700">{p.product_name}</p>
              </td>

              {/* SELLING PRICE */}
              <td className="p-4 font-semibold text-gray-700">
                ₹{p.product_selling_price}
              </td>

              {/* CONST PRICE */}
              <td className="p-4 font-semibold text-gray-700">
                ₹{p.product_cost_price}
              </td>

              {/* WEIGHT */}
              <td className="p-4">{p.product_weight}</td>

              {/* WEIGHT TYPE */}
              <td className="p-4">{p.product_weight_type}</td>

              {/* CREATED AT */}
              <td className="p-4 text-sm text-gray-600">
                <p>{formateDateTime(p?.createdAt, "date")}</p>
              </td>

              {/* ARROW */}
              <td className="p-4">
                <ChevronRight
                  size={14}
                  strokeWidth={3}
                  className="text-gray-500"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
