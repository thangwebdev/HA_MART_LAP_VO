const createError = require("http-errors");
const { validateCreatePhanQuyen } = require("../../utils/validate");
const phanQuyenModel = require("../models/phanQuyen.model");

const phanQuyenController = {
  async create(req, res, next) {
    try {
      const { ma_phan_quyen, ten_phan_quyen } = req.body;
      const { error } = validateCreatePhanQuyen({
        ma_phan_quyen,
        ten_phan_quyen,
      });
      if (error) {
        return next(error);
      }
      const phanQuyenExisted = await phanQuyenModel.findOne({ ma_phan_quyen });
      if (phanQuyenExisted) {
        return next(createError(400, `Đối tượng '${ma_phan_quyen}' đã tồn tại`));
      }
      const phanQuyen = await phanQuyenModel.create(req.body);
      return res.status(200).json(phanQuyen);
    } catch (error) {
      next(error);
    }
  },
};
module.exports = phanQuyenController;
