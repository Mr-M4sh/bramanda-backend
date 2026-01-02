const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phone: String,
    location: String,
    paymentMethod: {
      type: String,
      enum: ["Cash", "Online"],
      required: true
    },
    deliveryFeeStatus: {
      type: String,
      enum: ["Prepaid", "Pending"],
      required: true
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Done"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
