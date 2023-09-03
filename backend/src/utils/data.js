const {
  validateCreateStore,
  validateCreateProduct,
  validateCreateNhomVatTu,
  validateCreateDonViTinh,
  validateCreateLo,
  validateCreateNhaCungCap,
  validateCreatePhieuNhapKho,
  validateCreatePhieuKiemKho,
  validateCreatePhieuDieuChuyen,
  validateCreatePhieuXuatHuy,
  validateCreateLoaiPhieuThu,
  validateCreateLoaiPhieuChi,
  validateCreateKenhBan,
  validateCreatePTTT,
  validateCreateKH,
  validateCreatePhieuThu,
  validateCreateNNN,
  validateCreatePBH,
  validateCreateNNNHAN,
  validateCreatePhieuChi,
} = require('./validate');
const khoModel = require('../app/models/kho.model');
const vatTuModel = require('../app/models/vatTu.model');
const nhomVatTuModel = require('../app/models/nhomVatTu.model');
const donViTinhModel = require('../app/models/donViTinh.model');
const loModel = require('../app/models/lo.model');
const nhaCungCapModel = require('../app/models/nhaCungCap.model');
const phieuNhapKhoModel = require('../app/models/phieuNhapKho.model');
const phieuKiemKhoModel = require('../app/models/phieuKiemKho.model');
const phieuDieuChuyenModel = require('../app/models/phieuDieuChuyen.model');
const phieuXuatHuyModel = require('../app/models/phieuXuatHuy.model');
const loaiPhieuThuModel = require('../app/models/loaiPhieuThu.model');
const loaiPhieuChiModel = require('../app/models/loaiPhieuChi.model');
const kenhBanModel = require('../app/models/kenhBan.model');
const phuongThucThanhToanModel = require('../app/models/phuongThucThanhToan.model');
const khachHangModel = require('../app/models/khachHang.model');
const phieuThuModel = require('../app/models/phieuThu.model');
const nhomNguoiNopModel = require('../app/models/nhomNguoiNop.model');
const phieuBanHangModel = require('../app/models/phieuBanHang.model');
const trangThaiPhieuBanHangModel = require('../app/models/trangThaiPhieuBanHang.model');
const phieuChiModel = require('../app/models/phieuChi.model');
const nhomNguoiNhanModel = require('../app/models/nhomNguoiNhan.model');
const phanQuyenModel = require('../app/models/phanQuyen.model');
const trangThaiModel = require('../app/models/trangThai.model');

