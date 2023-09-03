const mongoose = require('mongoose');
const {
  generateUniqueValueUtil,
  generateTimeByDate,
} = require('../../utils/myUtil');
const mongooseDelete = require('mongoose-delete');
const soQuyModel = require('./soQuy.model');

/*
- Khi sửa cần sửa sổ quỹ
- Khi xóa cần xóa sổ quỹ
 */

const phieuThuSchema = new mongoose.Schema(
  {
    ma_phieu: {
      type: String,
      default: '',
      unique: true,
    },
    ma_ct: {
      type: String,
      default: '',
    },
    ma_loai_ct: {
      type: String,
      default: 'ptt',
    },
    ten_loai_ct: {
      type: String,
      default: 'Phiếu thu tiền',
    },
    ma_ct_tham_chieu: {
      type: String,
      default: '',
    },
    ma_nhom_nguoi_nop: {
      type: String,
      default: '',
    },
    ten_nhom_nguoi_nop: {
      type: String,
      default: '',
    },
    ma_nguoi_nop: {
      type: String,
      default: '',
    },
    ten_nguoi_nop: {
      type: String,
      default: '',
    },
    ma_loai: {
      type: String,
      default: '',
    },
    ten_loai: {
      type: String,
      default: '',
    },
    ngay_ct: {
      type: Date,
      default: null,
    },
    ngay_lap_phieu: {
      type: Date,
      default: null,
    },
    gia_tri: {
      type: Number,
      required: true,
    },
    ma_pttt: {
      type: String,
      default: '',
    },
    ten_pttt: {
      type: String,
      default: '',
    },
    ma_kho: {
      type: String,
      required: true,
    },
    ten_kho: {
      type: String,
      required: true,
    },
    dien_giai: {
      type: String,
      default: '',
    },
    nam: {
      type: Number,
      default: 0,
    },
    quy: {
      type: Number,
      default: 0,
    },
    thang: {
      type: Number,
      default: 0,
    },
    ngay: {
      type: Number,
      default: 0,
    },
    gio: {
      type: Number,
      default: 0,
    },
    phut: {
      type: Number,
      default: 0,
    },
    giay: {
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
  { timestamps: true, collection: 'phieu_thu' }
);
phieuThuSchema.index(
  { ma_phieu: 'text', ma_nhom_nguoi_nop: 'text', ten_nhom_nguoi_nop: 'text' },
  { default_language: 'none' }
);
phieuThuSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: 'all',
});
phieuThuSchema.pre('save', async function (next) {
  try {
    let error;
    const pt = this;
    if (!pt.ma_phieu) {
      const maPhieu = await generateUniqueValueUtil({
        maDm: 'PT',
        model: mongoose.model('PhieuThu', phieuThuSchema),
        compareKey: 'ma_phieu',
      });
      pt.ma_phieu = maPhieu;
    }
    const maChungTu = await generateUniqueValueUtil({
      maDm: 'PT',
      model: mongoose.model('PhieuThu', phieuThuSchema),
      compareKey: 'ma_ct',
    });
    pt.ma_ct = maChungTu;
    const { nam, quy, thang, ngay, gio, phut, giay } = generateTimeByDate(
      pt.ngay_ct
    );
    pt.nam = nam;
    pt.quy = quy;
    pt.thang = thang;
    pt.ngay = ngay;
    pt.gio = gio;
    pt.phut = phut;
    pt.giay = giay;
    if (error) {
      return next(error);
    } else {
      next();
    }
  } catch (error) {
    return next(error);
  }
});
phieuThuSchema.post('save', async function () {
  const pt = this;
  // luu vao so quy
  await soQuyModel.create({
    ma_ct: pt.ma_ct,
    ma_loai_ct: pt.ma_loai_ct,
    ten_loai_ct: pt.ten_loai_ct,
    ten_nguoi_nop_nhan: pt.ten_nguoi_nop,
    ten_pttt: pt.ten_pttt,
    ngay_ct: pt.ngay_ct,
    ngay_lap_phieu: pt.ngay_lap_phieu,
    gia_tri: pt.gia_tri,
    tien: pt.gia_tri,
    dien_giai: pt.dien_giai,
    ma_kho: pt.ma_kho,
    ten_kho: pt.ten_kho,
    nam: pt.nam,
    quy: pt.quy,
    thang: pt.thang,
    ngay: pt.ngay,
    gio: pt.gio,
    phut: pt.phut,
    giay: pt.giay,
  });
});
phieuThuSchema.pre('updateOne', async function (next) {
  try {
    const pt = this.getUpdate();
    const { nam, quy, thang, ngay, gio, phut, giay } = generateTimeByDate(
      pt.ngay_ct
    );
    pt.nam = nam;
    pt.quy = quy;
    pt.thang = thang;
    pt.ngay = ngay;
    pt.gio = gio;
    pt.phut = phut;
    pt.giay = giay;
  } catch (error) {
    next(error);
  }
});
phieuThuSchema.post('updateOne', async function () {
  const pt = this.getUpdate().$set;
  await soQuyModel.updateOne(
    { ma_ct: pt.ma_ct },
    {
      ten_nguoi_nop_nhan: pt.ten_nguoi_nop,
      ten_pttt: pt.ten_pttt,
      ngay_ct: pt.ngay_ct,
      ngay_lap_phieu: pt.ngay_lap_phieu,
      gia_tri: pt.gia_tri,
      tien: pt.gia_tri,
      dien_giai: pt.dien_giai,
      ma_kho: pt.ma_kho,
      ten_kho: pt.ten_kho,
      nam: pt.nam,
      quy: pt.quy,
      thang: pt.thang,
      ngay: pt.ngay,
      gio: pt.gio,
      phut: pt.phut,
      giay: pt.giay,
    }
  );
});

phieuThuSchema.post('updateMany', async function () {
  const filter = this.getFilter();
  const phieuThus = await this.model.findWithDeleted(filter);
  const maCts = phieuThus.map((item) => item.ma_ct);
  let method = phieuThus[0]?.deleted === true ? 'delete' : 'restore';
  await soQuyModel[method]({ ma_ct: { $in: maCts } });
});
phieuThuSchema.pre('deleteMany', async function () {
  const filter = this.getFilter();
  const phieuThus = await this.model.findDeleted(filter);
  const maCts = phieuThus.map((item) => item.ma_ct);
  await soQuyModel.deleteMany({ ma_ct: { $in: maCts } });
});

// function
phieuThuSchema.statics.setKho = async function({ma_kho, ten_kho}) {
  await this.updateMany({ma_kho}, {ten_kho})
}
phieuThuSchema.statics.isExistMaKho = async function(ma_kho) {
  const result = await this.findOne({ma_kho})
  return result
}

module.exports = mongoose.model('PhieuThu', phieuThuSchema);
