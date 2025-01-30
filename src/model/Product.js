const mongoose = require("mongoose");

//material schema
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please add a name"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    file: {
      type: String,
      required: true,
    },
    BasePrice: {
      type: Number,
    },
    StockQuantity: {
      type: Number,
    },
    Discount: {
      type: String,
    },
    DiscountType: {
      type: String,
    },
    Variants: {
      type: String,
      default: "150kg",
    },
    PackagingType: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
