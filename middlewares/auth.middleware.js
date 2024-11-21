// Import necessary packages
require("dotenv").config();
const jwt = require("jsonwebtoken");
const employeeService = require("../services/employee.service");

// Function to verify the token received from the frontend
const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      status: "fail",
      message: "No token provided!",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Error verifying token:", err);
      return res.status(401).send({
        status: "fail",
        message: "Unauthorized!",
      });
    }

    // Attach decoded employee info to the request object for further use
    req.employee_email = decoded.employee_email;
    next();
  });
};

// Function to check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    // Ensure employee_email is available
    const employee_email = req.employee_email;

    // Fetch employee by email
    const employee = await employeeService.getEmployeeByEmail(employee_email);

    if (!employee || employee.length === 0) {
      return res.status(404).send({
        status: "fail",
        message: "Employee not found!",
      });
    }

    // Check if employee has admin role
    if (employee[0].company_role_id === parseInt(process.env.ADMIN_ROLE_ID)) {
      return next(); // Proceed to the next middleware or controller
    } else {
      return res.status(403).send({
        status: "fail",
        error: "Not an Admin!",
      });
    }
  } catch (error) {
    console.error("Error checking admin role:", error);
    return res.status(500).send({
      status: "fail",
      message: "Internal server error",
    });
  }
};

// Export the authentication middleware functions
const authMiddleware = {
  verifyToken,
  isAdmin,
};
