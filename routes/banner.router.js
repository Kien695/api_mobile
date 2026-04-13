const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const controller = require("../controller/admin/banner.controller");
const middleware = require("../middleware/auth.middleware");
const uploadCloud = require("../middleware/uploadCloud.middleware");
router.get("/", controller.getBanner);
router.post(
  "/create",
  upload.single("image"),
  uploadCloud.uploadOne,

  controller.create,
);
router.delete(
  "/deleted/:id",
  controller.delete,
);

module.exports = router;
