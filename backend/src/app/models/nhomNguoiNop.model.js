const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const nhomNguoiNopSchema = new mongoose.Schema(
  {
    ma_nhom_nguoi_nop: {
      type: String,
      required: true,
      unique: true,
    },
    ten_nhom_nguoi_nop: {
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
  { timestamps: true, collection: 'nhom_nguoi_nop' }
);

nhomNguoiNopSchema.index(
    { ma_nhom_nguoi_nop: "text", ten_nhom_nguoi_nop: "text" },
    { default_language: "none" }
  );
nhomNguoiNopSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: 'all',
});

module.exports = mongoose.model('NhomNguoiNop', nhomNguoiNopSchema);
