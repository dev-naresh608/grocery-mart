import {
  findAddressSvc,
  addAddressSvc,
  deleteAddressSvc,
  updateAddressSvc,
} from "./address.service.js";

export const handleGetAddressApi = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    const addressList = await findAddressSvc(userId);
    if (!addressList || addressList.length === 0)
      return res.status(200).json({
        success: false,
        message: "Address not found",
      });

    return res.status(200).json({
      success: true,
      message: "Address fetched successfully",
      addressList,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const handleAddAddressApi = async (req, res) => {
  try {
    const { userId } = req.params;
    const payload = req.body;

    const returnResponse = (message) => {
      return {
        success: false,
        message: message,
      };
    };
    if (!userId) {
      return res.status(200).json(returnResponse("User id required"));
    }

    if (!payload) {
      return res.status(200).json(returnResponse("Payload required"));
    }

    const result = await addAddressSvc(userId, payload);

    if (!result) {
      return res.status(200).json(returnResponse("fail to add address"));
    }

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const handleDeleteAddressApi = async (req, res) => {
  try {
    const { addressId } = req.params;
    if (!addressId) {
      return res
        .status(400)
        .json({ success: false, message: "Address ID is required" });
    }
    const result = await deleteAddressSvc(addressId);
    if (!result) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Address not found or failed to delete",
        });
    }
    return res
      .status(200)
      .json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleUpdateAddressApi = async (req, res) => {
  try {
    const { addressId } = req.params;
    const payload = req.body;
    if (!addressId || !payload) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Address ID and payload are required",
        });
    }
    const result = await updateAddressSvc(addressId, payload);
    if (!result) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Address not found or failed to update",
        });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Address updated successfully",
        address: result,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
