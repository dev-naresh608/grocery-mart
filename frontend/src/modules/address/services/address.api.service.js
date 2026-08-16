import api from "@/configs/api";

export const handleGetAddressApi = async (userId) => {
  const { data } = await api.get(`/address/all/${userId}`);
  return data;
};

export const handleAddAddressApi = async (userId, payload) => {
  const { data } = await api.post(`/address/add/${userId}`, payload);
  return data;
};

export const handleDeleteAddressApi = async (addressId) => {
  const { data } = await api.delete(`/address/delete/${addressId}`);
  return data;
};

export const handleUpdateAddressApi = async (addressId, payload) => {
  const { data } = await api.patch(`/address/update/${addressId}`, payload);
  return data;
};
