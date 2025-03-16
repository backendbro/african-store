const express = require("express");
const router = express.Router();
const { getAllUsers, updateUser } = require("../controller/Admin");
const { protect, authorize } = require("../middleware/Auth");

// Define routes
router.get("/", getAllUsers);
router.put("/", updateUser);

module.exports = router;
