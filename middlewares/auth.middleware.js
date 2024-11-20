// Import necessary packages
require("dotenv").config(); // To load environment variables
const jwt = require("jwt-simple"); // Using jwt-simple for token decoding
const { User } = require("../models"); // Assuming a User model exists to handle user data
const employeeService = require("../services/employee.service");
const customerService=require("../services/customer.service") // Employee service to fetch employee details

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Get token from the 'Authorization' header
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    // Decode the token using the secret key (JWT_SECRET from environment)
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    req.employee_email = decoded.employee_email; // Attach employee email from the token to the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Middleware to verify if the user has an admin role
const verifyAdminRole = async (req, res, next) => {
  try {
    const employeeEmail = req.employee_email; // Get the employee email from the token
    const employee = await employeeService.getEmployeeByEmail(employeeEmail); // Fetch employee data

    if (!employee || employee[0].company_role_id !== 3) {
      // Assuming '3' is the admin role ID
      return res
        .status(403)
        .json({ message: "Access denied, admin role required" });
    }

    next(); // Proceed if the employee is an admin
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Export the middlewares
module.exports = {
  verifyToken,
  verifyAdminRole,
};
