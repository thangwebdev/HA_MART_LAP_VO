const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const phanQuyenSchema = new mongoose.Schema(
  {
    /*
    Chủ của hàng: 1, Quản lý kho: 2, nhân viên kho: 3, nhân viên bán hàng: 4
    */
    ma_phan_quyen: {
      type: Number,
      required: true,
      unique: true,
    },
    ten_phan_quyen: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true, collection: 'phan_quyen' }
);
phanQuyenSchema.index({ ten_phan_quyen: 'text' }, { default_language: 'none' });

phanQuyenSchema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true });

module.exports = mongoose.model("PhanQuyen", phanQuyenSchema);
