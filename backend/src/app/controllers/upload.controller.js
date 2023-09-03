const nguoiDungModel = require("../models/nguoiDung.model");
const createError = require("http-errors");
const { deleteFile } = require("../../utils/myUtil");
const fileModel = require("../models/file.model");
const vatTuModel = require("../models/vatTu.model");

const uploadController = {
  // avatar user
  async uploadAvatarUser(req, res, next) {
    try {
      const file = req.file;
      const { email } = req.body;
      if (!email) {
        deleteFile(file.path);
        return next(createError(400, "Không xác định được người dùng"));
      }
      const user = await nguoiDungModel
        .findOne({ email })
        .select(["-mat_khau"]);
      if (!user) {
        deleteFile(file.path);
        return next(createError(404, `Người dùng '${email}' không tồn tại`));
      }
      if (!(req.user.ma_phan_quyen === 1 || email === req.user.email)) {
        deleteFile(file.path);
        return next(
          createError(
            403,
            `Chỉ chủ cửa hàng hoặc người dùng '${email}' mới có quyền với tính năng này`
          )
        );
      }
      if (user.anh_dai_dien) {
        const filePath = `src/public${user.anh_dai_dien}`;
        deleteFile(filePath);
      }
      user.anh_dai_dien = `/uploads/user/${file.filename}`;
      await user.save();
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  // upload product thumbnail
  async uploadProductThumbnail(req, res, next) {
    try {
      const { stt, ma_vt } = req.body;
      if (!stt) {
        return next(createError(400, "Không xác định được số thứ tự hình ảnh"));
      }
      if (!ma_vt) {
        return next(createError(400, "Không xác định được hàng hóa"));
      }
      const vatTu = await vatTuModel.findOne({ ma_vt });
      if (!vatTu) {
        return next(createError(404, `Hàng hóa '${ma_vt}' không tồn tại`));
      }
      if (vatTu[stt]) {
        deleteFile(`src/public/${vatTu[stt]}`);
      }
      vatTu[stt] = req.file?.filename
        ? `uploads/product/${req.file.filename}`
        : "";
      await vatTu.save();
      return res.status(200).json(vatTu);
    } catch (error) {
      next(error);
    }
  },
  // upload file excel import
  async uploadExcel(req, res, next) {
    try {
      if (!req.file) {
        return next(createError(400, "Không có file mẫu"));
      }
      const { ma_danh_muc } = req.params;
      const file = await fileModel.findOneAndDelete({ ma_danh_muc });
      if (file) {
        deleteFile(`src/public${file.path}`);
      }
      const filePath = `/uploads/${req.query.folder}/${req.file.filename}`;
      const fileCreated = await fileModel.create({
        ma_danh_muc,
        path: filePath,
      });
      return res.status(200).json(fileCreated);
    } catch (error) {
      deleteFile(req.file.path);
      next(error);
    }
  },
};
module.exports = uploadController;
