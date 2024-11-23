const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config"); // Correct import of Sequelize instance
const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "mysql2", // or 'postgres', 'sqlite', etc.
});
// Define the Customer model
const Customer = sequelize.define("Customer", {
  customer_email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  customer_phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  customer_first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customer_last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  active_customer_status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

// Customer Service Object for interacting with the database
const CustomerService = {
  // Fetch all customers
  findAll: async () => {
    try {
      return await Customer.findAll(); // Return all customers
    } catch (error) {
      console.error("Error fetching customers: ", error.message);
      throw new Error("Error fetching customers from the database");
    }
  },

  // Fetch a customer by ID
  findById: async (id) => {
    try {
      const customer = await Customer.findByPk(id); // Find by primary key (ID)
      if (!customer) throw new Error("Customer not found");
      return customer;
    } catch (error) {
      console.error(`Error fetching customer by ID ${id}: `, error.message);
      throw new Error("Error fetching customer from the database");
    }
  },

  // Create a new customer
  createCustomer: async (customerData) => {
    try {
      return await Customer.create(customerData); // Return the newly created customer
    } catch (error) {
      console.error("Error creating customer: ", error.message);
      throw new Error("Error creating customer in the database");
    }
  },

  // Update customer details
  updateCustomer: async (id, customerData) => {
    try {
      const customer = await Customer.findByPk(id);
      if (!customer) throw new Error("Customer not found");
      await customer.update(customerData); // Update customer fields
      return customer; // Return the updated customer
    } catch (error) {
      console.error(`Error updating customer with ID ${id}: `, error.message);
      throw new Error("Error updating customer in the database");
    }
  },

  // Deactivate a customer
  deactivateCustomer: async (id) => {
    try {
      const customer = await Customer.findByPk(id);
      if (!customer) throw new Error("Customer not found");
      customer.active_customer_status = false;
      await customer.save(); // Save the updated status
      return customer; // Return the updated customer
    } catch (error) {
      console.error(
        `Error deactivating customer with ID ${id}: `,
        error.message
      );
      throw new Error("Error deactivating customer in the database");
    }
  },
};

// Export both the Customer model and CustomerService object
module.exports = { Customer, CustomerService };
