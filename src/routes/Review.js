const express = require("express");
const { createReview, getReviews } = require("../controller/Review");
const { protect, authorize } = require("../middleware/Auth");

const router = express.Router();
router.post("/", protect, authorize("owner", "admin", "user"), createReview);
router.get(
  "/:productId",
  protect,
  authorize("owner", "admin", "user"),
  getReviews
);

module.exports = router;
