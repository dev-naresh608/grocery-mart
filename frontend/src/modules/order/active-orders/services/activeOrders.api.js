import api from "@/configs/api";

export const getActiveOrdersApi = async (userId, role) => {
  const { data } = await api.get(`/active-orders/${userId}?role=${role}`);
  return data;
};

export const updateOrderStatusApi = async (orderId, order_status) => {
  const { data } = await api.patch(`/active-orders/${orderId}/status`, {
    order_status,
  });
  return data;
};

export const getAvailableDriverRequestsApi = async (driverId) => {
  const { data } = await api.get(`/active-orders/driver-requests/${driverId}`);
  return data;
};

export const driverAcceptOrderApi = async (orderId, driverId) => {
  const { data } = await api.post(`/active-orders/${orderId}/driver-accept`, {
    driverId,
  });
  return data;
};

export const driverRejectOrderApi = async (orderId, driverId) => {
  const { data } = await api.post(`/active-orders/${orderId}/driver-reject`, {
    driverId,
  });
  return data;
};

export const retryDriverAllocationApi = async (orderId) => {
  const { data } = await api.post(`/active-orders/${orderId}/retry-driver`);
  return data;
};
