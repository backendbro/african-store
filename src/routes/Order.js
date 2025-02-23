const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrdersPagination,
  updateByOrderId,
} = require("../controller/Order");
const { protect, authorize } = require("../middleware/Auth");

// Define routes
router.post("/", protect, authorize("admin"), createOrder);
router.get("/", protect, authorize("admin"), getOrders);
router.get("/pagination", protect, authorize("admin"), getOrdersPagination);
router.get("/order-stats", protect, authorize("admin"), getDashboardStats);
router.get("/:id", protect, authorize("admin"), getOrderById);
router.put("/:id", protect, authorize("admin"), updateByOrderId);
router.put("/status/:id", protect, authorize("admin"), updateOrderStatus);
router.delete("/:id", protect, authorize("admin"), deleteOrder);

module.exports = router;
