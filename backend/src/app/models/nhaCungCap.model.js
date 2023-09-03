const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const _PhieuThu = require('./phieuThu.model');
const _PhieuChi = require('./phieuChi.model');
const _PhieuNhapKho = require('./phieuNhapKho.model');
const createHttpError = require('http-errors');

/*
- Khi sửa tên cần cập nhật model
  + Phiếu nhập kho
  + Phiếu thu
  + Phiếu chi
- Khi xóa cần đảm bảo không có model nào phụ thuộc
 */

const nhaCungCapSchema = new mongoose.Schema(
  {
    ma_ncc: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ten_ncc: {
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
    fax: {
      type: String,
      default: '',
    },
    thong_tin_them: {
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
  { timestamps: true, collection: 'nha_cung_cap' }
);
nhaCungCapSchema.pre('updateOne', async function (next) {
  try {
    const filter = this.getFilter();
    const oldNCC = await this.model.findOne(filter);
    this.oldNCC = oldNCC;
    next();
  } catch (error) {
    next(error);
  }
});
nhaCungCapSchema.post('updateOne', async function () {
  const NCC = this.getUpdate().$set;
  if (NCC.ten_ncc !== this.oldNCC.ten_ncc) {
    await _PhieuThu.updateMany(
      { ma_nhom_nguoi_nop: 'ncc', ma_nguoi_nop: NCC.ma_ncc },
      {
        ten_nguoi_nop: NCC.ten_ncc,
      }
    );
    await _PhieuChi.updateMany(
      { ma_nhom_nguoi_nhan: 'ncc', ma_nguoi_nhan: NCC.ma_ncc },
      {
        ten_nguoi_nhan: NCC.ten_ncc,
      }
    );
    await _PhieuNhapKho.updateMany(
      { ma_ncc: NCC.ma_ncc },
      { ten_ncc: NCC.ten_ncc }
    );
  }
});
nhaCungCapSchema.pre('updateMany', async function (next) {
  try {
    let error;
    const filter = this.getFilter();
    const NCCS = await this.model.find(filter);
    const maNCCs = NCCS.map((item) => item.ma_ncc);
    const pnk = await _PhieuNhapKho.findOne({ ma_ncc: { $in: maNCCs } });
    if (pnk) {
      error = createHttpError(
        400,
        `Nhà cung cấp '${pnk.ten_ncc}' đã phát sinh  '${pnk.ma_phieu}'`
      );
    }
    const pt = await _PhieuThu.findOne({
      ma_nhom_nguoi_nop: 'ncc',
      ma_nguoi_nop: { $in: maNCCs },
    });
    const pc = await _PhieuChi.findOne({
      ma_nhom_nguoi_nop: 'ncc',
      ma_nguoi_nop: { $in: maNCCs },
    });
    if (!pnk && pt) {
      error = createHttpError(
        400,
        `Nhà cung cấp ' ${pt.ten_nguoi_nop} ' đã phát sinh phiếu thu '${pt.ma_phieu}'`
      );
    }
    if (!pnk && pc) {
      error = createHttpError(
        400,
        `Nhà cung cấp ' ${pc.ten_nguoi_nhan} 'đã phát sinh phiếu chi '${pc.ma_phieu}'`
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
nhaCungCapSchema.index(
  { ma_ncc: "text", ten_ncc: "text" },
  { default_language: "none" }
);
nhaCungCapSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: "all",
});

module.exports = mongoose.model("NhaCungCap", nhaCungCapSchema);
