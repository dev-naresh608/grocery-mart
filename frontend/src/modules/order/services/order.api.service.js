import api from "@/configs/api";

export const getAllOrdersApi = async (userId, role, options = {}) => {
  let page = 1;
  let limit = 10;
  let search = "";
  let sortBy = "createdAt";
  let sortOrder = "desc";

  if (typeof options === "number" || typeof options === "string") {
    page = options;
    limit = arguments[3] || 10;
    search = arguments[4] || "";
    sortBy = arguments[5] || "createdAt";
    sortOrder = arguments[6] || "desc";
  } else if (typeof options === "object") {
    page = options.page ?? 1;
    limit = options.limit ?? 10;
    search = options.search ?? "";
    sortBy = options.sortBy ?? "createdAt";
    sortOrder = options.sortOrder ?? "desc";
  }

  const queryParams = new URLSearchParams({
    role: role || "customer",
    page,
    limit,
    sortBy,
    sortOrder,
  });

  if (search) queryParams.append("search", search);

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
export const getAllOrdersSvc = async (userId, role, options = {}) => {
  let page = 1;
  let limit = 10;
  let search = "";
  let sortBy = "createdAt";
  let sortOrder = "desc";

  if (typeof options === "number" || typeof options === "string") {
    page = options;
    limit = arguments[3] || 10;
    search = arguments[4] || "";
    sortBy = arguments[5] || "createdAt";
    sortOrder = arguments[6] || "desc";
  } else if (typeof options === "object") {
    page = options.page ?? 1;
    limit = options.limit ?? 10;
    search = options.search ?? "";
    sortBy = options.sortBy ?? "createdAt";
    sortOrder = options.sortOrder ?? "desc";
  }

  const queryParams = new URLSearchParams({
    role: role || "customer",
    page,
    limit,
    sortBy,
    sortOrder,
  });

  if (search) queryParams.append("search", search);

  return await api.get(`/order/${userId}?${queryParams.toString()}`);
};

