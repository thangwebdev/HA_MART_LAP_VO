const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const chungTuSchema = new mongoose.Schema(
  {
    ma_ct: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ten_ct: {
      type: String,
      required: true,
      index: true,
    },
    dien_giai: {
      type: String,
      default: "",
    },
    createdBy: {
      type: String,
      default: "",
    },
    updatedBy: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, collection: "chung_tu" }
);
chungTuSchema.index(
  { ma_ct: "text", ten_ct: "text" },
  { default_language: "none" }
);
chungTuSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
  overrideMethods: "all",
});

module.exports = mongoose.model("ChungTu", chungTuSchema);
