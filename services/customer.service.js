const conn = require("../config/db.config"); // Import the connection pool
const crypto = require("crypto"); // Import crypto for generating a hash

// Helper function to handle database queries
const queryDatabase = async (query, params) => {
  try {
    const [result] = await conn.query(query, params);
    return result;
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
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

  // Basic validation
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

  try {
    // Step 1: Check if the customer email or phone number already exists
    const existingCustomer = await queryDatabase(
      "SELECT * FROM customer_identifier WHERE customer_email = ? OR customer_phone_number = ?",
      [customer_email, customer_phone_number]
    );

    if (existingCustomer.length > 0) {
      throw new Error("Email or Phone number already registered.");
    }

    // Step 2: Generate a unique customer hash
    const customerHash = crypto
      .createHash("sha256")
      .update(customer_email + customer_phone_number)
      .digest("hex");

    // Step 3: Use a transaction to ensure both inserts succeed or fail together
    await conn.beginTransaction(); // Start a transaction

    // Insert into customer_identifier table
    const insertCustomerIdentifierQuery = `
      INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash)
      VALUES (?, ?, ?)
    `;
    const customerIdentifierResult = await queryDatabase(
      insertCustomerIdentifierQuery,
      [customer_email, customer_phone_number, customerHash]
    );

    const customerId = customerIdentifierResult.insertId;

    // Insert into customer_info table
    const insertCustomerInfoQuery = `
      INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name, active_customer_status)
      VALUES (?, ?, ?, ?)
    `;
    const customerInfoResult = await queryDatabase(insertCustomerInfoQuery, [
      customerId,
      customer_first_name,
      customer_last_name,
      active_customer_status,
    ]);

    // Check if both inserts were successful
    if (
      customerInfoResult.affectedRows !== 1 ||
      customerIdentifierResult.affectedRows !== 1
    ) {
      throw new Error("Failed to insert into one or more customer tables.");
    }

    // Commit the transaction if all inserts succeed
    await conn.commit();

    // Return success response
    return {
      message: "Customer created successfully.",
      customerId,
    };
  } catch (error) {
    // If any error occurs, rollback the transaction
    await conn.rollback();

    console.error("Error in addCustomer:", error.message);
    throw new Error(`Failed to add customer: ${error.message}`);
  }
};

// Service to get all customers (unchanged)
exports.getCustomers = async () => {
  try {
    const customers = await queryDatabase("SELECT * FROM customers");
    return customers.rows;
  } catch (error) {
    throw new Error("Error fetching customer data");
  }
};

module.exports = { addCustomer };
