const xacThucRoute = require("./xacThuc.route");
const nguoiDungRoute = require("./nguoiDung.route");
const uploadRoute = require("./upload.route");
const phanQuyenRoute = require("./phanQuyen.route");
const fileRoute = require("./file.route");
const danhMucRoute = require("./danhmuc.route");
const tonKhoRoute = require("./tonKho.route");
const nhapkhoRoute = require("./nhapkho.route");
const reportRoute = require('./baocao.route');
const soQuyRoute = require('./soQuy.route');
const createError = require('http-errors');

const initApiRoute = (app) => {
  app.use('/api/v1/phanQuyen', phanQuyenRoute);
  app.use('/api/v1/xacThuc', xacThucRoute);
  app.use('/api/v1/nguoiDung', nguoiDungRoute);
  app.use('/api/v1/upload', uploadRoute);
  app.use('/api/v1/file', fileRoute);
  app.use('/api/v1/danhmuc', danhMucRoute);
  app.use('/api/v1/tonkho', tonKhoRoute);
  app.use('/api/v1/nhapkho', nhapkhoRoute);
  app.use('/api/v1/baocao', reportRoute);
  app.use('/api/v1/soquy', soQuyRoute);

  // handle error
  app.use((req, res, next) => {
    const error = createError.NotFound('Route is not exist');
    next(error);
  });
  app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message;
    return res.status(statusCode).json({ status: statusCode, message });
  });
};
module.exports = initApiRoute;
