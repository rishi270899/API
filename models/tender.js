const { Description } = require("@mui/icons-material");
const { timeStap } = require("console");
const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const TenderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },

    Description: {
      type: String,
      require: true,
    },

    start_time: { type: Date, require: true },
    end_time: { type: Date, require: true },
    buffer_time: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const TenderModel = mongoose.model("tender", TenderSchema);
module.exports = TenderModel;
