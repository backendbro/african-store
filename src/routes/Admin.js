const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUser,
  toggleUserRole,
  deleteUser,
} = require("../controller/Admin");
const { protect, authorize } = require("../middleware/Auth");

// Define routes
router.get("/", getAllUsers);
router.put("/update-user/:id", updateUser);
router.put("/toggle-role/:id", toggleUserRole);
router.delete("/", deleteUser);

module.exports = router;
