const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

// Define the route to fetch all orders
router.get("/api/orders", orderController.getAllOrders);

module.exports = router;
