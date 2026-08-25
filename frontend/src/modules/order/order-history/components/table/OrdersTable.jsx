import React from "react";
import {
  ChevronRight,
  CreditCard,
  DollarSign,
  Dot,
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
    { colLabel: "Status", icon: Dot },
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
    <div className="min-h-[300px] overflow-hidden border rounded-lg bg-white">
      <table className="w-full text-left text-sm">
        {/* TABLE HEAD */}
        <thead className="border-b bg-gray-50 text-gray-500">
          <tr>
            {TABLE_CONFIG.map((label) => renderTableHeader(label))}
            <th> </th>
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
                className="cursor-pointer border-b transition-colors duration-150 hover:bg-gray-100/70"
              >
                {/* ORDER ID */}
                <td className="p-4 font-medium text-gray-600">
                  #{o._id?.slice(0, 8).toUpperCase()}
                </td>

                {/* CUSTOMER / STORE */}
                <td className="p-4">
                  <div>
                    <p className="font-medium text-gray-700">
                      {o[cfg?.fromKey] || "-"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {displayAddress || "-"}
                    </p>
                  </div>
                </td>

                {/* DATE / TIME */}
                <td className="p-4 text-sm text-gray-600">
                  <p>{formatDate(o.createdAt)}</p>
                </td>

                {/* PAYMENT */}
                <td className="p-4 text-gray-600">
                  {o.payment_method === "cashOnDelivery" || o.payment_method === "cash"
                    ? "Cash"
                    : "Online"}
                </td>

                {/* TOTAL */}
                <td className="p-4 font-semibold text-gray-700">
                  ₹{o.price_detail?.finalPrice || o.priceDetails?.finalPrice || 0}
                </td>

                {/* STATUS */}
                <td className="p-4">
                  <OrderStatusPill status={o.order_status} />
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersTable;
