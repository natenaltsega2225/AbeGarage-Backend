const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");
const {
  authenticateToken,
  isAdmin,
} = require("../middlewares/auth.middleware");
const validateCustomer = require("../middlewares/validateCustomer");
const Customer = require("../models/Customer.model");

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
  validateCustomer, // Ensure this middleware validates properly
  async (req, res) => {
    try {
      await customerController.addCustomer(req, res);
    } catch (error) {
      console.error("Error in add-customer route:", error);
      return sendErrorResponse(
        res,
        500,
        "Error adding customer. Please try again later.",
        error.message
      );
    }
  }
);

// Route to get all customers (public or authenticated access, no specific restriction)
router.get("/", customerController.getAllCustomers);

// GET endpoint for fetching all customers (only accessible by authenticated admins)
router.get("/all-customers", authenticateToken, isAdmin, async (req, res) => {
  try {
    // Fetch all customers from the database
    const customers = await Customer.findAll();

    if (!customers || customers.length === 0) {
      return sendErrorResponse(res, 404, "No customers found");
    }

    // Return the customer data in JSON format
    return res.status(200).json({
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
