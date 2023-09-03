const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const _VatTu = require('./vatTu.model');
const createHttpError = require('http-errors');

/*
- Khi sửa tên cần cập nhật model vật tư
- Khi xóa cần đảm bảo không có vật tư nào đang phụ thuộc
 */

const nhomVatTuSchema = new mongoose.Schema(
  {
    ma_nvt: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ten_nvt: {
      type: String,
      required: true,
      index: true,
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
  { timestamps: true, collection: 'nhom_vat_tu' }
);
nhomVatTuSchema.index(
  { ma_nvt: 'text', ten_nvt: 'text' },
  { default_language: 'none' }
);
nhomVatTuSchema.pre('updateOne', async function (next) {
  try {
    const filter = this.getFilter();
    const oldNVT = await this.model.findOne(filter);
    this.oldNVT = oldNVT;
    next();
  } catch (error) {
    next(error);
  }
});
nhomVatTuSchema.post('updateOne', async function () {
  const nvt = this.getUpdate().$set;
  if (nvt.ten_nvt !== this.oldNVT.ten_nvt) {
    await _VatTu.updateMany({ ma_nvt: nvt.ma_nvt }, { ten_nvt: nvt.ten_nvt });
  }
});
nhomVatTuSchema.pre('updateMany', async function (next) {
  try {
    let error;
    const filter = this.getFilter();
    const nvts = await this.model.find(filter);
    for (let i = 0; i < nvts.length; i++) {
      const nvt = nvts[i];
      const vatTu = await _VatTu.findOne({ma_nvt: nvt.ma_nvt});
      if (vatTu) {
        error = createHttpError(
          400,
          `Nhóm vật tư '${nvt.ten_nvt}' đang dùng cho hàng hóa '${vatTu.ten_vt}'`
        );
        break;
      }
    }
    if (error) {
      return next(error);
    } else {
      return next();
    }
  } catch (error) {
    next(error);
  }
});
nhomVatTuSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: "all",
});

module.exports = mongoose.model("NhomVatTu", nhomVatTuSchema);
