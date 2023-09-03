const nguoiDungModel = require("../models/nguoiDung.model");
const createError = require("http-errors");

const userController = {
  // cập nhật
  async capNhatNguoiDung(req, res, next) {
    try {
      if (
        !(req.user.ma_phan_quyen === 1 || req.user.email === req.body.email)
      ) {
        return next(
          createError(
            403,
            `Chỉ chủ cửa hàng và tài khoản ${req.body.email} mới có quyền với tính năng này`
          )
        );
      }
      const { _id, ma_phan_quyen, ten_phan_quyen, email, ...rest } = req.body;
      if (!email) {
        return next(
          createError(400, "Không xác định được người dùng cập nhật")
        );
      }
      let user = await nguoiDungModel.findOne({ email });
      if (!user) {
        return next(createError(404, `Người dùng '${email}' không tồn tại`));
      }

      await nguoiDungModel.updateOne(
        { email: req.body.email },
        { ...rest, nguoi_chinh_sua: req.user.email }
      );
      user = await nguoiDungModel.findOne({ email }).select(["-mat_khau"]);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  async xoaNguoiDungVaoThungRac(req, res, next) {
    try {
      const id = req.params.id;
      if (!id) {
        return next(createError(400, "Không xác định được người dùng để xóa"));
      }
      const userToDelete = await nguoiDungModel
        .findById(id)
        .select(["-mat_khau"]);
      if (!userToDelete) {
        return next(404, "Người dùng không tồn tại");
      }
      await userToDelete.delete(req.user.email);
      return res.status(200).json(userToDelete);
    } catch (error) {
      next(error);
    }
  },
  // verify email
  async verifyEmail(req, res, next) {
    try {
      const { _id, email } = req.user;
    } catch (error) {
      next(error);
    }
  },
  // xem danh sách nhân viên
  async xemNhanVien(req, res, next) {
    try {
      let currentPage = 1;
      let rowPerPage = 20;
      const { page, limit, ...condition } = req.body;
      if (page) {
        currentPage = page;
      }
      if (limit) {
        rowPerPage = limit;
      }
      const skip = rowPerPage * (currentPage - 1);
      const staffs = await nguoiDungModel
        .find({ ma_phan_quyen: { $ne: 1 }, ...condition })
        .select(["-mat_khau"])
        .skip(skip)
        .limit(rowPerPage);
      return res.status(200).json(staffs);
    } catch (error) {
      next(error);
    }
  },
};
module.exports = userController;
