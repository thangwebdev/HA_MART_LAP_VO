const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const nhomNguoiNhanSchema = new mongoose.Schema(
  {
    ma_nhom_nguoi_nhan: {
      type: String,
      required: true,
      unique: true,
    },
    ten_nhom_nguoi_nhan: {
      type: String,
      required: true,
      unique: true,
    },
    ma_danh_muc:{
      type:String,
      required:true,
      unique:true,
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
  { timestamps: true, collection: 'nhom_nguoi_nhan' }
);

nhomNguoiNhanSchema.index(
    { ma_nhom_nguoi_nhan: "text", ten_nhom_nguoi_nhan: "text" },
    { default_language: "none" }
  );
nhomNguoiNhanSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: 'all',
});

module.exports = mongoose.model('NhomNguoiNhan', nhomNguoiNhanSchema);
