const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "tokens" }
);

module.exports = mongoose.model("Token", tokenSchema);
