const { Router } = require("express");
const router = Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  Register,
  Login,
  loggedInUser,
  updateProfilePicture,
  updateProfile,
} = require("../controller/Auth");
const { protect } = require("../middleware/Auth");

router.post("/register", Register);
router.post("/login", Login);
router.get("/me", protect, loggedInUser);

// Use upload.single with the field name from your HTML input (e.g., "profilePicture")
router.put(
  "/user/profile-picture",
  protect,
  upload.single("profilePicture"),
  updateProfilePicture
);
router.put("/profile", protect, updateProfile);

module.exports = router;
