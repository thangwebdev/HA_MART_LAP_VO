const nguoiDungModel = require('../app/models/nguoiDung.model');

const generateNguoiDung = async () => {
  // Tạo dữ liệu mẫu
  const email = 'admin@gmail.com';
  const sampleData = {
    ten_nguoi_dung: 'Phạm Hữu Khanh',
    email,
    mat_khau: '123456',
    ma_phan_quyen: 1,
    ten_phan_quyen: 'Chủ cửa hàng',
  };
  const user = await nguoiDungModel.findOne({ email });
  if (!user) {
    await nguoiDungModel.create(sampleData);
  }
};
module.exports = generateNguoiDung;
