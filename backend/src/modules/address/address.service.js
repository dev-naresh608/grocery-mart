import Address from "./address.model.js";
import { findAddress } from "../../distanceCalculator.js";

export const findAddressSvc = async (userId) => {
  const addressList = await Address.find({ user_id: userId });
  return addressList;
};

export const addAddressSvc = async (userId, payload) => {
  const {
    name,
    phone,
    street,
    city,
    state,
    pincode,
    location,
    coordinates,
    longitude,
    latitude,
  } = payload;

  let addressLocation = location;
  if (!addressLocation && Array.isArray(coordinates) && coordinates.length === 2) {
    addressLocation = {
      type: "Point",
      coordinates: [Number(coordinates[0]), Number(coordinates[1])],
    };
  } else if (
    !addressLocation &&
    longitude !== undefined &&
    latitude !== undefined &&
    longitude !== null &&
    latitude !== null &&
    !isNaN(Number(longitude)) &&
    !isNaN(Number(latitude))
  ) {
    addressLocation = {
      type: "Point",
      coordinates: [Number(longitude), Number(latitude)],
    };
  }

  // Fallback: If no coordinates were supplied, attempt backend geocoding
  if (!addressLocation && street && city) {
    const addressString = [street, city, state, pincode]
      .filter(Boolean)
      .join(", ");
    const geoResult = await findAddress(addressString);
    if (
      geoResult &&
      geoResult.success &&
      geoResult.longitude !== undefined &&
      geoResult.latitude !== undefined
    ) {
      addressLocation = {
        type: "Point",
        coordinates: [Number(geoResult.longitude), Number(geoResult.latitude)],
      };
    }
  }

  const cleanPhone = phone ? String(phone).trim().replace(/\D/g, "").slice(0, 10) : "";

  const addressData = {
    user_id: userId,
    name: name ? String(name).trim() : "",
    phone: cleanPhone,
    street: street,
    city: city,
    state: state,
    pincode: pincode,
  };

  if (addressLocation) {
    addressData.location = addressLocation;
  }

  const address = await Address.create(addressData);
  return address;
};

export const deleteAddressSvc = async (addressId) => {
  return await Address.findByIdAndDelete(addressId);
};

export const updateAddressSvc = async (addressId, payload) => {
  const updateData = { ...payload };

  if (
    !updateData.location &&
    Array.isArray(updateData.coordinates) &&
    updateData.coordinates.length === 2
  ) {
    updateData.location = {
      type: "Point",
      coordinates: [
        Number(updateData.coordinates[0]),
        Number(updateData.coordinates[1]),
      ],
    };
    delete updateData.coordinates;
  } else if (
    !updateData.location &&
    updateData.longitude !== undefined &&
    updateData.latitude !== undefined &&
    updateData.longitude !== null &&
    updateData.latitude !== null &&
    !isNaN(Number(updateData.longitude)) &&
    !isNaN(Number(updateData.latitude))
  ) {
    updateData.location = {
      type: "Point",
      coordinates: [
        Number(updateData.longitude),
        Number(updateData.latitude),
      ],
    };
    delete updateData.longitude;
    delete updateData.latitude;
  } else if (!updateData.location && (updateData.street || updateData.city)) {
    // If address text changed without explicit coordinates, geocode updated address
    const existing = await Address.findById(addressId);
    if (existing) {
      const street = updateData.street || existing.street;
      const city = updateData.city || existing.city;
      const state = updateData.state || existing.state;
      const pincode = updateData.pincode || existing.pincode;
      const addressString = [street, city, state, pincode]
        .filter(Boolean)
        .join(", ");
      const geoResult = await findAddress(addressString);
      if (geoResult && geoResult.success) {
        updateData.location = {
          type: "Point",
          coordinates: [Number(geoResult.longitude), Number(geoResult.latitude)],
        };
      }
    }
  }

  return await Address.findByIdAndUpdate(addressId, updateData, {
    returnDocument: "after",
    runValidators: true,
  });
};
