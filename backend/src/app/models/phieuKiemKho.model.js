const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const soKhoModel = require("./soKho.model");
const chungTuModel = require("../models/chungTu.model");
const loModel = require("../models/lo.model");
const tonKhoController = require("../controllers/tonkho.controller");
const {
  generateRandomCode,
  getQuyByMonth,
  generateUniqueValueUtil,
} = require('../../utils/myUtil');
const createHttpError = require('http-errors');

/*
- Khi sửa cần sửa sổ kho
- Khi xóa cần xóa sổ kho
 */

const phieuKiemKhoSchema = new mongoose.Schema(
  {
    ma_phieu: {
      type: String,
      unique: true,
    },
    ma_ct: {
      type: String,
    },
    ma_loai_ct: {
      type: String,
    },
    ten_loai_ct: {
      type: String,
    },
    ma_kho: {
      type: String,
      required: true,
    },
    ten_kho: {
      type: String,
      required: true,
    },
    ma_vt: {
      type: String,
      required: true,
    },
    ten_vt: {
      type: String,
      required: true,
    },
    ma_lo: {
      type: String,
      default: '',
    },
    ten_lo: {
      type: String,
      default: '',
    },
    ton_kho_so_sach: {
      type: Number,
      default: 0,
    },
    ton_kho_thuc_te: {
      type: Number,
      default: 0,
    },
    chenh_lech: {
      type: Number,
      default: 0,
    },
    ngay_ct: {
      type: Date,
      default: null,
    },
    ngay_kiem_hang: {
      type: Date,
      default: null,
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
  { timestamps: true, collection: 'phieu_kiem_kho' }
);

const generateUniqueValue = async () => {
  let maChungTu = generateRandomCode(6, 'pkk');
  const doc = await mongoose
    .model('PhieuKiemKho', phieuKiemKhoSchema)
    .findOne({ ma_ct: maChungTu });
  if (doc) {
    return await generateUniqueValue();
  } else {
    return maChungTu;
  }
};

phieuKiemKhoSchema.pre('save', async function (next) {
  try {
    const pkk = this;
    let error;
    const tonKho = await tonKhoController.getInventoryOnStoreHelper({
      ma_vt: pkk.ma_vt,
      ma_kho: pkk.ma_kho,
    });
    if (tonKho.ton_kho <= 0) {
      error = createHttpError(
        400,
        `Hàng hóa '${pkk.ten_vt}' không có tồn kho trong kho '${pkk.ten_kho}'`
      );
    }
    if (pkk.ma_lo) {
      const loExisted = await loModel.findOne({
        ma_lo: pkk.ma_lo,
        ma_vt: pkk.ma_vt,
        ma_kho: pkk.ma_kho,
      });
      if (!loExisted) {
        error = createHttpError(
          404,
          `Lô '${pkk.ten_lo}' với hàng hóa '${pkk.ten_vt}' và kho '${pkk.ten_kho}' không tồn tại`
        );
      }
    }
    if (error) {
      return next(error);
    } else {
      const maCt = await generateUniqueValueUtil({
        maDm: 'PKK',
        model: mongoose.model('PhieuKiemKho', phieuKiemKhoSchema),
        compareKey: 'ma_ct',
      });
      pkk.ma_ct = maCt;
      if (!pkk.ma_phieu) {
        const maPhieu = await generateUniqueValueUtil({
          maDm: 'PKK',
          model: mongoose.model('PhieuKiemKho', phieuKiemKhoSchema),
          compareKey: 'ma_phieu',
        });
        pkk.ma_phieu = maPhieu;
      }
      const chungTu = await chungTuModel.findOne({ ma_ct: 'pkk' });
      pkk.ma_loai_ct = chungTu.ma_ct;
      pkk.ten_loai_ct = chungTu.ten_ct;
      pkk.chenh_lech = (pkk.ton_kho_thuc_te || 0) - (pkk.ton_kho_so_sach || 0);
      next();
    }
  } catch (error) {
    next(error);
  }
});

phieuKiemKhoSchema.post('save', async function () {
  /*
    chênh lệnh = số lượng thực tế - số lượng sổ sách
    Lưu vào sổ kho với trường số lượng = chênh lệch
  */
  const pkk = this;
  const ngay = pkk.ngay_ct.getDate();
  const thang = pkk.ngay_ct.getMonth() + 1;
  const nam = pkk.ngay_ct.getFullYear();
  const quy = getQuyByMonth(thang);
  const gio = pkk.ngay_ct.getHours();
  const phut = pkk.ngay_ct.getMinutes();
  const giay = pkk.ngay_ct.getSeconds();
  // luu vao so kho
  await soKhoModel.create({
    ma_ct: pkk.ma_ct,
    ma_loai_ct: pkk.ma_loai_ct,
    ten_loai_ct: pkk.ten_loai_ct,
    ma_kho: pkk.ma_kho,
    ten_kho: pkk.ten_kho,
    ngay_ct: pkk.ngay_ct,
    nam,
    quy,
    thang,
    ngay,
    gio,
    phut,
    giay,
    ma_lo: pkk.ma_lo,
    ten_lo: pkk.ten_lo,
    ma_vt: pkk.ma_vt,
    ten_vt: pkk.ten_vt,
    so_luong: pkk.ton_kho_thuc_te - pkk.ton_kho_so_sach,
  });
});

phieuKiemKhoSchema.post('updateMany', async function () {
  try {
    const pkk = this;
    const _update = pkk.getUpdate();
    const filter = pkk.getFilter();
    if (_update.$set.deleted) {
      const phieuKiemKhos = await this.model
        .findDeleted(filter)
        .select(['-_id', 'ma_ct']);
      const maCts = phieuKiemKhos.map((item) => item.ma_ct);
      await soKhoModel.delete({ ma_ct: { $in: maCts } });
    } else {
      const phieuKiemKhos = await this.model
        .find(filter)
        .select(['-_id', 'ma_ct']);
      const maCts = phieuKiemKhos.map((item) => item.ma_ct);
      await soKhoModel.restore({ ma_ct: { $in: maCts } });
    }
  } catch (error) {
    return next(error);
  }
});


phieuKiemKhoSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: "all",
});

// function
phieuKiemKhoSchema.statics.setKho = async function ({ ma_kho, ten_kho }) {
  await this.updateMany({ ma_kho }, { ten_kho });
};
phieuKiemKhoSchema.statics.isExistMaKho = async function (ma_kho) {
  const result = await this.findOne({ ma_kho });
  return result;
};
phieuKiemKhoSchema.statics.setLo = async function ({ ma_lo, ten_lo }) {
  await this.updateMany({ ma_lo }, { ten_lo });
};
phieuKiemKhoSchema.statics.isExistMaLo = async function(ma_lo) {
  const result = await this.findOne({ma_lo})
  return result
}
phieuKiemKhoSchema.statics.setTenVt = async function ({ ma_vt, ten_vt }) {
  await this.updateMany({ ma_vt }, { ten_vt });
};
phieuKiemKhoSchema.statics.isExistMaVt = async function (ma_vt) {
  const result = await this.findOne({ ma_vt });
  return result;
};



module.exports = mongoose.model("PhieuKiemKho", phieuKiemKhoSchema);
