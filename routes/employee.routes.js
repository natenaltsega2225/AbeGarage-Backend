// routes/employeeRoutes.js
const express = require("express");
const router = express.Router();

// Import controller and middleware
const employeeController = require("../controllers/employee.controller");
const customerController = require("../controllers/customer.controller");
const {
  validateEmployeeRegistration,
  authMiddleware,
} = require("../middlewares/auth.middleware");

// Routes for employee registration and management
// Employee Registration Route
// This route handles POST requests to register a new employee.
router.post(
  "/api/admin/employee",
  authMiddleware.verifyToken, // Middleware to verify authentication token
  authMiddleware.isAdmin, // Middleware to ensure the user has admin privileges
  validateEmployeeRegistration, // Middleware to validate the employee registration data
  employeeController.registerEmployee // Controller method that handles employee registration logic
);

// Get All Employees Route
// This route fetches all employees. Admin access is required.
router.get(
  "/api/employees",
  authMiddleware.verifyToken, // Middleware to verify authentication token
  authMiddleware.isAdmin, // Middleware to ensure the user has admin privileges
  employeeController.getAllEmployees // Controller method to retrieve all employees
);

router.get(
  "/api/employee/:uuid",
  authMiddleware.verifyToken, // Ensures the user is authenticated
  authMiddleware.isAdmin, // Ensures the user has admin privileges
  employeeController.getSingleEmployee
);

// Update Employee Details Route
// This route updates employee details based on the employee ID.
router.put(
  "/api/employee/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin], // Ensure authenticated admin user
  employeeController.updateEmployee // Controller method to handle updating the employee
);

// Delete Employee Route
// This route deletes an employee based on the employee ID.
router.delete(
  "/api/admin/employee/:id",
  authMiddleware.verifyToken, // Middleware to verify authentication token
  authMiddleware.isAdmin, // Middleware to ensure the user has admin privileges
  employeeController.deleteEmployee // Controller method to handle employee deletion
);

// Add New Employee Route
// If you have a separate route for adding employees (as mentioned), we consolidate it here.
router.post(
  "/api/employee/add",
  authMiddleware.verifyToken, // Ensure the user is authenticated
  authMiddleware.isAdmin, // Ensure the user has admin privileges
  employeeController.addEmployee // Controller method for adding a new employee
);

module.exports = router;
