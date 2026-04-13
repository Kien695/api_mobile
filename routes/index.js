const express = require("express");
const router = express.Router();
const middleware = require("../middleware/auth.middleware");
const dashboardRouter = require("./dashboard.router");
const userAdminRouter = require("./userAdmin.router");
const productAdminRouter = require("./product.router");
// const orderRouter = require("./order.router");
const bannerRouter = require("./banner.router");
const roleRouter = require("./role.router");
module.exports = (app) => {
  app.use("/auth", userAdminRouter);
  app.use("/product", middleware.auth, productAdminRouter);
  app.use("/banner", middleware.auth, bannerRouter);
  app.use("/role", middleware.auth, roleRouter);
  app.use("/dashboard", middleware.auth, dashboardRouter);
  // app.use("/order", middleware.auth, orderRouter);
};
