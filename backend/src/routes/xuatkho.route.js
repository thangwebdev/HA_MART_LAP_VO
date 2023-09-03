const router = require("express").Router();
const xuatKhoController = require("../app/controllers/xuatkho.controller");
const authMiddleWare = require("../app/middlewares/auth.middleware");

router.post(
  "/chitiet",
  authMiddleWare.verifyToken,
  xuatKhoController.getDetailExportByProduct
);

module.exports = router;
