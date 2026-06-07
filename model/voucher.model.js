const mongoose = require("mongoose");
const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },

    discountType: {
      type: String,
      enum: ["percent", "fixed"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
    },

    minOrderValue: {
      type: Number,
      default: 0,
    },

    maxDiscount: Number,

    quantity: {
      type: Number,
      default: 1,
    },

    startDate: Date,

    endDate: Date,

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Voucher", voucherSchema, "voucher");
