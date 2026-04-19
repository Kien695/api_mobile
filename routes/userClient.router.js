const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const validate = require("../validates/auth.validate");
const controller = require("../controller/client/user.controller");
const middleware = require("../middleware/auth.middleware");
const uploadCloud = require("../middleware/uploadCloud.middleware");
router.get("/", middleware.auth, controller.getAccount);
router.post("/register", validate.register, controller.register);
router.post("/login", validate.login, controller.login);
router.put(
  "/user-avatar",
  middleware.auth,
  upload.single("image"),
  uploadCloud.uploadOne,
  controller.userAvatar,
);
router.patch("/update-user", middleware.auth, controller.updateUser);
module.exports = router;
