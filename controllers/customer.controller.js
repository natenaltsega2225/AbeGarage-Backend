const customerService = require("../services/customer.service"); // Import customer service

// Controller to handle adding a customer
const addCustomer = async (req, res) => {
  try {
    const customerData = req.body; // Get customer data from the request body
    const result = await customerService.addCustomer(customerData); // Call the service to add the customer
    res.status(201).json(result); // Send success response with customer info
  } catch (error) {
    console.error("Error in addCustomer:", error);
    if (error.status) {
      res.status(error.status).json({ message: error.message }); // Handle specific error status
    } else {
      res.status(500).json({ message: "Internal server error" }); // Generic server error
    }
  }
};

// Controller to handle getting all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerService.getAllCustomers(); // Call the service to fetch all customers
    if (customers.length === 0) {
      return res.status(404).json({ message: "No customers found." }); // If no customers found
    }
    res.status(200).json(customers); // Send the list of customers
  } catch (error) {
    console.error("Error in getAllCustomers:", error);
    res.status(500).json({ message: "Internal server error" }); // Handle errors
  }
};

// Controller to handle searching customers by search term
const searchCustomers = async (req, res) => {
  const { searchTerm } = req.query; // Get search term from query parameters
  try {
    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required." });
    }

    const customers = await customerService.searchCustomers(searchTerm); // Call service to search customers
    if (customers.length === 0) {
      return res.status(404).json({ message: "No matching customers found." });
    }
    res.status(200).json(customers); // Send the search results
  } catch (error) {
    console.error("Error in searchCustomers:", error);
    res.status(500).json({ message: "Internal server error" }); // Handle errors
  }
};

// Controller to handle getting a customer by ID
const getCustomerById = async (req, res) => {
  const { id } = req.params; // Get the customer ID from the route parameter
  try {
    const customer = await customerService.getCustomerById(id); // Call the service to fetch the customer by ID
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." }); // If customer not found
    }
    res.status(200).json(customer); // Send customer data
  } catch (error) {
    console.error("Error in getCustomerById:", error);
    res.status(500).json({ message: "Internal server error" }); // Handle errors
  }
};

//Controller function to handle getting all customers
const getSingleCustomerByHash = async (req, res) => {
  try {
    const { hash } = req.params;

    // Validate hash
    if (!hash || typeof hash !== "string" || hash.trim().length === 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "The customer hash provided is invalid or missing.",
      });
    }

    // Fetch customer data
    const customer = await customerService.getCustomerByHash(hash);

    if (!customer) {
      return res.status(404).json({
        error: "Customer not found",
        message: "The customer hash provided does not exist.",
      });
    }

    // Return customer data
    res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error.message);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while fetching customer data.",
    });
  }
};

//Update customer information by hash

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

module.exports = {
  addCustomer,
  updateCustomer,
  getSingleCustomerByHash,
  getAllCustomers,
};
