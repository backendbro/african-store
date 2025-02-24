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
  getDashboardStats,
  getMetrics,
  getMostSoldItems,
} = require("../controller/Order");
const { protect, authorize } = require("../middleware/Auth");

// Define routes
router.post("/", protect, authorize("admin"), createOrder);
router.get("/", protect, authorize("admin"), getOrders);
router.get("/order-stats", protect, authorize("admin"), getDashboardStats);
router.get("/order-metrics", protect, authorize("admin"), getMetrics);
router.get("/order-items", protect, authorize("admin"), getMostSoldItems);
router.get("/pagination", protect, authorize("admin"), getOrdersPagination);
router.get("/:id", protect, authorize("admin"), getOrderById);
router.put("/:id", protect, authorize("admin"), updateByOrderId);
router.put("/status/:id", protect, authorize("admin"), updateOrderStatus);
router.delete("/:id", protect, authorize("admin"), deleteOrder);

module.exports = router;
