const Order = require("../../model/order.model");
//get order
module.exports.getOrder = async (req, res) => {
  try {
    const order = await Order.find({ deleted: false })
      .sort({ createdAt: -1 })
      .populate("productItems.productId", "_id title image brand size")
      .populate("userId", "name email mobile");
    if (!order || order.length === 0) {
      return res.json({
        success: false,
        message: "Không có đơn hàng nào.",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: true,
    });
  }
};
