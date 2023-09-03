const createError = require("http-errors");

const roleMiddleWare = {
  checkAdmin(req, res, next) {
    const { ma_phan_quyen } = req.user;
    if (ma_phan_quyen !== 1) {
      return next(
        createError(403, "Chỉ chủ cửa hàng mới được phép sử dụng tính năng này")
      );
    }
    next();
  },
  checkAdminOrManager(req, res, next) {
    try {
      const { ma_phan_quyen } = req.user;
      if (!(ma_phan_quyen === 1 || ma_phan_quyen === 2)) {
        return next(
          createError(
            403,
            "Chỉ chủ cửa hàng và quản lý kho mới được phép sử dụng tính năng này"
          )
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  },
  exceptNhanVienBanHang(req, res, next) {
    try {
      const { ma_phan_quyen } = req.user;
      if (ma_phan_quyen === 4) {
        return next(createError(403, "Bạn không có quyền với tính năng này"));
      }
      next();
    } catch (error) {
      next(error);
    }
  },
  exceptNhanVienKho(req, res, next) {
    try {
      const { ma_phan_quyen } = req.user;
      if (ma_phan_quyen === 3) {
        return next(createError(403, "Bạn không có quyền với tính năng này"));
      }
      next();
    } catch (error) {
      next(error);
    }
  },
};
module.exports = roleMiddleWare;
