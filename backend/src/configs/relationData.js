const _SoKho = require('../app/models/soKho.model');
const _VatTu = require('../app/models/vatTu.model');
const _Lo = require('../app/models/lo.model');
const _PhieuKiemKho = require('../app/models/phieuKiemKho.model');
const _PhieuDieuChuyen = require('../app/models/phieuDieuChuyen.model');
const _PhieuXuatHuy = require('../app/models/phieuXuatHuy.model');
const _PhieuBanHang = require('../app/models/phieuBanHang.model');
const _PhieuNhapKho = require('../app/models/phieuNhapKho.model');

// update vatu to so kho
const relationVatTuToSoKho = async () => {
  const distincts = await _SoKho.aggregate([
    { $group: { _id: '$ma_vt', ma_vt: { $first: '$ma_vt' } } },
    { $project: { _id: 0 } },
  ]);
  for (let i = 0; i < distincts.length; i++) {
    const distinct = distincts[i];
    const vatTu = await _VatTu.findOne({ ma_vt: distinct.ma_vt });
    await _SoKho.updateMany(
      { ma_vt: distinct.ma_vt },
      { ten_vt: vatTu.ten_vt }
    );
  }
};
// update vatu to lo
const relationVatTuToLo = async () => {
  const distincts = await _Lo.aggregate([
    { $group: { _id: '$ma_vt', ma_vt: { $first: '$ma_vt' } } },
    { $project: { _id: 0 } },
  ]);
  for (let i = 0; i < distincts.length; i++) {
    const distinct = distincts[i];
    const vatTu = await _VatTu.findOne({ ma_vt: distinct.ma_vt });
    await _Lo.updateMany({ ma_vt: distinct.ma_vt }, { ten_vt: vatTu.ten_vt });
  }
};
// update vatu to phieu kiem kho
const relationVatTuToPhieuKiemKho = async () => {
  const distincts = await _PhieuKiemKho.aggregate([
    { $group: { _id: '$ma_vt', ma_vt: { $first: '$ma_vt' } } },
    { $project: { _id: 0 } },
  ]);
  for (let i = 0; i < distincts.length; i++) {
    const distinct = distincts[i];
    const vatTu = await _VatTu.findOne({ ma_vt: distinct.ma_vt });
    await _PhieuKiemKho.updateMany(
      { ma_vt: distinct.ma_vt },
      { ten_vt: vatTu.ten_vt }
    );
  }
};
// update vatu to phieu dieu chuyen
const relationVatTuToPhieuDieuChuyen = async () => {
  const distincts = await _PhieuDieuChuyen.aggregate([
    { $group: { _id: '$ma_vt', ma_vt: { $first: '$ma_vt' } } },
    { $project: { _id: 0 } },
  ]);
  for (let i = 0; i < distincts.length; i++) {
    const distinct = distincts[i];
    const vatTu = await _VatTu.findOne({ ma_vt: distinct.ma_vt });
    await _PhieuDieuChuyen.updateMany(
      { ma_vt: distinct.ma_vt },
      { ten_vt: vatTu.ten_vt }
    );
  }
};
// update vatu to phieu xuat huy
const relationVatTuToPhieuXuatHuy = async () => {
  const distincts = await _PhieuXuatHuy.aggregate([
    { $group: { _id: '$ma_vt', ma_vt: { $first: '$ma_vt' } } },
    { $project: { _id: 0 } },
  ]);
  for (let i = 0; i < distincts.length; i++) {
    const distinct = distincts[i];
    const vatTu = await _VatTu.findOne({ ma_vt: distinct.ma_vt });
    await _PhieuXuatHuy.updateMany(
      { ma_vt: distinct.ma_vt },
      { ten_vt: vatTu.ten_vt }
    );
  }
};

relationVatTuToSoKho();
relationVatTuToLo();
relationVatTuToPhieuKiemKho();
relationVatTuToPhieuDieuChuyen();
relationVatTuToPhieuXuatHuy();

async function relationData() {
  setInterval(async () => {
    await relationVatTuToSoKho();
    await relationVatTuToLo();
    await relationVatTuToPhieuKiemKho();
    await relationVatTuToPhieuDieuChuyen();
    await relationVatTuToPhieuXuatHuy();
  }, 3600000);
}
module.exports = relationData;
