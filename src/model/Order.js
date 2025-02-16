const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    amountPaid: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Transfer"],
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Successful", "Failed"],
      default: "pending",
    },
    foodItems: [OrderItemSchema], // Array of food items
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
