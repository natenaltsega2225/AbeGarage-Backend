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
    console.error("Error in addCustomer:", error);
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
    const customers = await customerService.getAllCustomers();

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
    console.error("Error in getAllCustomers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve customers",
      error: error.message,
    });
  }
};

// Controller to update customer information by hash
const updateCustomer = async (req, res) => {
  try {
    const { hash } = req.params; // Customer hash from the URL
    const { customer_phone_number, customer_first_name, customer_last_name } =
      req.body;

    // Validate hash
    if (!hash) {
      return res.status(400).json({
        error: "Bad Request",
        message: "The customer hash provided is invalid or missing.",
      });
    }

    // Check if at least one field is provided for update
    if (!customer_phone_number && !customer_first_name && !customer_last_name) {
      return res.status(400).json({
        error: "Bad Request",
        message:
          "At least one field (phone number, first name, or last name) is required to update.",
      });
    }

    // Call service to update customer details
    const updateResult = await customerService.updateCustomer(hash, {
      customer_phone_number,
      customer_first_name,
      customer_last_name,
    });

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({
        error: "Customer not found",
        message: "The customer hash provided does not exist.",
      });
    }

    res.status(200).json({
      message: "Customer updated successfully",
    });
  } catch (error) {
    console.error("Error updating customer:", error.message);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while updating customer data.",
    });
  }
};

module.exports = { addCustomer, updateCustomer, getAllCustomers };
