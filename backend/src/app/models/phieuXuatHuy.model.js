const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const soKhoModel = require('./soKho.model');
const chungTuModel = require('../models/chungTu.model');
const tonKhoController = require('../controllers/tonkho.controller');
const {
  generateRandomCode,
  generateUniqueValueUtil,
} = require('../../utils/myUtil');
const createHttpError = require('http-errors');

/*
- Khi sửa cần sửa sổ kho
- Khi xóa cần xóa sổ kho
 */

const phieuXuatHuySchema = new mongoose.Schema(
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
    ma_vt: {
      type: String,
      required: true,
    },
    ten_vt: {
      type: String,
      required: true,
    },
    ma_kho: {
      type: String,
      required: true,
    },
    ten_kho: {
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
    ngay_ct: {
      type: Date,
      default: null,
    },
    ngay_huy_hang: {
      type: Date,
      default: null,
    },
    sl_huy: {
      type: Number,
      required: true,
    },
    gia_tri_huy: {
      type: Number,
      default: 0,
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
  { timestamps: true, collection: 'phieu_xuat_huy' }
);

const generateUniqueValue = async () => {
  let maChungTu = generateRandomCode(6, 'pxh');
  const doc = await mongoose
    .model('PhieuXuatHuy', phieuXuatHuySchema)
    .findOne({ ma_ct: maChungTu });
  if (doc) {
    return await generateUniqueValue();
  } else {
    return maChungTu;
  }
};

phieuXuatHuySchema.pre('save', async function (next) {
  try {
    const pxh = this;
    const tonKho = await tonKhoController.getInventoryOnStoreHelper({
      ma_vt: pxh.ma_vt,
      ma_kho: pxh.ma_kho,
    });
    if (tonKho.ton_kho < pxh.sl_huy) {
      return next(
        createHttpError(
          400,
          `Hàng hóa '${pxh.ten_vt}' chỉ tồn '${tonKho.ton_kho}' ở kho '${pxh.ten_kho}'`
        )
      );
    }
    const maCt = await generateUniqueValueUtil({
      maDm: 'PXK',
      model: mongoose.model('PhieuXuatHuy', phieuXuatHuySchema),
      compareKey: 'ma_ct',
    });
    pxh.ma_ct = maCt;
    if (!pxh.ma_phieu) {
      const maPhieu = await generateUniqueValueUtil({
        maDm: 'PXK',
        model: mongoose.model('PhieuXuatHuy', phieuXuatHuySchema),
        compareKey: 'ma_phieu',
      });
      pxh.ma_phieu = maPhieu;
    }
    const chungTu = await chungTuModel.findOne({ ma_ct: 'pxh' });
    pxh.ma_loai_ct = chungTu.ma_ct;
    pxh.ten_loai_ct = chungTu.ten_ct;
    return next();
  } catch (error) {
    next(error);
  }
});

phieuXuatHuySchema.post('save', async function () {
  const pxh = this;
  const ngay = pdc.ngay_ct.getDate();
  const thang = pnk.ngay_ct.getMonth() + 1;
  const nam = pnk.ngay_ct.getFullYear();
  const quy = getQuyByMonth(thang);
  const gio = pnk.ngay_ct.getHours();
  const phut = pnk.ngay_ct.getMinutes();
  const giay = pnk.ngay_ct.getSeconds();
  await soKhoModel.create({
    ma_ct: pxh.ma_ct,
    ma_loai_ct: pxh.ma_loai_ct,
    ten_loai_ct: pxh.ten_loai_ct,
    ngay_ct: pxh.ngay_ct,
    ma_kho: pxh.ma_kho,
    ten_kho: pxh.ten_kho,
    ma_lo: pxh.ma_lo,
    ten_lo: pxh.ten_lo,
    ma_vt: pxh.ma_vt,
    ten_vt: pxh.ten_vt,
    sl_xuat: pxh.sl_huy,
    so_luong: -pxh.sl_huy,
    nam,
    quy,
    thang,
    ngay,
    gio,
    phut,
    giay,
  });
});

phieuXuatHuySchema.post('updateMany', async function () {
  const _update = this.getUpdate();
  const filter = this.getFilter();
  if (_update.$set.deleted) {
    const pxhs = await this.model.findDeleted(filter);
    const maCts = pxhs.map((item) => item.ma_ct);
    await soKhoModel.delete({ ma_ct: { $in: maCts } });
  } else {
    const pxhs = await this.model.find(filter);
    const maCts = pxhs.map((item) => item.ma_ct);
    await soKhoModel.restore({ ma_ct: { $in: maCts } });
  }
});
phieuXuatHuySchema.pre('deleteMany', async function (next) {
  try {
    const pxh = this;
    const filter = pxh.getFilter();
    const pxhs = await this.model.findDeleted(filter).select(['-_id', 'ma_ct']);
    const maCts = pxhs.map((item) => item.ma_ct);
    await soKhoModel.deleteMany({ ma_ct: { $in: maCts } });
  } catch (error) {
    return next(error);
  }
});

phieuXuatHuySchema.post('updateOne', async function () {
  const pxh = this.getUpdate().$set;
  const soKho = await soKhoModel.findOne({ ma_ct: pxh.ma_ct });
  soKho.ngay_ct = pxh.ngay_ct;
  soKho.ma_kho = pxh.ma_kho;
  soKho.ten_kho = pxh.ten_kho;
  soKho.ma_lo = pxh.ma_lo;
  soKho.ten_lo = pxh.ten_lo;
  soKho.ma_vt = pxh.ma_vt;
  soKho.ten_vt = pxh.ten_vt;
  soKho.sl_xuat = pxh.sl_huy;
  soKho.so_luong = -pxh.sl_huy;
  await soKho.save();
});
// function
phieuXuatHuySchema.statics.setKho = async function ({ ma_kho, ten_kho }) {
  await this.updateMany({ ma_kho }, { ten_kho });
};
phieuXuatHuySchema.statics.isExistMaKho = async function (ma_kho) {
  const result = await this.findOne({ ma_kho});
  return result;
};
phieuXuatHuySchema.statics.setLo = async function ({ ma_lo, ten_lo }) {
  await this.updateMany({ ma_lo }, { ten_lo });
};
phieuXuatHuySchema.statics.isExistMaLo = async function(ma_lo) {
  const result = await this.findOne({ma_lo})
  return result
}
phieuXuatHuySchema.statics.setTenVt = async function ({ ma_vt, ten_vt }) {
  await this.updateMany({ ma_vt }, { ten_vt });
};
phieuXuatHuySchema.statics.isExistMaVt = async function (ma_vt) {
  const result = await this.findOne({ ma_vt });
  return result;
};


phieuXuatHuySchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: 'all',
});


module.exports = mongoose.model('PhieuXuatHuy', phieuXuatHuySchema);
