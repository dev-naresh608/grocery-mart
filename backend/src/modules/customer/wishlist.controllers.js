import Customer from "./customer.model.js";

export const toggleWishlistStore = async (req, res) => {
  try {
    const { userId, storeId } = req.body;

    if (!userId || !storeId) {
      return res.status(400).json({
        success: false,
        message: "userId and storeId are required",
      });
    }

    const customer = await Customer.findOne({ user_id: userId });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (!customer.myWishlist) {
      customer.myWishlist = [];
    }

    const index = customer.myWishlist.indexOf(storeId);
    let action;

    if (index > -1) {
      // Remove from wishlist
      customer.myWishlist.splice(index, 1);
      action = "removed";
    } else {
      // Add to wishlist
      customer.myWishlist.push(storeId);
      action = "added";
    }

    await customer.save();

    return res.status(200).json({
      success: true,
      message: `Store ${action} ${action === "added" ? "to" : "from"} wishlist`,
      action,
      myWishlist: customer.myWishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWishlistStores = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const customer = await Customer.findOne({ user_id: userId }).populate(
      "myWishlist",
      "_id store_name store_address store_type is_store_open"
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      stores: customer.myWishlist || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
