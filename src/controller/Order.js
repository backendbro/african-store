const Order = require("../model/Order");
const moment = require("moment");

// 🟢 Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      customer_name,
      amount_paid,
      payment_method,
      order_status,
      order_items,
    } = req.body;

    if (
      !customer_name ||
      !amount_paid ||
      !payment_method ||
      !order_items.length
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newOrder = new Order({
      customer_name,
      amount_paid,
      payment_method,
      order_status,
      order_items,
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

// 🟡 Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ created_at: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

// exports.getOrdersPagination = async (req, res) => {
//   try {
//     let { page = 1, limit = 10 } = req.query; // Default: page 1, 10 orders per page
//     page = parseInt(page);
//     limit = parseInt(limit);

//     const totalOrders = await Order.countDocuments(); // Get total orders count
//     const orders = await Order.find()
//       .sort({ created_at: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     res.status(200).json({
//       totalOrders,
//       totalPages: Math.ceil(totalOrders / limit),
//       currentPage: page,
//       orders,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error fetching orders", error: error.message });
//   }
// };

// 🔵 Get order by ID

exports.getOrdersPagination = async (req, res) => {
  try {
    let { page = 1, limit = 10, filter } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    let query = {}; // Default query

    // Apply date filtering based on 'filter' value
    if (filter) {
      const now = moment();
      if (filter === "30m") {
        query.created_at = { $gte: now.subtract(30, "minutes").toDate() };
      } else if (filter === "24h") {
        query.created_at = { $gte: now.subtract(24, "hours").toDate() };
      } else if (filter === "7d") {
        query.created_at = { $gte: now.subtract(7, "days").toDate() };
      } else if (filter === "month") {
        query.created_at = { $gte: now.startOf("month").toDate() };
      }
    }

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      orders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
};

exports.updateByOrderId = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; // Data to update

    console.log(updateData);
    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true, // Return updated document
      runValidators: true, // Ensure validation is applied
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order updated successfully", updatedOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order", error: error.message });
  }
};

// 🟠 Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { order_status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { order_status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order", error: error.message });
  }
};

// 🔴 Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting order", error: error.message });
  }
};
