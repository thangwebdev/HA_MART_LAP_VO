const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const loaiPhieuChiSchema = new mongoose.Schema(
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
  { timestamps: true, collection: 'loai_phieu_chi' }
);

loaiPhieuChiSchema.index(
    { ma_loai: "text", ten_loai: "text" },
    { default_language: "none" }
  );
loaiPhieuChiSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: 'all',
});

module.exports = mongoose.model('LoaiPhieuChi', loaiPhieuChiSchema);
