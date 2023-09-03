const KenhBanModel = require('../app/models/kenhBan.model');

const generateKenhBan = async () => {
  // Tạo dữ liệu mẫu
  const sampleData = [{ ma_kenh: 'KB0001', ten_kenh: 'Trực tiếp' }];
  const operations = sampleData.map((doc) => ({
    updateOne: {
      filter: { ma_kenh: doc.ma_kenh },
      update: doc,
      upsert: true,
      new: true,
    },
  }));
  await KenhBanModel.bulkWrite(operations);
};
module.exports = generateKenhBan;
