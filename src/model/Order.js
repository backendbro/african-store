const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  food_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema(
  {
    customer_name: { type: String, required: true },
    amount_paid: { type: Number, required: true },
    payment_method: {
      type: String,
      enum: ["Cash", "Card", "Transfer"],
      required: true,
    },
    order_status: {
      type: String,
      enum: ["Pending", "Successful", "Failed"],
      default: "pending",
    },
    order_items: [OrderItemSchema], // Array of food items
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
