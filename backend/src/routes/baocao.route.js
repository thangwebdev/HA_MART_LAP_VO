const router = require('express').Router();
const authMiddleWare = require('../app/middlewares/auth.middleware');
const roleMiddleWare = require('../app/middlewares/role.middware');
const reportController = require('../app/controllers/baocao.controller');
const reportMiddleWare = require('../app/middlewares/report.middleware');

// Báo cáo bán hàng
// Báo cáo doanh thu
router.post(
  '/:reportCode',
  authMiddleWare.verifyToken,
  roleMiddleWare.checkAdminOrManager,
  reportMiddleWare.specifyReport,
  reportController.reportFinance
);
router.post(
  '/hanghoa/tonghop',
  authMiddleWare.verifyToken,
  roleMiddleWare.checkAdminOrManager,
  reportController.reportHangHoa
);

module.exports = router;
