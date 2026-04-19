const mongoose = require("mongoose");
const Product = require("../../model/product.model");
const searchHelper = require("../../Helper/Search");

//get all product
module.exports.getAllProduct = async (req, res) => {
  try {
    const page = req.query.page || 1;

    let find = {
      deleted: false,
    };
    //search
    const objectSearch = searchHelper(req.query);

    if (objectSearch.regex) {
      find.title = objectSearch.regex;
    }

    //sort
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    } else {
      sort.price = "asc";
    }
    const totalProduct = await Product.countDocuments(find);
    const totalPage = Math.ceil(totalProduct / 8);
    const product = await Product.find(find)
      .limit(8)
      .sort(sort)
      .skip((page - 1) * 8);
    res.json({
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
//detail
module.exports.detailProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(400).json({
        message: "Sản phẩm không tồn tại!",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      error: false,
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
