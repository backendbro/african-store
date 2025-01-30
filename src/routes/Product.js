const express = require("express");
const { protect, authorize } = require("../middleware/Auth");
const { createProducts, getProducts } = require("../controller/Product");
const router = express.Router();

const multer = require("multer");

// Set up Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array("images[]", 10);

router.post(
  "/create/:categoryId",
  protect,
  authorize("admin", "owner"),
  upload,
  createProducts
);
router.get("/", protect, authorize("admin", "owner"), getProducts);

module.exports = router;
