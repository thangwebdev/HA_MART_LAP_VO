const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const soKhoModel = require('./soKho.model');

const {
  generateUniqueValueUtil,
  generateTimeByDate,
} = require('../../utils/myUtil');

/*
- Khi sửa tên cần cập nhật model
  + Lô
  + Phiếu nhập
  + Phiếu kiểm
  + Phiếu điều chuyển
  + Phiếu xuất hủy
  + Phiếu bán hàng
- Khi xóa cấn xóa tất cả dữ liệu liên quan trên các model
 */

const productSchema = new mongoose.Schema(
  {
    ma_vt: {
      type: String,
      // required: true,
      unique: true,
      index: true,
    },
    ten_vt: {
      type: String,
      required: true,
      index: true,
    },
    barcode: {
      type: String,
      default: '',
    },
    ten_tat: {
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
    ma_dvt: {
      type: String,
      default: '',
    },
    ten_dvt: {
      type: String,
      default: '',
    },
    xuat_xu: {
      type: String,
      default: '',
    },
    gia_ban_le: {
      type: Number,
      default: 0,
    },
    gia_von: {
      type: Number,
      default: 0,
    },
    gia_von_cu: {
      type: Number,
      default: 0,
    },
    ton_toi_thieu: {
      type: Number,
      default: 0,
    },
    ton_toi_da: {
      type: Number,
      default: 0,
    },
    ton_kho_ban_dau: {
      type: [
        {
          ma_kho: String,
          ten_kho: String,
          ton_kho: Number,
        },
      ],
      default: null,
    },
    ds_vt_cung_loai: {
      type: [String],
      default: null,
    },
    vi_tri: {
      type: String,
      default: '',
    },
    mo_ta: {
      type: String,
      default: '',
    },
    theo_doi_lo: {
      type: Boolean,
      default: false,
    },
    hinh_anh1: {
      type: String,
      default: '',
    },
    hinh_anh2: {
      type: String,
      default: '',
    },
    hinh_anh3: {
      type: String,
      default: '',
    },
    // vat tu cung loai start
    ds_dvt: {
      type: [
        {
          ma_dvt: String,
          ten_dvt: String,
          sl_quy_doi: Number,
          gia_ban_qd: Number,
          barcode: String
        },
      ],
      default: [],
    },
    // vat tu cung loai end
    createdBy: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: String,
      default: '',
    },
  },
  { timestamps: true, collection: 'vat_tu' }
);
productSchema.pre('save', async function (next) {
  try {
    const vatTu = this;
    if (!vatTu.ma_vt) {
      const maVt = await generateUniqueValueUtil({
        maDm: 'SP',
        model: mongoose.model('VatTu', productSchema),
        compareKey: 'ma_vt',
      });
      vatTu.ma_vt = maVt;
    }
  } catch (error) {
    next(error);
  }
});
productSchema.post('save', async function () {
  const vatTu = this;
  const ngayCt = new Date();
  const { nam, quy, thang, ngay, gio, phut, giay } = generateTimeByDate(ngayCt);
  if (vatTu.ton_kho_ban_dau.length > 0) {
    vatTu.ton_kho_ban_dau.map(async (item) => {
      await soKhoModel.create({
        ma_ct: vatTu.ma_vt,
        ma_kho: item.ma_kho,
        ten_kho: item.ten_kho,
        ma_vt: vatTu.ma_vt,
        ten_vt: vatTu.ten_vt,
        sl_nhap: item.ton_kho,
        so_luong: item.ton_kho,
        ngay_ct: ngayCt,
        nam,
        quy,
        thang,
        ngay,
        gio,
        phut,
        giay,
      });
    });
  }
});
productSchema.pre('updateOne', async function (next) {
  try {
    const filter = this.getFilter();
    const oldVatTu = await this.model.findOne(filter);
    this.oldVatTu = oldVatTu;
    return next();
  } catch (error) {
    next(error);
  }
});
productSchema.post('updateOne', async function () {
  const vatTu = this.getUpdate().$set;
  if (vatTu.ten_vt !== this.oldVatTu.ten_vt) {
   
  }
});
productSchema.post('updateMany', async function () {
  
});


productSchema.index(
  { ma_vt: "text", ten_vt: "text" },
  { default_language: "none" }
);
productSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: "all",
});

module.exports = mongoose.model("VatTu", productSchema);
