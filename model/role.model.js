const mongoose = require("mongoose");
const roleModel = new mongoose.Schema({
  title: String,
  description: String,
  permissions: {
    type: Array,
    default: [],
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});
const Role = mongoose.model("Role", roleModel, "role");
module.exports = Role;