const dsDanhMuc = [
  {
    maDanhMuc: 'dmkho',
    uniqueField: 'ma_kho',
    model: khoModel,
    validate: validateCreateStore,
    fields: ['ma_kho', 'ten_kho', 'dia_chi', 'email', 'dien_thoai'],
  },
  {
    maDanhMuc: 'dmvt',
    uniqueField: 'ma_vt',
    model: vatTuModel,
    validate: validateCreateProduct,
    fields: [
      'ma_vt',
      'ten_vt',
      'barcode',
      'ten_tat',
      'ma_nvt',
      'ten_nvt',
      'ma_dvt',
      'ten_dvt',
      'xuat_xu',
      'gia_von',
      'gia_ban_le',
      'ton_toi_thieu',
      'ton_toi_da',
      'mo_ta',
      'vi_tri',
    ],
  },
  {
    maDanhMuc: 'dmnvt',
    uniqueField: 'ma_nvt',
    model: nhomVatTuModel,
    validate: validateCreateNhomVatTu,
    fields: ['ma_nvt', 'ten_nvt'],
  },
  {
    maDanhMuc: 'dmdvt',
    uniqueField: 'ma_dvt',
    model: donViTinhModel,
    validate: validateCreateDonViTinh,
    fields: ['ma_dvt', 'ten_dvt'],
  },
  {
    maDanhMuc: 'dmlo',
    uniqueField: 'ma_lo',
    model: loModel,
    validate: validateCreateLo,
    fields: [
      'ma_lo',
      'ten_lo',
      'ngay_san_xuat',
      'han_su_dung',
      'ma_vt',
      'ten_vt',
    ],
  },
  {
    maDanhMuc: 'dmncc',
    uniqueField: 'ma_ncc',
    model: nhaCungCapModel,
    validate: validateCreateNhaCungCap,
    fields: [
      'ma_ncc',
      'ten_ncc',
      'dia_chi',
      'dien_thoai',
      'email',
      'fax',
      'thong_tin_them',
    ],
  },
  {
    maDanhMuc: 'dmpnk',
    uniqueField: 'ma_phieu',
    model: phieuNhapKhoModel,
    validate: validateCreatePhieuNhapKho,
    fields: [
      'ma_phieu',
      'ma_kho',
      'ten_kho',
      'ngay_lap_phieu',
      'ngay_nhap_hang',
      'ma_ncc',
      'ten_ncc',
      'mo_ta',
      'details',
    ],
  },
  {
    maDanhMuc: 'dmpkk',
    uniqueField: 'ma_phieu',
    model: phieuKiemKhoModel,
    validate: validateCreatePhieuKiemKho,
    fields: [
      'ma_phieu',
      'ma_kho',
      'ten_kho',
      'ma_vt',
      'ten_vt',
      'ton_kho_so_sach',
      'ton_kho_thuc_te',
      'can_bang_kho',
    ],
  },
  {
    maDanhMuc: 'dmpxdc',
    uniqueField: 'ma_phieu',
    model: phieuDieuChuyenModel,
    validate: validateCreatePhieuDieuChuyen,
    fields: ['ma_phieu', 'ma_kho', 'ten_kho', 'ma_vt', 'ten_vt'],
  },
  {
    maDanhMuc: 'dmpxh',
    uniqueField: 'ma_phieu',
    model: phieuXuatHuyModel,
    validate: validateCreatePhieuXuatHuy,
    fields: ['ma_phieu', 'ma_kho', 'ten_kho', 'ma_vt', 'ten_vt'],
  },
  {
    maDanhMuc: 'dmlpt',
    uniqueField: 'ma_loai',
    model: loaiPhieuThuModel,
    validate: validateCreateLoaiPhieuThu,
    fields: ['ma_loai', 'ten_loai'],
  },
  {
    maDanhMuc: 'dmlpc',
    uniqueField: 'ma_loai',
    model: loaiPhieuChiModel,
    validate: validateCreateLoaiPhieuChi,
    fields: ['ma_loai', 'ten_loai'],
  },
  {
    maDanhMuc: 'dmkb',
    uniqueField: 'ma_kenh',
    model: kenhBanModel,
    validate: validateCreateKenhBan,
    fields: ['ma_kenh', 'ten_kenh'],
  },
  {
    maDanhMuc: 'dmpttt',
    uniqueField: 'ma_pttt',
    model: phuongThucThanhToanModel,
    validate: validateCreatePTTT,
    fields: ['ma_pttt', 'ten_pttt'],
  },
  {
    maDanhMuc: 'dmkh',
    uniqueField: 'sdt',
    model: khachHangModel,
    validate: validateCreateKH,
    fields: ['ma_kh', 'ten_kh'],
  },
  {
    maDanhMuc: 'dmpc',
    uniqueField: 'ma_phieu',
    model: phieuChiModel,
    validate: validateCreatePhieuChi,
    fields: ['ma_phieu'],
  },
  {
    maDanhMuc: 'dmpt',
    uniqueField: 'ma_phieu',
    model: phieuThuModel,
    validate: validateCreatePhieuThu,
    fields: ['ma_phieu'],
  },
  {
    maDanhMuc: 'dmnnn',
    uniqueField: 'ma_nhom_nguoi_nop',
    model: nhomNguoiNopModel,
    validate: validateCreateNNN,
    fields: ['ma_nhom_nguoi_nop, ten_nhom_nguoi_nop'],
  },
  {
    maDanhMuc: 'dmnnnh',
    uniqueField: 'ma_nhom_nguoi_nhan',
    model: nhomNguoiNhanModel,
    validate: validateCreateNNNHAN,
    fields: ['ma_nhom_nguoi_nhan, ten_nhom_nguoi_nhan'],
  },
  {
    maDanhMuc: 'dmpbh',
    uniqueField: 'ma_phieu',
    model: phieuBanHangModel,
    validate: validateCreatePBH,
    fields: ['ma_phieu', 'ma_ct', 'ma_loai_ct', 'ten_loai_ct'],
  },
  {
    maDanhMuc: 'dmttpbh',
    uniqueField: 'ma_trang_thai',
    model: trangThaiPhieuBanHangModel,
    fields: ['ma_trang_thai', 'ten_trang_thai'],
  },
  {
    maDanhMuc: 'dmpq',
    uniqueField: 'ma_phan_quyen',
    model: phanQuyenModel,
    fields: ['ma_phan_quyen', 'ten_phan_quyen'],
  },
  {
    maDanhMuc: 'dmtrangthai',
    uniqueField: '_id',
    model: trangThaiModel,
    fields: ['ma_phan_quyen', 'ten_phan_quyen', 'ma_loai_ct'],
  },
];
module.exports = { dsDanhMuc };