const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const nguoiDungModel = require('./nguoiDung.model');
const _PhieuChi = require('./phieuChi.model');
const _PhieuBanHang = require('./phieuBanHang.model');
const createHttpError = require('http-errors');

/*
- Khi sửa tên, cần cập nhật model
  + Phiếu chi
  + Phiếu bán hàng
- Khi xóa cần đảm bảo không có model nào đang phụ thuộc
 */

const nhanVienSchema = new mongoose.Schema(
  {
    ma_nv: {
      type: String,
      unique: true,
    },
    ma_phan_quyen: {
      type: Number,
      required: true,
    },
    ten_phan_quyen: {
      type: String,
      required: true,
    },
    ten_nv: {
      type: String,
      required: true,
      index: true,
    },
    ngay_sinh: {
      type: Date,
      default: null,
    },
    gioi_tinh: {
      type: String,
      default: '',
    },
    dia_chi: {
      type: String,
      default: '',
    },
    dien_thoai: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    thong_tin_them: {
      type: String,
      default: '',
    },
    user_id: {
      type: String,
      default: '',
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
  { timestamps: true, collection: 'nhan_vien' }
);
nhanVienSchema.index(
  { ma_nv: 'text', ten_nv: 'text' },
  { default_language: 'none' }
);
nhanVienSchema.pre('save', async function (next) {
  try {
    const nhanVien = this;
    if (!nhanVien.ma_nv) {
      nhanVien.ma_nv = nhanVien.email;
    }
    const nguoiDung = await nguoiDungModel.create({
      ten_nguoi_dung: nhanVien.ten_nv,
      email: nhanVien.email,
      mat_khau: nhanVien.email,
      dien_thoai: nhanVien.dien_thoai,
      ngay_sinh: nhanVien.ngay_sinh,
      gioi_tinh: nhanVien.gioi_tinh,
      ma_phan_quyen: nhanVien.ma_phan_quyen,
      ten_phan_quyen: nhanVien.ten_phan_quyen,
    });
    nhanVien.user_id = nguoiDung._id;
  } catch (error) {
    next(error);
  }
});
nhanVienSchema.pre('updateOne', async function (next) {
  try {
    const nhanVien = this.getUpdate();
    const filter = this.getFilter();
    const nhanVienOld = await this.model.findOne(filter);
    this.nhanVienOld = nhanVienOld;

    if (nhanVien.email !== nhanVienOld.email) {
      return next(createHttpError(400, 'Không được thay đổi email'));
    }
    await nguoiDungModel.updateOne(
      { email: nhanVien.email },
      {
        ten_nguoi_dung: nhanVien.ten_nv,
        dien_thoai: nhanVien.dien_thoai,
        ngay_sinh: nhanVien.ngay_sinh,
        gioi_tinh: nhanVien.gioi_tinh,
        ma_phan_quyen: nhanVien.ma_phan_quyen,
        ten_phan_quyen: nhanVien.ten_phan_quyen,
      }
    );
  } catch (error) {
    next(error);
  }
});

nhanVienSchema.post('updateOne', async function () {
  const nhanVien = this.getUpdate().$set;
  if (nhanVien.ten_nv !== this.nhanVienOld.ten_nv) {
    await _PhieuChi.updateMany(
      { ma_nhom_nguoi_nhan: 'nv', ma_nguoi_nhan: nhanVien.ma_nv },
      {
        ten_nguoi_nhan: nhanVien.ten_nv,
      }
    );
    await _PhieuBanHang.updateMany(
      { ma_nv: nhanVien.ma_nv },
      { ten_nv: nhanVien.ten_nv }
    );
  }
});
nhanVienSchema.pre('updateMany', async function (next) {
  try {
    let error;
    const filter = this.getFilter();
    const nhanViens = await this.model.find(filter);
    const maNVs = nhanViens.map((item) => item.ma_nv);
    const pbh = await _PhieuBanHang.findOne({ ma_nv: { $in: maNVs } });
    if (pbh) {
      error = createHttpError(
        400,
        `Nhân viên ' ${pbh.ten_nguoi_nhan} ' đã phát sinh hóa đơn '${pbh.ma_phieu}'`
      );
    }
    const pc = await _PhieuChi.findOne({
      ma_nhom_nguoi_nhan: 'nv',
      ma_nguoi_nhan: { $in: maNVs },
    });
    if (!pbh && pc) {
      error = createHttpError(
        400,
        `Nhân viên ' ${pc.ten_nguoi_nhan} ' đã phát sinh phiếu chi '${pc.ma_phieu}'`
      );
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
nhanVienSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: 'all',
});

module.exports = mongoose.model('NhanVien', nhanVienSchema);
