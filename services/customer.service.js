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
    throw {
      status: 409,
      message: "Email or Phone number already registered.",
    }; // Return conflict error if email/phone exists
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
    return { customerId, message: "Customer created successfully." };
  } catch (error) {
    console.error("Error in addCustomer:", error);
    throw error; // Re-throw the error for controller handling
  }
};

// Service function to get all customers
const getAllCustomers = async () => {
  try {
    const query = `
         SELECT 
            ci_info.customer_first_name,
            ci_info.customer_last_name,
            ci_info.active_customer_status,
            cid.customer_id,
            cid.customer_email,
            cid.customer_phone_number,
            cid.customer_added_date,
            cid.customer_hash
         FROM 
            customer_info AS ci_info
         JOIN 
            customer_identifier AS cid
         ON 
            ci_info.customer_id = cid.customer_id
            ORDER BY cid.customer_id DESC
      `;

    const [customers] = await conn.query(query); // Execute the query
    return customers; // Return the customers array
  } catch (error) {
    console.error("Error in getAllCustomers:", error); // Log the error
    throw error; // Propagate the error
  }
};

// Service function to search customers by term
const searchCustomers = async (searchTerm) => {
  try {
    const query = `
         SELECT 
            ci_info.customer_first_name,
            ci_info.customer_last_name,
            ci_info.active_customer_status,
            cid.customer_email,
            cid.customer_phone_number
         FROM 
            customer_info AS ci_info
         JOIN 
            customer_identifier AS cid
         ON 
            ci_info.customer_id = cid.customer_id
         WHERE 
            ci_info.customer_first_name LIKE ? OR
            ci_info.customer_last_name LIKE ? OR
            cid.customer_email LIKE ? OR
            cid.customer_phone_number LIKE ?
      `;
    const searchPattern = `%${searchTerm}%`; // Add % for SQL LIKE search
    const [customers] = await conn.query(query, [
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
    ]);
    return customers;
  } catch (error) {
    console.error("Error in searchCustomers:", error);
    throw error;
  }
};

// Service function to get customer by ID
const getCustomerById = async (customerId) => {
  try {
    const query = `
      SELECT * 
      FROM customer_info 
      WHERE customer_id = ?
    `;
    const [customer] = await conn.query(query, [customerId]);
    return customer.length > 0 ? customer[0] : null; // Return customer or null if not found
  } catch (error) {
    console.error("Error in getCustomerById:", error);
    throw error;
  }
};

//A service function to get single customer
const getCustomerByHash = async (hash) => {
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
};

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Retrieves the customer ID from the database based on the provided customer hash.
 *
 * @returns {Promise<object[]>} A promise that resolves to an array containing the customer ID if found, otherwise an empty array.
 * @throws {Error} If an error occurs during the database query execution.
 */

/******  4033958c-36fb-49df-8c8e-74c9e68e649d  *******/
const getCustomerId = async (hash) => {
  try {
    const query = `
      SELECT customer_id 
      FROM customer_identifier 
      WHERE customer_hash = ?
    `;
    const [result] = await conn.execute(query, [hash]);
    return result;
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
    const result = await getCustomerId(hash);
    if (!result || result.length === 0) {
      return "not_found"; // Return if the customer does not exist.
    }
    const customer_id = result[0].customer_id;

    // Step 2: Update the customer_identifier table (if applicable)
    if (updatedData.customer_phone_number) {
      const queryIdentifier = `
        UPDATE customer_identifier 
        SET customer_phone_number = COALESCE(?, customer_phone_number)
        WHERE customer_id = ?
      `;
      const [resultIdentifier] = await conn.execute(queryIdentifier, [
        updatedData.customer_phone_number,
        customer_id,
      ]);

      if (resultIdentifier.affectedRows === 0) {
        errors.push("Failed to update customer_identifier table");
      }
    }

    // Step 3: Update the customer_info table (first name, last name)
    if (updatedData.customer_first_name || updatedData.customer_last_name) {
      const queryInfo = `
        UPDATE customer_info 
        SET customer_first_name = COALESCE(?, customer_first_name),
            customer_last_name = COALESCE(?, customer_last_name)
        WHERE customer_id = ?
      `;
      const [resultInfo] = await conn.execute(queryInfo, [
        updatedData.customer_first_name,
        updatedData.customer_last_name,
        customer_id,
      ]);

      if (resultInfo.affectedRows === 0) {
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

module.exports = {
  addCustomer,
  updateCustomer,
  getCustomerByHash,
  getAllCustomers,
};
