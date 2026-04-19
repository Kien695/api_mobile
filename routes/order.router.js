const express = require("express");
const router = express.Router();
const controllerClient = require("../controller/client/order.controller");
const controllerAdmin = require("../controller/admin/order.controller");
router.post("/add", controllerClient.order);
router.get("/get-order-admin", controllerAdmin.getOrder);
// router.patch("/updateStatus", controller.updateStatus);
module.exports = router;
