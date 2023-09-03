const mongoose = require('mongoose');

const trangThaiSchema = new mongoose.Schema(
  {
    ma_trang_thai: {
      type: Number,
      required: true,
    },
    ten_trang_thai: {
      type: String,
      required: true
    },
    ma_loai_ct: {
      type: String,
    },
  },
  { timestamps: true, collection: 'trang_thai' }
);
module.exports = mongoose.model('TrangThai', trangThaiSchema);
