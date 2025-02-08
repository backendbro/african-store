const express = require("express");
const { createReview, getReviews } = require("../controller/Review");
const { protect, authorize } = require("../middleware/Auth");

const router = express.Router();
router.post("/", protect, authorize("owner", "admin"), createReview);
router.get("/", protect, authorize("owner", "admin"), getReviews);

module.exports = router;
