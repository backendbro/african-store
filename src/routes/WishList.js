const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  displayProducts,
} = require("../controller/Wishlist");
const { protect, authorize } = require("../middleware/Auth");

router.post("/", protect, authorize("owner", "admin", "user"), addToWishlist);
router.get("/", protect, authorize("owner", "admin", "user"), getWishlist);
router.get("/user-wish", protect, authorize("user"), displayProducts);
router.put(
  "/",
  protect,
  authorize("owner", "admin", "user"),
  removeFromWishlist
);

module.exports = router;
