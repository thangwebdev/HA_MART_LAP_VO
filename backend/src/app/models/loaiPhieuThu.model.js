const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const loaiPhieuThuSchema = new mongoose.Schema(
  {
    ma_loai: {
      type: String,
      required: true,
      unique: true,
    },
    ten_loai: {
      type: String,
      required: true,
      unique: true,
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
  { timestamps: true, collection: 'loai_phieu_thu' }
);
loaiPhieuThuSchema.index(
  { ma_loai: "text", ten_loai: "text" },
  { default_language: "none" }
);

loaiPhieuThuSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: 'all',
});

module.exports = mongoose.model('LoaiPhieuThu', loaiPhieuThuSchema);
