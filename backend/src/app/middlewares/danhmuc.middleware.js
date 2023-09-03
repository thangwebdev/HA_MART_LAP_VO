const createError = require("http-errors");
const { dsDanhMuc } = require("../../utils/data");
const roleMiddleWare = require("./role.middware");

const danhMucMiddleWare = {
  // assign danh muc
  assignDanhMuc(req, res, next) {
    try {
      const { ma_danh_muc } = req.params;
      if (!ma_danh_muc) {
        return next(createError(400, "Không xác định được danh mục"));
      }
      const danhMuc = dsDanhMuc.find((dm) => dm.maDanhMuc === ma_danh_muc);
      if (!danhMuc) {
        return next(
          createError(404, `Danh mục '${ma_danh_muc}' không tồn tại`)
        );
      }
      req.danhMuc = danhMuc;
      next();
    } catch (error) {
      next(error);
    }
  },
  // specify Role On Danh Muc
  specifyRoleOnDanhMuc(req, res, next) {
    try {
      const danhMuc = req.danhMuc;
      if (!danhMuc) {
        return next(createError(400, "Không xác định được danh mục"));
      }
      switch (danhMuc.maDanhMuc) {
        case 'dmkho':
          return roleMiddleWare.checkAdmin(req, res, next);
        case 'dmct':
          return roleMiddleWare.checkAdmin(req, res, next);
        case 'dmnv':
          return roleMiddleWare.checkAdminOrManager(req, res, next);
        case 'dmpbh':
          return roleMiddleWare.exceptNhanVienKho(req, res, next);
        case 'dmkh':
          return roleMiddleWare.exceptNhanVienKho(req, res, next);
        default:
          return roleMiddleWare.exceptNhanVienBanHang(req, res, next);
      }
    } catch (error) {
      next(error);
    }
  },
};
module.exports = danhMucMiddleWare;
