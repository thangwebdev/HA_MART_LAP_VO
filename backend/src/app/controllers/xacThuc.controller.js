const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/myUtil");
const {
  validateNguoiDungDangKy,
  validateNguoiDungDangNhap,
} = require("../../utils/validate");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token.model");
const nguoiDungModel = require("../models/nguoiDung.model");
const phanQuyenModel = require("../models/phanQuyen.model");

const xacThucController = {
  // Đăng ký tài khoản
  async dangKy(req, res, next) {
    try {
      const { ten_nguoi_dung, ma_nguoi_dung, mat_khau, email, ma_phan_quyen } =
        req.body;
      const { error } = validateNguoiDungDangKy({
        ma_nguoi_dung,
        ten_nguoi_dung,
        mat_khau,
        email,
        ma_phan_quyen,
      });
      if (error) {
        return next(error);
      }
      let userCheck = await nguoiDungModel.findOneWithDeleted({
        email,
      });
      if (userCheck) {
        return next(createError(400, `Email này đã tồn tại`));
      }
      userCheck = await nguoiDungModel.findOneWithDeleted({
        ma_nguoi_dung,
      });
      if (userCheck) {
        return next(createError(400, `Mã người dùng đã tồn tại`));
      }
      const phanQuyen = await phanQuyenModel.findOne({ ma_phan_quyen });
      if (!phanQuyen) {
        return next(
          createError(404, `Mã phân quyền '${ma_phan_quyen}' không tồn tại`)
        );
      }
      const userToSave = new nguoiDungModel({
        ...req.body,
        ten_phan_quyen: phanQuyen.ten_phan_quyen,
        nguoi_tao: req.user.email,
      });
      await userToSave.save();
      const { mat_khau: mk, ...user } = userToSave._doc;
      return res.status(200).json(user);
    } catch (error) {
      error.statusCode = 500;
      next(error);
    }
  },
  // đăng nhập
  async dangNhap(req, res, next) {
    try {
      const { email, mat_khau } = req.body;
      const { error } = validateNguoiDungDangNhap({ email, mat_khau });
      if (error) {
        return next(error);
      }
      const user = await nguoiDungModel.findOne({ email });
      if (!user) {
        return next(createError(404, `Email '${email}' không tồn tại`));
      }
      const isValidPassword = await user.isValidPassword(mat_khau);
      if (!isValidPassword) {
        return next(createError(400, "Mật khẩu không trùng khớp"));
      }
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      const tokenSaved = await tokenModel.findOne({ email: email });
      if (tokenSaved) {
        await tokenModel.deleteOne({ email });
      }
      await tokenModel.create({ email, value: refreshToken });
      const { mat_khau: pw, ...userSend } = user.toObject();
      return res
        .status(200)
        .json({ user: userSend, accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  },
  // refresh token
  async lamMoi(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const tokenExisted = await tokenModel.findOne({
        value: refreshToken,
      });
      if (!tokenExisted) {
        return next(createError(404, "Refresh token không tồn tại"));
      }
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_KEY,
        async function (err, decoded) {
          if (err) {
            return next(createError(400, "Refresh token không hợp lệ"));
          }
          await tokenModel.deleteOne({ value: refreshToken });
          const accessToken = generateAccessToken(decoded);
          const newRefreshToken = generateRefreshToken(decoded);
          await tokenModel.create({ value: newRefreshToken });
          return res
            .status(200)
            .json({ accessToken, refreshToken: newRefreshToken });
        }
      );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = xacThucController;
