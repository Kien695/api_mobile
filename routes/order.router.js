const express = require("express");
const router = express.Router();
const controller = require("../controller/admin/order.controller");
router.get("/", controller.getOrder);
module.exports = router;
