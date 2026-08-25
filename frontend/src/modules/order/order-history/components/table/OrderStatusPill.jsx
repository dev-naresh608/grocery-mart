import React from "react";
import { orderStatusConfig } from "../../configs";

function OrderStatusPill({ status }) {
  const ORDER_STATUS_CONFIG = orderStatusConfig();
  const cfg = ORDER_STATUS_CONFIG[status];

  return (
    <span
      className={`
        rounded-full border
        px-3 py-1
        text-xs
        font-semibold
        capitalize
        ${cfg?.pillStyle || "bg-gray-100 text-gray-700"}
      `}
    >
      {cfg?.label || status}
    </span>
  );
}

export default OrderStatusPill;
