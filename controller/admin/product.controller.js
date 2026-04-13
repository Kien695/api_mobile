const Product = require("../../model/product.model");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  secure: true,
});
//create
module.exports.create = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    if (!product) {
      res.status(400).json({
        error: true,
        success: false,
        message: "Sản phẩm không được tạo",
      });
    }
    res.status(201).json({
      message: "Tạo sản phẩm thành công",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
      error: true,
      success: false,
    });
  }
};
//get
module.exports.getProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perpage = parseInt(req.query.perpage) || 3;
    //sort
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.params.sortValue;
    } else {
      sort.price = "desc";
    }

    const product = await Product.find({
      deleted: false,
    })
      .skip((page - 1) * perpage)
      .limit(perpage)
      .sort(sort);
    res.status(200).json({ success: true, error: false, data: product });
  } catch (error) {
    return res.status(500).json({
      message: error,
      error: true,
      success: false,
    });
  }
};
//edit
module.exports.editProduct = async (req, res) => {
  try {
    const oldProduct = await Product.findById(req.params.id);
    if (!oldProduct) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại", success: false });
    }
    if (req.body.image) {
      await cloudinary.uploader.destroy(oldProduct.image_public_id);
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    return res.json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
//delete
module.exports.deleteProduct = async (req, res) => {
  try {
    const oldProduct = await Product.findById(req.params.id);
    if (!oldProduct) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại", success: false });
    }
    if (oldProduct.image_public_id) {
      await cloudinary.uploader.destroy(oldProduct.image_public_id);
    }
    await Product.findByIdAndDelete(req.params.id);
    return res.json({
      success: true,
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
