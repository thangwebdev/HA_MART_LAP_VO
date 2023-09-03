const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const _PhieuNhapKho = require('../app/models/phieuNhapKho.model');
const _PhieuKiemKho = require('../app/models/phieuKiemKho.model');
const _PhieuXuatHuy = require('../app/models/phieuXuatHuy.model');
const _PhieuBanHang = require('../app/models/phieuBanHang.model');

const LO_UPDATE = 'lo/update';
eventEmitter.on(LO_UPDATE, async (lo) => {
  await _PhieuNhapKho.setLo({ ma_lo: lo.ma_lo, ten_lo: lo.ten_lo });
  await _PhieuKiemKho.setLo({ ma_lo: lo.ma_lo, ten_lo: lo.ten_lo });
  await _PhieuXuatHuy.setLo({ ma_lo: lo.ma_lo, ten_lo: lo.ten_lo });
  await _PhieuBanHang.setLo({ ma_lo: lo.ma_lo, ten_lo: lo.ten_lo });
});

const LO_SOFTDELETE = 'lo/softdelete';
eventEmitter.on(LO_SOFTDELETE, async (los, next) => {
    let error
  for (let i = 0; i < los.length; i++) {
    const lo = los[i];
    const pnk = await _PhieuNhapKho.isExistMaLo(lo.ma_lo);
    const pkk = await _PhieuKiemKho.isExistMaLo(lo.ma_lo);
    const pxk = await _PhieuXuatHuy.isExistMaLo(lo.ma_lo);
    const pbh = await _PhieuBanHang.isExistMaLo(lo.ma_lo);
    if (pnk) {
      error = createHttpError(
        400,
        `Lô '${lo.ten_lo}' đã phát sinh dữ liệu với phiếu nhập '${pnk.ma_phieu}'`
      );
      break;
    } else if (pkk) {
      error = createHttpError(
        400,
        `Lô '${lo.ten_lo}' đã phát sinh dữ liệu với phiếu kiểm kho '${pkk.ma_phieu}'`
      );
      break;
    } else if (pxk) {
      error = createHttpError(
        400,
        `Lô '${lo.ten_lo}' đã phát sinh dữ liệu với phiếu xuất kho '${pxk.ma_phieu}'`
      );
      break;
    } else if (pbh) {
      error = createHttpError(
        400,
        `Lô '${lo.ten_lo}' đã phát sinh dữ liệu với hóa đơn '${pxk.ma_phieu}'`
      );
      break;
    }
  }
  if(error) {
    return next(error)
  }else {
    return next()
  }
});

module.exports = { eventEmitter, LO_UPDATE, LO_SOFTDELETE };
