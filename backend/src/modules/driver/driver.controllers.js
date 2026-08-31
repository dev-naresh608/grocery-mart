import { updateDriverLocationSvc } from "./driver.services.js";
import Driver from "./driver.model.js";
import { badRequest, serverError } from "../../utils/response.js";
import { validateCoordinates } from "../../utils/geo.schema.js";

export const handleUpdateDriverLocation = async (req, res) => {
  try {
    const userId = req.user?.sub || req.user?.id || req.user?._id;
    const userRole = req.user?.role;

    if (!userId) {
      return badRequest(res, "Authentication required");
    }

    if (userRole !== "driver") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only drivers can update driver location",
      });
    }

    let { latitude, longitude, lat, lng, coordinates } = req.body;

    let targetLng = longitude !== undefined ? longitude : lng;
    let targetLat = latitude !== undefined ? latitude : lat;

    if (Array.isArray(coordinates) && coordinates.length === 2) {
      targetLng = coordinates[0];
      targetLat = coordinates[1];
    }

    targetLng = Number(targetLng);
    targetLat = Number(targetLat);

    if (
      isNaN(targetLng) ||
      isNaN(targetLat) ||
      !validateCoordinates([targetLng, targetLat])
    ) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: [
          {
            field: "coordinates",
            message:
              "Coordinates must be valid numbers: Longitude [-180, 180] and Latitude [-90, 90]",
          },
        ],
      });
    }

    const updatedDriver = await updateDriverLocationSvc(userId, [
      targetLng,
      targetLat,
    ]);

    if (!updatedDriver) {
      return res.status(404).json({
        success: false,
        message: "Driver profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Driver location updated successfully",
      currentLocation: updatedDriver.currentLocation,
    });
  } catch (error) {
    return serverError(res, error, "Failed to update driver location");
  }
};

export const handleGetDriverLocation = async (req, res) => {
  try {
    const userId = req.user?.sub || req.user?.id || req.user?._id;

    if (!userId) {
      return badRequest(res, "Authentication required");
    }

    const driver = await Driver.findOne({ user_id: userId }).select(
      "currentLocation status is_busy",
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    return res.status(200).json({
      success: true,
      currentLocation: driver.currentLocation || null,
      status: driver.status,
      is_busy: driver.is_busy,
    });
  } catch (error) {
    return serverError(res, error, "Failed to fetch driver location");
  }
};
