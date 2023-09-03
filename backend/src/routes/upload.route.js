const router = require("express").Router();
const { upload } = require("../utils/myUtil");
const uploadController = require("../app/controllers/upload.controller");
const authMiddleWare = require("../app/middlewares/auth.middleware");
const roleMiddleWare = require("../app/middlewares/role.middware");

// upload avatar user
router.post(
  "/user/avatar",
  authMiddleWare.verifyToken,
  upload.single("avatar"),
  uploadController.uploadAvatarUser
);
// upload hình ảnh sản phẩm
router.post(
  "/product/thumbnail",
  authMiddleWare.verifyToken,
  roleMiddleWare.exceptNhanVienBanHang,
  upload.single("thumbnail"),
  uploadController.uploadProductThumbnail
);
// upload file excel mẫu cho danh mục
router.post(
  "/:ma_danh_muc/excel",
  authMiddleWare.verifyToken,
  roleMiddleWare.checkAdminOrManager,
  upload.single("excel"),
  uploadController.uploadExcel
);

module.exports = router;
