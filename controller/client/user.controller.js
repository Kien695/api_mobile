const ClientUser = require("../../model/userClient.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../../config/sendMail");
const UserClient = require("../../model/userClient.model");
const cloudinary = require("cloudinary").v2;
//register
module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await ClientUser.findOne({
      email: email,
    });
    if (user) {
      return res.status(400).json({
        message: "Tài khoản đã tồn tại",
      });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);
    await ClientUser.create({
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
    const user = await ClientUser.findOne({
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
      message: error,
      error: true,
      success: false,
    });
  }
};
//get account
module.exports.getAccount = async (req, res) => {
  try {
    const user = await ClientUser.findById(res.locals.userId).select(
      "-password",
    );

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

    let user = await ClientUser.findById(userId);
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
    const existUser = await ClientUser.findById(userId);
    if (!existUser) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Tài khoản không được cập nhật!",
      });
    }
    // Cập nhật user
    const updatedUser = await ClientUser.findByIdAndUpdate(userId, req.body, {
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
//forgotPassword
module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserClient.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "Email không tồn tại",
        success: false,
        error: true,
      });
    }
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const userId = user._id;
    const updateUser = await UserClient.findByIdAndUpdate(
      userId,
      {
        otp: verifyCode,
        otpExpires: Date.now() + 600000,
      },
      {
        new: true,
      },
    );
    const subject = "Mã OTP xác minh";
    const html = `Mã OTP lấy lại mật khẩu là: <b style="color: green;">${verifyCode}</b>. Thời hạn sử dụng là: ${updateUser.otpExpires}`;
    const verifyEmail = await sendMail(email, subject, html);
    return res.json({
      message: "Kiểm tra email của bạn",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};
//verify forgot-password
module.exports.verifyForgotPassword = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await UserClient.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "Email không tồn tại",
        success: false,
        error: true,
      });
    }
    if (otp !== user.otp) {
      return res.status(400).json({
        message: "OTP không hợp lệ",
        success: false,
        error: true,
      });
    }
    const currentTime = Date.now();
    if (user.otpExpires < currentTime) {
      return res.status(400).json({
        message: "OTP đã hết hạn",
        success: false,
        error: true,
      });
    }
    user.otp = "";
    user.otpExpires = "";
    await user.save();
    return res.status(200).json({
      error: false,
      success: true,
      message: "OTP đã được xác minh",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};
//reset password
module.exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    const user = await UserClient.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "Email không tồn tại!",
        success: false,
        error: true,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(newPassword, salt);
    user.password = hashPassword;
    await user.save();
    return res.status(200).json({
      error: false,
      success: true,
      message: "Đổi mật khẩu thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};
