const BannerHome = require("../../model/banner.model");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  secure: true,
});
//get
module.exports.getBanner = async (req, res) => {
  try {
    const banner = await BannerHome.find();
    if (!banner) {
      return res.status(404).json({
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      data: banner,
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
//create
module.exports.create = async (req, res) => {
  try {
    let banner = new BannerHome(req.body);
    if (!banner) {
      return res.status(400).json({
        message: "Banner không tạo được",
        error: true,
        success: false,
      });
    }
    await banner.save();
    return res.status(201).json({
      message: "Tạo banner chính thành công",
      error: false,
      success: true,
      data: banner,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//del
module.exports.delete = async (req, res) => {
  try {
    const banner = await BannerHome.findById(req.params.id);
    if (!banner) {
      return res.status(400).json({
        message: "Banner không được tìm thấy",
        error: true,
        success: false,
      });
    }
    if (banner.image_public_id) {
      await cloudinary.uploader.destroy(banner.image_public_id);
    }
    await BannerHome.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "Xóa banner chính thành công!",
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
