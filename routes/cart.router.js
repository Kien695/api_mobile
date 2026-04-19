const express = require("express");
const router = express.Router();

const controller = require("../controller/client/cart.controller");
router.post("/add", controller.addToCart);
router.get("/getItem", controller.getCartItem);

router.delete("/deleteCart", controller.deleteCartItem);
router.delete("/deleteCartAll", controller.deleteCartAll);
module.exports = router;
