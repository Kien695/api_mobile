const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: String,
    image_public_id: String,
    price: Number,
    discountPercentage: Number,
    countInStock: Number,
    numReview: Number,
    rating: Number,
    size: {
      type: [String],
      default: [],
    },
    sale: {
      type: Number,
      default: 0,
    },
    deleted: {
      type: Boolean,
      default: false,
    },

    deletedBy: {
      account_id: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser" },
      deletedAt: Date,
    },
  },
  { timestamps: true },
);
const Product = mongoose.model("Product", productSchema, "product");
module.exports = Product;
