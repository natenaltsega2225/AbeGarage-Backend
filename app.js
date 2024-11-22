// Import required modules
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const customerRoutes = require("./routes/customer.routes"); // Adjusted path to match the file
const middleware=require("./middlewares/auth.middleware")
const routes = require("./routes"); // If other routes are used, ensure they are correctly imported
// Initialize dotenv to load environment variables
dotenv.config();

// Create the Express app
const app = express();

// Setup CORS and middleware
app.use(cors());
app.use(express.json());

// Register the customer routes under the '/api' path
app.use("/api", customerRoutes);
// Route setup: Apply the authenticateAdmin middleware for the '/api/all-customers' route
app.use("/api/all-customers", middleware.authenticateAdmin, customerRoutes);
// If you have other routes to integrate, use them here
app.use(routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
});

// Handle 404 errors for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Get the port from environment variable or fallback to 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
