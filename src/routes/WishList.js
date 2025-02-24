const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  displayProducts,
} = require("../controller/Wishlist");
const { protect, authorize } = require("../middleware/Auth");

router.post(
  "/create-wishlist",
  protect,
  authorize("owner", "admin", "user"),
  addToWishlist
);
router.get("/", protect, authorize("owner", "admin", "user"), getWishlist);
router.get("/user-wish", protect, authorize("user", "admin"), displayProducts);
router.put(
  "/",
  protect,
  authorize("owner", "admin", "user"),
  removeFromWishlist
);

module.exports = router;
