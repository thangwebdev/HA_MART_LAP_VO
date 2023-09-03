const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const _VatTu = require('./vatTu.model');
const vatTuModel = require('./vatTu.model');
const createHttpError = require('http-errors');

/*
 - Khi chỉnh sửa tên cần chỉnh sửa model vatTu
 - khi xóa cần đảm bảo không có vật tư nào đang sử dụng đơn vị tính này
 */

const donViTinhSchema = new mongoose.Schema(
  {
    ma_dvt: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ten_dvt: {
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
  { timestamps: true, collection: 'don_vi_tinh' }
);

donViTinhSchema.pre('updateOne', async function (next) {
  try {
    const filter = this.getFilter();
    const oldDVT = await this.model.findOne(filter);
    this.oldDVT = oldDVT;
    next();
  } catch (error) {
    next(error);
  }
});
donViTinhSchema.post('updateOne', async function () {
  const dvt = this.getUpdate().$set;
  if (dvt.ten_dvt !== this.oldDVT.ten_dvt) {
    await _VatTu.updateMany({ ma_dvt: dvt.ma_dvt }, { ten_dvt: dvt.ten_dvt });
    await _VatTu.updateMany(
      { 'ds_dvt.ma_dvt': dvt.ma_dvt },
      { 'ds_dvt.$.ten_dvt': dvt.ten_dvt }
    );
  }
});
donViTinhSchema.pre('updateMany', async function (next) {
  try {
    let error;
    const filter = this.getFilter();
    const dvts = await this.model.find(filter);
    for (let i = 0; i < dvts.length; i++) {
      const dvt = dvts[i];
      const vatTu = await vatTuModel.findOne({
        $or: [{ ma_dvt: dvt.ma_dvt }, { 'ds_dvt.ma_dvt': dvt.ma_dvt }],
      });
      if (vatTu) {
        error = createHttpError(
          400,
          `Đơn vị tính '${dvt.ten_dvt}' đang dùng cho hàng hóa '${vatTu.ten_vt}'`
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

donViTinhSchema.index(
  { ma_dvt: "text", ten_dvt: "text" },
  { default_language: "none" }
);
donViTinhSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: "all",
});

module.exports = mongoose.model("DonViTinh", donViTinhSchema);
