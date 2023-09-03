const nhomNguoiNhanModel = require('../app/models/nhomNguoiNhan.model');

const generateNhomNguoiNhan = async () => {
  // Tạo dữ liệu mẫu
  const sampleData = [
    {
      ma_nhom_nguoi_nhan: 'ncc',
      ten_nhom_nguoi_nhan: 'Nhà Cung Cấp',
      ma_danh_muc: 'dmncc',
    },
    {
        ma_nhom_nguoi_nhan: 'nv',
        ten_nhom_nguoi_nhan: 'Nhân Viên',
        ma_danh_muc: 'dmkh',
      },
      {
        ma_nhom_nguoi_nhan: 'khac',
        ten_nhom_nguoi_nhan: 'Khác',
      },
    
    
  ];
  const operations = sampleData.map((doc) => ({
    updateOne: {
      filter: { ma_nhom_nguoi_nhan: doc.ma_nhom_nguoi_nhan },
      update: doc,
      upsert: true,
      new: true,
    },
  }));
  await nhomNguoiNhanModel.bulkWrite(operations)
};
module.exports = generateNhomNguoiNhan;
