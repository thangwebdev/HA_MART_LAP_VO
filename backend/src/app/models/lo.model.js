const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const _PhieuNhapKho = require('./phieuNhapKho.model');
const _PhieuKiemKho = require('./phieuKiemKho.model');
const _PhieuXuatHuy = require('./phieuXuatHuy.model');
const _PhieuBanHang = require('./phieuBanHang.model');
const createHttpError = require('http-errors');

/*
- Khi sửa tên lô cần cập nhật model
  + Phiếu nhập kho
  + Phiếu kiểm kho
  + Phiếu xuất hủy
  + Phiếu bán hàng
- Khi xóa cần đảm bảo không có model nào phụ thuộc
 */

const loSchema = new mongoose.Schema(
  {
    ma_lo: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ten_lo: {
      type: String,
      required: true,
      index: true,
    },
    ma_kho: {
      type: String,
      required: true,
    },
    ten_kho: {
      type: String,
      required: true,
    },
    ngay_san_xuat: {
      type: Date,
      default: '',
    },
    han_su_dung: {
      type: Date,
      default: '',
    },
    ma_vt: {
      type: String,
      default: '',
    },
    ten_vt: {
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
  { timestamps: true, collection: 'lo' }
);

loSchema.pre('updateOne', async function (next) {
  try {
    const filter = this.getFilter();
    const oldLo = this.model.findOne(filter);
    this.oldLo = oldLo;
    next();
  } catch (error) {
    next(error);
  }
});
loSchema.post('updateOne', async function () {
  const lo = this.getUpdate().$set;
  if (lo.ten_lo !== this.oldLo.ten_lo) {
    await _PhieuNhapKho.setLo({ ma_lo: lo.ma_lo, ten_lo: lo.ten_lo });
    await _PhieuKiemKho.setLo({ ma_lo: lo.ma_lo, ten_lo: lo.ten_lo });
    await _PhieuXuatHuy.setLo({ ma_lo: lo.ma_lo, ten_lo: lo.ten_lo });
    await _PhieuBanHang.setLo({ ma_lo: lo.ma_lo, ten_lo: lo.ten_lo });
  }
});
loSchema.pre('updateMany', async function (next) {
  try {
    let error
    const filter = this.getFilter();
    const loUpdate = this.getUpdate();
    if (loUpdate.deleted === true) {
      const los = await this.model.find(filter);
      for (let i = 0; i < los.length; i++) {
        const lo = los[i];
        const pnk = await _PhieuNhapKho.isExistMaLo(lo.ma_lo);
        const pkk = await _PhieuKiemKho.isExistMaLo(lo.ma_lo);
        const pxk = await _PhieuXuatHuy.isExistMaLo(lo.ma_lo);
        const pbh = await _PhieuBanHang.isExistMaLo(lo.ma_lo);
        if (pnk) {
          error = createHttpError(
            400,
            `Lô '${lo.ten_lo}' đã phát sinh dữ liệu với phiếu nhập '${pnk.ma_phieu}'`
          );
          break;
        } else if (pkk) {
          error = createHttpError(
            400,
            `Lô '${lo.ten_lo}' đã phát sinh dữ liệu với phiếu kiểm kho '${pkk.ma_phieu}'`
          );
          break;
        } else if (pxk) {
          error = createHttpError(
            400,
            `Lô '${lo.ten_lo}' đã phát sinh dữ liệu với phiếu xuất kho '${pxk.ma_phieu}'`
          );
          break;
        } else if (pbh) {
          error = createHttpError(
            400,
            `Lô '${lo.ten_lo}' đã phát sinh dữ liệu với hóa đơn '${pxk.ma_phieu}'`
          );
          break;
        }
      }
      if (error) {
        return next(error);
      } else {
        return next();
      }
    }
  } catch (error) {
    next(error);
  }
});

// function
loSchema.statics.setKho = async function ({ ma_kho, ten_kho }) {
  await this.updateMany({ ma_kho }, { ten_kho });
};
loSchema.statics.isExistMaKho = async function (ma_kho) {
  const result = await this.findOne({ ma_kho });
  return result;
};
loSchema.statics.setTenVt = async function({ma_vt, ten_vt}) {
  await this.updateMany({ma_vt}, {ten_vt})
}
loSchema.statics.isExistMaVt = async function(ma_vt) {
  const result = await this.findOne({ma_vt})
  return result
}

loSchema.index({ ma_lo: "text", ten_lo: "text" }, { default_language: "none" });
loSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: "all",
});

module.exports = mongoose.model("Lo", loSchema);
