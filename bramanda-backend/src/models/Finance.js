const mongoose = require("mongoose");

const FinanceSchema = new mongoose.Schema(
  {
    investedMoney: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Finance", FinanceSchema);
