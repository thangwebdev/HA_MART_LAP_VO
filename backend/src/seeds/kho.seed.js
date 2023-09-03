const khoModel = require('../app/models/kho.model');

const generateKho = async () => {
  // Tạo dữ liệu mẫu
  const ma_kho = 'CN0001';
  const sampleData = {
    ma_kho,
    ten_kho: 'Chi nhánh trung tâm',
  };
  const kho = await khoModel.findOne({ ma_kho });
  if (!kho) {
    await khoModel.create(sampleData);
  }
};
module.exports = generateKho;
