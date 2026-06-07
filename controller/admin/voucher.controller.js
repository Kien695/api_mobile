const Voucher = require("../../model/voucher.model");

// GET /voucher
module.exports.getVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      vouchers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /voucher/create
module.exports.createVoucher = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      quantity,
      products,
      startDate,
      endDate,
    } = req.body;

    const exist = await Voucher.findOne({
      code: code.toUpperCase(),
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Voucher đã tồn tại",
      });
    }

    const voucher = await Voucher.create({
      code: code.toUpperCase(),

      discountType,
      discountValue,

      minOrderValue,
      maxDiscount,
      quantity,

      products: products || [],

      startDate,
      endDate,
    });

    res.status(201).json({
      success: true,
      message: "Tạo voucher thành công",
      voucher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PATCH /voucher/edit/:id
module.exports.editVoucher = async (req, res) => {
  try {
    const id = req.params.id;

    const voucher = await Voucher.findById(id);

    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy voucher",
      });
    }

    const updatedVoucher = await Voucher.findByIdAndUpdate(
      id,
      {
        ...req.body,
        code: req.body.code ? req.body.code.toUpperCase() : voucher.code,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Cập nhật voucher thành công",
      voucher: updatedVoucher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /voucher/delete/:id
module.exports.deleteVoucher = async (req, res) => {
  try {
    const id = req.params.id;

    const voucher = await Voucher.findById(id);

    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy voucher",
      });
    }

    await Voucher.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Xóa voucher thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//get by id
module.exports.getVoucherByProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const vouchers = await Voucher.find({
      active: true,

      $or: [
        {
          products: [],
        },
        {
          products: productId,
        },
      ],

      startDate: {
        $lte: new Date(),
      },

      endDate: {
        $gte: new Date(),
      },

      quantity: {
        $gt: 0,
      },
    })
      .sort({
        createdAt: -1,
      })
      .select("-products");

    res.status(200).json({
      success: true,
      vouchers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
