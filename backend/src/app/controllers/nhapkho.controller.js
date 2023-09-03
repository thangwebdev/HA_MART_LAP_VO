const createError = require("http-errors");
const phieuNhapKhoModel = require("../models/phieuNhapKho.model");
const vatTuModel = require("../models/vatTu.model");

const nhapKhoController = {
  async getDetailImportByProduct(req, res, next) {
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
      const pnks = await phieuNhapKhoModel.aggregate([
        { $match: { "details.ma_vt": ma_vt } },
        {
          $project: {
            _id: 0,
            ma_ct: "$ma_ct",
            ma_phieu: "$ma_phieu",
            ma_kho: "$ma_kho",
            ten_kho: "$ten_kho",
            ngay_nhap_hang: "$ngay_nhap_hang",
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
                ngay_nhap_hang: "$ngay_nhap_hang",
                so_luong_nhap: { $first: "$details.so_luong_nhap" },
                gia_von: { $first: "$details.gia_von" },
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
      if (pnks[0]) {
        return res.status(200).json(pnks[0]);
      } else {
        return res.status(200).json({ data: [] });
      }
    } catch (error) {
      next(error);
    }
  },
};
module.exports = nhapKhoController;
