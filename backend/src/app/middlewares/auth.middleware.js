const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const authMiddleWare = {
  verifyToken(req, res, next) {
    const tokenHeader = req.headers["authorization"];
    if (!tokenHeader) {
      return next(createError(404, "Chúng tôi không biết bạn là ai"));
    }
    const accessToken = tokenHeader.split(" ")[1];
    jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_KEY,
      function (err, decoded) {
        if (err) {
          return next(createError(401, "Bạn chưa được xác thực"));
        }
        req.user = decoded;
        next();
      }
    );
  },
};
module.exports = authMiddleWare;
