import mongoose from "mongoose";

export const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (coords) {
          if (!Array.isArray(coords) || coords.length !== 2) {
            return false;
          }
          const [longitude, latitude] = coords;
          if (
            typeof longitude !== "number" ||
            typeof latitude !== "number" ||
            isNaN(longitude) ||
            isNaN(latitude)
          ) {
            return false;
          }
          return (
            longitude >= -180 &&
            longitude <= 180 &&
            latitude >= -90 &&
            latitude <= 90
          );
        },
        message:
          "Coordinates must be [longitude, latitude] where -180 <= longitude <= 180 and -90 <= latitude <= 90",
      },
    },
  },
  { _id: false },
);

export const validateCoordinates = (coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return false;
  }
  const [longitude, latitude] = coordinates;
  if (
    typeof longitude !== "number" ||
    typeof latitude !== "number" ||
    isNaN(longitude) ||
    isNaN(latitude)
  ) {
    return false;
  }
  return (
    longitude >= -180 &&
    longitude <= 180 &&
    latitude >= -90 &&
    latitude <= 90
  );
};
