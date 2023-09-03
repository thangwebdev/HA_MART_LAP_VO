/*
  * Báo cáo bán hàng
  - Báo cáo doanh thu
  + Theo thời gian
  + Theo nguồn bán hàng (update)
  + Sản phẩm bán chạy
  + Doanh thu theo sản phẩm
  + Doanh thu theo đơn hàng
  + Doanh thu theo khách hàng
  + Doanh thu theo nhân viên
  + Doanh thu theo chi nhánh
  + Báo cáo trả hàng theo sản phẩm
  + Báo cáo trả hàng theo đơn hàng
  + Báo cáo bán hàng chi tiết

  - Báo cáo lợi nhuận
  + Lợi nhuận theo thời gian
  + Lợi nhuận theo đơn hàng
  + Lợi nhuận theo khách hàng (update)
  + Lợi nhuận theo nhóm khách hàng (update)
  + Lợi nhuận theo chi nhánh
  + Lợi nhuận theo sản phẩm
  + Lợi nhuận theo nhân viên (update)
  + Lợi nhuận theo nguồn bán hàng (update)
  + Báo cáo bán hàng tổng hợp

  * Báo cáo kho
  - Báo cáo tồn kho
  - Sổ kho
  - Báo cáo dưới định mức tồn
  - Xuất, nhập tồn
  - Báo cáo vượt đinh mức
  - Báo cáo kiểm hàng
  - Báo cáo gợi ý nhập hàng

  * Báo cáo tài chính
  - Báo cái lãi lỗ
  - Sổ quỹ
  - Báo cáo công nợ phải thu
  - Báo cáo công nợ phải trả
*/
const moment = require('moment');
const soKhoModel = require('../models/soKho.model');
const phieuBanHangModel = require('../models/phieuBanHang.model');

