const AdminUser = require("../../model/userAdmin.model");

const ClientUser = require("../../model/userClient.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
//register
module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await AdminUser.findOne({
      email: email,
    });
    if (user) {
      return res.status(400).json({
        message: "Tài khoản đã tồn tại",
      });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);
    await AdminUser.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    return res.status(200).json({
      message: "Đăng kí tài khoản thành công",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};
//login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AdminUser.findOne({
      email: email,
    });
    if (!user) {
      return res.status(400).json({
        message: "Tài khoản không tồn tại",
      });
    }
    if (user.active == "inactive") {
      return res.status(400).json({
        message: "Tài khoản ngừng hoạt động",
      });
    }
    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Mật khẩu không chính xác!",
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    return res.status(200).json({
      message: "Đăng nhập thành công",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};
//get account
module.exports.getAccount = async (req, res) => {
  try {
    const user = await AdminUser.findById(res.locals.userId)
      .select("-password")
      .populate("role");
    return res.status(200).json({
      error: false,
      data: user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};
//[put] /avatar-user
module.exports.userAvatar = async (req, res) => {
  try {
    const userId = res.locals.userId;
    console.log(userId);
    let user = await AdminUser.findById(userId);
    if (!user) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // Xóa ảnh cũ nếu có
    if (user.image_public_id) {
      cloudinary.uploader.destroy(user.image_public_id);
    }

    // Cập nhật avatar mới
    user.image = req.body.image;
    user.image_public_id = req.body.image_public_id;
    await user.save();

    return res.status(200).json({
      error: false,
      success: true,
      avatar: user.image,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
//[ptch] /update user
module.exports.updateUser = async (req, res) => {
  try {
    const userId = res.locals.userId;

    // Tìm user hiện tại
    const existUser = await AdminUser.findById(userId);
    if (!existUser) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Tài khoản không được cập nhật!",
      });
    }
    // Cập nhật user
    const updatedUser = await AdminUser.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    return res.status(200).json({
      message: "Cập nhật tài khoản thành công",
      error: false,
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};
//[get] // get all account admin
module.exports.getAllAccount = async (req, res) => {
  try {
    const account = await AdminUser.find().select("-password").populate("role");
    if (!account) {
      return res.json({
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      error: false,
      success: true,
      data: account,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};
//[get] // get all account Client
module.exports.getAllClientAccounts = async (req, res) => {
  try {
    const account = await ClientUser.find({ deleted: false }).select(
      "-password",
    );

    if (!account) {
      return res.json({
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      error: false,
      success: true,
      data: account,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};
//[patch] //delete user client
module.exports.deleteClient = async (req, res) => {
  try {
    // Tìm đúng tài khoản theo id
    const account = await ClientUser.findById(req.params.id);

    // Nếu không tìm thấy
    if (!account) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Không tìm thấy tài khoản",
      });
    }

    // Nếu hợp lệ thì xóa
    await ClientUser.findByIdAndUpdate(req.params.id, { deleted: true });

    return res.status(200).json({
      error: false,
      success: true,
      message: "Xóa tài khoản thành công",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};
//[patch] //update role user
module.exports.updateRoleUser = async (req, res) => {
  try {
    const update = await AdminUser.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({
      error: false,
      success: true,
      message: "Cập nhật quyền thành công thành công",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};
//[delete] /delete Account
module.exports.deleteAccount = async (req, res) => {
  try {
    // Tìm đúng tài khoản theo id
    const account = await AdminUser.findById(req.params.id);

    // Nếu không tìm thấy
    if (!account) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Không tìm thấy tài khoản",
      });
    }

    // Nếu hợp lệ thì xóa
    await AdminUser.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      error: false,
      success: true,
      message: "Xóa tài khoản thành công",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};
