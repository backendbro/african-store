const express = require("express");
const { protect, authorize } = require("../middleware/Auth");
const {
  createProducts,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  getCategoryProducts,
} = require("../controller/Product");
const router = express.Router();

const multer = require("multer");

// Set up Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array("images[]", 10);

router.post(
  "/create/:categoryId",
  protect,
  authorize("admin", "owner", "user"),
  upload,
  createProducts
);
router.get("/", getProducts);
router.get("/category", getCategoryProducts);
router.get("/:id", getProduct);
router.put(
  "/:id",
  protect,
  authorize("admin", "owner", "user"),
  upload,
  updateProduct
);
router.delete(
  "/:id",
  protect,
  authorize("admin", "owner", "user"),
  deleteProduct
);

module.exports = router;
