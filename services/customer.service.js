// const { CustomerIdentifier, CustomerInfo } = require("../models");
const crypto = require("crypto"); // Import crypto for generating a hash
const sequelize = require("../config/db.config"); // Assuming you have sequelize instance exported here

// Helper function for validating customer data
const validateCustomerData = (customerData) => {
  const {
    customer_email,
    customer_phone_number,
    customer_first_name,
    customer_last_name,
  } = customerData;

  if (
    !customer_email ||
    !customer_phone_number ||
    !customer_first_name ||
    !customer_last_name
  ) {
    throw new Error(
      "Missing required fields: email, phone number, first name, and last name are mandatory."
    );
  }
};

// Helper function for generating a unique customer hash
const generateCustomerHash = (email, phoneNumber) => {
  return crypto
    .createHash("sha256")
    .update(email + phoneNumber)
    .digest("hex");
};

// Service function to add a new customer
const addCustomer = async (customerData) => {
  const {
    customer_email,
    customer_phone_number,
    customer_first_name,
    customer_last_name,
    active_customer_status,
  } = customerData;

  // Step 1: Validate customer data
  validateCustomerData(customerData);

  const transaction = await sequelize.transaction();

  try {
    // Step 2: Check if the customer email or phone number already exists
    const existingCustomer = await CustomerIdentifier.findOne({
      where: {
        [sequelize.Op.or]: [
          { customer_email: customer_email },
          { customer_phone_number: customer_phone_number },
        ],
      },
    });

    if (existingCustomer) {
      throw new Error("Email or Phone number already registered.");
    }

    // Step 3: Generate a unique customer hash
    const customerHash = generateCustomerHash(
      customer_email,
      customer_phone_number
    );

    // Step 4: Insert into customer_identifier table
    const customerIdentifier = await CustomerIdentifier.create(
      {
        customer_email,
        customer_phone_number,
        customer_hash: customerHash,
      },
      { transaction }
    );

    const customerId = customerIdentifier.id;

    // Insert into customer_info table
    await CustomerInfo.create(
      {
        customer_id: customerId,
        customer_first_name,
        customer_last_name,
        active_customer_status,
      },
      { transaction }
    );

    // Step 5: Commit the transaction
    await transaction.commit();

    // Return success response
    return {
      success: true,
      message: "Customer created successfully.",
      customerId,
    };
  } catch (error) {
    // If any error occurs, rollback the transaction
    await transaction.rollback();

    console.error("Error in addCustomer:", error.message);
    throw new Error(`Failed to add customer: ${error.message}`);
  }
};

// Service to get all customers
const getAllCustomers = async () => {
  try {
    const customers = await CustomerIdentifier.findAll({
      include: [
        {
          model: CustomerInfo,
          as: "info",
          attributes: [
            "customer_first_name",
            "customer_last_name",
            "active_customer_status",
          ],
        },
      ],
    });

    if (customers.length === 0) {
      return { success: false, message: "No customers found." };
    }

    return {
      success: true,
      customers,
    };
  } catch (error) {
    console.error("Error fetching customers:", error.message);
    throw new Error("Error fetching customer data. Please try again later.");
  }
};

// Helper function to retrieve customer_id by hash
const getCustomerId = async (hash) => {
  try {
    const customer = await CustomerIdentifier.findOne({
      where: { customer_hash: hash },
    });

    if (!customer) {
      throw new Error("Customer not found.");
    }

    return customer.customer_id;
  } catch (error) {
    console.error("Error in getCustomerId:", error.message);
    throw new Error("Failed to fetch customer ID");
  }
};

// Update customer details by hash
const updateCustomer = async (hash, updatedData) => {
  try {
    const errors = []; // Array to track any update failures.

    // Step 1: Retrieve the customer_id using the hash
    const customerId = await getCustomerId(hash);

    // Step 2: Update the customer_identifier table (if applicable)
    if (updatedData.customer_phone_number) {
      const result = await CustomerIdentifier.update(
        { customer_phone_number: updatedData.customer_phone_number },
        { where: { customer_id: customerId } }
      );

      if (result[0] === 0) {
        errors.push("Failed to update customer_identifier table");
      }
    }

    // Step 3: Update the customer_info table (first name, last name)
    if (updatedData.customer_first_name || updatedData.customer_last_name) {
      const result = await CustomerInfo.update(
        {
          customer_first_name: updatedData.customer_first_name,
          customer_last_name: updatedData.customer_last_name,
        },
        { where: { customer_id: customerId } }
      );

      if (result[0] === 0) {
        errors.push("Failed to update customer_info table");
      }
    }

    // Step 4: Return Results
    if (errors.length > 0) {
      return { success: false, message: "Some updates failed", errors };
    } else {
      return { success: true, message: "Customer updated successfully" };
    }
  } catch (error) {
    console.error("Error in updateCustomer:", error.message);
    throw new Error("Unexpected server error");
  }
};

module.exports = { addCustomer, updateCustomer, getAllCustomers };
