const router = require("express").Router();
const phanQuyenController = require("../app/controllers/phanQuyenController");
const authMiddleWare = require("../app/middlewares/auth.middleware");

router.post("/",  phanQuyenController.create);

module.exports = router;
