const chungTuModel = require('../app/models/chungTu.model');

const generateChungTu = async () => {
  // Tạo dữ liệu mẫu
  const sampleData = [
    {
      ma_ct: 'pnk',
      ten_ct: 'Phiếu nhập kho',
      dien_giai: 'Mỗi lần nhập kho sẽ tạo ra một phiếu nhập kho',
    },
    // {
    //   ma_ct: 'pxk',
    //   ten_ct: 'Phiếu xuất kho',
    //   dien_giai: 'Mỗi lần xuất kho cần tạo một phiếu xuất kho',
    // },
    {
      ma_ct: 'pkk',
      ten_ct: 'Phiếu kiểm kho',
      dien_giai: 'Khi kiểm kho sẽ tạo một phiếu kiểm kho',
    },
    {
      ma_ct: 'pbh',
      ten_ct: 'Phiếu bán hàng',
      dien_giai: 'Ghi nhận thông tin bán hàng',
    },
    {
      ma_ct: 'pxdc',
      ten_ct: 'Phiếu điều chuyển kho',
      dien_giai:
        'Ghi nhận thông tin khi điều chuyển hàng hóa từ kho này sang kho khác',
    },
    {
      ma_ct: 'pxh',
      ten_ct: 'Phiếu xuất hủy',
      dien_giai: 'Ghi nhận thông tin khi tiêu hủy hàng hóa khỏi kho',
    },
    {
      ma_ct: 'ptt',
      ten_ct: 'Phiếu thu tiền',
      dien_giai: 'Ghi nhận thông tin khi thu tiền vào quỹ',
    },
    {
      ma_ct: 'pct',
      ten_ct: 'Phiếu chi tiền',
      dien_giai: 'Ghi nhận thông tin khi chi tiền trong quỹ',
    },
  ];
  const operations = sampleData.map((doc) => ({
    updateOne: {
      filter: { ma_ct: doc.ma_ct },
      update: doc,
      upsert: true,
      new: true,
    },
  }));
  await chungTuModel.bulkWrite(operations);
};
module.exports = generateChungTu;
