const trangThaiPBHModel = require('../app/models/trangThaiPhieuBanHang.model');

const generateTrangThaiPBH = async () => {
  // Tạo dữ liệu mẫu
  const sampleData = [
    { ma_trang_thai: 1, ten_trang_thai: 'Đang có khách' },
    { ma_trang_thai: 2, ten_trang_thai: 'Đã thanh toán' },
    { ma_trang_thai: 3, ten_trang_thai: 'Hủy' },
  ];
  const operations = sampleData.map((doc) => ({
    updateOne: {
      filter: { ma_trang_thai: doc.ma_trang_thai },
      update: doc,
      upsert: true,
      new: true,
    },
  }));
  await trangThaiPBHModel.bulkWrite(operations);
};
module.exports = generateTrangThaiPBH;
