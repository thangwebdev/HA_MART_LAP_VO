const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const soKhoModel = require('../models/soKho.model');
const trangThaiModel = require('../models/trangThai.model');
// const loModel = require('../models/lo.model');
const tonKhoController = require('../controllers/tonkho.controller');
const createError = require('http-errors');
const {
  generateRandomCode,
  getQuyByMonth,
  generateUniqueValueUtil,
} = require('../../utils/myUtil');
const vatTuModel = require('./vatTu.model');
const phieuChiModel = require('./phieuChi.model');
const createHttpError = require('http-errors');

/*
- Khi sửa (không được sửa details) cần sửa sổ kho
 */

const phieuNhapKhoSchema = new mongoose.Schema(
  {
    ma_ct: {
      type: String,
    },
    ma_phieu: {
      type: String,
      unique: true,
    },
    ma_kho: {
      type: String,
      required: true,
      default: '',
    },
    ten_kho: {
      type: String,
      required: true,
      default: '',
    },
    ma_loai_ct: {
      type: String,
      default: 'pnk',
    },
    ten_loai_ct: {
      type: String,
      default: 'Phiếu nhập kho',
    },
    ngay_ct: {
      type: Date,
      default: new Date(),
    },
    ngay_nhap_hang: {
      type: Date,
      default: null,
    },
    ma_ncc: {
      type: String,
      default: '',
    },
    ten_ncc: {
      type: String,
      default: '',
    },
    tong_tien_nhap: {
      type: Number,
      default: 0,
    },
    dien_giai: {
      type: String,
      default: '',
    },
    ma_pptt: {
      type: String,
      default: '',
    },
    ten_pptt: {
      type: String,
      default: '',
    },
    ma_trang_thai: {
      type: Number,
      default: 1,
    },
    ten_trang_thai: {
      type: String,
      default: '',
    },
    details: {
      type: [
        {
          gia_von: {
            type: Number,
            default: 0,
          },
          ma_dvt: {
            type: String,
            default: '',
          },
          ten_dvt: {
            type: String,
            default: '',
          },
          ma_lo: {
            type: String,
            default: '',
          },
          ten_lo: {
            type: String,
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
          ma_nvt: {
            type: String,
            default: '',
          },
          ten_nvt: {
            type: String,
            default: '',
          },
          so_luong_nhap: {
            type: Number,
            default: 0,
          },
          tien_nhap: {
            type: Number,
            default: 0,
          },
        },
      ],
      default: [],
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
  { timestamps: true, collection: 'phieu_nhap_kho' }
);

const generateUniqueValue = async () => {
  let maChungTu = generateRandomCode(6, 'pnk');
  const doc = await mongoose
    .model('PhieuNhapKho', phieuNhapKhoSchema)
    .findOne({ ma_ct: maChungTu });
  if (doc) {
    return await generateUniqueValue();
  } else {
    return maChungTu;
  }
};

// Middleware tinh tong tien nhap kho
phieuNhapKhoSchema.pre('save', async function (next) {
  try {
    let error;
    const pnk = this;
    if (!pnk.ma_phieu) {
      const maPhieu = await generateUniqueValueUtil({
        maDm: 'PNK',
        model: mongoose.model('PhieuNhapKho', phieuNhapKhoSchema),
        compareKey: 'ma_phieu',
      });
      pnk.ma_phieu = maPhieu;
    }
    const maChungTu = await await generateUniqueValueUtil({
      maDm: 'PNK',
      model: mongoose.model('PhieuNhapKho', phieuNhapKhoSchema),
      compareKey: 'ma_ct',
    });
    pnk.ma_ct = maChungTu;
    const details = pnk.details || [];
    // tính tổng tiền nhập dựa trên các sản phẩm nhập
    const tong_tien_nhap =
      pnk.tong_tien_nhap ||
      details.reduce((sum, detail) => {
        return sum + detail.tien_nhap;
      }, 0);
    pnk.tong_tien_nhap = tong_tien_nhap;
    const trangThai = await trangThaiModel.findOne({ ma_trang_thai: 1 });
    pnk.ma_trang_thai = trangThai?.ma_trang_thai || 1;
    pnk.ten_trang_thai = trangThai?.ten_trang_thai || '';
    // lưu tồn kho cho các sản phẩm

    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      const vatTu = await vatTuModel.findOne({ ma_vt: detail.ma_vt });
      if (!vatTu) {
        error = createError(`Hàng hóa '${detail.ten_vt}' không tồn tại.`);
        break;
      }
      // if (detail.ma_lo) {
      //   const loValidate = await loModel.findOne({
      //     ma_vt: detail.ma_vt,
      //     ma_kho: pnk.ma_kho,
      //     ma_lo: detail.ma_lo,
      //   });
      //   if (!loValidate) {
      //     error = createError(
      //       404,
      //       `Lô '${detail.ma_lo}' với hàng hóa '${detail.ma_vt}' và kho '${pnk.ma_kho}' không tồn tại`
      //     );
      //     break;
      //   }
      // }
      detail.ma_nvt = vatTu.ma_nvt;
      detail.ten_nvt = vatTu.ten_nvt;
    }
    if (error) {
      return next(error);
    } else {
      next();
    }
  } catch (error) {
    return next(error);
  }
});
/* 
Tính giá vốn trung bình

Theo phương pháp tính này, mỗi lần nhập hàng thì giá vốn sẽ được tính lại theo công thức:

MAC = ( A + B ) / C

Với:

MAC: Giá vốn của sản phẩm tính theo bình quân tức thời
A: Giá trị kho hiện tại trước nhập = Tồn kho trước nhập * giá MAC trước nhập
B: Giá trị kho nhập mới = Tồn nhập mới * giá nhập kho đã phân bổ chi phí
C: Tổng tồn = Tồn trước nhập + tồn sau nhập

MAC = ton_kho * mac + nhap_kho * gia von / ton_kho + nhap_kho
*/
const caculateGiaVon = ({ tonKho = 0, MAC = 0, nhapKho = 0, giaVon = 0 }) => {
  const newMAC = (tonKho * MAC + nhapKho * giaVon) / (tonKho + nhapKho);
  return Math.round(newMAC);
};
phieuNhapKhoSchema.post('save', async function () {
  const pnk = this;
  const ngay = pnk.ngay_ct.getDate();
  const thang = pnk.ngay_ct.getMonth() + 1;
  const nam = pnk.ngay_ct.getFullYear();
  const quy = getQuyByMonth(thang);
  const gio = pnk.ngay_ct.getHours();
  const phut = pnk.ngay_ct.getMinutes();
  const giay = pnk.ngay_ct.getSeconds();
  // tạo phiếu chi tiền
  await phieuChiModel.create({
    ma_loai: 'LPC0001',
    ten_loai: 'Chi tiền nhập hàng',
    ma_nhom_nguoi_nhan: 'ncc',
    ten_nhom_nguoi_nhan: 'Nhà Cung Cấp',
    ten_nguoi_nhan: pnk.ten_ncc,
    ma_nguoi_nhan: pnk.ma_ncc,
    ngay_ct: pnk.ngay_ct,
    ngay_lap_phieu: pnk.ngay_ct,
    gia_tri: pnk.tong_tien_nhap,
    ma_kho: pnk.ma_kho,
    ten_kho: pnk.ten_kho,
    dien_giai: 'Phiếu tạo tự động khi nhập hàng',
  });
  // lưu vào sổ kho
  pnk.details.forEach(async (detail) => {
    const tonKho = await tonKhoController.getTotalInventoryHelper(detail.ma_vt);
    const vatTu = await vatTuModel.findOne({ ma_vt: detail.ma_vt });
    // tinh gia von trung binh
    const MAC = caculateGiaVon({
      tonKho: tonKho?.ton_kho || 0,
      MAC: vatTu.gia_von || 0,
      nhapKho: detail.so_luong_nhap,
      giaVon: detail.gia_von,
    });
    await vatTuModel.updateOne(
      { ma_vt: detail.ma_vt },
      {
        gia_von_cu: vatTu?.gia_von || 0,
        gia_von: MAC,
      }
    );
    await soKhoModel.create({
      ma_ct: pnk.ma_ct,
      ma_loai_ct: pnk.ma_loai_ct,
      ten_loai_ct: pnk.ten_loai_ct,
      ma_kho: pnk.ma_kho,
      ten_kho: pnk.ten_kho,
      ngay_ct: pnk.ngay_ct,
      nam,
      quy,
      thang,
      ngay,
      gio,
      phut,
      giay,
      ma_lo: detail.ma_lo,
      ten_lo: detail.ten_lo,
      ma_vt: detail.ma_vt,
      ten_vt: detail.ten_vt,
      ma_ncc: pnk.ma_ncc,
      ten_ncc: pnk.ten_ncc,
      sl_nhap: detail.so_luong_nhap,
      so_luong: detail.so_luong_nhap,
      gia_tri_nhap: detail.tien_nhap,
    });
  });
});
phieuNhapKhoSchema.pre('updateOne', async function (next) {
  try {
    return next(
      createError(400, 'Không thể chỉnh sửa, phiếu nhập kho đã lưu vào sổ')
    );
  } catch (error) {
    next(error);
  }
});
phieuNhapKhoSchema.pre('updateMany', async function (next) {
  try {
    const pnk = this.getUpdate();
    if (pnk.deleted === true) {
      return next(
        createHttpError(400, 'Không thể xóa vì dữ liệu đã lưu vào sổ kho')
      );
    }
  } catch (error) {
    next(error);
  }
});
phieuNhapKhoSchema.pre('deleteMany', async function () {
  const filter = this.getFilter();
  const pnks = await this.model.find(filter);
  const maCts = pnks.map((item) => item.ma_ct);
  await soKhoModel.deleteMany({ ma_ct: { $in: maCts } });
});

// function
phieuNhapKhoSchema.statics.setKho = async function ({ ma_kho, ten_kho }) {
  await this.updateMany({ ma_kho }, { ten_kho });
};
phieuNhapKhoSchema.statics.isExistMaKho = async function (ma_kho) {
  const result = await this.findOne({ ma_kho });
  return result;
};
phieuNhapKhoSchema.statics.setLo = async function ({ ma_lo, ten_lo }) {
  await this.updateMany(
    { 'details.ma_lo': ma_lo },
    { 'details.$.ten_lo': ten_lo }
  );
};
phieuNhapKhoSchema.statics.isExistMaLo = async function (ma_lo) {
  const result = await this.findOne({ 'details.ma_lo': ma_lo });
  return result;
};
phieuNhapKhoSchema.statics.setTenVt = async function({ma_vt, ten_vt}) {
  await this.updateMany({'details.ma_vt': ma_vt}, {'details.$.ten_vt': ten_vt})
}
phieuNhapKhoSchema.statics.isExistMaVt = async function(ma_vt) {
  const result = await this.findOne({'details.ma_vt': ma_vt})
  return result
}


phieuNhapKhoSchema.index({ ma_phieu: 'text' }, { default_language: 'none' });
phieuNhapKhoSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: 'all',
});

module.exports = mongoose.model("PhieuNhapKho", phieuNhapKhoSchema);
