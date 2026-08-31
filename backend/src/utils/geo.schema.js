import mongoose from "mongoose";

/**
 * Validates GeoJSON [longitude, latitude] coordinates.
 * - Longitude must be between -180 and 180
 * - Latitude must be between -90 and 90
 * - Must be an array of exactly 2 numbers (not NaN, not null)
 */
export const validateCoordinates = (val) => {
  return (
    Array.isArray(val) &&
    val.length === 2 &&
    typeof val[0] === "number" &&
    !isNaN(val[0]) &&
    val[0] >= -180 &&
    val[0] <= 180 &&
    typeof val[1] === "number" &&
    !isNaN(val[1]) &&
    val[1] >= -90 &&
    val[1] <= 90
  );
};

export const coordinateValidationErrorMessage =
  "Coordinates must be [longitude, latitude] with longitude between -180 and 180, and latitude between -90 and 90";

/**
 * Standard GeoJSON Point Schema for Mongoose
 */
export const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: validateCoordinates,
        message: coordinateValidationErrorMessage,
      },
    },
  },
  { _id: false },
);

pointSchema.pre("validate", function () {
  if (this.coordinates && !this.type) {
    this.type = "Point";
  }
});

/**
 * Helper to construct a GeoJSON Point from coordinates or [lng, lat]
 */
export const formatGeoPoint = (lng, lat) => {
  const numLng = Number(lng);
  const numLat = Number(lat);

  if (isNaN(numLng) || isNaN(numLat)) return null;

  return {
    type: "Point",
    coordinates: [numLng, numLat],
  };
};
