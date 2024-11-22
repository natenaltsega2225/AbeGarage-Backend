const customerService = require("../services/customer.service");

// Controller function to handle adding a new customer
const addCustomer = async (req, res) => {
  try {
    const customerData = req.body;

    // Validate the input customer data (optional)
    if (!customerData.name || !customerData.email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Call the service layer to add the customer to the database
    const result = await customerService.addCustomer(customerData);

    // Send success response
    res.status(201).json({
      message: "Customer created successfully!",
      data: result,
    });
  } catch (error) {
    // Log error for debugging purposes
    console.error("Error in addCustomer:", error);

    // Handle specific error types
    if (error.status === 409) {
      // Conflict error (e.g., duplicate email)
      return res.status(409).json({
        message: error.message,
      });
    }

    // Generic internal server error response
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
// Controller to get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await customerService.getCustomers();
    res.status(200).json({
      limit: customers.length,
      customers: customers,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

module.exports = { addCustomer };
