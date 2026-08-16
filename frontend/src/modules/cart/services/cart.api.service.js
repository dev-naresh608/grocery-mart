import api from "@/configs/api";

export const getCartApi = async (userId) => {
  const { data } = await api.get(`/cart/user/${userId}`);
  return data;
};

export const addToCartApi = async (userId, productId, storeId, quantity = 1) => {
  const { data } = await api.post(`/cart/add`, { userId, productId, storeId, quantity });
  return data;
};

export const updateCartQtyApi = async (userId, productId, quantity) => {
  const { data } = await api.patch(`/cart/update`, { userId, productId, quantity });
  return data;
};

export const removeFromCartApi = async (userId, productId) => {
  const { data } = await api.delete(`/cart/remove/${userId}/${productId}`);
  return data;
};

export const clearCartApi = async (userId) => {
  const { data } = await api.delete(`/cart/clear/${userId}`);
  return data;
};

export const getStoreApi = async (storeId) => {
  const { data } = await api.get(`/stores/${storeId}`);
  return data;
};

export const addOrderApi = async (payload) => {
  const { data } = await api.post(`/order`, payload);
  return data;
};
