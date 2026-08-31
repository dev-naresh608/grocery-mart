import api from "@/configs/api";

/**
 * Updates the physical store location.
 * @param {string} storeId
 * @param {{ latitude: number, longitude: number, address?: string }} payload
 */
export const updateStoreLocationApi = async (storeId, payload) => {
  const { data } = await api.patch(`/stores/${storeId}/location`, payload);
  return data;
};
