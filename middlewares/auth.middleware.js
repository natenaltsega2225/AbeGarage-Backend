require("dotenv").config();
const jwt = require("jsonwebtoken");
const employeeService = require("../services/employee.service");
const customerService = require("../services/customer.service");

// Utility function for sending consistent error responses
function sendErrorResponse(res, statusCode, message) {
  return res.status(statusCode).json({ error: message });
}

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return sendErrorResponse(res, 401, "Token is required");
  }

  // Verify the JWT token
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      return sendErrorResponse(res, 403, "Invalid or expired token");
    }

    // Attach user data (decoded info) to the request object for further use
    req.user = decoded;
    next();
  });
}

// Middleware to check if the user is an admin
async function isAdmin(req, res, next) {
  try {
    const userEmail = req.user?.employee_email;

    if (!userEmail) {
      return sendErrorResponse(res, 400, "User email not found in token");
    }

    // Fetch employee by email from the database
    const employee = await employeeService.getEmployeeByEmail(userEmail);

    if (!employee || employee.length === 0) {
      return sendErrorResponse(res, 404, "Employee not found");
    }

    // Check if the employee has admin role based on company_role_id
    const employeeRole = employee[0].company_role_id;
    const adminRoleId = parseInt(process.env.ADMIN_ROLE_ID);

    if (employeeRole === adminRoleId) {
      return next(); // User is admin, proceed to next middleware/controller
    } else {
      return sendErrorResponse(res, 403, "You do not have admin privileges");
    }
  } catch (error) {
    console.error("Error verifying admin role:", error);
    return sendErrorResponse(res, 500, "Internal server error");
  }
}

// Middleware to authenticate and authorize as admin in one step
function authenticateAdmin(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return sendErrorResponse(res, 401, "Authentication invalid");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return sendErrorResponse(res, 401, "Authentication invalid");
    }

    // Attach the user data to request
    req.user = decoded;

    // Fetch employee to check for admin role
    const userEmail = decoded?.employee_email;
    if (!userEmail) {
      return sendErrorResponse(res, 400, "User email missing in token");
    }

    try {
      const employee = await employeeService.getEmployeeByEmail(userEmail);

      if (!employee || employee.length === 0) {
        return sendErrorResponse(res, 404, "Employee not found");
      }

      const employeeRole = employee[0].company_role_id;
      const adminRoleId = parseInt(process.env.ADMIN_ROLE_ID);

      if (employeeRole === adminRoleId) {
        return next(); // Admin, proceed to next handler
      } else {
        return sendErrorResponse(
          res,
          403,
          "You do not have the required admin privileges"
        );
      }
    } catch (error) {
      console.error("Error verifying admin:", error);
      return sendErrorResponse(res, 500, "Internal server error");
    }
  });
}

// Export the middleware functions
module.exports = {
  authenticateToken,
  isAdmin,
  authenticateAdmin,
};
