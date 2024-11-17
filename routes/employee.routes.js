// routes/employeeRoutes.js
const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const {
  validateEmployeeRegistration,
} = require("../middlewares/validationmiddleware");
const authMiddleware = require("../middlewares/auth.middleware");

// Use validation middleware in the registration route
// Route Path: The path /employee is defined as a POST route, meaning it will handle employee registration requests that contain data (e.g., in JSON format).
// Middleware (validateEmployeeRegistration): Runs first and validates the request data to ensure it meets requirements (e.g., required fields, correct formats). If validation fails, it returns an error response; if it succeeds, the request is passed on.
// Controller (employeeController.registerEmployee): Executes the registration logic, including saving the new employee to the database. This method handles the main business logic after validation.
router.post(
  "/api/admin/employee",
  authMiddleware.verifyToken, // Ensures the user is authenticated
  authMiddleware.isAdmin, // Ensures the user has admin privileges
  validateEmployeeRegistration, // Validates the request data
  employeeController.registerEmployee // Registers the employee if all checks pass
);
router.get(
  "/api/employees",
  authMiddleware.verifyToken, // Ensures the user is authenticated
  authMiddleware.isAdmin, // Ensures the user has admin privileges
  employeeController.getAllEmployees
);


// PUT request to update employee details
router.put(
  "/api/employee/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  employeeController.updateEmployee
);
// Employee Deletion Route
router.delete(
  "/api/admin/employee/:id", // Route to delete an employee
  authMiddleware.verifyToken, // Ensures the user is authenticated
  authMiddleware.isAdmin, // Ensures the user has admin privileges
  employeeController.deleteEmployee // Deletes the employee if checks pass
);

module.exports = router;
