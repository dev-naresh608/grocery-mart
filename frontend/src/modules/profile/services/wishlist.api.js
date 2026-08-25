import api from "../../../configs/api";

export const toggleWishlistApi = async (userId, storeId) => {
  const { data } = await api.post("/wishlist/toggle", { userId, storeId });
  return data;
};

export const getWishlistStoresApi = async (userId) => {
  const { data } = await api.get(`/wishlist/${userId}`);
  return data;
};
