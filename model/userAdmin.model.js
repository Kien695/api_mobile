const mongoose = require("mongoose");
const UserAdminSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    image: {
      type: String,
      default: "",
    },
    image_public_id: { type: String, default: "" },
    mobile: {
      type: String,
      default: null,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      default: "active",
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    deleted:{
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);
const AdminUser = mongoose.model("AdminUser", UserAdminSchema, "user-admin");
module.exports = AdminUser;
