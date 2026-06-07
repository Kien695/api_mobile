const mongoose = require("mongoose");
const UserClientSchema = new mongoose.Schema(
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
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    status: {
      type: String,
      default: "active",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);
const UserClient = mongoose.model(
  "UserClient",
  UserClientSchema,
  "user-client",
);
module.exports = UserClient;