const reportController = {
  // Báo cáo bán hàng
  //  - Báo cáo doanh thu

  // handler functions
  async getXNTHangHoa({ startDate, endDate, skip, limit, condition }) {
    const result = [];

    const matchObj = {
      $match: { ngay_ct: { $gte: startDate, $lte: endDate }, ...condition },
    };
    if (!condition.ma_kho) {
      matchObj.$match.ma_loai_ct = { $in: ['pnk', 'pbh'] };
    }
    let nhapXuatKhos = await soKhoModel.aggregate([
      matchObj,
      {
        $group: {
          _id: '$ma_vt',
          ma_vt: { $first: '$ma_vt' },
          ten_vt: { $first: '$ten_vt' },
          nhap_kho: { $sum: '$sl_nhap' },
          xuat_kho: { $sum: '$sl_xuat' },
        },
      },
      { $project: { _id: 0 } },
      { $skip: skip },
      { $limit: limit },
    ]);
    let count = await soKhoModel.aggregate([
      matchObj,
      {
        $group: {
          _id: '$ma_vt',
        },
      },
    ]);
    const matchObjDauKy = {
      $match: { ngay_ct: { $lt: startDate }, ...condition },
    };
    const tonDauKys = await soKhoModel.aggregate([
      matchObjDauKy,
      {
        $group: {
          _id: '$ma_vt',
          ma_vt: { $first: '$ma_vt' },
          ton_dau_ky: { $sum: '$so_luong' },
        },
      },
      { $project: { _id: 0 } },
    ]);
    const matchObjCuoiKy = {
      $match: { ngay_ct: { $lte: endDate }, ...condition },
    };
    const tonCuoiKys = await soKhoModel.aggregate([
      matchObjCuoiKy,
      {
        $group: {
          _id: '$ma_vt',
          ma_vt: { $first: '$ma_vt' },
          ton_cuoi_ky: { $sum: '$so_luong' },
        },
      },
      { $project: { _id: 0 } },
    ]);
    for (let i = 0; i < nhapXuatKhos.length; i++) {
      const maVt = nhapXuatKhos[i].ma_vt;
      const tonDauKy = tonDauKys.find((item) => item.ma_vt === maVt);
      const tonCuoiKy = tonCuoiKys.find((item) => item.ma_vt === maVt);
      result.push({
        ...nhapXuatKhos[i],
        ton_dau_ky: tonDauKy?.ton_dau_ky || 0,
        ton_cuoi_ky: tonCuoiKy?.ton_cuoi_ky || 0,
      });
    }
    return { data: result, count: count.length };
  },
  async getBanHangHangHoa({ startDate, endDate, skip, limit, condition }) {
    const matchObj = {
      $match: {
        ngay_ct: { $gte: startDate, $lte: endDate },
        ma_loai_ct: 'pbh',
        ...condition,
      },
    };
    const result = await soKhoModel.aggregate([
      matchObj,
      {
        $group: {
          _id: '$ma_vt',
          ma_vt: { $first: '$ma_vt' },
          ten_vt: { $first: '$ten_vt' },
          t_sl_ban: { $sum: '$sl_xuat' },
          doanh_thu_thuan: { $sum: '$gia_tri_ban' },
        },
      },
      { $skip: skip },
      { $limit: limit },
      { $project: { _id: 0 } },
    ]);
    const count = await soKhoModel.aggregate([
      matchObj,
      {
        $group: {
          _id: '$ma_vt',
        },
      },
    ]);
    return { data: result, count: count.length };
  },
  async getLoiNhuanHangHoa({ startDate, endDate, skip, limit, condition }) {
    const matchObj = {
      $match: {
        ngay_ct: { $gte: startDate, $lte: endDate },
        ma_loai_ct: 'pbh',
        ...condition,
      },
    };
    const result = await soKhoModel.aggregate([
      matchObj,
      {
        $group: {
          _id: '$ma_vt',
          ma_vt: { $first: '$ma_vt' },
          ten_vt: { $first: '$ten_vt' },
          t_sl_ban: { $sum: '$sl_xuat' },
          doanh_thu_thuan: { $sum: '$gia_tri_ban' },
          t_gia_von: { $sum: '$chi_phi' },
        },
      },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          ma_vt: 1,
          ten_vt: 1,
          t_sl_ban: 1,
          doanh_thu_thuan: 1,
          t_gia_von: 1,
          loi_nhuan: { $subtract: ['$doanh_thu_thuan', '$t_gia_von'] },
        },
      },
    ]);
    const count = await soKhoModel.aggregate([
      matchObj,
      {
        $group: {
          _id: '$ma_vt',
        },
      },
    ]);
    return { data: result, count: count.length };
  },
  async getKhachHangHangHoa({ startDate, endDate, skip, limit, condition }) {
    const matchObj = {
      $match: {
        ngay_ct: { $gte: startDate, $lte: endDate },
        ma_loai_ct: 'pbh',
        ...condition,
      },
    };
    const result = await soKhoModel.aggregate([
      matchObj,
      {
        $group: {
          _id: '$ma_vt',
          ma_vt: { $first: '$ma_vt' },
          ten_vt: { $first: '$ten_vt' },
          sl_mua: { $sum: '$sl_xuat' },
          gia_tri: { $sum: '$gia_tri_ban' },
          customers: { $addToSet: '$ma_kh' },
        },
      },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          ma_vt: 1,
          ten_vt: 1,
          sl_mua: 1,
          gia_tri: 1,
          sl_khach: { $size: '$customers' },
        },
      },
    ]);
    const count = await soKhoModel.aggregate([
      matchObj,
      {
        $group: {
          _id: '$ma_vt',
        },
      },
    ]);
    return { data: result, count: count.length };
  },
  async getNCCHangHoa({ startDate, endDate, skip, limit, condition }) {
    const matchObj = {
      $match: {
        ngay_ct: { $gte: startDate, $lte: endDate },
        ma_loai_ct: 'pnk',
        ...condition,
      },
    };
    const result = await soKhoModel.aggregate([
      matchObj,
      {
        $group: {
          _id: '$ma_vt',
          ma_vt: { $first: '$ma_vt' },
          ten_vt: { $first: '$ten_vt' },
          sl_nhap: { $sum: '$sl_nhap' },
          gia_tri: { $sum: '$gia_tri_nhap' },
          suppliers: { $addToSet: '$ma_ncc' },
        },
      },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          ma_vt: 1,
          ten_vt: 1,
          sl_nhap: 1,
          gia_tri: 1,
          sl_ncc: { $size: '$suppliers' },
        },
      },
    ]);
    const count = await soKhoModel.aggregate([
      matchObj,
      {
        $group: {
          _id: '$ma_vt',
        },
      },
    ]);
    return { data: result, count: count.length };
  },

  async typeEqualOne({ title, body, matchObjBase, groupObj, projectObj }) {
    const { time_type, ...restBody } = body;
    let startDate, endDate, currentYear, currentDate;
    let result = { title, data: [] };
    const { tu_ngay, den_ngay, ...condition } = restBody;
    let matchObj = {};
    switch (time_type) {
      case 5:
        result.title += ` từ ${moment(tu_ngay).format(
          'DD/MM/YYYY'
        )} đến ${moment(den_ngay).format('DD/MM/YYYY')}`;
        startDate = new Date(tu_ngay);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(den_ngay);
        matchObj = {
          $match: {
            ngay_ct: { $gte: startDate, $lte: endDate },
            ...matchObjBase,
            ...condition,
          },
        };
        result.data = await phieuBanHangModel.aggregate([
          matchObj,
          {
            $group: {
              _id: null,
              ...groupObj,
            },
          },
          {
            $addFields: {
              label: `${moment(tu_ngay).format('DD/MM/YYYY')} đến ${moment(
                den_ngay
              ).format('DD/MM/YYYY')}`,
            },
          },
          { $project: { _id: 0 } },
        ]);
        break;
      case 4:
        result.title += ' 4 quý gần nhất';
        const currentQuarter = moment().quarter();
        // Lấy năm hiện tại
        currentYear = moment().year();

        // Tạo một mảng chứa 4 quý gần nhất
        const quarters = [];

        // Lấy 4 quý gần nhất
        for (let i = currentQuarter; i >= currentQuarter - 3; i--) {
          if (i > 0) {
            quarters.unshift({ nam: currentYear, quy: i });
          } else {
            quarters.unshift({ nam: currentYear - 1, quy: i + 4 });
          }
        }
        matchObj = {
          $match: {
            nam: { $in: quarters.map((item) => item.nam) },
            quy: { $in: quarters.map((item) => item.quy) },
            ...matchObjBase,
            ...condition,
          },
        };
        const resp = await phieuBanHangModel.aggregate([
          matchObj,
          {
            $group: {
              _id: {
                nam: '$nam',
                quy: '$quy',
              },
              ...groupObj,
              nam: { $first: '$nam' },
              quy: { $first: '$quy' },
            },
          },
          { $sort: { nam: 1, quy: 1 } },
          {
            $project: {
              _id: 0,
              ...projectObj,
              label: {
                $concat: [
                  'Quý ',
                  { $toString: '$quy' },
                  ' năm ',
                  { $toString: '$nam' },
                ],
              },
            },
          },
        ]);
        result.data = resp;
        break;
      case 3:
        result.title += ' 6 tháng gần nhất';
        currentDate = moment();
        const currentMonth = currentDate.month();
        currentYear = currentDate.year();
        const months = [];
        for (let i = currentMonth; i >= currentMonth - 5; i--) {
          if (i >= 0) {
            months.push({ nam: currentYear, thang: i + 1 });
          } else {
            months.push({ nam: currentYear - 1, thang: i + 12 + 1 });
          }
        }
        matchObj = {
          $match: {
            nam: { $in: months.map((item) => item.nam) },
            thang: { $in: months.map((item) => item.thang) },
            ...matchObjBase,
            ...condition,
          },
        };
        result.data = await phieuBanHangModel.aggregate([
          matchObj,
          {
            $group: {
              _id: { nam: '$nam', thang: '$thang' },
              ...groupObj,
              nam: { $first: '$nam' },
              thang: { $first: '$thang' },
            },
          },
          { $sort: { nam: 1, thang: 1 } },
          {
            $project: {
              _id: 0,
              ...projectObj,
              label: {
                $concat: [
                  'Tháng ',
                  { $toString: '$thang' },
                  ' năm ',
                  { $toString: '$nam' },
                ],
              },
            },
          },
        ]);
        break;
      case 2:
        result.title += ' tháng này';
        // Lấy ngày đầu tiên của tháng hiện tại
        const startOfMonth = moment().startOf('month');

        // Lấy ngày cuối cùng của tháng hiện tại
        const today = moment();

        // Tạo một mảng để lưu trữ khoảng thời gian của các tuần trong tháng
        const weeksInMonth = [];

        // Lặp qua từng tuần trong tháng
        let startOfWeek = startOfMonth.clone().startOf('isoWeek');
        while (startOfWeek.isSameOrBefore(today)) {
          // Lấy ngày bắt đầu và kết thúc của tuần, chỉ bao gồm các ngày trong tháng hiện tại
          const startOfWeekInMonth = moment.max(startOfWeek, startOfMonth);
          const endOfWeekInMonth = moment.min(
            startOfWeek.clone().endOf('isoWeek'),
            today
          );

          // Kiểm tra xem tuần có chứa các ngày trong tháng hiện tại hay không
          if (startOfWeekInMonth.isSameOrBefore(endOfWeekInMonth)) {
            weeksInMonth.push({
              start: startOfWeekInMonth.format('YYYY-MM-DD'),
              end: endOfWeekInMonth.format('YYYY-MM-DD'),
            });
          }
          // Di chuyển đến tuần tiếp theo
          startOfWeek.add(1, 'week');
        }
        const data = [];
        for (let i = 0; i < weeksInMonth.length; i++) {
          const week = weeksInMonth[i];
          const startDate = new Date(week.start);
          const endDate = new Date(week.end);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59);
          const matchObj = {
            $match: {
              ngay_ct: { $gte: startDate, $lte: endDate },
              ...matchObjBase,
              ...condition,
            },
          };
          const res = await phieuBanHangModel.aggregate([
            matchObj,
            {
              $group: {
                _id: null,
                ...groupObj,
              },
            },
            {
              $project: {
                _id: 0,
                ...projectObj,
                label: {
                  $concat: [
                    moment(week.start).format('DD/MM/YYYY'),
                    ' đến ',
                    moment(week.end).format('DD/MM/YYYY'),
                  ],
                },
              },
            },
          ]);
          if (res.length === 1) {
            data.push(res[0]);
          }
        }
        result.data = data;
        break;
      default:
        result.title += ' tuần này';
        currentDate = moment();
        const startOfCurrentWeek = moment().startOf('isoWeek').startOf('day');
        for (
          let date = startOfCurrentWeek;
          date <= currentDate;
          date = date.clone().add(1, 'day')
        ) {
          const day = new Date(date.format('YYYY-MM-DD'));
          day.setHours(0, 0, 0, 0);
          const resp = await phieuBanHangModel.aggregate([
            {
              $match: { ngay_ct: day, ...matchObjBase, ...condition },
            },
            {
              $group: {
                _id: null,
                ...groupObj,
              },
            },
            {
              $project: {
                _id: 0,
                ...projectObj,
                label: date.format('DD/MM/YYYY'),
              },
            },
          ]);
          if (resp.length === 1) {
            result.data.push(resp[0]);
          }
        }
        break;
    }
    return result;
  },
  async typeGreaterThanOne({
    title,
    concernText,
    body,
    matchObjBase,
    groupObj,
    projectObj,
    peplineChaning = [],
  }) {
    const { tu_ngay, den_ngay, ...condition } = body;
    const result = {
      title: `10 ${concernText} có ${title} cao nhất`,
      data: [],
    };
    const startDate = new Date(tu_ngay);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(den_ngay);
    const data = await phieuBanHangModel.aggregate([
      {
        $match: {
          ngay_ct: { $gte: startDate, $lte: endDate },
          ...matchObjBase,
          ...condition,
        },
      },
      {
        $group: groupObj,
      },
      ...peplineChaning,
      { $project: projectObj },
    ]);
    result.data = data;
    return result;
  },

  // api function
  async reportFinance(req, res, next) {
    /**
     - Theo thời gian -> type = 1
     + Tuần này: time_type = 1
     + Tháng này: time_type = 2
     + Sáu tháng gần nhất: time_type = 3
     + Bốn quý gần nhất: time_type = 4
     + Thời gian tùy chọn: time_type = 5
     - Theo chi nhánh: 10 chi nhánh  -> type = 2
     - Theo khách hàng: 10 khách hàng -> type = 3
     - Kênh bán: 10 kênh bán -> type = 4
     - Phương thức thanh toán: 10 pttt -> type = 5
     - Nhân viên: 10 nhân viên -> type = 6
     */
    try {
      const { type, ...body } = req.body;
      const { groupFields, title } = req.report;
      const matchObjBase = { ma_trang_thai: 2 };
      const groupObj = groupFields.reduce((acc, field) => {
        acc[field.reportKey] = { $sum: field.sumKey };
        return acc;
      }, {});
      const projectObj = groupFields.reduce((acc, field) => {
        acc[field.reportKey] = 1;
        return acc;
      }, {});
      let peplineChaning = [
        { $sort: { [groupFields[0].reportKey]: -1 } },
        { $limit: 10 },
      ];
      let result = { title, data: [] };

      switch (type) {
        case 6:
          matchObjBase.ma_nv = { $ne: '' };
          groupObj._id = '$ma_nv';
          groupObj.label = { $first: '$ten_nv' };
          projectObj._id = 0;
          projectObj.label = 1;
          result = await reportController.typeGreaterThanOne({
            title,
            concernText: 'nhân viên',
            body,
            matchObjBase,
            groupObj,
            projectObj,
            peplineChaning,
          });
          break;
        case 5:
          matchObjBase.ma_pttt = { $ne: '' };
          groupObj._id = '$ma_pttt';
          groupObj.label = { $first: '$ten_pttt' };
          projectObj._id = 0;
          projectObj.label = 1;

          result = await reportController.typeGreaterThanOne({
            title,
            concernText: 'phương thức thanh toán',
            body,
            matchObjBase,
            groupObj,
            projectObj,
            peplineChaning,
          });
          break;
        case 4:
          matchObjBase.ma_kenh = { $ne: '' };
          groupObj._id = '$ma_kenh';
          groupObj.label = { $first: '$ten_kenh' };
          projectObj._id = 0;
          projectObj.label = 1;

          result = await reportController.typeGreaterThanOne({
            title,
            concernText: 'kênh bán',
            body,
            matchObjBase,
            groupObj,
            projectObj,
            peplineChaning,
          });
          break;
        case 3:
          groupObj._id = '$ma_kh';
          groupObj.label = { $first: '$ten_kh' };
          projectObj._id = 0;
          projectObj.label = 1;

          result = await reportController.typeGreaterThanOne({
            title,
            concernText: 'khách hàng',
            body,
            matchObjBase,
            groupObj,
            projectObj,
            peplineChaning,
          });
          break;
        case 2:
          groupObj._id = '$ma_kho';
          groupObj.label = { $first: '$ten_kho' };
          projectObj._id = 0;
          projectObj.label = 1;

          result = await reportController.typeGreaterThanOne({
            title,
            concernText: 'chi nhánh',
            body,
            matchObjBase,
            groupObj,
            projectObj,
            peplineChaning,
          });
          break;
        default:
          result = await reportController.typeEqualOne({
            title,
            body,
            matchObjBase,
            groupObj,
            projectObj,
          });
          break;
      }
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  async reportHangHoa(req, res, next) {
    try {
      let { tu_ngay, den_ngay, page, limit, type, ...condition } = req.body;
      let startDate;
      let endDate;
      if (!page) {
        page = 1;
      }
      if (!limit) {
        limit = 20;
      }
      if (!type) {
        type = 1;
      }
      const skip = (page - 1) * limit;
      startDate = tu_ngay ? new Date(tu_ngay) : new Date();
      endDate = den_ngay ? new Date(den_ngay) : new Date();

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59);

      let result = {};

      switch (type) {
        case '2':
          result = await reportController.getLoiNhuanHangHoa({
            startDate,
            endDate,
            skip,
            limit,
            condition,
          });
          break;
        case '3':
          result = await reportController.getXNTHangHoa({
            startDate,
            endDate,
            skip,
            limit,
            condition,
          });
          break;
        case '4':
          result = await reportController.getKhachHangHangHoa({
            startDate,
            endDate,
            skip,
            limit,
            condition,
          });
          break;
        case '5':
          result = await reportController.getNCCHangHoa({
            startDate,
            endDate,
            skip,
            limit,
            condition,
          });
          break;
        default:
          result = await reportController.getBanHangHangHoa({
            startDate,
            endDate,
            skip,
            limit,
            condition,
          });
          break;
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = reportController;
