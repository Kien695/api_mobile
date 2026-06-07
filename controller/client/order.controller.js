const mongoose = require("mongoose");
const Cart = require("../../model/cart.model");
const Product = require("../../model/product.model");
const Order = require("../../model/order.model");
const User = require("../../model/userClient.model");
//add
module.exports.order = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userId = res.locals.userId;
    const payment_status = req.body.payment_status || "no";
    const paymentMethod = req.body.paymentMethod || "cod";
    const delivery_address = req.body.delivery_address || "";
    const productItems = req.body.productItems || [];
    const totalAmount = req.body.totalAmount;
    const mobile = req.body.mobile;
    // 1. Trừ kho (loop từng sản phẩm)
    for (const item of productItems) {
      const product = await Product.findOneAndUpdate(
        {
          _id: item.productId,
          countInStock: { $gte: item.quantity },
        },
        {
          $inc: { countInStock: -item.quantity },
        },
        { session },
      );

      if (!product) {
        throw new Error("Không đủ hàng");
      }
    }

    // 2. Tạo order
    const order = await Order.create(
      [
        {
          userId,
          productItems,
          paymentMethod,
          delivery_address,
          mobile,
          totalAmount,
          payment_status,
        },
      ],
      { session },
    );

    // 3. Clear cart
    await Cart.updateOne(
      {
        user_id: userId,
      },
      { $set: { item_carts: [] } },
      { session },
    );

    // 4. Commit
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Đặt hàng thành công",
      order,
    });
  } catch (error) {
    // rollback
    await session.abortTransaction();

    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};
//get order
module.exports.getOrder = async (req, res) => {
  try {
    const userId = res.locals.userId;

    const order = await Order.find({ userId: userId })
      .populate(
        "productItems.productId",
        "_id name images brand price discountPercentage",
      )
      .sort({ createdAt: -1 });

    if (!order || order.length === 0) {
      return res.json({
        success: false,
        message: "Không có đơn hàng nào.",
      });
    }

    res.json({
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
