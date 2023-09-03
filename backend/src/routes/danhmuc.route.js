const router = require("express").Router();
const danhMucController = require("../app/controllers/danhmuc.controller");
const authMiddleWare = require("../app/middlewares/auth.middleware");
const danhMucMiddleWare = require("../app/middlewares/danhmuc.middleware");
const { upload } = require("../utils/myUtil");

// thêm mới
router.post(
  "/:ma_danh_muc",
  authMiddleWare.verifyToken,
  danhMucMiddleWare.assignDanhMuc,
  danhMucMiddleWare.specifyRoleOnDanhMuc,
  danhMucController.create
);
// cập nhật
router.put(
  "/:ma_danh_muc",
  authMiddleWare.verifyToken,
  danhMucMiddleWare.assignDanhMuc,
  danhMucMiddleWare.specifyRoleOnDanhMuc,
  danhMucController.update
);
// xóa bản ghi vào thùng rác
router.delete(
  "/:ma_danh_muc",
  authMiddleWare.verifyToken,
  danhMucMiddleWare.assignDanhMuc,
  danhMucMiddleWare.specifyRoleOnDanhMuc,
  danhMucController.deleteMany
);
// xóa vĩnh viễn
router.delete(
  "/:ma_danh_muc/destroy",
  authMiddleWare.verifyToken,
  danhMucMiddleWare.assignDanhMuc,
  danhMucMiddleWare.specifyRoleOnDanhMuc,
  danhMucController.destroyMany
);
// Khôi phục từ thùng rác
router.post(
  "/:ma_danh_muc/restore",
  authMiddleWare.verifyToken,
  danhMucMiddleWare.assignDanhMuc,
  danhMucMiddleWare.specifyRoleOnDanhMuc,
  danhMucController.restoreMany
);
// Lấy danh sách kèm điều kiện
router.post(
  "/:ma_danh_muc/search",
  authMiddleWare.verifyToken,
  danhMucMiddleWare.assignDanhMuc,
  danhMucController.search
);
// Lấy danh sách đã xóa kèm điều kiện
router.post(
  "/:ma_danh_muc/search/deleted",
  authMiddleWare.verifyToken,
  danhMucMiddleWare.assignDanhMuc,
  danhMucController.searchDeleted
);
// import bản ghi từ excel
router.post(
  "/:ma_danh_muc/import-excel",
  authMiddleWare.verifyToken,
  danhMucMiddleWare.assignDanhMuc,
  danhMucMiddleWare.specifyRoleOnDanhMuc,
  upload.single("excel"),
  danhMucController.importExcel
);
module.exports = router;
