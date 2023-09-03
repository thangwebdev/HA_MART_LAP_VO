const createError = require("http-errors");
const soKhoModel = require("../models/soKho.model");
const vatTuModel = require("../models/vatTu.model");
const khoModel = require("../models/kho.model");
const loModel = require("../models/lo.model");

const tonKhoController = {
  // helper functions
  async checkVatTu(ma_vt, next) {
    let error = false;
    try {
      if (!ma_vt) {
        error = true;
        next(createError(400, 'Không xác định được hàng hóa'));
      }
      const vatTu = await vatTuModel.findOne({ ma_vt });
      if (!vatTu) {
        error = true;
        next(createError(404, `Hàng hóa '${ma_vt}' không tồn tại`));
      }
    } catch (error) {
      next(error);
    } finally {
      return error;
    }
  },
  async getInventoryOnStoreHelper({ ma_vt, ma_kho }) {
    const existed = await soKhoModel.findOne({ ma_vt, ma_kho });
    if (!existed) {
      return { ton_kho: 0 };
    }
    const tonKho = await soKhoModel.aggregate([
      { $match: { ma_kho, ma_vt } },
      { $group: { _id: null, ton_kho: { $sum: '$so_luong' } } },
      { $project: { _id: 0 } },
    ]);
    return tonKho[0];
  },
  async getTotalInventoryHelper(maVt) {
    const existed = await soKhoModel.findOne({ ma_vt: maVt });
    if (!existed) {
      return { ton_kho: 0 };
    }
    const tonKho = await soKhoModel.aggregate([
      { $match: { ma_vt: maVt } },
      {
        $group: {
          _id: '$ma_kho',
          tong_ton_kho: { $sum: '$so_luong' },
        },
      },
      { $group: { _id: null, ton_kho: { $sum: '$tong_ton_kho' } } },
      { $project: { _id: 0 } },
    ]);
    return tonKho[0];
  },
  async getInventoryByConsigmentHelper({ ma_vt, ma_lo }) {
    const existed = await soKhoModel.findOne({ ma_vt, ma_lo });
    if (!existed) {
      return { ton_kho: 0 };
    }
    const tonKho = await soKhoModel.aggregate([
      { $match: { ma_lo, ma_vt } },
      { $group: { _id: null, ton_kho: { $sum: '$so_luong' } } },
      { $project: { _id: 0 } },
    ]);
    return tonKho[0];
  },
  // controller functions
  async getTotalInventory(req, res, next) {
    try {
      const { ma_vt } = req.body;
      const isError = await tonKhoController.checkVatTu(ma_vt, next);
      if (isError) {
        return;
      }
      const tonKho = await getTotalInventoryHelper(ma_vt);
      return res.status(200).json(tonKho);
    } catch (error) {
      next(error);
    }
  },
  async getDetailInventory(req, res, next) {
    try {
      const { ma_vt } = req.body;
      const isError = await tonKhoController.checkVatTu(ma_vt, next);
      if (isError) {
        return;
      }
      const existed = await soKhoModel.findOne({ ma_vt });
      if (!existed) {
        return res.status(200).json([]);
      }
      const tonKho = await soKhoModel.aggregate([
        { $match: { ma_vt } },
        {
          $group: {
            _id: '$ma_kho',
            ten_kho: { $first: '$ten_kho' },
            ton_kho: { $sum: '$so_luong' },
          },
        },
        {
          $project: {
            _id: 0,
            ma_kho: '$_id',
            ten_kho: '$ten_kho',
            ton_kho: '$ton_kho',
          },
        },
      ]);
      return res.status(200).json(tonKho);
    } catch (error) {
      return next(error);
    }
  },
  async getInventoryOnStore(req, res, next) {
    try {
      const { ma_vt, ma_kho } = req.body;
      if (!ma_kho) {
        return next(createError(400, 'Không xác định được kho'));
      }
      const kho = await khoModel.findOne({ ma_kho });
      if (!kho) {
        return next(createError(400, `Kho '${ma_kho}' không tồn tại`));
      }
      const isError = await tonKhoController.checkVatTu(ma_vt, next);
      if (isError) {
        return;
      }
      const tonKho = await tonKhoController.getInventoryOnStoreHelper({
        ma_vt,
        ma_kho,
      });
      return res.status(200).json(tonKho);
    } catch (error) {
      return next(error);
    }
  },
  async getInventoryByConsignment(req, res, next) {
    try {
      const { ma_vt, ma_lo } = req.body;
      if (!ma_lo) {
        return next(createError(400, 'Không xác định được lô'));
      }
      const lo = await loModel.findOne({ ma_lo });
      if (!lo) {
        return next(createError(400, `Lô '${ma_lo}' không tồn tại`));
      }
      const isError = await tonKhoController.checkVatTu(ma_vt, next);
      if (isError) {
        return;
      }
      const tonKho = await tonKhoController.getInventoryByConsigmentHelper({
        ma_vt,
        ma_lo,
      });
      return res.status(200).json(tonKho);
    } catch (error) {
      return next(error);
    }
  },
  async getDetailInventoryByConsignment(req, res, next) {
    try {
      const { ma_vt } = req.body;
      const isError = await tonKhoController.checkVatTu(ma_vt, next);
      if (isError) {
        return;
      }
      const existed = await soKhoModel.findOne({ ma_vt, ma_lo: { $ne: '' } });
      if (!existed) {
        return res.status(200).json([]);
      }
      const tonKho = await soKhoModel.aggregate([
        { $match: { ma_vt } },
        {
          $group: {
            _id: '$ma_lo',
            ten_lo: { $first: '$ten_lo' },
            ton_kho: { $sum: '$so_luong' },
            ten_kho: { $first: '$ten_kho' },
          },
        },
        {
          $project: {
            _id: 0,
            ma_lo: '$_id',
            ten_lo: '$ten_lo',
            ton_kho: '$ton_kho',
            ten_kho: '$ten_kho',
          },
        },
      ]);
      return res.status(200).json(tonKho);
    } catch (error) {
      return next(error);
    }
  },
  async reportXNT(req, res, next) {
    try {
      let { tu_ngay, den_ngay, page, limit, ...condition } = req.body;
      let startDate;
      let endDate;
      if (!page) {
        page = 1;
      }
      if (!limit) {
        limit = 20;
      }
      const skip = (page - 1) * limit;
      startDate = tu_ngay ? new Date(tu_ngay) : new Date();
      endDate = den_ngay ? new Date(den_ngay) : new Date();

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      const result = [];

      const matchObj = {
        $match: { ngay_ct: { $gte: startDate, $lte: endDate }, ...condition },
      };

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
            ma_vt: { $first: '$ma_vt' },
            ten_vt: { $first: '$ten_vt' },
            nhap_kho: { $sum: '$sl_nhap' },
            xuat_kho: { $sum: '$sl_xuat' },
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
      return res.json({ data: result, count: count.length });
    } catch (error) {
      next(error);
    }
  },
};
module.exports = tonKhoController;
