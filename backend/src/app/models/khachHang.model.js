const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const _PhieuThu = require('./phieuThu.model');
const _PhieuBanHang = require('./phieuBanHang.model');
const createHttpError = require('http-errors');

/*
- Khi sửa tên cần cập nhật model
  + Phiếu bán hàng
  + Phiếu thu
- Khi xóa cần đảm bảo không có model nào đang phụ thuộc
 */

const khachHangSchema = new mongoose.Schema(
  {
    ma_kh: {
      type: String,
      unique: true,
    },
    ten_kh: {
      type: String,
      required: true,
      unique: true,
    },
    sdt: {
      type: String,
      required: true,
      unique: true,
    },
    dia_chi: {
      type: String,
      default: '',
    },
    ngay_sinh: {
      type: Date,
      default: null,
    },
    email: {
      type: String,
      default: '',
    },
    createdBy: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: String,
      default: '',
    },
  },
  { timestamps: true, collection: 'khach_hang' }
);

khachHangSchema.pre('save', async function (next) {
  try {
    const khachHang = this;
    khachHang.ma_kh = khachHang.sdt;
    next();
  } catch (error) {
    next(error);
  }
});

khachHangSchema.pre('updateOne', async function (next) {
  try {
    const filter = this.getFilter();
    const oldKhachHang = await this.model.findOne(filter);
    this.oldKhachHang = oldKhachHang;
    next();
  } catch (error) {
    next(error);
  }
});
khachHangSchema.post('updateOne', async function () {
  const khachHang = this.getUpdate().$set;
  if (khachHang.ten_kh !== this.oldKhachHang.ten_kh) {
    await _PhieuThu.updateMany(
      { ma_nhom_nguoi_nop: 'kh', ma_nguoi_nop: khachHang.ma_kh },
      {
        ten_nguoi_nop: khachHang.ten_kh,
      }
    );
    await _PhieuBanHang.updateMany(
      { ma_kh: khachHang.ma_kh },
      { ten_kh: khachHang.ten_kh }
    );
  }
});
khachHangSchema.pre('updateMany', async function (next) {
  try {
    let error;
    const filter = this.getFilter();
    const khachHangs = await this.model.find(filter);
    const maKhs = khachHangs.map((item) => item.ma_kh);
    const pbh = await _PhieuBanHang.findOne({ ma_kh: { $in: maKhs } });
    if (pbh) {
      error = createHttpError(
        400,
        `Khách hàng đã phát sinh hóa đơn '${pbh.ma_phieu}'`
      );
    }
    const pt = await _PhieuThu.findOne({
      ma_nhom_nguoi_nop: 'kh',
      ma_nguoi_nop: { $in: maKhs },
    });
    if (!pbh && pt) {
      error = createHttpError(
        400,
        `Khách hàng đã phát sinh phiếu thu '${pt.ma_phieu}'`
      );
    }
    if (error) {
      return next(error);
    } else {
      return next();
    }
  } catch (error) {
    next(error);
  }
});

khachHangSchema.index(
    { ma_kh: "text", ten_kh: "text",sdt:'text',dia_chi:'text',email:'text'},
    { default_language: "none" }
  );
khachHangSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: 'all',
});

module.exports = mongoose.model('Khách Hàng', khachHangSchema);
