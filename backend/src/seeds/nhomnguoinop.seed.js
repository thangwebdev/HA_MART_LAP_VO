const nhomNguoiNopModel = require('../app/models/nhomNguoiNop.model');

const generateNhomNguoiNop = async () => {
  // Tạo dữ liệu mẫu
  const sampleData = [
    {
      ma_nhom_nguoi_nop: 'ncc',
      ten_nhom_nguoi_nop: 'Nhà Cung Cấp',
      ma_danh_muc: 'dmncc',
    },
    {
      ma_nhom_nguoi_nop: 'kh',
      ten_nhom_nguoi_nop: 'Khách Hàng',
      ma_danh_muc: 'dmkh',
    },
    {
      ma_nhom_nguoi_nop: 'khac',
      ten_nhom_nguoi_nop: 'Khác',
    },
  ];
  const operations = sampleData.map((doc) => ({
    updateOne: {
      filter: { ma_nhom_nguoi_nop: doc.ma_nhom_nguoi_nop },
      update: doc,
      upsert: true,
      new: true,
    },
  }));
  await nhomNguoiNopModel.bulkWrite(operations)
};
module.exports = generateNhomNguoiNop;
