import api from "../../../configs/api";

export const getAllProductsApi = async (userId) => {
  try {
    const { data } = await api.get(
      `/product/allproducts/${userId}`,
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

// ================ HANDLE STOCK CHANGE ==================
export const handleProductStockChangeApi = async (
  product_id,
  is_product_in_stock,
  userId,
) => {
  const updates = {
    is_product_in_stock: !is_product_in_stock,
  };
  const { data } = await api.patch(
    `/product/${product_id}`,
    {
      store_id: userId,
      product_id,
      updates,
    },
  );
  return data;
};

// ================ HANDLE OFFER CHANGE ==================
export const handleProductOfferChangeApi = async (
  product_id,
  is_offer_available,
  userId,
) => {
  const updates = {
    is_offer_available: !is_offer_available,
  };
  const { data } = await api.patch(
    `/product/${product_id}`,
    {
      store_id: userId,
      updates,
    },
  );
  return data;
};

// ================= DELETE PRODUCT =======================
export const handleDeleteProductApi = async (
  product_id,
  currentUser,
  setCurrentUser,
) => {
  const { data } = await api.delete(
    `/product/${product_id}`,
    { data: { store_id: currentUser._id } },
  );

  const newUpdatedProductList = currentUser?.productList?.filter(
    (p) => p._id !== data.result,
  ) || [];
  if (typeof setCurrentUser === "function") {
    setCurrentUser({
      ...currentUser,
      productList: newUpdatedProductList,
    });
  }
};

export const getProductByIdApi = async (productId) => {
  try {
    const { data } = await api.get(
      `/product/${productId}`,
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateProductApi = async (productId, storeId, updates) => {
  try {
    const { data } = await api.patch(
      `/product/${productId}`,
      {
        store_id: storeId,
        updates,
      },
    );
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
