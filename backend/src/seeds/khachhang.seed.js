const khachHangModel = require('../app/models/khachHang.model');

const generateKhachHang = async () => {
  // Tạo dữ liệu mẫu
  const sampleData = [{ ma_kh: 'khachle', ten_kh: 'Khách lẻ' }];
  const operations = sampleData.map((doc) => ({
    updateOne: {
      filter: { ma_kh: doc.ma_kh },
      update: doc,
      upsert: true,
      new: true,
    },
  }));
  await khachHangModel.bulkWrite(operations);
};
module.exports = generateKhachHang;
