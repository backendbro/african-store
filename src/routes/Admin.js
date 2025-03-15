const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controller/Admin");
const { protect, authorize } = require("../middleware/Auth");

// Define routes
router.get("/", protect, authorize("owner"), getAllUsers);

module.exports = router; // ✅ Export the router properly
