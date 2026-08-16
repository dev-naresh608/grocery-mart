// SEARCH
export const searchOrdersSvc = (allOrders, searchValue) => {
  if (!searchValue?.trim()) {
    return allOrders;
  }

  const search = searchValue.toLowerCase().trim();

  return allOrders.filter((o) => {
    return (
      o._id?.toLowerCase().includes(search) ||
      o.store_name?.toLowerCase().includes(search) ||
      o.name?.toLowerCase().includes(search) ||
      o.store_address?.toLowerCase().includes(search) ||
      o.order_status?.toLowerCase().includes(search) ||
      o.payment_method?.toLowerCase().includes(search) ||
      String(o.price_detail?.finalPrice).includes(search) ||
      ("$" + o.price_detail?.finalPrice).includes(search)
    );
  });
};

// FILTER
export const filterOrderByStatus = (allOrders, status = "all") => {
  if (!allOrders || allOrders.length === 0 || status === "all") {
    return allOrders;
  }

  return allOrders.filter((o) => o.order_status === status);
};

export const filterOrderByPayment = (allOrders, paymentMethod = "all") => {
  if (!allOrders || allOrders.length === 0 || paymentMethod === "all") {
    return allOrders;
  }
  return allOrders.filter((o) => o.payment_method === paymentMethod);
};

export const filterTodaysOrders = (allOrders) => {
  if (!allOrders || allOrders.length === 0) return allOrders;
  const today = new Date().toDateString();
  return allOrders.filter((order) => new Date(order.createdAt).toDateString() === today);
};

// SORT
export const sortOrderByDate = (
  allOrders,
  order = "desc",
) => {
  if (!allOrders || allOrders.length === 0) {
    return allOrders;
  }

  return [...allOrders].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return order === "desc" ? dateB - dateA : dateA - dateB;
  });
};

export const sortOrderByPrice = (allOrders, order = "desc") => {
  if (!allOrders || allOrders.length === 0) {
    return allOrders;
  }

  return [...allOrders].sort((a, b) => {
    const priceA = a.price_detail?.finalPrice || 0;
    const priceB = b.price_detail?.finalPrice || 0;

    return order === "desc" ? priceB - priceA : priceA - priceB;
  });
};
