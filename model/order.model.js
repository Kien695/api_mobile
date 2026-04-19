const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "UserClient",
    },
    productItems: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        size: { type: String },
        order_status: {
          type: String,
          enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
          default: "pending",
        },
        deleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    paymentMethod: {
      type: String,
      default: "",
      enum: ["cod", "cash"],
    },
    payment_status: {
      type: String,
      default: "",
      enum: ["no", "yes"],
    },
    delivery_address: {
      type: String,
    },
    mobile: {
      type: String,
      default: null,
    },
    deleted: {
      type: Boolean,
      default: false,
    },

    totalAmount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);
const Order = mongoose.model("Order", orderSchema, "order");
module.exports = Order;
