const joi = require("joi");

// phân quyền
const validateCreatePhanQuyen = (phanQuyen) => {
  const phanQuyenSchema = joi.object({
    ma_phan_quyen: joi.number().required(),
    ten_phan_quyen: joi.string().required(),
  });
  return phanQuyenSchema.validate(phanQuyen);
};
// auth
const validateNguoiDungDangKy = (user) => {
  const userSchema = joi.object({
    ma_nguoi_dung: joi.string().required(),
    ten_nguoi_dung: joi.string().required(),
    mat_khau: joi.string().required(),
    email: joi.string().required().email(),
    ma_phan_quyen: joi.number().required(),
  });
  return userSchema.validate(user);
};
const validateNguoiDungDangNhap = (user) => {
  const userSchema = joi.object({
    email: joi.string().required().email(),
    mat_khau: joi.string().required(),
  });
  return userSchema.validate(user);
};

// store
const validateCreateStore = ({ ma_kho, ten_kho }) => {
  const storeSchema = joi.object({
    ma_kho: joi.string().required(),
    ten_kho: joi.string().required(),
  });
  return storeSchema.validate({ ma_kho, ten_kho });
};
// product
const validateCreateProduct = ({  ten_vt }) => {
  const productSchema = joi.object({
    // ma_vt: joi.string().required(),
    ten_vt: joi.string().required(),
  });
  return productSchema.validate({ ten_vt });
};
// nhom vat tu
const validateCreateNhomVatTu = ({ ma_nvt, ten_nvt }) => {
  const modelSchema = joi.object({
    ma_nvt: joi.string().required(),
    ten_nvt: joi.string().required(),
  });
  return modelSchema.validate({ ma_nvt, ten_nvt });
};
// file
const validateCreateFile = (file) => {
  const fileSchema = joi.object({
    ma_danh_muc: joi.string().required(),
    path: joi.string().required(),
  });
  return fileSchema.validate(file);
};
// don vi tinh
const validateCreateDonViTinh = ({ ma_dvt, ten_dvt }) => {
  const modelSchema = joi.object({
    ma_dvt: joi.string().required(),
    ten_dvt: joi.string().required(),
  });
  return modelSchema.validate({ ma_dvt, ten_dvt });
};
// lo
const validateCreateLo = ({ ma_lo, ten_lo }) => {
  const modelSchema = joi.object({
    ma_lo: joi.string().required(),
    ten_lo: joi.string().required(),
  });
  return modelSchema.validate({ ma_lo, ten_lo });
};
// nha cung cap
const validateCreateNhaCungCap = ({ ma_ncc, ten_ncc }) => {
  const modelSchema = joi.object({
    ma_ncc: joi.string().required(),
    ten_ncc: joi.string().required(),
  });
  return modelSchema.validate({ ma_ncc, ten_ncc });
};
// phieu nhap kho
const validateCreatePhieuNhapKho = ({ ma_kho, ten_kho }) => {
  const modelSchema = joi.object({
    ma_kho: joi.string().required(),
    ten_kho: joi.string().required(),
  });
  return modelSchema.validate({ ma_kho, ten_kho });
};

