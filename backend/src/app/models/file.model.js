const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    ma_danh_muc: {
      type: String,
      required: true,
      unique: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "files" }
);
module.exports = mongoose.model("File", fileSchema);
