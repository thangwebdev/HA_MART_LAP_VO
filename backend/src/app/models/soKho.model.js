const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const soKhoSchema = new mongoose.Schema(
  {
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
    // bat dau ngay thang
    ngay_ct: {
      type: Date,
      default: null,
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
    // ket thuc ngay thang
    ma_lo: {
      type: String,
    },
    ten_lo: {
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
    ma_ncc: {
      type: String,
      default: '',
    },
    ten_ncc: {
      type: String,
      default: '',
    },
    sl_nhap: {
      type: Number,
      default: 0,
    },
    sl_xuat: {
      type: Number,
      default: 0,
    },
    so_luong: {
      type: Number,
      default: 0,
      require: true,
    },
    ma_kh: {
      type: String,
      default: '',
    },
    gia_tri_ban: {
      type: Number,
      default: 0,
    },
    gia_tri_nhap: {
      type: Number,
      default: 0,
    },
    chi_phi: {
      type: Number,
      default: 0,
    },
    loi_nhuan: {
      type: Number,
      default: 0,
    },
    ma_tham_chieu: {
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
  { timestamps: true, collection: 'so_kho' }
);
/**
  - gia_tri_ban: sl_xuat * giá bán đã trừ đi chiết khấu
  - chi_phi: để tính lợi nhuận
  - ma_kh: để tổng hợp theo hàng bán
 */

soKhoSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: 'all',
});



module.exports = mongoose.model("SoKho", soKhoSchema);
