const LoaiPhieuChiModel = require('../app/models/loaiPhieuChi.model');

const generateLoaiPhieuChi = async () => {
  // Tạo dữ liệu mẫu
  const sampleData = [
    { ma_loai: 'LPC0001', ten_loai: 'Chi tiền nhập hàng' },
    { ma_loai: 'LPC0002', ten_loai: 'Chi tiền lương nhân viên' },
    { ma_loai: 'LPC0003', ten_loai: 'Chi tiền điện nước' },
    { ma_loai: 'LPC0004', ten_loai: 'Chi khác' },
  ];
  const operations = sampleData.map((doc) => ({
    updateOne: {
      filter: { ma_loai: doc.ma_loai },
      update: doc,
      upsert: true,
      new: true,
    },
  }));
  await LoaiPhieuChiModel.bulkWrite(operations);
};
module.exports = generateLoaiPhieuChi;
