const mongoose = require("mongoose");
const bannerHomeSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: "",
    },
    image_public_id: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);
const BannerHome = mongoose.model(
  "BannerHome",
  bannerHomeSchema,
  "banner-home",
);
module.exports = BannerHome;
