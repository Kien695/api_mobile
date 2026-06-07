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
//update status order
module.exports.updateStatus = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const productId = req.body.productId;
    const action = req.body.action;
    const order = await Order.findById(orderId).populate(
      "productItems.productId",
      "_id name images size",
    );

    let message = "";
    if (order) {
      const index = order.productItems.findIndex(
        (item) => item.productId._id.toString() === productId,
      );
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm trong đơn hàng",
        });
      }
      if (action == "shipping") {
        order.productItems[index].order_status = "shipping";
        message = "Đơn hàng đang được vận chuyển!";
      }
      if (action == "delivered") {
        order.productItems[index].order_status = "delivered";
        order.payment_status = "yes";
        message = "Đơn hàng đã được giao thành công!";
      }
      if (action === "cancelled") {
        order.productItems[index].order_status = "cancelled";
        message = "Đơn hàng đã bị hủy!";
      }
      await order.save();

      return res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái thành công!",
        data: order,
      });
    }
    return res
      .status(404)
      .json({ success: false, message: "Đơn hàng không tìm thấy" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: true,
    });
  }
};
