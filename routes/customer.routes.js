const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");
const {
  authenticateToken,
  isAdmin,
} = require("../middlewares/auth.middleware");
const validateCustomer = require("../middlewares/validateCustomer");
const Customer = require("../models/Customer.model");

// Centralized error handler function (for future use)
const sendErrorResponse = (res, statusCode, message, logMessage) => {
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
  validateCustomer, // Ensure this middleware is defined properly
  customerController.addCustomer // Ensure this handler exists
);

// Route to get all customers (public or authenticated access, no specific restriction)
router.get("/", customerController.getAllCustomers);

// GET endpoint for fetching all customers (only accessible by authenticated admins)
router.get("/all-customers", authenticateToken, isAdmin, async (req, res) => {
  try {
    // Fetch all customers from the database
    const customers = await Customer.findAll();

    if (customers.length === 0) {
      return res.status(404).json({ message: "No customers found" });
    }

    // Return the customer data in JSON format
    res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return sendErrorResponse(
      res,
      500,
      "Error fetching customers. Please try again later.",
      error.message
    );
  }
});

module.exports = router;
