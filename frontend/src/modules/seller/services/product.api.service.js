import api from "@/configs/api";

export const addProductApi = async (formDataToSend) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const { data } = await api.post(
    "/product/add-product",
    formDataToSend,
    config,
  );
  return data;
};

export const getAllProductsApi = async (userId) => {
  const { data } = await api.get(`/product/allproducts/${userId}`);
  return data;
};

export const getProductByIdApi = async (productId) => {
  const { data } = await api.get(`/product/${productId}`);
  return data;
};

export const updateProductApi = async (productId, storeId, updates) => {
  const { data } = await api.patch(`/product/${productId}`, {
    store_id: storeId,
    updates,
  });
  return data;
};

export const toggleProductMenuStatusApi = async (productId, storeId, showInMenu) => {
  return updateProductApi(productId, storeId, { show_in_menu: showInMenu });
};

export const deleteProductApi = async (productId, storeId) => {
  const { data } = await api.delete(`/product/${productId}`, {
    data: { store_id: storeId },
  });
  return data;
};

export const handleDeleteProductApi = deleteProductApi;

export const getAllStoresApi = async (searchQuery = "") => {
  const url = searchQuery
    ? `/stores?search=${encodeURIComponent(searchQuery)}`
    : "/stores";
  const { data } = await api.get(url);
  return data;
};

export const getStoreProductsApi = async (storeId) => {
  const { data } = await api.get(`/stores/allproducts/${storeId}`);
  return data;
};

export const searchProductsSvc = (products = [], searchValue = "") => {
  if (!products) return [];
  if (!searchValue) return products;
  return products.filter((p) =>
    p.product_name?.toLowerCase().includes(searchValue.toLowerCase().trim())
  );
};
