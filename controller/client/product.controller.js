const mongoose = require("mongoose");
const Product = require("../../model/product.model");
const searchHelper = require("../../Helper/Search");
const { getAIRecommendation } = require("../../config/filterByAI");

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
//filter products by AI
module.exports.fetchAIFilteredProducts = async (req, res) => {
  try {
    const { userPrompt } = req.body;

    if (!userPrompt || !userPrompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Provide a valid prompt.",
      });
    }

    const filterKeywords = (query) => {
      const stopWords = new Set([
        "là",
        "của",
        "và",
        "hay",
        "hoặc",
        "cho",
        "với",
        "một",
        "những",
        "các",
        "được",
        "bị",
        "tôi",
        "mình",
        "em",
        "anh",
        "chị",
        "muốn",
        "cần",
        "tìm",
        "mua",
        "giúp",
        "hãy",
        "vui",
        "lòng",
        "có",
        "không",
        "ở",
        "trong",
        "ngoài",
        "trên",
        "dưới",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
      ]);

      return query
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((word) => word && !stopWords.has(word));
    };

    const keywords = filterKeywords(userPrompt);

    if (keywords.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter more specific keywords.",
      });
    }

    const conditions = keywords.flatMap((keyword) => [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ]);

    const filteredProducts = await Product.find({
      $or: conditions,
    })
      .sort({ createdAt: -1 })
      .limit(100);

    if (filteredProducts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Không có sản phẩm nào hợp lệ với tìm kiếm của bạn.",
        products: [],
      });
    }
    const aiProducts = await getAIRecommendation(userPrompt, filteredProducts);

    return res.status(200).json({
      success: true,
      total: aiProducts.length,
      products: aiProducts,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
