const Product = require("../../model/product.model");
const User = require("../../model/userClient.model");
const Order = require("../../model/order.model");

//[get]
module.exports.dashboard = async (req, res) => {
  try {
    const statistics = {
      products: { total: 0 },
      revenue: { total: 0 },
      user: { total: 0 },
      order: { total: 0 },
    };
    //product
    statistics.products.total = await Product.countDocuments({
      deleted: false,
    });

    //user
    statistics.user.total = await User.countDocuments();
    //order
    statistics.order.total = await Order.countDocuments({ deleted: false });

    //revenue

    const revenueResult = await Order.aggregate([
      {
        $match: {
          payment_status: "yes",
          deleted: false,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    statistics.revenue.total =
      revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      error: false,
      success: true,
      data: statistics,
      //   revenue: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
