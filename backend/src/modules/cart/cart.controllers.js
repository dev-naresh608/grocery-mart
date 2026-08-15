import {
  getCartByUserIdSvc,
  addToCartSvc,
  updateCartQtySvc,
  removeFromCartSvc,
  clearCartSvc,
  getCartItemService,
} from "./cart.service.js";

export const handleGetCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }
    const cartItems = await getCartByUserIdSvc(userId);
    return res.status(200).json({ success: true, result: cartItems });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleAddToCart = async (req, res) => {
  try {
    const { userId, productId, storeId, quantity } = req.body;
    if (!userId || !productId || !storeId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "userId, productId, and storeId are required",
        });
    }
    const item = await addToCartSvc(userId, productId, storeId, quantity);
    return res
      .status(200)
      .json({
        success: true,
        result: item,
        message: "Item added to cart successfully",
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleUpdateCartQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || quantity === undefined) {
      return res
        .status(400)
        .json({
          success: false,
          message: "userId, productId, and quantity are required",
        });
    }
    const item = await updateCartQtySvc(userId, productId, quantity);
    return res
      .status(200)
      .json({
        success: true,
        result: item,
        message: "Quantity updated successfully",
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleRemoveFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ success: false, message: "userId and productId are required" });
    }
    const result = await removeFromCartSvc(userId, productId);
    return res
      .status(200)
      .json({
        success: true,
        result,
        message: "Item removed from cart successfully",
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleClearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }
    await clearCartSvc(userId);
    return res
      .status(200)
      .json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleFindCartItemById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product id required",
      });
    }
    const product = await getCartItemService(productId);
    return res.status(200).json({
      success: true,
      message: "product fetched successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
