const router = require("express").Router();
const xacThucController = require("../app/controllers/xacThuc.controller");

router.post(
  "/dangKy",
  xacThucController.dangKy
);
router.post("/dangNhap", xacThucController.dangNhap);
router.post("/lamMoi", xacThucController.lamMoi);

module.exports = router;
