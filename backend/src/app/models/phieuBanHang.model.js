const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const {
  generateUniqueValueUtil,
  getQuyByMonth,
  generateTimeByDate,
} = require('../../utils/myUtil');
const vatTuModel = require('./vatTu.model');
const tonKhoController = require('../controllers/tonkho.controller');
const createHttpError = require('http-errors');
const soKhoModel = require('./soKho.model');
const phieuThuModel = require('./phieuThu.model');

/*
 - Khi sửa phiếu bán hàng đang ở trang thái = 2 thì cần cập nhật phiếu thu tiền và sổ kho
 - Khi sửa phiếu bán hàng từ trang thái = 2 sang != 2 thì cần xóa phiếu thu và sổ kho tương ứng
 - Khi xóa phiếu bán hàng cần xóa phiếu thu và sổ kho tương ứng
 */

const phieuBanHangSchema = new mongoose.Schema(
  {
    ma_phieu: {
      type: String,
      unique: true,
    },
    ma_ct: {
      type: String,
      default: '',
    },
    ma_loai_ct: {
      type: String,
      default: 'pbh',
    },
    ten_loai_ct: {
      type: String,
      default: 'Phiếu bán hàng',
    },
    ma_kho: {
      type: String,
      required: true,
    },
    ten_kho: {
      type: String,
      required: true,
    },
    ngay_ct: {
      type: Date,
      default: null,
    },
    ngay_lap_phieu: {
      type: Date,
      default: null,
    },
    ma_nv: {
      type: String,
      default: '',
    },
    ten_nv: {
      type: String,
      default: '',
    },
    ma_kh: {
      type: String,
      default: 'khachle',
    },
    ten_kh: {
      type: String,
      default: 'Khách lẻ',
    },
    ma_kenh: {
      type: String,
      default: '',
    },
    ten_kenh: {
      type: String,
      default: '',
    },
    ma_pttt: {
      type: String,
      default: '',
    },
    ten_pttt: {
      type: String,
      default: '',
    },
    tien_hang: {
      // tổng tiền hàng trong detail
      type: Number,
      default: 0,
    },
    ty_le_ck_hd: {
      type: Number,
      default: 0,
    },
    tien_ck_hd: {
      // tien_hang * ty_le_ck_hd / 100
      type: Number,
      default: 0,
    },
    tien_ck_sp: {
      // tổng tiền chiêt khấu trong detail
      type: Number,
      default: 0,
    },
    tong_tien_ck: {
      // tổng tiền chiết khẩu + tiền chiết khấu hóa đơn
      type: Number,
      default: 0,
    },
    VAT: {
      type: Number,
      default: 0,
    },
    thanh_tien: {
      // tien_hang - tong_tien_ck
      type: Number,
      default: 0,
    },
    t_thanh_tien: {
      // thanh_tien + thue + tien_van_chuyen
      type: Number,
      default: 0,
    },
    chi_phi: {
      // tổng số lượng detail * giá vốn
      type: Number,
      default: 0,
    },
    loi_nhuan: {
      type: Number,
      default: 0,
    },
    tien_thu: {
      type: Number,
      default: 0,
    },
    tien_thoi: {
      type: Number,
      default: 0,
    },
    tien_van_chuyen: {
      type: Number,
      default: 0,
    },
    ghi_chu: {
      type: String,
      default: '',
    },
    ma_trang_thai: {
      type: Number,
      default: 1,
    },
    ten_trang_thai: {
      type: String,
      default: '',
    },
    nam: {
      type: Number,
      default: 0,
    },
    thang: {
      type: Number,
      default: 0,
    },
    ngay: {
      type: Number,
      default: 0,
    },
    quy: {
      type: Number,
      default: 0,
    },
    gio: {
      type: Number,
      default: 0,
    },
    phut: {
      type: Number,
      default: 0,
    },
    giay: {
      type: Number,
      default: 0,
    },
    details: {
      type: [
        {
          ma_vt: {
            // bắt buộc truyền
            type: String,
            required: true,
          },
          ten_vt: {
            // bắt buộc truyền
            type: String,
            required: true,
          },
          ma_dvt: {
            // bắt buộc truyền
            type: String,
            required: true,
          },
          ten_dvt: {
            // bắt buộc truyền
            type: String,
            required: true,
          },
          ma_nvt: {
            type: String,
            default: '',
          },
          ten_nvt: {
            type: String,
            default: '',
          },
          ma_lo: {
            // cần truyền
            type: String,
            default: '',
          },
          ten_lo: {
            type: String,
            default: '',
          },
          gia_ban_le: {
            type: Number,
            default: 0,
          },
          gia_von: {
            type: Number,
            default: 0,
          },
          don_gia: {
            type: Number,
            default: 0,
          },
          sl_xuat: {
            // bắt buộc truyền
            type: Number,
            required: true,
          },
          tien_hang: {
            type: Number,
            default: 0,
          },
          ty_le_ck: {
            type: Number,
            default: 0,
          },
          tien_ck: {
            type: Number,
            default: 0,
          },
          tien_ck_phan_bo: {
            type: Number,
            default: 0,
          },
          tong_tien_ck: {
            type: Number,
            default: 0,
          },
          thanh_tien: {
            type: Number,
            default: 0,
          },
          chi_phi: {
            type: Number,
            default: 0,
          },
          ghi_chu: {
            type: String,
            default: '',
          },
          hinh_anh: {
            type: String,
            default: ''
          },
          theo_doi_lo: {
            type: Boolean,
            default: false
          }
        },
      ],
      default: [],
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
  { timestamps: true, collection: 'phieu_ban_hang' }
);

const assignDetail = ({ vatTu, detail, tienChietKhauTrenTungSanPham }) => {
  let slThucTe = detail.sl_xuat
  detail.ma_nvt = vatTu.ma_nvt;
  detail.ten_nvt = vatTu.ten_nvt;
  if (vatTu.ds_dvt.length > 0) {
    const dvt = vatTu.ds_dvt.find((item) => item.ma_dvt === detail.ma_dvt);
    if (dvt) {
      detail.gia_ban_le = dvt.gia_ban_qd;
      slThucTe = detail.sl_xuat * dvt.sl_quy_doi
    } else {
      detail.gia_ban_le = vatTu.gia_ban_le;
    }
  } else {
    detail.gia_ban_le = vatTu.gia_ban_le;
  }
  detail.gia_von = vatTu.gia_von;
  detail.don_gia =
    detail.gia_ban_le - (detail.gia_ban_le * (detail.ty_le_ck || 0)) / 100;
  detail.tien_hang = detail.don_gia * detail.sl_xuat;
  detail.tien_ck =
    ((detail.gia_ban_le * (detail.ty_le_ck || 0)) / 100) * detail.sl_xuat;
  detail.tien_ck_phan_bo = tienChietKhauTrenTungSanPham;
  detail.tong_tien_ck = detail.tien_ck + detail.tien_ck_phan_bo;
  detail.thanh_tien = detail.tien_hang - detail.tong_tien_ck;
  detail.chi_phi = detail.gia_von * slThucTe;
};

phieuBanHangSchema.pre('save', async function (next) {
  try {
    let error;
    let pbh = this;
    let tienChietKhauTrenTungSanPham = 0;
    // tinh tien chiet khau hoa don
    const tienCkHd = ((pbh.ty_le_ck_hd || 0) * pbh.tien_hang) / 100;
    pbh.tien_ck_hd = tienCkHd;
    if (pbh.tien_ck_hd) {
      if (pbh.details.length > 0) {
        tienChietKhauTrenTungSanPham = pbh.tien_ck_hd / pbh.details.length;
      }
    }

    // kiểm tra tồn kho
    for (let i = 0; i < pbh.details.length; i++) {
      const detail = pbh.details[i];
      let slToCompare = detail.sl_xuat;
      const vatTu = await vatTuModel.findOne({ ma_vt: detail.ma_vt });
      if (!vatTu) {
        error = createHttpError(
          400,
          `Mã hàng hóa '${detail.ma_vt}' không tồn tại`
        );
        break;
      }

      if (vatTu.ds_dvt.length > 0) {
        const dvt = vatTu.ds_dvt.find((item) => item.ma_dvt === detail.ma_dvt);
        if (dvt) {
          slToCompare = detail.sl_xuat * dvt.sl_quy_doi;
        }
      }
      // tim vat tu cung ma
      const sameVatTus = pbh.details.filter(
        (item) => item.ma_vt === detail.ma_vt && item.ma_dvt !== detail.ma_dvt
      );
      if (sameVatTus.length > 0) {
        const tongSl = sameVatTus.reduce((acc, item) => {
          let dvt = vatTu.ds_dvt.find(
            (itemDvt) => itemDvt.ma_dvt === item.ma_dvt
          );
          // nếu không có đơn vị tính trong danh sách => đó là đon vị tính cơ sở
          if (!dvt) {
            dvt = {
              ma_dvt: vatTu.ma_dvt,
              ten_dvt: vatTu.ten_dvt,
              sl_quy_doi: 1,
            };
          }
          if (dvt) {
            return acc + item.sl_xuat * dvt.sl_quy_doi;
          } else {
            return acc;
          }
        }, 0);
        slToCompare += tongSl;
      }

      if (detail.ma_lo) {
        const tonKho = await tonKhoController.getInventoryByConsigmentHelper({
          ma_vt: detail.ma_vt,
          ma_lo: detail.ma_lo,
        });
        if (tonKho.ton_kho < slToCompare) {
          error = createHttpError(
            400,
            `Hàng hóa '${detail.ten_vt}' chỉ tồn ${tonKho.ton_kho} ${vatTu.ten_dvt} ở lô '${detail.ten_lo}'`
          );
          break;
        }
      } else {
        const tonKho = await tonKhoController.getInventoryOnStoreHelper({
          ma_vt: detail.ma_vt,
          ma_kho: pbh.ma_kho,
        });
        if (tonKho.ton_kho < slToCompare) {
          error = createHttpError(
            400,
            `Hàng hóa '${detail.ten_vt}' chỉ tồn ${tonKho.ton_kho} ${vatTu.ten_dvt} tại kho '${pbh.ten_kho}'`
          );
          break;
        }
      }
      assignDetail({ vatTu, detail, tienChietKhauTrenTungSanPham });
    }
    if (error) {
      return next(error);
    } else {
      if (!pbh.ma_phieu) {
        const maPhieu = await generateUniqueValueUtil({
          maDm: 'PBH',
          model: mongoose.model('PhieuBanHang', phieuBanHangSchema),
          compareKey: 'ma_phieu',
        });
        pbh.ma_phieu = maPhieu;
      }
      const maChungTu = await generateUniqueValueUtil({
        maDm: 'PBH',
        model: mongoose.model('PhieuBanHang', phieuBanHangSchema),
        compareKey: 'ma_ct',
      });
      pbh.ma_ct = maChungTu;

      // tinh tien hang
      const tienHang = pbh.details.reduce((acc, item) => {
        return acc + item.don_gia * item.sl_xuat;
      }, 0);
      pbh.tien_hang = tienHang;
      // tinh tien ck san pham
      const tienCkSp = pbh.details.reduce((acc, item) => {
        return acc + item.tien_ck;
      }, 0);
      pbh.tien_ck_sp = tienCkSp;
      // tinh tong tien ck
      const tongCk = pbh.tien_ck_hd + pbh.tien_ck_sp;
      pbh.tong_tien_ck = tongCk || 0;
      // tinh thanh tien
      const thanhTien = pbh.tien_hang - pbh.tong_tien_ck;
      pbh.thanh_tien = thanhTien || 0;
      // tinh tien VAT
      const tienVAT = (pbh.tien_hang * pbh.VAT) / 100;
      // tinh tong thanh tien
      const tongThanhTien = pbh.thanh_tien + tienVAT + pbh.tien_van_chuyen;
      pbh.t_thanh_tien = tongThanhTien;
      // tinh chi phi
      const chiPhi = await pbh.details.reduce(async (accPromise, item) => {
        const acc = await accPromise
        const vatTu = await vatTuModel.findOne({ ma_vt: item.ma_vt });
        let slThucTe = item.sl_xuat;
        if (vatTu?.ds_dvt?.length > 0) {
          const dvt = vatTu.ds_dvt.find((d) => d.ma_dvt === item.ma_dvt);
          if (dvt) {
            slThucTe = item.sl_xuat * dvt.sl_quy_doi;
          }
        }
        return acc + slThucTe * item.gia_von;
      }, Promise.resolve(0));
      pbh.chi_phi = chiPhi;
      // tinh loi nhuan
      const loiNhuan = pbh.thanh_tien - pbh.chi_phi;
      pbh.loi_nhuan = loiNhuan;
      const { nam, quy, thang, ngay, gio, phut, giay } = generateTimeByDate(
        pbh.ngay_ct
      );
      pbh.nam = nam;
      pbh.quy = quy;
      pbh.thang = thang;
      pbh.ngay = ngay;
      pbh.gio = gio;
      pbh.phut = phut;
      pbh.giay = giay;
      next();
    }
  } catch (error) {
    next(error);
  }
});
phieuBanHangSchema.post('save', async function () {
  const pbh = this;
  if (pbh.ma_trang_thai === 2) {
    const ngay = pbh.ngay_ct.getDate();
    const thang = pbh.ngay_ct.getMonth() + 1;
    const nam = pbh.ngay_ct.getFullYear();
    const quy = getQuyByMonth(thang);
    const gio = pbh.ngay_ct.getHours();
    const phut = pbh.ngay_ct.getMinutes();
    const giay = pbh.ngay_ct.getSeconds();

    // luu vao phieu thu
    await phieuThuModel.create({
      ma_ct_tham_chieu: pbh.ma_ct,
      ma_nhom_nguoi_nop: 'kh',
      ten_nhom_nguoi_nop: 'Khách Hàng',
      ma_loai: 'LPT0001',
      ten_loai: 'Thu tiền khách hàng',
      ngay_ct: pbh.ngay_ct,
      ngay_lap_phieu: pbh.ngay_ct,
      gia_tri: pbh.t_thanh_tien,
      ma_pttt: pbh.ma_pttt,
      ten_pttt: pbh.ten_pttt,
      ma_kho: pbh.ma_kho,
      ten_kho: pbh.ten_kho,
      dien_giai: 'Phiếu tạo tự động khi thanh toán hóa đơn bán hàng',
    });

    // luu vao so kho
    pbh.details.forEach(async (detail) => {
      const vatTu = await vatTuModel.findOne({ ma_vt: detail.ma_vt });
      let slXuat = detail.sl_xuat;
      if (vatTu.ds_dvt?.length > 0) {
        const dvt = vatTu.ds_dvt.find((item) => item.ma_dvt === detail.ma_dvt);
        if (dvt) {
          slXuat = detail.sl_xuat * dvt.sl_quy_doi;
        }
      }
      await soKhoModel.create({
        ma_ct: pbh.ma_ct,
        ma_loai_ct: pbh.ma_loai_ct,
        ten_loai_ct: pbh.ten_loai_ct,
        ma_kho: pbh.ma_kho,
        ten_kho: pbh.ten_kho,
        ngay_ct: pbh.ngay_ct,
        nam,
        quy,
        thang,
        ngay,
        gio,
        phut,
        giay,
        ma_lo: detail.ma_lo,
        ten_lo: detail.ten_lo,
        ma_vt: detail.ma_vt,
        ten_vt: detail.ten_vt,
        sl_xuat: slXuat,
        so_luong: -slXuat,
        ma_kh: pbh.ma_kh,
        gia_tri_ban: detail.thanh_tien,
        chi_phi: detail.chi_phi,
        loi_nhuan: detail.thanh_tien - detail.chi_phi,
        ma_tham_chieu: detail._id,
      });
    });
  }
});
phieuBanHangSchema.pre('updateOne', async function (next) {
  try {
    let error;
    let pbh = this.getUpdate();
    const filter = this.getFilter();
    const oldPbh = await this.model.findOne(filter);
    this.oldPbh = oldPbh;

    if (oldPbh.ma_trang_thai === 2) {
      return next(
        createHttpError(400, `Không thể chỉnh sửa, hóa đơn đã thanh toán`)
      );
    } else {
      const tienCkHd = ((pbh.ty_le_ck_hd || 0) * pbh.tien_hang) / 100;
      pbh.tien_ck_hd = tienCkHd;
      let tienChietKhauTrenTungSanPham = 0;
      if (pbh.tien_ck_hd) {
        if (pbh.details.length > 0) {
          tienChietKhauTrenTungSanPham = pbh.tien_ck_hd / pbh.details.length;
        }
      }
      for (let i = 0; i < pbh.details.length; i++) {
        const detail = pbh.details[i];
        const oldDetail = oldPbh.details[i];
        let slToCompare = detail.sl_xuat;
        const vatTu = await vatTuModel.findOne({ ma_vt: detail.ma_vt });
        if (!vatTu) {
          error = createHttpError(
            400,
            `Mã hàng hóa '${detail.ma_vt}' không tồn tại`
          );
          break;
        }
        if (
          oldPbh.ma_trang_thai === 2 &&
          pbh.ma_trang_thai === 2 &&
          (oldDetail?.ma_vt !== detail?.ma_vt ||
            oldDetail?.thanh_tien !== detail?.thanh_tien)
        ) {
          error = createHttpError(
            400,
            `Không được chỉnh sửa chi tiết hóa đơn đã thanh toán`
          );
          break;
        }
        if (vatTu.ds_dvt.length > 0) {
          const dvt = vatTu.ds_dvt.find(
            (item) => item.ma_dvt === detail.ma_dvt
          );
          if (dvt) {
            slToCompare = detail.sl_xuat * dvt.sl_quy_doi;
          }
        }
        // tim vat tu cung ma
        const sameVatTus = pbh.details.filter(
          (item) => item.ma_vt === detail.ma_vt && item.ma_dvt !== detail.ma_dvt
        );
        if (sameVatTus.length > 0) {
          const tongSl = sameVatTus.reduce((acc, item) => {
            let dvt = vatTu.ds_dvt.find(
              (itemDvt) => itemDvt.ma_dvt === item.ma_dvt
            );
            // nếu không có đơn vị tính trong danh sách => đó là đon vị tính cơ sở
            if (!dvt) {
              dvt = {
                ma_dvt: vatTu.ma_dvt,
                ten_dvt: vatTu.ten_dvt,
                sl_quy_doi: 1,
              };
            }
            if (dvt) {
              return acc + item.sl_xuat * dvt.sl_quy_doi;
            } else {
              return acc;
            }
          }, 0);
          slToCompare += tongSl;
        }

        if (detail.ma_lo) {
          const tonKho = await tonKhoController.getInventoryByConsigmentHelper({
            ma_vt: detail.ma_vt,
            ma_lo: detail.ma_lo,
          });
          if (tonKho.ton_kho < slToCompare) {
            error = createHttpError(
              400,
              `Hàng hóa '${detail.ten_vt}' chỉ tồn ${tonKho.ton_kho} ${vatTu.ten_dvt} ở lô '${detail.ten_lo}'`
            );
            break;
          }
        } else {
          const tonKho = await tonKhoController.getInventoryOnStoreHelper({
            ma_vt: detail.ma_vt,
            ma_kho: pbh.ma_kho,
          });
          if (tonKho.ton_kho < slToCompare) {
            error = createHttpError(
              400,
              `Hàng hóa '${detail.ten_vt}' chỉ tồn ${tonKho.ton_kho} ${vatTu.ten_dvt} tại kho '${pbh.ten_kho}'`
            );
            break;
          }
        }
        assignDetail({ vatTu, detail, tienChietKhauTrenTungSanPham });
      }
      if (error) {
        return next(error);
      } else {
        // tinh tien hang
        const tienHang = pbh.details.reduce((acc, item) => {
          return acc + item.don_gia * item.sl_xuat;
        }, 0);
        pbh.tien_hang = tienHang;
        // tinh tien ck san pham
        const tienCkSp = pbh.details.reduce((acc, item) => {
          return acc + (item.tien_ck || 0);
        }, 0);
        pbh.tien_ck_sp = tienCkSp || 0;
        // tinh tong tien ck
        const tongCk = pbh.tien_ck_hd + pbh.tien_ck_sp;
        pbh.tong_tien_ck = tongCk || 0;
        // tinh thanh tien
        const thanhTien = pbh.tien_hang - pbh.tong_tien_ck;
        pbh.thanh_tien = thanhTien || 0;
        // tinh tien VAT
        const tienVAT = (pbh.tien_hang * pbh.VAT) / 100;
        // tinh tong thanh tien
        const tongThanhTien = pbh.thanh_tien + tienVAT + pbh.tien_van_chuyen;
        pbh.t_thanh_tien = tongThanhTien;
        // tinh chi phi
        const chiPhi = await pbh.details.reduce(async (accPromise, item) => {
          const acc = await accPromise;
          const vatTu = await vatTuModel.findOne({ ma_vt: item.ma_vt });
          let slThucTe = item.sl_xuat;
          if (vatTu?.ds_dvt?.length > 0) {
            const dvt = vatTu.ds_dvt.find((d) => d.ma_dvt === item.ma_dvt);
            if (dvt) {
              slThucTe = item.sl_xuat * dvt.sl_quy_doi;
            }
          }
          return acc + slThucTe * item.gia_von;
        }, Promise.resolve(0));
        pbh.chi_phi = chiPhi;
        const { nam, quy, thang, ngay, gio, phut, giay } = generateTimeByDate(
          new Date(pbh.ngay_ct)
        );
        // tinh loi nhuan
        const loiNhuan = pbh.thanh_tien - pbh.chi_phi;
        pbh.loi_nhuan = loiNhuan;
        pbh.tien_thoi = pbh.tien_thu - pbh.t_thanh_tien;
        pbh.nam = nam;
        pbh.quy = quy;
        pbh.thang = thang;
        pbh.ngay = ngay;
        pbh.gio = gio;
        pbh.phut = phut;
        pbh.giay = giay;
        next();
      }
    }
  } catch (error) {
    next(error);
  }
});
phieuBanHangSchema.post('updateOne', async function () {
  let pbh = this.getUpdate().$set;
  const ngay = pbh.ngay_ct.getDate();
  const thang = pbh.ngay_ct.getMonth() + 1;
  const nam = pbh.ngay_ct.getFullYear();
  const quy = getQuyByMonth(thang);
  const gio = pbh.ngay_ct.getHours();
  const phut = pbh.ngay_ct.getMinutes();
  const giay = pbh.ngay_ct.getSeconds();

  if (this.oldPbh?.ma_trang_thai !== 2 && pbh.ma_trang_thai === 2) {
    // luu vao phieu thu
    await phieuThuModel.create({
      ma_ct_tham_chieu: pbh.ma_ct,
      ma_loai: 'LPT0001',
      ten_loai: 'Thu tiền khách hàng',
      ngay_ct: pbh.ngay_ct,
      ngay_lap_phieu: pbh.ngay_ct,
      gia_tri: pbh.t_thanh_tien,
      ma_pttt: pbh.ma_pttt,
      ten_pttt: pbh.ten_pttt,
      ma_kho: pbh.ma_kho,
      ten_kho: pbh.ten_kho,
      dien_giai: 'Phiếu tạo tự động khi thanh toán hóa đơn bán hàng',
    });

    // luu vao so kho
    pbh.details.forEach(async (detail) => {
      const vatTu = await vatTuModel.findOne({ ma_vt: detail.ma_vt });
      let slXuat = detail.sl_xuat;
      if (vatTu.ds_dvt?.length > 0) {
        const dvt = vatTu.ds_dvt.find((item) => item.ma_dvt === detail.ma_dvt);
        if (dvt) {
          slXuat = detail.sl_xuat * dvt.sl_quy_doi;
        }
      }
      await soKhoModel.create({
        ma_ct: pbh.ma_ct,
        ma_loai_ct: pbh.ma_loai_ct,
        ten_loai_ct: pbh.ten_loai_ct,
        ma_kho: pbh.ma_kho,
        ten_kho: pbh.ten_kho,
        ngay_ct: pbh.ngay_ct,
        nam,
        quy,
        thang,
        ngay,
        gio,
        phut,
        giay,
        ma_lo: detail.ma_lo,
        ten_lo: detail.ten_lo,
        ma_vt: detail.ma_vt,
        ten_vt: detail.ten_vt,
        sl_xuat: slXuat,
        so_luong: -slXuat,
        ma_kh: pbh.ma_kh,
        gia_tri_ban: detail.thanh_tien,
        chi_phi: detail.chi_phi,
        loi_nhuan: detail.thanh_tien - detail.chi_phi,
        ma_tham_chieu: detail._id,
      });
    });
  }
  // else if (this.oldPbh.ma_trang_thai === 2 && pbh.ma_trang_thai !== 2) {
  //   // xoa phieu thu
  //   await phieuThuModel.deleteMany({ ma_ct_tham_chieu: pbh.ma_ct });
  //   // xoa so kho
  //   for (let i = 0; i < pbh.details.length; i++) {
  //     const detail = pbh.details[i];
  //     await soKhoModel.deleteMany({
  //       ma_ct: pbh.ma_ct,
  //       ma_vt: detail.ma_vt,
  //       ma_tham_chieu: detail._id,
  //     });
  //   }
  // } else if (pbh.ma_trang_thai === 2 && this.oldPbh.ma_trang_thai === 2) {
  //   await phieuThuModel.updateOne(
  //     { ma_ct_tham_chieu: pbh.ma_ct },
  //     {
  //       ngay_ct: pbh.ngay_ct,
  //       ngay_lap_phieu: pbh.ngay_ct,
  //       gia_tri: pbh.t_thanh_tien,
  //       ma_pttt: pbh.ma_pttt,
  //       ten_pttt: pbh.ten_pttt,
  //       ma_kho: pbh.ma_kho,
  //       ten_kho: pbh.ten_kho,
  //       dien_giai: 'Phiếu tạo tự động khi thanh toán hóa đơn bán hàng',
  //     }
  //   );
  //   for (let i = 0; i < pbh.details.length; i++) {
  //     const detail = pbh.details[i];
  //     await soKhoModel.updateOne(
  //       { ma_ct: pbh.ma_ct, ma_vt: detail.ma_vt, ma_tham_chieu: detail._id },
  //       {
  //         ma_kho: pbh.ma_kho,
  //         ten_kho: pbh.ten_kho,
  //         ngay_ct: pbh.ngay_ct,
  //         nam,
  //         quy,
  //         thang,
  //         ngay,
  //         gio,
  //         phut,
  //         giay,
  //         ma_lo: detail.ma_lo,
  //         ten_lo: detail.ten_lo,
  //         ma_vt: detail.ma_vt,
  //         ten_vt: detail.ten_vt,
  //         sl_xuat: slXuat,
  //         so_luong: -slXuat,
  //         ma_kh: pbh.ma_kh,
  //         gia_tri_ban: detail.thanh_tien,
  //         chi_phi: detail.chi_phi,
  //         loi_nhuan: detail.thanh_tien - detail.chi_phi,
  //       }
  //     );
  //   }
  // }
});
phieuBanHangSchema.post('updateMany', async function () {
  const filter = this.getFilter();
  const pbhUpdate = this.getUpdate().$set;
  const pbhs = await this.model.findWithDeleted(filter);
  const maCts = pbhs.map((item) => item.ma_ct);
  let method = pbhs[0]?.deleted === true ? 'delete' : 'restore';
  // cap nhat phieu thu
  await phieuThuModel[method]({ ma_ct_tham_chieu: { $in: maCts } });
  pbhs.forEach(async (pbh) => {
    const maThamChieus = pbh.details.map((item) => item._id);
    await soKhoModel[method]({ ma_tham_chieu: { $in: maThamChieus } });
  });
});
phieuBanHangSchema.pre('deleteMany', async function (next) {
  try {
    const filter = this.getFilter();
    const pbhs = await this.model.findDeleted(filter);
    const maCts = pbhs.map((item) => item.ma_ct);
    await phieuThuModel.deleteMany({ ma_ct_tham_chieu: { $in: maCts } });
    pbhs.forEach(async (pbh) => {
      const maThamChieus = pbh.details.map((item) => item._id);
      await soKhoModel.deleteMany({ ma_tham_chieu: { $in: maThamChieus } });
    });
    next();
  } catch (error) {
    next(error);
  }
});

// function
phieuBanHangSchema.statics.setKho = async function ({ ma_kho, ten_kho }) {
  await this.updateMany({ ma_kho }, { ten_kho });
};
phieuBanHangSchema.statics.isExistMaKho = async function (ma_kho) {
  const result = await this.findOne({ ma_kho });
  return result;
};
phieuBanHangSchema.statics.setKenhBan = async function ({ ma_kenh, ten_kenh }) {
  await this.updateMany({ ma_kenh }, { ten_kenh });
};
phieuBanHangSchema.statics.isExistMaKenh = async function (ma_kenh) {
  const result = await this.findOne({ ma_kenh });
  return result;
};
phieuBanHangSchema.statics.setLo = async function ({ ma_lo, ten_lo }) {
  await this.updateMany(
    { 'details.ma_lo': ma_lo },
    { 'details.$.ten_lo': ten_lo }
  );
};
phieuBanHangSchema.statics.isExistMaLo = async function (ma_lo) {
  const result = await this.findOne({ 'details.ma_lo': ma_lo });
  return result;
};
phieuBanHangSchema.statics.setTenVt = async function ({ ma_vt, ten_vt }) {
  await this.updateMany(
    { 'details.ma_vt': ma_vt },
    { 'details.$.ten_vt': ten_vt }
  );
};
phieuBanHangSchema.statics.isExistMaVt = async function (ma_vt) {
  const result = await this.findOne({ 'details.ma_vt': ma_vt });
  return result;
};

phieuBanHangSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: 'all',
});

module.exports = mongoose.model('PhieuBanHang', phieuBanHangSchema);
