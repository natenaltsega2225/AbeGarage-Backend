const conn = require("../config/db.config"); // Import the connection pool
const crypto = require("crypto"); // Import crypto for generating a hash

// Service function to add a new customer
const addCustomer = async (customerData) => {
  const {
    customer_email,
    customer_phone_number,
    customer_first_name,
    customer_last_name,
    active_customer_status,
  } = customerData; // Extract fields

  // Check if the customer email or phone number already exists
  const [existingCustomer] = await conn.query(
    "SELECT * FROM customer_identifier WHERE customer_email = ? OR customer_phone_number = ?",
    [customer_email, customer_phone_number]
  );

  if (existingCustomer.length > 0) {
    throw new Error("Email or Phone number already registered.");
  }

  try {
    // Step 1: Generate customer_hash
    const customerHash = crypto
      .createHash("sha256")
      .update(customer_email + customer_phone_number)
      .digest("hex");

    // Step 2: Insert into customer_identifier
    const insertCustomerIdentifierQuery = `
      INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash) 
      VALUES (?, ?, ?)
    `;
    const [customerIdentifierResult] = await conn.query(
      insertCustomerIdentifierQuery,
      [
        customer_email,
        customer_phone_number,
        customerHash, // Store the generated hash
      ]
    );

    const customerId = customerIdentifierResult.insertId; // Get the generated customer_id

    // Step 3: Insert into customer_info (now with the correct customer_id)
    const insertCustomerInfoQuery = `
      INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name, active_customer_status) 
      VALUES (?, ?, ?, ?)
    `;
    const [customerInfoResult] = await conn.query(insertCustomerInfoQuery, [
      customerId, // Pass the customer_id from the previous insert
      customer_first_name,
      customer_last_name,
      active_customer_status, // This should be passed in the request data
    ]);

    // Check if the insert was successful
    if (customerInfoResult.affectedRows !== 1) {
      console.error("Failed to insert into customer_info table");
      return null;
    }

    // Return success message
    return {
      message: "Customer created successfully.",
      customerId,
    };
  } catch (error) {
    console.error("Error in addCustomer:", error);
    return null; // Return null on failure, or handle it differently
  }
};
//A service function to get single customer
const getCustomerByHash = async(hash)=>{
  try {
    const query = `
            SELECT 
                ci.customer_id,
                ci.customer_email,
                ci.customer_phone_number,
                ci.customer_added_date,
                ci.customer_hash,
                info.customer_first_name,
                info.customer_last_name,
                info.active_customer_status
            FROM customer_identifier AS ci
            INNER JOIN customer_info AS info
            ON ci.customer_id = info.customer_id
            WHERE ci.customer_hash = ?
        `;

    const [rows] = await conn.query(query, [hash]);

    // Return the customer if found, otherwise return null
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error in getCustomerByHash service:", error.message);
    throw error;
  }
}

module.exports = { addCustomer,getCustomerByHash };
