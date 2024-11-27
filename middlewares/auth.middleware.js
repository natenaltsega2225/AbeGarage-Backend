require("dotenv").config();
const jwt = require("jsonwebtoken");
const employeeService = require("../services/employee.service");

// Function to verify the token received from the frontend
const verifyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"];

  // Check if the token is provided
  if (!token) {
    console.error("No token provided in request.");
    return res.status(403).send({
      status: "fail",
      message: "No token provided!",
    });
  }

  // Verify the provided token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err.message);
      return res.status(401).send({
        status: "fail",
        message: "Unauthorized access. Invalid token!",
      });
    }

    // Attach decoded employee email to the request object
    req.employee_email = decoded.employee_email;

    if (!req.employee_email) {
      console.error("Decoded token does not contain employee_email.");
      return res.status(400).send({
        status: "fail",
        message: "Invalid token payload. Missing employee_email.",
      });
    }

    next();
  });
};

// Function to check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const { employee_email } = req;

    // Ensure the email is present in the request object
    if (!employee_email) {
      console.error("Employee email missing in request object.");
      return res.status(400).send({
        status: "fail",
        message: "Employee email not found in token payload.",
      });
    }

    // Fetch the employee record from the database
    const employee = await employeeService.getEmployeeByEmail(employee_email);

    if (!employee || employee.length === 0) {
      console.error(`Employee with email ${employee_email} not found.`);
      return res.status(404).send({
        status: "fail",
        message: "Employee not found!",
      });
    }

    // Check if employee has admin role
    if (employee[0].company_role_id === 3) {
      return next(); // Proceed to the next middleware or controller
    } else {
      return res.status(403).send({
        status: "fail",
        message: "Access denied. Not an admin!",
      });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error while checking admin role:", error);
    return res.status(500).send({
      status: "fail",
      message: "Internal server error. Please try again later.",
    });
  }
};

// Export the authentication middleware functions
const authMiddleware = {
  verifyToken,
  isAdmin,
};

module.exports = authMiddleware;
