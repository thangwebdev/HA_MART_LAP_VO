const router = require("express").Router();
const soQuyController = require("../app/controllers/soquy.controller");
const authMiddleware = require("../app/middlewares/auth.middleware");
const roleMiddleware = require('../app/middlewares/role.middware');

router.post(
  '/',
  authMiddleware.verifyToken,
  roleMiddleware.checkAdminOrManager,
  soQuyController.getSoquy
);

module.exports = router;
