// Import the necessary modules
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Initialize dotenv configuration
dotenv.config();

// Initialize Express app
const app = express();

// Import routes
const customerRoutes = require("./routes/customer.routes");
const orderRoutes = require("./routes/order.routes");
const mainRoutes = require("./routes"); // If you have a general main routes file

// Get port number from environment variables
const PORT = process.env.PORT || 5000;

// Use middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Use routes
app.use("/api", orderRoutes); // Order-related routes under '/api'
app.use("/api/customers", customerRoutes); // Customer-related routes under '/api/customers'

// If you have a main router, add it here (or adjust the path if needed)
app.use("/", mainRoutes); // Main or general routes (if necessary)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Database connected");
});

module.exports = app; // Export app for testing or further use
