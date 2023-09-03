const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const _Lo = require('./lo.model');
const _PhieuChi = require('./phieuChi.model');
const _PhieuThu = require('./phieuThu.model');
const _PhieuNhapKho = require('./phieuNhapKho.model');
const _PhieuXuatHuy = require('./phieuXuatHuy.model');
const _PhieuDieuChuyen = require('./phieuDieuChuyen.model');
const _PhieuKiemKho = require('./phieuKiemKho.model');
const _PhieuBanHang = require('./phieuBanHang.model');
const createHttpError = require('http-errors');
const loModel = require("./lo.model");

/*
- Khi chỉnh sửa tên kho cần cập nhật các model
  + Lô,
  + phiếu chi,
  + phiếu thu,
  + phiếu nhập,
  + phiếu xuất hủy,
  + Phiếu điều chuyển
  + phiếu kiểm kho
  + Phiếu bán hàng
- Nếu xóa cần đảm bảo không có model nào ở trên đang phụ thuộc
 */

const khoSchema = new mongoose.Schema(
  {
    ma_kho: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ten_kho: {
      type: String,
      required: true,
      index: true,
    },
    dia_chi: {
      type: String,
      default: '',
    },
    dien_thoai: {
      type: String,
      default: '',
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
  { timestamps: true, collection: 'kho' }
);

khoSchema.pre('updateOne', async function (next) {
  try {
    const filter = this.getFilter();
    const oldKho = this.model.findOne(filter);
    this.oldKho = oldKho;
    next();
  } catch (error) {
    next(error);
  }
});
khoSchema.post('updateOne', async function () {
  const kho = this.getUpdate().$set;
  if (kho.ten_kho !== this.oldKho.ten_kho) {
    await _PhieuBanHang.setKho({ ma_kho: kho.ma_kho, ten_kho: kho.ten_kho });
    await _PhieuChi.setKho({ ma_kho: kho.ma_kho, ten_kho: kho.ten_kho });
    await _PhieuThu.setKho({ ma_kho: kho.ma_kho, ten_kho: kho.ten_kho });
    await _PhieuNhapKho.setKho({ ma_kho: kho.ma_kho, ten_kho: kho.ten_kho });
    await _PhieuKiemKho.setKho({ ma_kho: kho.ma_kho, ten_kho: kho.ten_kho });
    await _PhieuDieuChuyen.setKho({ ma_kho: kho.ma_kho, ten_kho: kho.ten_kho });
    await _PhieuXuatHuy.setKho({ ma_kho: kho.ma_kho, ten_kho: kho.ten_kho });
    await _Lo.setKho({ ma_kho: kho.ma_kho, ten_kho: kho.ten_kho });
  }
});
khoSchema.pre('updateMany', async function (next) {
  try {
    const filter = this.getFilter();
    const khos = await this.model.find(filter);
    for (let i = 0; i < khos.length; i++) {
      const kho = khos[i];
      const pbh = await _PhieuBanHang.isExistMaKho(kho.ma_kho);
      const pc = await _PhieuChi.isExistMaKho(kho.ma_kho);
      const pt = await _PhieuThu.isExistMaKho(kho.ma_kho);
      const pnk = await _PhieuNhapKho.isExistMaKho(kho.ma_kho);
      const pkk = await _PhieuKiemKho.isExistMaKho(kho.ma_kho);
      const pdc = await _PhieuDieuChuyen.isExistMaKho(kho.ma_kho);
      const pxh = await _PhieuXuatHuy.isExistMaKho(kho.ma_kho);
      const lo = await _Lo.isExistMaKho(kho.ma_kho);

      if (pbh || pc || pt || pnk || pkk || pdc || pxh || lo) {
        error = createHttpError(
          400,
          `Kho '${kho.ten_kho}' đã phát sinh dữ liệu`
        );
        break;
      }
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

khoSchema.index(
  { ma_kho: "text", ten_kho: "text" },
  { default_language: "none" }
);
khoSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: "all",
});

module.exports = mongoose.model("Kho", khoSchema);
