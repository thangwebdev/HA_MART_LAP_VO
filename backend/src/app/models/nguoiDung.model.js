const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const mongooseDelete = require("mongoose-delete");

const nguoiDungSchema = new mongoose.Schema(
  {
    ten_nguoi_dung: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mat_khau: {
      type: String,
      required: true,
    },
    dien_thoai: {
      type: String,
      default: "",
    },
    ngay_sinh: {
      type: Date,
      default: "",
    },
    gioi_tinh: {
      type: String,
      default: "",
    },
    anh_dai_dien: {
      type: String,
      default: "",
    },
    ma_phan_quyen: {
      type: Number,
      required: true,
    },
    ten_phan_quyen: {
      type: String,
      required: true,
    },
    ds_kho: {
      type: [String],
      default: [],
    },
    nguoi_tao: {
      type: String,
      default: "",
    },
    nguoi_chinh_sua: {
      type: String,
      default: "",
    },
    emai_xac_thuc: {
      type: Date,
      default: "",
    },
  },
  { timestamps: true, collection: "nguoidung" }
);
// Middleware to hash password before saving to database
nguoiDungSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("mat_khau")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.mat_khau, salt);
    user.mat_khau = hash;
    next();
  } catch (error) {
    return next(error);
  }
});
// Method to check if password is correct
nguoiDungSchema.methods.isValidPassword = async function (mat_khau) {
  try {
    return await bcrypt.compare(mat_khau, this.mat_khau);
  } catch (error) {
    throw error;
  }
};
nguoiDungSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: "all",
});

module.exports = mongoose.model("NguoiDung", nguoiDungSchema);
