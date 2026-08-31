import { config } from "./configs/config.js";

export async function findAddress(userAddress) {
  if (!userAddress || typeof userAddress !== "string" || !userAddress.trim()) {
    return {
      success: false,
      error: "Address text is required for geocoding",
    };
  }

  const apiKey =
    config.services?.openRouterApiKey ||
    process.env.OPEN_ROUTER_SERVICE_API_KEY;

  // 1. Try OpenRouteService if API key is configured
  if (apiKey && apiKey !== "api_key_from_https://openrouteservice.org/dev/") {
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(userAddress.trim())}`,
      );

      if (response.ok) {
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const coordinates = data.features[0].geometry.coordinates;
          return {
            success: true,
            latitude: coordinates[1],
            longitude: coordinates[0],
          };
        }
      }
    } catch {
      // Proceed to fallback
    }
  }

  // 2. Fallback: OpenStreetMap Nominatim
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(userAddress.trim())}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "Novexa-App/1.0",
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return {
          success: true,
          latitude: Number(data[0].lat),
          longitude: Number(data[0].lon),
        };
      }
    }

    return {
      success: false,
      error: "No matching location found for the provided address",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to fetch coordinates for address",
    };
  }
}

export async function reverseGeocode(latitude, longitude) {
  const lat = Number(latitude);
  const lon = Number(longitude);

  if (isNaN(lat) || isNaN(lon)) {
    return {
      success: false,
      error: "Valid latitude and longitude are required",
    };
  }

  const apiKey =
    config.services?.openRouterApiKey ||
    process.env.OPEN_ROUTER_SERVICE_API_KEY;

  // 1. Try OpenRouteService if API key is configured
  if (apiKey && apiKey !== "api_key_from_https://openrouteservice.org/dev/") {
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/reverse?api_key=${apiKey}&point.lat=${lat}&point.lon=${lon}&size=1`,
      );
      if (response.ok) {
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const props = data.features[0].properties;
          return {
            success: true,
            formattedAddress: props.label || props.name || "",
            street: props.street || props.name || "",
            city: props.locality || props.county || props.region || "",
            state: props.region || "",
            pincode: props.postalcode || "",
          };
        }
      }
    } catch {
      // Proceed to fallback
    }
  }

  // 2. Fallback: OpenStreetMap Nominatim
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          "User-Agent": "Novexa-App/1.0",
        },
      },
    );
    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};
      const street =
        addr.road || addr.suburb || addr.neighbourhood || addr.amenity || "";
      const city =
        addr.city || addr.town || addr.village || addr.city_district || addr.state_district || "";
      const state = addr.state || "";
      const pincode = addr.postcode || "";

      return {
        success: true,
        formattedAddress: data.display_name || [street, city, state, pincode].filter(Boolean).join(", "),
        street,
        city,
        state,
        pincode,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to reverse geocode location",
    };
  }

  return {
    success: false,
    error: "Unable to determine address from coordinates",
  };
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
