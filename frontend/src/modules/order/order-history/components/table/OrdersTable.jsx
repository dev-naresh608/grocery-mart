import React from "react";
import {
  ChevronRight,
  CreditCard,
  DollarSign,
  Activity,
  Clock,
  Package,
  Store,
  CarIcon,
} from "lucide-react";
import { tableHeaderConfig } from "../../configs";
import OrderStatusPill from "./OrderStatusPill";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils";

function OrdersTable({ currentUserRole, allOrders }) {
  const navigate = useNavigate();
  const cfg = tableHeaderConfig(currentUserRole);

  const TABLE_CONFIG = [
    { colLabel: "Order ID", icon: Package },
    {
      colLabel: cfg?.colLabel || "Details",
      icon:
        currentUserRole === "customer"
          ? Store
          : currentUserRole === "seller"
          ? Store
          : CarIcon,
    },
    { colLabel: "Created Date", icon: Clock },
    { colLabel: "Payment", icon: CreditCard },
    { colLabel: "Total", icon: DollarSign },
  ];

  const renderTableHeader = (label) => {
    const Icon = label?.icon;

    return (
      <th key={label.colLabel} className="px-5 py-3.5 whitespace-nowrap text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-gray-400 shrink-0" />}
          <span className="whitespace-nowrap">{label?.colLabel}</span>
        </div>
      </th>
    );
  };

  return (
    <div className="min-h-[300px] overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden border border-gray-200/90 rounded-2xl bg-white shadow-xs">
      <table className="w-full text-left text-sm">
        {/* TABLE HEAD */}
        <thead className="border-b border-gray-200/80 bg-gray-50/80 text-gray-600">
          <tr>
            {TABLE_CONFIG.map((label) => renderTableHeader(label))}
            <th className="px-4 py-3.5"> </th>
          </tr>
        </thead>

        {/* TABLE BODY */}
        <tbody>
          {allOrders.map((o) => {
            const displayAddress = typeof o[cfg?.subKey] === "object"
              ? `${o[cfg?.subKey].street || ""} ${o[cfg?.subKey].city || ""}`
              : o[cfg?.subKey];

            return (
              <tr
                key={o._id}
                onClick={() => navigate(`/orders/${o._id}`)}
                className="cursor-pointer border-b border-gray-100 transition-colors duration-150 hover:bg-gray-50/80"
              >
                {/* ORDER ID */}
                <td className="px-5 py-4 whitespace-nowrap font-medium text-gray-700">
                  #{o._id?.slice(0, 8).toUpperCase()}
                </td>

                {/* CUSTOMER / STORE */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="max-w-[220px]">
                    <p className="font-semibold text-gray-800 truncate">
                      {o[cfg?.fromKey] || "-"}
                    </p>

                    <p className="text-xs text-gray-500 font-medium truncate" title={displayAddress || ""}>
                      {displayAddress || "-"}
                    </p>
                  </div>
                </td>

                {/* DATE / TIME */}
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                  <p>{formatDate(o.createdAt)}</p>
                </td>

                {/* PAYMENT */}
                <td className="px-5 py-4 whitespace-nowrap text-gray-600 font-medium">
                  {o.payment_method === "cashOnDelivery" || o.payment_method === "cash"
                    ? "Cash"
                    : "Online"}
                </td>

                {/* TOTAL */}
                <td className="px-5 py-4 whitespace-nowrap font-bold text-gray-800">
                  ₹{o.price_detail?.finalPrice || o.priceDetails?.finalPrice || 0}
                </td>

                {/* ARROW */}
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <ChevronRight
                    size={16}
                    strokeWidth={2.5}
                    className="text-gray-400"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersTable;
