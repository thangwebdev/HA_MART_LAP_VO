const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const multer = require("multer");
const fs = require("fs");
const { v4 } = require("uuid");
const moment = require('moment');

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      ma_phan_quyen: user.ma_phan_quyen,
    },
    process.env.JWT_ACCESS_KEY,
    { expiresIn: '1d' }
  );
};
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      ma_phan_quyen: user.ma_phan_quyen,
    },
    process.env.JWT_REFRESH_KEY,
    { expiresIn: '30d' }
  );
};
function generateRandomCode(length = 6, prefix = '') {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}${prefix ? '_' : ''}${code}`;
}
async function generateUniqueValueUtil({ maDm, model, compareKey = 'ma_ct' }) {
  let uniqueValue = generateRandomCode(6, maDm);
  const doc = await model.findOne({ [compareKey]: uniqueValue });
  if (doc) {
    return await generateUniqueValue();
  } else {
    return uniqueValue;
  }
}
// get quy by month
function getQuyByMonth(month) {
  if (month < 1 || month > 12) {
    return;
  }
  if (month >= 1 && month <= 3) {
    return 1;
  } else if (month > 3 && month <= 6) {
    return 2;
  } else if (month > 6 && month <= 9) {
    return 3;
  } else {
    return 4;
  }
}

// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!file) {
      return cb(createError(404, 'Không nhận được file'));
    }
    const folederSave = req.query.folder;
    if (!folederSave) {
      const err = createError(400, 'Không xác định foler lưu');
      return cb(err);
    }
    fs.access(`src/public/uploads/${folederSave}`, (error) => {
      if (error) {
        return cb(error);
      }
    });
    cb(null, `src/public/uploads/${folederSave}`);
  },
  filename: function (req, file, cb) {
    const nameToSave = v4() + '_' + file.originalname;
    file.nameToSave = nameToSave;
    cb(null, nameToSave);
  },
});

const upload = multer({
  storage: storage,
});

// delete file
const deleteFile = (path) => {
  if (!path) return;
  fs.access(path, (error) => {
    if (!error) {
      fs.unlink(path, (error) => {
        if (error) {
          return next(error);
        }
      });
    }
  });
};
// lấy ra các quý trang khoảng thời gian

// lấy ra tất cả các tháng trong khoảng thời gian
const getMonthsByPeriod = ({ tu_ngay, den_ngay }) => {
  let startDate;
  let endDate;
  const months = [];
  if (tu_ngay && den_ngay) {
    startDate = moment(tu_ngay);
    endDate = moment(den_ngay);
    let currentMonth = startDate.clone().startOf('month');
    while (currentMonth.isSameOrBefore(endDate, 'month')) {
      months.push(currentMonth.format('YYYY-MM-DD')); // Thêm tên tháng vào mảng
      currentMonth.add(1, 'month');
    }
  }
  return months;
};
// lấy ra các ngày trong một tháng
const getDatesInMonth = ({ tu_ngay, den_ngay }) => {
  let startDate;
  let endDate;
  const days = [];
  if (tu_ngay && den_ngay) {
    startDate = moment(tu_ngay);
    endDate = moment(den_ngay);
    let currentDate = startDate.clone();
    while (currentDate.isSameOrBefore(endDate, 'day')) {
      days.push(currentDate.format('YYYY-MM-DD')); // Thêm ngày vào mảng
      currentDate.add(1, 'day');
    }
  }
  return days;
};
const generateTimeByDate = (ngayInput) => {
  const date = new Date(ngayInput)
  const nam = date.getFullYear();
  const thang = date.getMonth() + 1;
  const ngay = date.getDate();
  const quy = getQuyByMonth(thang);
  const gio = date.getHours();
  const phut = date.getMinutes();
  const giay = date.getSeconds();
  return { nam, quy, thang, ngay, gio, phut, giay };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateRandomCode,
  generateUniqueValueUtil,
  getQuyByMonth,
  getDatesInMonth,
  upload,
  deleteFile,
  getMonthsByPeriod,
  generateTimeByDate
};
