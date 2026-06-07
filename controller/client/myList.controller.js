const MyList = require("../../model/myList.model");
//thêm
module.exports.addToMyList = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const productId = req.body.productId;

    const myList = new MyList({ userId: userId, product: productId });
    const save = await myList.save();
    return res.status(200).json({
      message: "Sản phẩm được thêm vào danh sách yêu thích",
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
//xóa
module.exports.deleteMyList = async (req, res) => {
  try {
    const myListItem = await MyList.find({
      product: req.params.id,
      userId: res.locals.userId,
    });

    if (!myListItem) {
      return res.status(404).json({
        message: "Không tìm thấy",
        error: true,
        success: false,
      });
    }
    const deleteItem = await MyList.findOneAndDelete({
      product: req.params.id,
      userId: res.locals.userId,
    });
    return res.status(200).json({
      message: "Sản phẩm được xóa khỏi danh sách yêu thích",
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
//xóa tất cả
module.exports.deleteAllMyList = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const deleteAll = await MyList.deleteMany({ userId: userId });
    return res.status(200).json({
      message: "Đã xóa tất cả sản phẩm khỏi danh sách yêu thích",
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
//lấy
module.exports.getMyList = async (req, res) => {
  try {
    const myList = await MyList.find({
      userId: res.locals.userId,
    }).populate("product");
    res.status(200).json({
      data: myList,
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
