const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");
const validateCustomer = require("../middleware/validateCustomer");

// POST endpoint for adding a customer
router.post(
  "/api/add-customer",
  validateCustomer,
  customerController.addCustomer
);

// Route to get all customers (public or authenticated access, no specific restriction)
router.get("/", customerController.getAllCustomers);

// GET endpoint for fetching all customers (only accessible by authenticated admins)
router.get("/all-customers", authenticateToken, isAdmin, async (req, res) => {
  try {
    // Fetch all customers from the database (Assuming a Customer model exists)
    const customers = await Customer.findAll();

    if (!customers) {
      return res.status(404).json({ message: "No customers found" });
    }

    // Return the customer data in JSON format
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    // Provide more specific error message
    res.status(500).json({
      message: "Error fetching customers. Please try again later.",
      error: error.message,
    });
  }
});

module.exports = router;
