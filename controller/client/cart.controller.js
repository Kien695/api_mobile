const Cart = require("../../model/cart.model");
const UserClient = require("../../model/userClient.model");
//add to cart
module.exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, size, price } = req.body;
    const user_id = res.locals.userId;
    let cart = await Cart.findOne({ user_id });
    if (!cart) {
      cart = await Cart.create({
        user_id,
        item_carts: [{ productId, quantity, size, price }],
      });
    } else {
      const itemIndex = cart.item_carts.findIndex(
        (item) => item.productId.toString() === productId,
      );
      if (itemIndex > -1) {
        cart.item_carts[itemIndex].quantity += quantity;
        cart.item_carts[itemIndex].price = price;
        cart.item_carts[itemIndex].size = size;
      } else {
        cart.item_carts.push({ productId, quantity, size, price });
      }
      await cart.save();
    }
    return res.status(200).json({
      message: "Thêm vào giỏ hàng thành công",
      error: false,
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
//lấy giỏ hàng
module.exports.getCartItem = async (req, res) => {
  try {
    const userId = res.locals.userId;

    const cart = await Cart.findOne({
      user_id: userId,
    }).populate("item_carts.productId");

    let items = [];
    if (cart && cart.item_carts.length > 0) {
      items = cart.item_carts;
    }
    return res.status(200).json({
      data: items,

      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
//xóa sp trong giỏ hàng
module.exports.deleteCartItem = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const productId = req.body.productId;

    const cart = await Cart.findOne({ user_id: userId });
    if (cart) {
      const index = cart.item_carts.findIndex(
        (item) => item.productId.toString() === productId,
      );
      if (index === -1) {
        return res.status(404).json({
          message: "Sản phẩm không có trong giỏ hàng",
          success: false,
          error: true,
        });
      }
      cart.item_carts.splice(index, 1);
      await cart.save();
    }
    return res.status(200).json({
      message: "Sản phẩm đã được xóa khỏi giỏ hàng",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
//delete all
module.exports.deleteCartAll = async (req, res) => {
  try {
    const userId = res.locals.userId;

    await Cart.deleteMany({ user_id: userId }); // xóa tất cả giỏ hàng của user

    return res.status(200).json({
      message: "Giỏ hàng đã được xóa toàn bộ",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
