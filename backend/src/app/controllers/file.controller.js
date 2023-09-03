const createError = require("http-errors");
const fileModel = require("../models/file.model");

const fileController = {
  async getLink(req, res, next) {
    try {
      const { ma_danh_muc } = req.params;
      if (!ma_danh_muc) {
        return next(
          createError(400, `Không xác định được mã danh mục '${ma_danh_muc}'`)
        );
      }
      const file = await fileModel.findOne({ ma_danh_muc });
      if (!file) {
        return next(
          createError(404, `Danh mục '${ma_danh_muc}' chưa có file excel mẫu`)
        );
      }
      return res.status(200).json(file);
    } catch (error) {
      next(error);
    }
  },
};
module.exports = fileController;
