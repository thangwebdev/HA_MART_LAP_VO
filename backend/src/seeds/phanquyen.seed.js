const phanQuyenModel = require('../app/models/phanQuyen.model');

const generatePhanQuyen = async () => {
  // Tạo dữ liệu mẫu
  const sampleData = [
    {
      ma_phan_quyen: 1,
      ten_phan_quyen: 'Chủ của hàng',
    },
    {
      ma_phan_quyen: 2,
      ten_phan_quyen: 'Quản lý kho',
    },
    {
      ma_phan_quyen: 3,
      ten_phan_quyen: 'nhân viên kho',
    },
    {
      ma_phan_quyen: 4,
      ten_phan_quyen: 'nhân viên bán hàng',
    },
  ];
  const operations = sampleData.map((doc) => ({
    updateOne: {
      filter: { ma_phan_quyen: doc.ma_phan_quyen },
      update: doc,
      upsert: true,
      new: true,
    },
  }));
  await phanQuyenModel.bulkWrite(operations);
};
module.exports = generatePhanQuyen;
