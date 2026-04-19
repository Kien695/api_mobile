const express = require("express");
const router = express.Router();
const controller = require("../controller/client/myList.controller");

router.post("/add", controller.addToMyList);
router.delete("/remove/:id", controller.deleteMyList);
router.delete("/removeAll", controller.deleteAllMyList);
router.get("/", controller.getMyList);
module.exports = router;
