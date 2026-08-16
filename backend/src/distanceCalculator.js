import { config } from "./configs/config.js";

export async function findAddress(userAddress) {
  const apiKey = config.services?.openRouterApiKey || process.env.OPEN_ROUTER_SERVICE_API_KEY;
  try {
    const response = await fetch(
      `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(userAddress)}`,
    );

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const coordinates = data.features[0].geometry.coordinates;

      return {
        latitude: coordinates[1],
        longitude: coordinates[0],
      };
    }

    return {
      error: "No location found",
    };
  } catch (error) {
    return {
      error: "Failed to fetch address",
    };
  }
}

export function getDistanceAndETA(lat1, lon1, lat2, lon2, speedKmH = 25) {
  const toRad = (angle) => (Math.PI / 180) * angle;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  const etaHours = distanceKm / speedKmH;

  return { distanceKm, etaHours };
}
