const mongoose = require("mongoose");
const myListSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserClient",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
const MyList = mongoose.model("MyList", myListSchema, "my-list");
module.exports = MyList;
