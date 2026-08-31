import Seller from "./seller.model.js";
import { findAddress } from "../../distanceCalculator.js";

export const createSellerSvc = async (userId, payload, session) => {
  const {
    phone,
    store_owner_name,
    store_name,
    store_type,
    store_address,
    location,
    coordinates,
    longitude,
    latitude,
  } = payload;

  let storeLocation = location;
  if (!storeLocation && Array.isArray(coordinates) && coordinates.length === 2) {
    storeLocation = {
      type: "Point",
      coordinates: [Number(coordinates[0]), Number(coordinates[1])],
    };
  } else if (
    !storeLocation &&
    longitude !== undefined &&
    latitude !== undefined &&
    longitude !== null &&
    latitude !== null &&
    !isNaN(Number(longitude)) &&
    !isNaN(Number(latitude))
  ) {
    storeLocation = {
      type: "Point",
      coordinates: [Number(longitude), Number(latitude)],
    };
  }

  // Attempt backend geocoding if store_address is text and coordinates were not explicitly passed
  if (!storeLocation && typeof store_address === "string" && store_address.trim()) {
    try {
      const geoResult = await findAddress(store_address);
      if (geoResult && geoResult.success && geoResult.longitude !== undefined && geoResult.latitude !== undefined) {
        storeLocation = {
          type: "Point",
          coordinates: [Number(geoResult.longitude), Number(geoResult.latitude)],
        };
      }
    } catch {
      // Graceful fallback during initial signup: allow registration and let seller set location in dashboard
    }
  }

  const sellerDoc = {
    user_id: userId,
    phone: phone,
    store_name: store_name,
    store_owner_name: store_owner_name,
    store_type: store_type,
    store_address: store_address,
  };

  if (storeLocation) {
    sellerDoc.location = storeLocation;
  }

  const sellers = await Seller.create([sellerDoc], { session });
  return sellers[0];
};

export const updateSellerLocationSvc = async (sellerId, coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    throw new Error("Coordinates must be an array of [longitude, latitude]");
  }

  return await Seller.findByIdAndUpdate(
    sellerId,
    {
      location: {
        type: "Point",
        coordinates: [Number(coordinates[0]), Number(coordinates[1])],
      },
    },
    { returnDocument: "after", runValidators: true },
  );
};
