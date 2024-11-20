const { Customer } = require("../models"); // Assuming you're using Sequelize for your models

/**
 * Fetch all customers from the database.
 * @returns {Promise<Array>} A promise that resolves to a list of all customers.
 */
const getAllCustomers = async () => {
  try {
    // Fetch all customers from the database
    const customers = await Customer.findAll();
    return customers; // Returns an array of customer objects
  } catch (error) {
    throw new Error("Error fetching customers: " + error.message);
  }
};

/**
 * Fetch a single customer by their ID.
 * @param {number} customerId The ID of the customer to fetch.
 * @returns {Promise<Object>} A promise that resolves to a customer object.
 */
const getCustomerById = async (customerId) => {
  try {
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  } catch (error) {
    throw new Error("Error fetching customer: " + error.message);
  }
};

/**
 * Create a new customer.
 * @param {Object} customerData The customer data to create a new record.
 * @returns {Promise<Object>} A promise that resolves to the created customer object.
 */
const createCustomer = async (customerData) => {
  try {
    const newCustomer = await Customer.create(customerData);
    return newCustomer;
  } catch (error) {
    throw new Error("Error creating customer: " + error.message);
  }
};

/**
 * Update a customer's details by their ID.
 * @param {number} customerId The ID of the customer to update.
 * @param {Object} customerData The data to update the customer with.
 * @returns {Promise<Object>} A promise that resolves to the updated customer object.
 */
const updateCustomer = async (customerId, customerData) => {
  try {
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    await customer.update(customerData);
    return customer;
  } catch (error) {
    throw new Error("Error updating customer: " + error.message);
  }
};

/**
 * Delete a customer by their ID.
 * @param {number} customerId The ID of the customer to delete.
 * @returns {Promise<void>} A promise that resolves when the customer is deleted.
 */
const deleteCustomer = async (customerId) => {
  try {
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    await customer.destroy();
  } catch (error) {
    throw new Error("Error deleting customer: " + error.message);
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
