import FormProduct from '~/components/form/product/FormProduct';
import { formatDateDisplay, numeralCustom } from './helpers';
import FormNVT from '~/components/form/productGroup/FormNVT';
import FormDVT from '~/components/form/dvt/FormDVT';
import FormKho from '~/components/form/kho/FormKho';
import FilterProduct from '~/components/filter/product/FilterProduct';
import FilterProductGroup from '~/components/filter/productGroup/FilterProductGroup';
import FilterDVT from '~/components/filter/donViTinh/FilterDVT';
import FilterKho from '~/components/filter/kho/FilterKho';
import FormSupplier from '~/components/form/supplier/FormSupplier';
import FilterSupplier from '~/components/filter/supplier/FilterSupplier';
import FormChungTu from '~/components/form/chungtu/FormChungTu';
import FilterChungTu from '~/components/filter/chungTu/FilterChungTu';
import FormPNK from '~/components/form/pnk/FormPNK';
import FormLo from '~/components/form/lo/FormLo';
import FilterLo from '~/components/filter/lo/FilterLo';
import FilterPNK from '~/components/filter/pnk/FilterPNK';
import FormPKK from '~/components/form/pkk/FormPKK';
import FilterPKK from '~/components/filter/pkk/FilterPKK';
import FormPXDC from '~/components/form/pxdc/FormPXDC';
import FilterPXDC from '~/components/filter/pxdc/FilterPXDC';
import FormPXH from '~/components/form/pxh/FormPXH';
import FormLPC from '~/components/form/lpc/FormLPC';
import FormLPT from '~/components/form/lpt/FormLPT';
import FilterLPC from '~/components/filter/lpc/FilterLPC';
import FilterLPT from '~/components/filter/lpt/FilterLPT';
import FormKB from '~/components/form/kb/FormKB';
import FilterKB from '~/components/filter/kenhBan/FilterKB';
import FormPTTT from '~/components/form/pttt/FormPTTT';
import FilterPTTT from '~/components/filter/pttt/FilterPTTT';
import FormKH from '~/components/form/khachhang/FormKH';
import FilterKH from '~/components/filter/khachhang/FilterKH';
import FormPT from '~/components/form/phieuthu/FormPT';
import FormNNN from '~/components/form/nhomnguoinop/FormNNN';
import FilterPT from '~/components/filter/phieuThu/FilterPT';

import FormPBH from '~/components/form/pbh/FormPBH';
import FormPC from '~/components/form/phieuchi/FormPC';
import FormNNNHAN from '~/components/form/nhomnguoinhan/FormNNNHAN';
import FilterPC from '~/components/filter/phieuChi/FilterPC';
import FilterPBH from '~/components/filter/pbh/FilterPBH';
import FormNhanVien from '~/components/form/nhanvien/FormNhanVien';
import FilterNhanVien from '~/components/filter/nhanvien/FilterNhanVien';
import FilterPXH from '~/components/filter/pxh/FilterPXH';

