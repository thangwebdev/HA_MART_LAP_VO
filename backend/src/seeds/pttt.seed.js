const PtttModel = require('../app/models/phuongThucThanhToan.model');

const generatePTTT = async () => {
  // Tạo dữ liệu mẫu
  const sampleData = [
    { ma_pttt: 'PTTT0001', ten_pttt: 'Tiền mặt' },
    { ma_pttt: 'PTTT0002', ten_pttt: 'Chuyển khoản' },
  ];
  const operations = sampleData.map((doc) => ({
    updateOne: {
      filter: { ma_pttt: doc.ma_pttt },
      update: doc,
      upsert: true,
      new: true,
    },
  }));
  await PtttModel.bulkWrite(operations);
};
module.exports = generatePTTT;
