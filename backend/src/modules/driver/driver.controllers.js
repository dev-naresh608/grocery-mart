import { updateDriverLocationSvc } from "./driver.services.js";

export const handleUpdateDriverLocation = async (req, res) => {
  try {
    const { userId, coordinates, longitude, latitude } = req.body;
    const targetUserId = userId || req.user?._id || req.user?.id;

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: "Driver User ID is required",
      });
    }

    let coords = coordinates;
    if (!coords && longitude !== undefined && latitude !== undefined) {
      coords = [Number(longitude), Number(latitude)];
    }

    if (!coords || !Array.isArray(coords) || coords.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Valid coordinates [longitude, latitude] are required",
      });
    }

    const updatedDriver = await updateDriverLocationSvc(targetUserId, coords);
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
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update driver location",
    });
  }
};
