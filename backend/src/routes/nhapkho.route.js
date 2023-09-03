const router = require("express").Router();
const nhapKhoController = require("../app/controllers/nhapkho.controller");
const authMiddleWare = require("../app/middlewares/auth.middleware");

router.post(
  "/chitiet",
  authMiddleWare.verifyToken,
  nhapKhoController.getDetailImportByProduct
);

module.exports = router;
