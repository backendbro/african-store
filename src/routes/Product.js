const express = require("express");
const { protect, authorize } = require("../middleware/Auth");
const {
  createProducts,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  getCategoryProducts
} = require("../controller/Product");
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
router.get("/:id", protect, authorize("admin", "owner"), getProduct);
router.get("/category", protect, authorize("admin", "owner"), getCategoryProducts);
router.put("/:id", protect, authorize("admin", "owner"), upload, updateProduct);
router.delete("/:id", protect, authorize("admin", "owner"), deleteProduct);

module.exports = router;
