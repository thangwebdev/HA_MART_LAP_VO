const soQuyModel = require('../models/soQuy.model');
const moment = require('moment');

const soQuyController = {
  async getSoquy(req, res, next) {
    try {
      let { tu_ngay, den_ngay, page, limit, ...restCondition } = req.body;
      let startDate = moment(tu_ngay);
      startDate.hours(0);
      startDate.minutes(0);
      startDate.seconds(0);
      startDate = startDate.toDate();
      let endDate = moment(den_ngay);
      endDate.hours(23);
      endDate.minutes(59);
      endDate.seconds(59);
      endDate = endDate.toDate();

      let condition = restCondition;
      if (restCondition.ma_loai_ct) {
        const { ma_loai_ct, ...rest } = restCondition;
        condition = rest;
      }

      if (!page) {
        page = 1;
      }
      if (!limit) {
        limit = 20;
      }
      const skip = (page - 1) * limit;
      const soQuy = {};

      // tinh ton dau ky
      const matchObjTonDauKy = {
        $match: { ngay_ct: { $lt: startDate }, ...condition },
      };
      const tonDauky = await soQuyModel.aggregate([
        matchObjTonDauKy,
        { $group: { _id: null, ton_dau_ky: { $sum: '$tien' } } },
      ]);
      soQuy.ton_dau_ky = tonDauky[0]?.ton_dau_ky || 0;
      // tinh ton cuoi ky
      const matchObjTonCuoiKy = {
        $match: { ngay_ct: { $lte: endDate }, ...condition },
      };
      const tonCuoiKy = await soQuyModel.aggregate([
        matchObjTonCuoiKy,
        { $group: { _id: null, ton_cuoi_ky: { $sum: '$tien' } } },
      ]);
      soQuy.ton_cuoi_ky = tonCuoiKy[0]?.ton_cuoi_ky || 0;
      // tinh chi trong ky
      const matchObjChiTrongKy = {
        $match: {
          ngay_ct: { $gte: startDate, $lte: endDate },
          ...condition,
          ma_loai_ct: 'pct',
        },
      };
      const chiTrongKy = await soQuyModel.aggregate([
        matchObjChiTrongKy,
        { $group: { _id: null, tong_chi: { $sum: '$gia_tri' } } },
      ]);
      soQuy.tong_chi = chiTrongKy[0]?.tong_chi || 0;
      // tinh thu trong ky
      const matchObjThuTrongKy = {
        $match: {
          ngay_ct: { $gte: startDate, $lte: endDate },
          ...condition,
          ma_loai_ct: 'ptt',
        },
      };
      const thuTrongKy = await soQuyModel.aggregate([
        matchObjThuTrongKy,
        { $group: { _id: null, tong_thu: { $sum: '$gia_tri' } } },
      ]);
      soQuy.tong_thu = thuTrongKy[0]?.tong_thu || 0;
      // records
      const conditionObj = {
        ngay_ct: { $gte: startDate, $lte: endDate },
        ...restCondition,
      };
      const records = await soQuyModel
        .find(conditionObj)
        .skip(skip)
        .limit(limit);
      soQuy.records = records;
      // count
      const count = await soQuyModel.find(conditionObj).count();
      soQuy.count = count;

      return res.status(200).json(soQuy);
    } catch (error) {
      next(error);
    }
  },
};
module.exports = soQuyController;
