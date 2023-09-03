const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const _PhieuBanHang = require('./phieuBanHang.model');
const createHttpError = require('http-errors');

/**
 - Khi chỉnh sửa cần chỉnh sửa model phiêu bán hàng
 - Khi xóa, cần đảm bảo không có phiếu báng hàng nào đang dùng kênh này
 */

const kenhBanSchema = new mongoose.Schema(
  {
    ma_kenh: {
      type: String,
      required: true,
      unique: true,
    },
    ten_kenh: {
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
  { timestamps: true, collection: 'kenh_ban' }
);

kenhBanSchema.pre('updateOne', async function (next) {
  try {
    const filter = this.getFilter();
    const oldKenhBan = this.model.findOne(filter);
    this.oldKenhBan = oldKenhBan;
    next();
  } catch (error) {
    next(error);
  }
});

kenhBanSchema.post('updateOne', async function () {
  const kenhBan = this.getUpdate().$set;
  if (kenhBan.ten_kenh !== this.oldKenhBan.ten_kenh) {
    await _PhieuBanHang.setKenhBan({
      ma_kenh: kenhBan.ma_kenh,
      ten_kenh: kenhBan.ten_kenh,
    });
  }
});

kenhBanSchema.pre('updateMany', async function (next) {
  try {
    let error;
    const filter = this.getFilter();
    const kenhBans = await this.model.find(filter);
    for (let i = 0; i < kenhBans.length; i++) {
      const kenhBan = kenhBans[i];
      const pbh = await _PhieuBanHang.isExistMaKenh(kenhBan.ma_kenh);
      if (pbh) {
        error = createHttpError(
          400,
          `Kênh bán '${kenhBan.ten_kenh}' đang áp dụng cho hóa đơn có mã '${pbh.ma_phieu}'`
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

kenhBanSchema.index(
    { ma_kenh: "text", ten_kenh: "text" },
    { default_language: "none" }
  );
kenhBanSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: 'all',
});

module.exports = mongoose.model('KenhBan', kenhBanSchema);
