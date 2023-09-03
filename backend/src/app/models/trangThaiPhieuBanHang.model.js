const mongoose = require('mongoose');

const trangThaiPhieuBanHangSchema = new mongoose.Schema(
  {
    ma_trang_thai: {
      type: Number,
      required: true,
      unique: true,
    },
    ten_trang_thai: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true, collection: 'trang_thai_pbh' }
);
module.exports = mongoose.model(
  'TrangThaiPhieuBanHang',
  trangThaiPhieuBanHangSchema
);
