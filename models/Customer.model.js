const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config"); // Correct import of Sequelize instance

// Define the Customer model with additional validation
const Customer = sequelize.define("Customer", {
  customer_email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: "This email is already associated with another account.",
    },
    validate: {
      isEmail: {
        msg: "Please provide a valid email address.",
      },
    },
  },
  customer_phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: "This phone number is already in use.",
    },
    validate: {
      len: {
        args: [10, 15],
        msg: "Phone number should be between 10 to 15 characters.",
      },
    },
  },
  customer_first_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "First name is required.",
      },
    },
  },
  customer_last_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Last name is required.",
      },
    },
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
      const customers = await Customer.findAll();
      return customers;
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
      // Validate before creating customer
      const customer = await Customer.create(customerData);
      return customer;
    } catch (error) {
      console.error("Error creating customer: ", error.message);
      if (error.name === "SequelizeValidationError") {
        throw new Error(
          "Validation error: " + error.errors.map((e) => e.message).join(", ")
        );
      }
      throw new Error("Error creating customer in the database");
    }
  },

  // Update customer details
  updateCustomer: async (id, customerData) => {
    try {
      const customer = await Customer.findByPk(id);
      if (!customer) throw new Error("Customer not found");
      await customer.update(customerData);
      return customer;
    } catch (error) {
      console.error(`Error updating customer with ID ${id}: `, error.message);
      if (error.name === "SequelizeValidationError") {
        throw new Error(
          "Validation error: " + error.errors.map((e) => e.message).join(", ")
        );
      }
      throw new Error("Error updating customer in the database");
    }
  },

  // Deactivate a customer
  deactivateCustomer: async (id) => {
    try {
      const customer = await Customer.findByPk(id);
      if (!customer) throw new Error("Customer not found");
      customer.active_customer_status = false;
      await customer.save();
      return customer;
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
