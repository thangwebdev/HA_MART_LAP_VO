const router = require("express").Router();
const authMiddleWare = require("../app/middlewares/auth.middleware");
const roleMiddleWare = require("../app/middlewares/role.middware");
const nguoiDungController = require("../app/controllers/nguoiDung.controlle");

router.put(
  "/",
  authMiddleWare.verifyToken,
  nguoiDungController.capNhatNguoiDung
);
router.delete(
  "/:id",
  authMiddleWare.verifyToken,
  roleMiddleWare.checkAdmin,
  nguoiDungController.xoaNguoiDungVaoThungRac
);
router.get(
  "/verify-email",
  authMiddleWare.verifyToken,
  nguoiDungController.verifyEmail
);
router.post(
  "/nhanvien",
  authMiddleWare.verifyToken,
  nguoiDungController.xemNhanVien
);

module.exports = router;
