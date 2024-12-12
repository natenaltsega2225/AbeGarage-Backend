const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrderrs,
  getsingleOrder,
  customerOrders,
  updateOrder,
} = require("../controllers/order.controller");

// POST request to create a new order
router.post("/api/order", createOrder);

//GET request to get all orders
router.get(
  "/api/orders",
  //   authMiddleware.verifyToken, // Ensures the user is authenticated
  //   authMiddleware.isAdmin, // Ensures the user has admin privileges
  getAllOrderrs
);

//GET request to get single order
router.get("/api/order/:order_hash", getsingleOrder);
//Get customer orders
router.get("/api/customer/orders/:hash", customerOrders);
// Route to update an order
router.put("/api/order", updateOrder);
//

module.exports = router;
