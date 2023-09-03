const trangThaiModel = require('../app/models/trangThai.model');

const generateTrangThai = async () => {
  // Tạo dữ liệu mẫu
  const sampleData = [
    { ma_trang_thai: 1, ten_trang_thai: 'Đang có khách', ma_loai_ct: 'dmpbh' },
    { ma_trang_thai: 2, ten_trang_thai: 'Đã thanh toán', ma_loai_ct: 'dmpbh' },
    { ma_trang_thai: 3, ten_trang_thai: 'Hủy', ma_loai_ct: 'dmpbh' },
    { ma_trang_thai: 1, ten_trang_thai: 'Khởi tạo', ma_loai_ct: 'dmpkho' },
    { ma_trang_thai: 2, ten_trang_thai: 'Chờ duyệt', ma_loai_ct: 'dmpkho' },
    { ma_trang_thai: 3, ten_trang_thai: 'Đã duyệt', ma_loai_ct: 'dmpkho' },
  ];
  const operations = sampleData.map((doc) => ({
    updateOne: {
      filter: { ma_trang_thai: doc.ma_trang_thai, ma_loai_ct: doc.ma_loai_ct },
      update: doc,
      upsert: true,
      new: true,
    },
  }));
  await trangThaiModel.bulkWrite(operations);
};
module.exports = generateTrangThai;