const dsDanhMuc = {
  dmvt: {
    title: 'hàng hóa',
    uniqueKey: 'ma_vt',
    Form: FormProduct,
    Filter: FilterProduct,
    columns: [
      {
        name: 'Mã',
        selector: (row) => row.ma_vt,
        width: '150px',
        sortable: true,
        wrap: true,
      },
      {
        name: 'Tên',
        selector: (row) => row.ten_vt,
        minWidth: '200px',
        sortable: true,
      },
      {
        name: 'Mã vạch',
        selector: (row) => row.barcode,
        width: '150px',
        center: true,
        sortable: true,
      },
      {
        name: 'Nhóm hàng hóa',
        selector: (row) => row.ten_nvt,
        width: '150px',
        center: true,
        sortable: true,
      },
      {
        name: 'Giá bán lẻ',
        selector: (row) => row.gia_ban_le,
        center: true,
        sortable: true,
        width: '120px',
        format: (row) => numeralCustom(row.gia_ban_le).format(),
      },
      {
        name: 'Đơn vị tính',
        selector: (row) => row.ten_dvt,
        width: '120px',
        center: true,
        sortable: true,
      },
    ],
  },
  dmnvt: {
    title: 'nhóm hàng hóa',
    uniqueKey: 'ma_nvt',
    Filter: FilterProductGroup,
    Form: FormNVT,
    columns: [
      {
        name: 'Mã',
        selector: (row) => row.ma_nvt,
        sortable: true,
      },
      {
        name: 'Tên',
        selector: (row) => row.ten_nvt,
        sortable: true,
      },
      {
        name: 'Người tạo',
        selector: (row) => row.createdBy,
        sortable: true,
      },
    ],
  },
  dmdvt: {
    title: 'đơn vị tính',
    uniqueKey: 'ma_dvt',
    Filter: FilterDVT,
    Form: FormDVT,
    columns: [
      {
        name: 'Mã',
        selector: (row) => row.ma_dvt,
        sortable: true,
      },
      {
        name: 'Tên',
        selector: (row) => row.ten_dvt,
        sortable: true,
      },
      {
        name: 'Người tạo',
        selector: (row) => row.createdBy,
        sortable: true,
      },
    ],
  },
  dmkho: {
    title: 'kho',
    uniqueKey: 'ma_kho',
    Form: FormKho,
    Filter: FilterKho,
    columns: [
      {
        name: 'Mã',
        selector: (row) => row.ma_kho,
        sortable: true,
        width: '120px',
      },
      {
        name: 'Tên',
        selector: (row) => row.ten_kho,
        sortable: true,
        width: '200px',
        wrap: true,
      },

      {
        name: 'Địa chỉ',
        selector: (row) => row.dia_chi,
        sortable: true,
        width: '200x',
        wrap: true,
      },
      {
        name: 'Điện thoại',
        selector: (row) => row.dien_thoai,
        sortable: true,
        minWidth: '150px',
        center: true,
      },
      {
        name: 'Email',
        selector: (row) => row.email,
        sortable: true,
        minWidth: '200px',
        center: true,
        right: true,
      },
    ],
  },
  dmncc: {
    title: 'nhà cung cấp',
    uniqueKey: 'ma_ncc',
    Form: FormSupplier,
    Filter: FilterSupplier,
    columns: [
      {
        name: 'Mã',
        selector: (row) => row.ma_ncc,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Tên',
        selector: (row) => row.ten_ncc,
        sortable: true,
        width: '200px',
        wrap: true,
      },
      {
        name: 'Địa chỉ',
        selector: (row) => row.dia_chi,
        sortable: true,
        center: true,
        width: '200px',
        wrap: true,
      },
      {
        name: 'Điện thoại',
        selector: (row) => row.dien_thoai,
        sortable: true,
        center: true,
        minWidth: '120px',
      },
      {
        name: 'Email',
        selector: (row) => row.email,
        sortable: true,
        center: true,
        minWidth: '120px',
      },
      {
        name: 'Người tạo',
        selector: (row) => row.createdBy,
        sortable: true,
        center: true,
        minWidth: '200px',
      },
    ],
  },
  dmlo: {
    title: 'lô',
    uniqueKey: 'ma_lo',
    Form: FormLo,
    Filter: FilterLo,
    columns: [
      {
        name: 'Mã',
        selector: (row) => row.ma_lo,
        sortable: true,
        width: '100px',
      },
      {
        name: 'Tên',
        selector: (row) => row.ten_lo,
        sortable: true,
        minWidth: '200px',
        wrap: true,
      },
      {
        name: 'Kho',
        selector: (row) => row.ten_kho,
        sortable: true,
        minWidth: '200px',
        wrap: true,
      },
      {
        name: 'Tên hàng',
        selector: (row) => row.ten_vt,
        sortable: true,
        minWidth: '150px',
      },
      {
        name: 'Ngày sản xuất',
        selector: (row) => row.ngay_san_xuat,
        format: (row) => formatDateDisplay(row.ngay_san_xuat),
        sortable: true,
        minWidth: '100px',
        center: true,
      },
      {
        name: 'Hạn sử dụng',
        selector: (row) => row.han_su_dung,
        format: (row) => formatDateDisplay(row.han_su_dung),
        sortable: true,
        minWidth: '100px',
        center: true,
      },
    ],
  },
  dmct: {
    title: 'chứng từ',
    uniqueKey: 'ma_ct',
    Form: FormChungTu,
    Filter: FilterChungTu,
    columns: [
      {
        name: 'Mã',
        selector: (row) => row.ma_ct,
        sortable: true,
        width: '100px',
      },
      {
        name: 'Tên',
        selector: (row) => row.ten_ct,
        sortable: true,
        width: '200px',
      },
      {
        name: 'Diễn giải',
        selector: (row) => row.dien_giai,
        sortable: true,
        minWidth: '100px',
        wrap: true,
      },
    ],
  },
  dmpnk: {
    title: 'phiếu nhập kho',
    uniqueKey: 'ma_phieu',
    Form: FormPNK,
    Filter: FilterPNK,
    columns: [
      {
        name: 'Mã phiếu',
        selector: (row) => row.ma_phieu,
        sortable: true,
        width: '120px',
        left: true,
        wrap: true,
      },
      {
        name: 'Mã chứng từ',
        selector: (row) => row.ma_ct,
        sortable: true,
        minWidth: '120px',
        wrap: true,
      },
      {
        name: 'Kho',
        selector: (row) => row.ten_kho,
        sortable: true,
        center: true,
        minWidth: '100px',
      },
      {
        name: 'Ngày chứng từ',
        selector: (row) => row.ngay_ct,
        sortable: true,
        center: true,
        format: (row) => formatDateDisplay(row.ngay_ct),
        minWidth: '150px',
      },
      {
        name: 'Ngày nhập hàng',
        selector: (row) => row.ngay_nhap_hang,
        sortable: true,
        minWidth: '150px',
        center: true,
        format: (row) => formatDateDisplay(row.ngay_nhap_hang),
      },
      {
        name: 'Nhà cung cấp',
        selector: (row) => row.ten_ncc,
        sortable: true,
        minWidth: '130px',
        center: true,
        wrap: true,
      },
      {
        name: 'Tổng tiền nhập',
        selector: (row) => row.tong_tien_nhap,
        sortable: true,
        right: true,
        minWidth: '140px',
        format: (row) => numeralCustom(row.tong_tien_nhap).format(),
      },
    ],
  },
  dmpkk: {
    title: 'phiếu kiểm kho',
    uniqueKey: 'ma_phieu',
    Form: FormPKK,
    Filter: FilterPKK,
    columns: [
      {
        name: 'Mã phiếu',
        selector: (row) => row.ma_phieu,
        sortable: true,
        minWidth: '100px',
        left: true,
      },
      {
        name: 'Mã chứng từ',
        selector: (row) => row.ma_ct,
        sortable: true,
        minWidth: '120px',
        center: true,
      },
      {
        name: 'Kho',
        selector: (row) => row.ten_kho,
        sortable: true,
        center: true,
        minWidth: '150px',
      },
      {
        name: 'Hàng Hóa',
        selector: (row) => row.ten_vt,
        width: '180px',
        wrap: true,
        sortable: true,
        left: true,
      },
      {
        name: 'Tồn Kho Sổ Sách',
        selector: (row) => row.ton_kho_so_sach,
        minWidth: '150px',
        sortable: true,
        center: true,
      },
      {
        name: 'Tồn Kho Thực Tế',
        selector: (row) => row.ton_kho_thuc_te,
        minWidth: '150px',
        sortable: true,
      },
      {
        name: 'Chênh Lệch',
        selector: (row) => row.chenh_lech,
        minWidth: '120px',
        sortable: true,
        center: true,
      },
      {
        name: 'Ngày chứng từ',
        selector: (row) => row.ngay_ct,
        sortable: true,
        center: true,
        format: (row) => formatDateDisplay(row.ngay_ct),
        minWidth: '150px',
      },
      {
        name: 'Ngày kiểm hàng',
        selector: (row) => row.ngay_kiem_hang,
        sortable: true,
        minWidth: '150px',
        center: true,
        format: (row) => formatDateDisplay(row.ngay_kiem_hang),
      },

      {
        name: 'Lô',
        selector: (row) => row.ten_lo,
        sortable: true,
        right: true,
        minWidth: '150px',
        wrap: true,
      },
    ],
  },
  dmpxdc: {
    title: 'phiếu xuất điều chuyển',
    uniqueKey: 'ma_phieu',
    Form: FormPXDC,
    Filter: FilterPXDC,
    columns: [
      {
        name: 'Mã phiếu',
        selector: (row) => row.ma_phieu,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Từ kho',
        selector: (row) => `${row.ten_kho_tu}(${row.ma_kho_tu})`,
        sortable: true,
        minWidth: '150px',
      },
      {
        name: 'Đến kho',
        selector: (row) => `${row.ten_kho_den}(${row.ma_kho_den})`,
        sortable: true,
        minWidth: '150px',
      },
      {
        name: 'Số lượng',
        selector: (row) => row.sl_chuyen,
        sortable: true,
        minWidth: '100px',
        center: true,
      },
      {
        name: 'Ngày chứng từ',
        selector: (row) => row.ngay_ct,
        format: (row) => formatDateDisplay(row.ngay_ct),
        sortable: true,
        minWidth: '150px',
        center: true,
      },
      {
        name: 'Ngày xuất kho',
        selector: (row) => row.ngay_xuat_kho,
        format: (row) => formatDateDisplay(row.ngay_xuat_kho),
        sortable: true,
        minWidth: '150px',
        center: true,
      },
      {
        name: 'Ngày nhập kho',
        selector: (row) => row.ngay_nhap_kho,
        format: (row) => formatDateDisplay(row.ngay_nhap_kho),
        sortable: true,
        minWidth: '150px',
        right: true,
      },
    ],
  },
  dmpxh: {
    title: 'phiếu xuất hủy',
    uniqueKey: 'ma_phieu',
    Form: FormPXH,
    Filter: FilterPXH,
    columns: [
      {
        name: 'Mã phiếu',
        selector: (row) => row.ma_phieu,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Kho',
        selector: (row) => row.ten_kho,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Hàng hóa',
        selector: (row) => row.ten_vt,
        sortable: true,
        minWidth: '150px',
      },
      {
        name: 'Số lượng',
        selector: (row) => row.sl_huy,
        sortable: true,
        minWidth: '120px',
        center: true,
      },
      {
        name: 'Giá trị',
        selector: (row) => row.gia_tri_huy,
        format: (row) => numeralCustom(row.gia_tri_huy).format(),
        sortable: true,
        minWidth: '120px',
        center: true,
      },
      {
        name: 'Ngày chứng từ',
        selector: (row) => row.ngay_ct,
        format: (row) => formatDateDisplay(row.ngay_ct),
        sortable: true,
        minWidth: '150px',
      },
      {
        name: 'Ngày hủy hàng',
        selector: (row) => row.ngay_huy_hang,
        format: (row) => formatDateDisplay(row.ngay_huy_hang),
        sortable: true,
        minWidth: '150px',
        right: true,
      },
    ],
  },
  dmlpt: {
    title: 'loại phiếu thu',
    uniqueKey: 'ma_loai',
    Form: FormLPT,
    Filter: FilterLPT,
    columns: [
      {
        name: 'Mã loại',
        selector: (row) => row.ma_loai,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Tên Loại',
        selector: (row) => row.ten_loai,
        sortable: true,
        minWidth: '100px',
      },
    ],
  },
  dmlpc: {
    title: 'loại phiếu chi',
    uniqueKey: 'ma_loai',
    Form: FormLPC,
    Filter: FilterLPC,
    columns: [
      {
        name: 'Mã loại',
        selector: (row) => row.ma_loai,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Tên Loại',
        selector: (row) => row.ten_loai,
        sortable: true,
        minWidth: '100px',
      },
    ],
  },
  dmkb: {
    title: 'Kênh bán',
    uniqueKey: 'ma_kenh',
    Form: FormKB,
    Filter: FilterKB,
    columns: [
      {
        name: 'Mã Kênh',
        selector: (row) => row.ma_kenh,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Tên Kênh',
        selector: (row) => row.ten_kenh,
        sortable: true,
        minWidth: '100px',
      },
    ],
  },
  dmpttt: {
    title: 'phương thức thanh toán',
    uniqueKey: 'ma_pttt',
    Form: FormPTTT,
    Filter: FilterPTTT,
    columns: [
      {
        name: 'Mã phuong thuc thanh toan',
        selector: (row) => row.ma_pttt,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Tên phuong thuc thanh toan',
        selector: (row) => row.ten_pttt,
        sortable: true,
        minWidth: '100px',
      },
    ],
  },
  dmkh: {
    title: 'Khách Hàng',
    uniqueKey: 'sdt',
    Form: FormKH,
    Filter: FilterKH,
    columns: [
      {
        name: 'Mã khách hàng',
        selector: (row) => row.ma_kh,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Tên khách hàng',
        selector: (row) => row.ten_kh,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Số điện thoại',
        selector: (row) => row.sdt,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Địa chỉ',
        selector: (row) => row.dia_chi,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Ngày sinh',
        selector: (row) => formatDateDisplay(row.ngay_sinh),
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Email',
        selector: (row) => row.email,
        sortable: true,
        minWidth: '100px',
      },
    ],
  },
  dmpt: {
    title: 'Phiếu Thu',
    uniqueKey: 'ma_phieu',
    Form: FormPT,
    Filter: FilterPT,
    columns: [
      {
        name: 'Mã phiếu chi',
        selector: (row) => row.ma_phieu,
        sortable: true,
        left: true,
        minWidth: '120px',
      },
      {
        name: 'Mã chứng từ',
        selector: (row) => row.ma_ct,
        sortable: true,
        minWidth: '120px',
      },
      {
        name: 'Diễn giải',
        selector: (row) => row.dien_giai,
        sortable: true,
        center: true,
        minWidth: '150px',
        wrap: true,
      },
      {
        name: 'Giá trị',
        selector: (row) => row.gia_tri,
        format: (row) => numeralCustom(row.gia_tri).format(),
        sortable: true,
        center: true,
        minWidth: '120px',
      },
      {
        name: 'Loại phiếu',
        selector: (row) => row.ten_loai,
        sortable: true,
        center: true,
        minWidth: '150px',
      },
      {
        name: 'Ngày chứng từ',
        selector: (row) => row.ngay_ct,
        sortable: true,
        minWidth: '150px',
        center: true,
        format: (row) => formatDateDisplay(row.ngay_ct),
      },
      {
        name: 'Ngày lập phiếu',
        selector: (row) => row.ngay_lap_phieu,
        sortable: true,
        minWidth: '150px',
        right: true,
        format: (row) => formatDateDisplay(row.ngay_lap_phieu),
      },
    ],
  },
  dmpc: {
    title: 'Phiếu Chi',
    uniqueKey: 'ma_phieu',
    Form: FormPC,
    Filter: FilterPC,
    columns: [
      {
        name: 'Mã phiếu thu',
        selector: (row) => row.ma_phieu,
        sortable: true,
        left: true,
        minWidth: '120px',
      },
      {
        name: 'Mã chứng từ',
        selector: (row) => row.ma_ct,
        sortable: true,
        minWidth: '120px',
      },
      {
        name: 'Diễn giải',
        selector: (row) => row.dien_giai,
        sortable: true,
        center: true,
        minWidth: '150px',
        wrap: true,
      },
      {
        name: 'Giá trị',
        selector: (row) => row.gia_tri,
        format: (row) => numeralCustom(row.gia_tri).format(),
        sortable: true,
        center: true,
        minWidth: '120px',
      },
      {
        name: 'Loại phiếu',
        selector: (row) => row.ten_loai,
        sortable: true,
        center: true,
        minWidth: '150px',
      },
      {
        name: 'Ngày chứng từ',
        selector: (row) => row.ngay_ct,
        sortable: true,
        minWidth: '150px',
        center: true,
        format: (row) => formatDateDisplay(row.ngay_ct),
      },
      {
        name: 'Ngày lập phiếu',
        selector: (row) => row.ngay_lap_phieu,
        sortable: true,
        minWidth: '150px',
        right: true,
        format: (row) => formatDateDisplay(row.ngay_lap_phieu),
      },
    ],
  },

  dmpbh: {
    title: 'phiếu bán hàng',
    uniqueKey: 'ma_phieu',
    Form: FormPBH,
    Filter: FilterPBH,
    columns: [
      {
        name: 'Mã phiếu',
        selector: (row) => row.ma_phieu,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Kho',
        selector: (row) => row.ten_kho,
        sortable: true,
        minWidth: '120px',
        wrap: true,
      },
      {
        name: 'Ngày chứng từ',
        selector: (row) => row.ngay_ct,
        format: (row) => formatDateDisplay(row.ngay_ct),
        sortable: true,
        width: '140px',
      },
      {
        name: 'Ngày lập phiếu',
        selector: (row) => row.ngay_lap_phieu,
        format: (row) => formatDateDisplay(row.ngay_lap_phieu),
        sortable: true,
        width: '140px',
        center: true,
      },
      {
        name: 'Tổng thành tiền',
        selector: (row) => row.t_thanh_tien,
        format: (row) => numeralCustom(row.t_thanh_tien).format(),
        sortable: true,
        center: true,
        width: '140px',
      },

      {
        name: 'Nhân viên',
        selector: (row) => row.ten_nv,
        sortable: true,
        width: '120px',
        wrap: true,
        center: true,
      },
      {
        name: 'Khách hàng',
        selector: (row) => row.ten_kh,
        sortable: true,
        center: true,
        wrap: true,
        width: '120px',
      },
      {
        name: 'Kênh bán',
        selector: (row) => row.ten_kenh,
        sortable: true,
        width: '120px',
        center: true,
        wrap: true,
      },
      {
        name: 'Phương thức thanh toán',
        selector: (row) => row.ten_pttt,
        sortable: true,
        width: '180px',
        right: true,
      },
    ],
  },
  dmnnn: {
    title: 'Nhóm người nộp',
    uniqueKey: 'ten_nhom_nguoi_nop',
    Form: FormNNN,
    // Filter: FilterPTTT,
    columns: [
      {
        name: 'Mã nhóm người nộp',
        selector: (row) => row.ma_nhom_nguoi_nop,
        sortable: true,
        minWidth: '100px',
        width: '140px',
        center: true,
      },
      {
        name: 'Tên nhóm người nộp',
        selector: (row) => row.ten_nhom_nguoi_nop,
        sortable: true,
        minWidth: '100px',
      },
    ],
  },
  dmnnnh: {
    title: 'Nhóm người nhận',
    uniqueKey: 'ma_nhom_nguoi_nhan',
    Form: FormNNNHAN,
    // Filter: FilterPTTT,
    columns: [
      {
        name: 'Mã nhóm người nhận',
        selector: (row) => row.ma_nhom_nguoi_nhan,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Tên nhóm người nhận',
        selector: (row) => row.ten_nhom_nguoi_nhan,
        sortable: true,
        minWidth: '100px',
      },
    ],
  },
  dmnv: {
    title: 'nhân viên',
    uniqueKey: 'ma_nv',
    Form: FormNhanVien,
    Filter: FilterNhanVien,
    columns: [
      {
        name: 'Mã',
        selector: (row) => row.ma_nv,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Tên',
        selector: (row) => row.ten_nv,
        sortable: true,
        minWidth: '100px',
        center: true,
      },
      {
        name: 'Email',
        selector: (row) => row.email,
        sortable: true,
        minWidth: '100px',
        center: true,
      },
      {
        name: 'Điện thoại',
        selector: (row) => row.dien_thoai,
        sortable: true,
        minWidth: '100px',
        center: true,
      },
      {
        name: 'Ngày sinh',
        selector: (row) => row.ngay_sinh,
        format: (row) => formatDateDisplay(row.ngay_sinh),
        sortable: true,
        minWidth: '100px',
        right: true,
      },
    ],
  },
};

export { dsDanhMuc };
