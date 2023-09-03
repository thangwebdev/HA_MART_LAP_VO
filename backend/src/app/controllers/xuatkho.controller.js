const createError = require("http-errors");
const phieuXuatKhoModel = require("../models/phieuXuatKho.model");
const vatTuModel = require("../models/vatTu.model");

const xuatKhoController = {
  async getDetailExportByProduct(req, res, next) {
    try {
      let { ma_vt, limit, page } = req.body;
      if (!limit) {
        limit = 20;
      }
      if (!page) {
        page = 1;
      }
      const skip = (page - 1) * limit;
      if (!ma_vt) {
        return next(createError(400, "Không xác định được hàng hóa"));
      }
      const vatTu = await vatTuModel.findOne({ ma_vt });
      if (!vatTu) {
        return next(createError(404, `Hàng hóa '${ma_vt}' không tồn tại.`));
      }
      const pxks = await phieuXuatKhoModel.aggregate([
        { $match: { "details.ma_vt": ma_vt } },
        {
          $project: {
            _id: 0,
            ma_ct: "$ma_ct",
            ma_phieu: "$ma_phieu",
            ma_kho: "$ma_kho",
            ten_kho: "$ten_kho",
            ngay_xuat_hang: "$ngay_xuat_hang",
            details: {
              $filter: {
                input: "$details",
                as: "detail",
                cond: { $eq: ["$$detail.ma_vt", ma_vt] },
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            info: {
              $push: {
                ma_ct: "$ma_ct",
                ma_phieu: "$ma_phieu",
                ma_kho: "$ma_kho",
                ten_kho: "$ten_kho",
                ngay_xuat_hang: "$ngay_xuat_hang",
                so_luong_xuat: { $first: "$details.so_luong_xuat" },
                gia_xuat: { $first: "$details.gia_xuat" },
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            data: { $slice: ["$info", skip, limit] },
            count: "$count",
          },
        },
      ]);
      if (pxks[0]) {
        return res.status(200).json(pxks[0]);
      } else {
        return res.status(200).json({ data: [] });
      }
    } catch (error) {
      next(error);
    }
  },
};
module.exports = xuatKhoController;
