const Order = require("../../model/order.model");
//get order
module.exports.getOrder = async (req, res) => {
  try {
    const order = await Order.find({ deleted: false })
      .sort({ createdAt: -1 })
      .populate("productItems.productId", "_id name images brand size")
      .populate("userId", "name email mobile");
    if (!order || order.length === 0) {
      return res.json({
        success: false,
        message: "Không có đơn hàng nào.",
      });
    }
    const filterOrder = order
      .map((order) => ({
        ...order._doc,
        productItems: productItems.filter((item) => item.deleted == false),
      }))
      .filter((order) => order.productItems.length > 0);
    res.status(200).json({
      success: true,
      data: filterOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: true,
    });
  }
};
