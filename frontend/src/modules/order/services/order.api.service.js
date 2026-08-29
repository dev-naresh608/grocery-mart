import api from "@/configs/api";

export const getAllOrdersApi = async (
  userId,
  role,
  pageOrOptions = 1,
  limit = 10,
  search = "",
  sortBy = "createdAt",
  sortOrder = "desc"
) => {
  let page = 1;
  let lim = 10;
  let s = "";
  let sBy = "createdAt";
  let sOrder = "desc";

  if (typeof pageOrOptions === "object" && pageOrOptions !== null) {
    page = pageOrOptions.page ?? 1;
    lim = pageOrOptions.limit ?? 10;
    s = pageOrOptions.search ?? "";
    sBy = pageOrOptions.sortBy ?? "createdAt";
    sOrder = pageOrOptions.sortOrder ?? "desc";
  } else {
    page = pageOrOptions || 1;
    lim = limit || 10;
    s = search || "";
    sBy = sortBy || "createdAt";
    sOrder = sortOrder || "desc";
  }

  const queryParams = new URLSearchParams({
    role: role || "customer",
    page: String(page),
    limit: String(lim),
    sortBy: sBy,
    sortOrder: sOrder,
  });

  if (s) queryParams.append("search", s);

  const { data } = await api.get(`/order/${userId}?${queryParams.toString()}`);
  return data;
};

export const getOrderDetailApi = async (orderId) => {
  const { data } = await api.get(`/order/detail/${orderId}`);
  return data;
};

export const createOrderApi = async (orderData) => {
  const { data } = await api.post(`/order`, orderData);
  return data;
};

export const updateOrderStatusApi = async (orderId, status) => {
  const { data } = await api.patch(`/order/detail/${orderId}`, { status });
  return data;
};

export const deleteOrderApi = async (orderId) => {
  const { data } = await api.delete(`/order/detail/${orderId}`);
  return data;
};

// Aliases for compatibility
export const getAllOrdersSvc = async (
  userId,
  role,
  pageOrOptions = 1,
  limit = 10,
  search = "",
  sortBy = "createdAt",
  sortOrder = "desc"
) => {
  let page = 1;
  let lim = 10;
  let s = "";
  let sBy = "createdAt";
  let sOrder = "desc";

  if (typeof pageOrOptions === "object" && pageOrOptions !== null) {
    page = pageOrOptions.page ?? 1;
    lim = pageOrOptions.limit ?? 10;
    s = pageOrOptions.search ?? "";
    sBy = pageOrOptions.sortBy ?? "createdAt";
    sOrder = pageOrOptions.sortOrder ?? "desc";
  } else {
    page = pageOrOptions || 1;
    lim = limit || 10;
    s = search || "";
    sBy = sortBy || "createdAt";
    sOrder = sortOrder || "desc";
  }

  const queryParams = new URLSearchParams({
    role: role || "customer",
    page: String(page),
    limit: String(lim),
    sortBy: sBy,
    sortOrder: sOrder,
  });

  if (s) queryParams.append("search", s);

  return await api.get(`/order/${userId}?${queryParams.toString()}`);
};


