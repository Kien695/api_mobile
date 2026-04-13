const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const validate = require("../validates/auth.validate");
const controller = require("../controller/admin/product.controller");
const uploadCloud = require("../middleware/uploadCloud.middleware");
router.get("/", controller.getProduct);
router.post(
  "/create",
  upload.single("image"),
  uploadCloud.uploadOne,
  controller.create,
);
router.patch(
  "/edit/:id",
  upload.single("image"),
  uploadCloud.uploadOne,
  controller.editProduct,
);
router.delete("/deleted/:id", controller.deleteProduct);
module.exports = router;
