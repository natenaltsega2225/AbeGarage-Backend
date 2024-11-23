const customerService = require("../services/customer.service");

// Controller function to handle adding a new customer
const addCustomer = async (req, res) => {
  try {
    const customerData = req.body;

    // Validate the input customer data
    if (!customerData.name || !customerData.email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    // Simple email validation (can be improved with regex or a library like validator)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(customerData.email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Call the service layer to add the customer to the database
    const result = await customerService.addCustomer(customerData);

    // If customer already exists (based on unique email for instance)
    if (result && result.status === 409) {
      return res.status(409).json({
        success: false,
        message: "Customer already exists with this email",
      });
    }

    // Send success response
    res.status(201).json({
      success: true,
      message: "Customer created successfully!",
      data: result,
    });
  } catch (error) {
    // Log error with more context
    console.error("Error in addCustomer:", error);

    // Handle specific error types
    if (error.status === 409) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    // Generic internal server error response with more details
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Controller to get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerService.getCustomers();

    // Handle the case where no customers are found
    if (!customers || customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No customers found",
      });
    }

    res.status(200).json({
      success: true,
      limit: customers.length,
      customers: customers,
    });
  } catch (error) {
    // Log error for debugging
    console.error("Error in getAllCustomers:", error);

    // Return a more descriptive error message
    res.status(500).json({
      success: false,
      message: "Failed to retrieve customers",
      error: error.message,
    });
  }
};

module.exports = { addCustomer, getAllCustomers };
