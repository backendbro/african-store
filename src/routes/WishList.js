const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controller/Wishlist");
const { protect, authorize } = require("../middleware/Auth");

router.get("/", protect, authorize("owner", "admin", "user"), getWishlist);
router.post("/", protect, authorize("owner", "admin", "user"), addToWishlist);
router.put(
  "/",
  protect,
  authorize("owner", "admin", "user"),
  removeFromWishlist
);

module.exports = router;
