import api from "@/configs/api";

export const getAllOrdersApi = async (userId, role, page = 1, limit = 10, search = "") => {
  const { data } = await api.get(
    `/order/${userId}?role=${role}&page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
  );
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
export const getAllOrdersSvc = async (userId, role, page = 1, limit = 10, search = "") => {
  return await api.get(
    `/order/${userId}?role=${role}&page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
  );
};
