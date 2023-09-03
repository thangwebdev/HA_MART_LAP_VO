const createError = require("http-errors");
const mongoose = require("mongoose");
const xlsx = require("xlsx");
const { deleteFile } = require("../../utils/myUtil");
const fileModel = require("../models/file.model");

const danhMucController = {
  // check duplicate unique field
  async checkUniqueValueExisted(model, uniqueField, uniqueFieldValue, next) {
    try {
      const document = await model.findOneWithDeleted({
        [uniqueField]: uniqueFieldValue,
      });
      if (document) {
        return next(
          createError(400, `${uniqueField} '${uniqueFieldValue}' đã tồn tại`)
        );
      } else {
        return uniqueFieldValue;
      }
    } catch (error) {
      next(error);
    }
  },
  // create
  async create(req, res, next) {
    try {
      const { model, uniqueField, validate } = req.danhMuc;
      if (!model) {
        return next(400, "Không có model cho danh mục này");
      }
      const { error } = validate(req.body);
      if (error) {
        return next(error);
      }
      let uniqueFieldValue = req.body[uniqueField];
      if (uniqueFieldValue) {
        uniqueFieldValue = await danhMucController.checkUniqueValueExisted(
          model,
          uniqueField,
          uniqueFieldValue,
          next
        );
        if (!uniqueFieldValue) {
          return;
        }
      }
      const document = await model.create({
        ...req.body,
        createdBy: req.user.email,
      });
      return res.status(200).json(document);
    } catch (error) {
      next(error);
    }
  },
  // update
  async update(req, res, next) {
    try {
      const { model, uniqueField } = req.danhMuc;
      if (!model) {
        return next(400, "Không có model cho danh mục này");
      }
      const { [uniqueField]: uniqueFieldValue } = req.body;
      if (!uniqueFieldValue) {
        return next(
          createError(400, "Không xác định được đối tượng để cập nhật")
        );
      }
      const documentSaved = await model.findOne({
        [uniqueField]: uniqueFieldValue,
      });
      if (!documentSaved) {
        return next(
          createError(404, `Đối tượng '${uniqueFieldValue}' không tồn tại`)
        );
      }
      await model.updateOne(
        { [uniqueField]: uniqueFieldValue },
        { ...req.body, updatedBy: req.user.email }
      );
      const documentUpdated = await model.findOne({
        [uniqueField]: uniqueFieldValue,
      });
      return res.status(200).json(documentUpdated);
    } catch (error) {
      next(error);
    }
  },
  // delete many
  async deleteMany(req, res, next) {
    try {
      const { model, uniqueField } = req.danhMuc;
      const { uniqueValues } = req.body;
      if (!uniqueValues || !Array.isArray(uniqueValues)) {
        return next(createError(400, "Không xác định được đối tượng để xóa"));
      }

      await model.delete(
        { [uniqueField]: { $in: uniqueValues } },
        req.user.email
      );
      const deletedDocuments = await model.findWithDeleted({
        [uniqueField]: { $in: uniqueValues },
      });
      return res.status(200).json(deletedDocuments);
    } catch (error) {
      next(error);
    }
  },
  // destroy many
  async destroyMany(req, res, next) {
    try {
      const { model, uniqueField } = req.danhMuc;
      if (!model) {
        return next(400, "Không có model cho danh mục này");
      }
      const { uniqueValues } = req.body;
      if (!uniqueValues || !Array.isArray(uniqueValues)) {
        return next(createError("Không xác định được đối tượng để xóa"));
      }
      const destroyedDocuments = await model.findDeleted({
        [uniqueField]: { $in: uniqueValues },
      });
      await model.deleteMany({ [uniqueField]: { $in: uniqueValues } });
      return res.status(200).json(destroyedDocuments);
    } catch (error) {
      next(error);
    }
  },
  // restore many
  async restoreMany(req, res, next) {
    try {
      const { model, uniqueField } = req.danhMuc;
      if (!model) {
        return next(400, "Không có model cho danh mục này");
      }
      const { uniqueValues } = req.body;
      if (!uniqueValues || !Array.isArray(uniqueValues)) {
        return next(
          createError(400, "Không xác định được đối tượng để khôi phục")
        );
      }
      // find existing store to check duplicate code
      const documentExisting = await model.findOne({
        [uniqueField]: { $in: uniqueValues },
      });
      if (documentExisting) {
        return next(
          createError(
            400,
            `Không thể khôi phục '${documentExisting[uniqueField]}' do trùng mã.`
          )
        );
      }
      await model.restore({ [uniqueField]: { $in: uniqueValues } });
      const restoreDocuments = await model.find({
        [uniqueField]: { $in: uniqueValues },
      });
      return res.status(200).json(restoreDocuments);
    } catch (error) {
      next(error);
    }
  },
  // search
  async search(req, res, next) {
    try {
      const { model } = req.danhMuc;
      if (!model) {
        return next(400, "Không có model cho danh mục này");
      }
      let { limit, page, ...condition } = req.body;
      if (!limit) {
        limit = 20;
      }
      if (!page) {
        page = 1;
      }
      const skip = limit * (page - 1);
      const documents = await model
        .find(condition)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .collation({ locale: "vi", strength: 1 });
      const count = await model.find(condition).count();
      return res.status(200).json({ data: documents, count });
    } catch (error) {
      next(error);
    }
  },
  // search deleted
  async searchDeleted(req, res, next) {
    try {
      const { model } = req.danhMuc;
      if (!model) {
        return next(400, "Không có model cho danh mục này");
      }
      let { limit, page, ...condition } = req.body;
      if (!limit) {
        limit = 20;
      }
      if (!page) {
        page = 1;
      }
      const skip = limit * (page - 1);
      const documents = await model
        .findDeleted(condition)
        .skip(skip)
        .limit(limit);
      const count = await model.findDeleted(condition).count();
      return res.status(200).json({ data: documents, count });
    } catch (error) {
      next(error);
    }
  },
  // import excel
  async importExcel(req, res, next) {
    // Start a transaction
    const session = await mongoose.startSession();
    try {
      if (!req?.file?.path) {
        return next(createError(400, 'Không có file import'));
      }
      const { model, uniqueField, fields, validate } = req.danhMuc;
      if (!model) {
        return next(400, 'Không có model cho danh mục này');
      }
      /*
        mode = 1: check trùng mã và báo lỗi, rollback tất cả
        mode = 2: Ghi đè dữ liệu nếu trung mã
      */
      const { mode = 1 } = req.body;
      const filePath = req.file.path;
      const workbook = xlsx.readFile(filePath);
      const sheetNames = workbook.SheetNames;
      const firstSheet = workbook.Sheets[sheetNames[0]];
      const data = xlsx.utils.sheet_to_json(firstSheet, {
        header: fields,
        range: 2,
      });

      let documents = [];
      let uniqueValues = [];
      let isError = false;
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const { error } = validate(item);
        if (error) {
          isError = error;
          break;
        }
        uniqueValues.push(item[uniqueField].trim());
      }
      if (isError) {
        return next(isError);
      }
      await session.withTransaction(async () => {
        switch (Number(mode)) {
          case 2:
            const operations = data.map((doc) => ({
              updateOne: {
                filter: { [uniqueField]: doc[uniqueField] },
                update: doc,
                upsert: true,
                new: true,
              },
            }));
            await model.bulkWrite(operations, { session });
            break;
          default: // mode = 1
            const existingDocument = await model.findOne({
              [uniqueField]: { $in: uniqueValues },
            });
            if (existingDocument) {
              isError = true;
              return next(
                createError(
                  400,
                  `Import thất bại vì trùng mã '${existingDocument[uniqueField]}'`
                )
              );
            }
            await model.insertMany(data, { session });
            break;
        }
      });
      if (!isError) {
        documents = await model.find({ [uniqueField]: { $in: uniqueValues } });
        return res.status(200).json(documents);
      }
    } catch (error) {
      next(error);
    } finally {
      deleteFile(req?.file?.path);
      session.endSession();
    }
  },
};
module.exports = danhMucController;
