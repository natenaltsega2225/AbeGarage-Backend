require("dotenv").config();
const jwt = require("jsonwebtoken");
const employeeService = require("../services/employee.service");

// Function to verify the token and check if user is an admin
const verifyAdmin = async (req, res, next) => {
  let token =
    req.headers["x-access-token"] ||
    req.headers["authorization"]?.split(" ")[1]; // Support both x-access-token and Bearer token

  if (!token) {
    return res.status(403).send({
      status: "fail",
      message: "Access denied. No token provided.",
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.employee_email = decoded.employee_email;

    // Fetch employee data based on decoded email
    const employee = await employeeService.getEmployeeByEmail(
      req.employee_email
    );

    if (!employee || employee.length === 0) {
      return res.status(404).send({
        status: "fail",
        message: "Employee not found!",
      });
    }

    // Check if the employee is an admin (role id 3)
    if (employee[0].company_role_id === 3) {
      req.user = decoded; // Attach user data to request
      next(); // Proceed to the next middleware or route handler
    } else {
      return res.status(403).send({
        status: "fail",
        message: "Access denied. Admins only.",
      });
    }
  } catch (error) {
    console.error("Error verifying token or checking role:", error);
    return res.status(400).send({
      status: "fail",
      message: "Invalid token or server error.",
    });
  }
};

// Export the combined authentication middleware
const authMiddleware = {
  verifyAdmin,
};

module.exports = authMiddleware;
