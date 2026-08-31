import { API_BASE_URL } from "../configs/api";

// Get distance
export const getDistance = async (lat1, lon1, lat2, lon2) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/distance?lat1=${lat1}&lon1=${lon1}&lat2=${lat2}&lon2=${lon2}`,
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching distance:", error);
    return null;
  }
};

// Geocode address text to coordinates
export const getAddress = async (userAddress) => {
  if (!userAddress) {
    return {
      error: "Address is required",
    };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/distance/address?userAddress=${encodeURIComponent(userAddress)}`,
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching address:", error);
    return { err: "server is not running" };
  }
};

// Reverse geocode coordinates to human-readable address
export const reverseGeocodeApi = async (latitude, longitude) => {
  if (latitude === undefined || longitude === undefined) {
    return { success: false, error: "Coordinates are required" };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/distance/reverse?lat=${latitude}&lng=${longitude}`,
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return { success: false, error: error.message };
  }
};
