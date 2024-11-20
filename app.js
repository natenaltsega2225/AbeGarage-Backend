// Import necessary modules
import Customer from "./controllers/customer.controller";
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Customer } = require("./models"); // Assuming Sequelize is used for database models
const routes = require("./routes");
const customerRoutes = require("./routes/customer.routes"); // Customer-specific routes
const {
  verifyToken,
  verifyAdminRole,
} = require("./middlewares/authMiddleware"); // Token verification middleware

// Create the web server
const app = express();

// Middleware setup
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse incoming JSON requests

// Define routes
app.use("/api", routes); // General API routes
app.use("/api/customers", customerRoutes); // Customer routes will handle '/api/customers'

// Define secure route for fetching all customers, requiring token verification and admin role
app.get(
  "/api/all-customers",
  verifyToken, // Token verification middleware
  verifyAdminRole, // Admin role verification middleware
  async (req, res) => {
    try {
      // Fetch all customers from the database
      const customers = await Customer.findAll();
      return res.status(200).json({ customers });
    } catch (error) {
      console.error("Error fetching customers:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
);

// Database connection check (example for Sequelize)
const { sequelize } = require("./models"); // Assuming 'sequelize' is exported from models.js
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");

    // Start the server only after DB connection is successful
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit the process if DB connection fails
  });

// Export the app for testing or further usage
module.exports = app;
