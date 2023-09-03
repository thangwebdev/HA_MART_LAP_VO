const reports = {
  doanhthu: {
    title: 'Doanh thu',
    groupFields: [
      { reportKey: 'doanh_thu_thuan', sumKey: '$thanh_tien' },
      { reportKey: 'doanh_thu', sumKey: '$t_thanh_tien' },
    ],
  },
  loinhuan: {
    title: 'Lợi nhuận',
    groupFields: [
      { reportKey: 'loi_nhuan', sumKey: '$loi_nhuan' },
      { reportKey: 'tong_doanh_thu', sumKey: '$thanh_tien' },
      { reportKey: 'tong_chi_phi', sumKey: '$chi_phi' },
    ],
  },
};
module.exports = reports;
