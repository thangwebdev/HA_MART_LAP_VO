const reports = require('../../utils/reports');
const createHttpError = require('http-errors');

const reportMiddleWare = {
  specifyReport(req, res, next) {
    try {
      const { reportCode } = req.params;
      const report = reports[reportCode];
      if (!report) {
        return next(
          createHttpError(404, `Loại báo cáo '${reportCode}' không tồn tại`)
        );
      }
      req.report = report;
      return next();
    } catch (error) {
      next(error);
    }
  },
};
module.exports = reportMiddleWare;
