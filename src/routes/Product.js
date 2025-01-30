const express = require("express");
const { protect, authorize } = require("../middleware/Auth");
const { createProducts } = require("../controller/Product");
const router = express.Router();

router.post(
  "/create/:categoryId",
  protect,
  authorize("admin", "owner"),
  createProducts
);

module.exports = router;
