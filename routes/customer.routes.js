const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");
const {
  authenticateToken,
  isAdmin,
  verifyAdmin,
} = require("../middlewares/auth.middleware"); // Assuming verifyAdmin is in the same file as authenticateToken and isAdmin
const validateCustomer = require("../middlewares/validateCustomer");

// Centralized error handler function
const sendErrorResponse = (res, statusCode, message, logMessage = null) => {
  if (logMessage) {
    console.error(logMessage);
  }
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

// POST endpoint for adding a customer
router.post(
  "/api/add-customer",
  validateCustomer,
  customerController.addCustomer
);

// Route to update customer information
router.put("/api/update-customer/:hash", customerController.updateCustomer);

// GET all customers (accessible only by admin)
router.get(
  "/api/all-customers",
  verifyAdmin,
  customerController.getAllCustomers
);

module.exports = router;
