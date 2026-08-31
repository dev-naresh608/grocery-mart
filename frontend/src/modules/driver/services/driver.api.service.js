import api from "@/configs/api";

/**
 * Updates the authenticated driver's current GPS location.
 * @param {{ latitude: number, longitude: number }} coords
 */
export const updateDriverLocationApi = async ({ latitude, longitude }) => {
  const { data } = await api.patch("/driver/location", {
    latitude: Number(latitude),
    longitude: Number(longitude),
  });
  return data;
};

/**
 * Fetches the authenticated driver's current location and active status.
 */
export const getDriverLocationApi = async () => {
  const { data } = await api.get("/driver/location");
  return data;
};
