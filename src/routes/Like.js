const express = require("express");
const { toggleLike, getReviewLikes } = require("../controller/Like");
const { protect, authorize } = require("../middleware/Auth"); // Ensure user is logged in

const router = express.Router();

router.post("/toggle", protect, authorize("owner", "admin"), toggleLike);
router.get("/review", protect, authorize("owner", "admin"), getReviewLikes);

module.exports = router;
