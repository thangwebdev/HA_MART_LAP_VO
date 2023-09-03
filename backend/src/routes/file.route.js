const router = require("express").Router();
const fileController = require("../app/controllers/file.controller");
const authMiddleWare = require("../app/middlewares/auth.middleware");

// get link exel danh muc
router.get(
  "/:ma_danh_muc/excel",
  authMiddleWare.verifyToken,
  fileController.getLink
);

module.exports = router;
