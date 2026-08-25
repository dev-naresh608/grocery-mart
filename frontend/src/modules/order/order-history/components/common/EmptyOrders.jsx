import React from "react";

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="text-lg font-semibold text-gray-600">No Orders Yet 📦</h2>

      <p className="mt-1 text-sm text-gray-500">
        Start shopping to see your orders here
      </p>
    </div>
  );
}

export default EmptyOrders;