// phieu kiem kho
const validateCreatePhieuKiemKho = ({ ma_kho, ten_kho, ma_vt, ten_vt }) => {
  const modelSchema = joi.object({
    ma_kho: joi.string().required(),
    ten_kho: joi.string().required(),
    ma_vt: joi.string().required(),
    ten_vt: joi.string().required(),
  });
  return modelSchema.validate({ ma_kho, ten_kho, ma_vt, ten_vt });
};
// phieu dieu chuyen
const validateCreatePhieuDieuChuyen = ({
  ma_kho_tu,
  ten_kho_tu,
  ma_kho_den,
  ten_kho_den,
  ma_vt,
  ten_vt,
  sl_chuyen,
}) => {
  const modelSchema = joi.object({
    ma_kho_tu: joi.string().required(),
    ten_kho_tu: joi.string().required(),
    ma_kho_den: joi.string().required(),
    ten_kho_den: joi.string().required(),
    ma_vt: joi.string().required(),
    ten_vt: joi.string().required(),
    sl_chuyen: joi.number().required(),
  });
  return modelSchema.validate({
    ma_kho_tu,
    ten_kho_tu,
    ma_kho_den,
    ten_kho_den,
    ma_vt,
    ten_vt,
    sl_chuyen,
  });
};
// phieu xuat huy
const validateCreatePhieuXuatHuy = ({ ma_kho, ten_vt }) => {
  const modelSchema = joi.object({
    ma_kho: joi.string().required(),
    ten_vt: joi.string().required(),
  });
  return modelSchema.validate({ ma_kho, ten_vt });
};
// chung tu
const validateCreateChungTu = ({ ma_ct, ten_ct }) => {
  const modelSchema = joi.object({
    ma_ct: joi.string().required(),
    ten_ct: joi.string().required(),
  });
  return modelSchema.validate({ ma_ct, ten_ct });
};
// loai phieu thu
const validateCreateLoaiPhieuThu = ({ ma_loai, ten_loai }) => {
  const modelSchema = joi.object({
    ma_loai: joi.string().required(),
    ten_loai: joi.string().required(),
  });
  return modelSchema.validate({ ma_loai, ten_loai });
};
// loai phieu chi
const validateCreateLoaiPhieuChi = ({ ma_loai, ten_loai }) => {
  const modelSchema = joi.object({
    ma_loai: joi.string().required(),
    ten_loai: joi.string().required(),
  });
  return modelSchema.validate({ ma_loai, ten_loai });
};
// kenh ban
const validateCreateKenhBan = ({ ma_kenh, ten_kenh }) => {
  const modelSchema = joi.object({
    ma_kenh: joi.string().required(),
    ten_kenh: joi.string().required(),
  });
  return modelSchema.validate({ ma_kenh, ten_kenh });
};
// phuong thuc thanh toan
const validateCreatePTTT = ({ ma_pttt, ten_pttt }) => {
  const modelSchema = joi.object({
    ma_pttt: joi.string().required(),
    ten_pttt: joi.string().required(),
  });
  return modelSchema.validate({ ma_pttt, ten_pttt });
};
// khach hang
const validateCreateKH = ({ ten_kh, sdt }) => {
  const modelSchema = joi.object({
    ten_kh: joi.string().required(),
    sdt: joi.string().required(),
  });
  return modelSchema.validate({ ten_kh, sdt });
};
// phieu ban le
const validateCreatePBH = ({ ngay_ct, ngay_lap_phieu }) => {
  const modelSchema = joi.object({
    ngay_ct: joi.date().required(),
    ngay_lap_phieu: joi.date().required(),
  });
  return modelSchema.validate({ ngay_ct, ngay_lap_phieu });
};
const validateCreateTTPBL = ({ ma_trang_thai, ten_trang_thai }) => {
  const modelSchema = joi.object({
    ma_trang_thai: joi.number().required(),
    ten_trang_thai: joi.string().required(),
  });
  return modelSchema.validate({ ma_trang_thai, ten_trang_thai });
};
const validateCreatePhieuThu = ({
  ma_nhom_nguoi_nop,
  ten_nhom_nguoi_nop,
  ma_loai,
  ten_loai,
  gia_tri,
  ma_kho,
  ten_kho,
  ngay_ct,
  ngay_lap_phieu,
}) => {
  const modelSchema = joi.object({
    ten_nhom_nguoi_nop: joi.string().required(),
    ma_nhom_nguoi_nop: joi.string().required(),
    ma_loai: joi.string().required(),
    ten_loai: joi.string().required(),
    gia_tri: joi.number().required(),
    ma_kho: joi.string().required(),
    ten_kho: joi.string().required(),
    ngay_ct: joi.string().required(),
    ngay_lap_phieu: joi.string().required(),
  });
  return modelSchema.validate({
    ma_nhom_nguoi_nop,
    ten_nhom_nguoi_nop,
    ma_loai,
    ten_loai,
    gia_tri,
    ma_kho,
    ten_kho,
    ngay_ct,
    ngay_lap_phieu,
  });
};
const validateCreatePhieuChi = ({
  ma_nhom_nguoi_nhan,
  ten_nhom_nguoi_nhan,
  ma_loai,
  ten_loai,
  gia_tri,
  ma_kho,
  ten_kho,
}) => {
  const modelSchema = joi.object({
    ten_nhom_nguoi_nhan: joi.string().required(),
    ma_nhom_nguoi_nhan: joi.string().required(),
    ma_loai: joi.string().required(),
    ten_loai: joi.string().required(),
    gia_tri: joi.number().required(),
    ma_kho: joi.string().required(),
    ten_kho: joi.string().required(),
  });
  return modelSchema.validate({
    ma_nhom_nguoi_nhan,
    ten_nhom_nguoi_nhan,
    ma_loai,
    ten_loai,
    gia_tri,
    ma_kho,
    ten_kho,
  });
};
const validateCreateNNN = ({
  ma_nhom_nguoi_nop,
  ten_nhom_nguoi_nop,
  ma_danh_muc,
}) => {
  const modelSchema = joi.object({
    ma_nhom_nguoi_nop: joi.string().required(),
    ten_nhom_nguoi_nop: joi.string().required(),
    ma_danh_muc: joi.string().required(),
  });
  return modelSchema.validate({
    ma_nhom_nguoi_nop,
    ten_nhom_nguoi_nop,
    ma_danh_muc,
  });
};
const validateCreateNNNHAN = ({
  ma_nhom_nguoi_nhan,
  ten_nhom_nguoi_nhan,
  ma_danh_muc,
}) => {
  const modelSchema = joi.object({
    ma_nhom_nguoi_nhan: joi.string().required(),
    ten_nhom_nguoi_nhan: joi.string().required(),
    ma_danh_muc: joi.string().required(),
  });
  return modelSchema.validate({
    ma_nhom_nguoi_nhan,
    ten_nhom_nguoi_nhan,
    ma_danh_muc,
  });
};
// nhan vien
const validateCreateNhanVien = ({ email, ma_phan_quyen, ten_nv }) => {
  const modelSchema = joi.object({
    email: joi.string().required(),
    ten_nv: joi.string().required(),
    ma_phan_quyen: joi.number().required(),
  });
  return modelSchema.validate({ email, ten_nv, ma_phan_quyen });
};
module.exports = {
  validateCreatePhanQuyen,
  validateNguoiDungDangKy,
  validateNguoiDungDangNhap,
  validateCreateStore,
  validateCreateProduct,
  validateCreateFile,
  validateCreateNhomVatTu,
  validateCreateDonViTinh,
  validateCreateLo,
  validateCreateNhaCungCap,
  validateCreatePhieuNhapKho,
  validateCreatePhieuKiemKho,
  validateCreatePhieuDieuChuyen,
  validateCreatePhieuXuatHuy,
  validateCreateChungTu,
  validateCreateLoaiPhieuThu,
  validateCreateLoaiPhieuChi,
  validateCreateKenhBan,
  validateCreatePTTT,
  validateCreateKH,
  validateCreateTTPBL,
  validateCreatePhieuThu,
  validateCreatePhieuChi,
  validateCreateNNN,
  validateCreateNNNHAN,
  validateCreatePBH,
  validateCreateNhanVien,
};
