require("dotenv").config();
const jwt = require("jsonwebtoken");
const employeeService = require("../services/employee.service");

// Utility function to send consistent error responses
function sendErrorResponse(res, statusCode, message, logMessage) {
  if (logMessage) {
    console.error(logMessage); // Log detailed error message for better debugging
  }
  return res.status(statusCode).json({
    success: false,
    message: message,
  });
}

// Utility function for JWT verification
function verifyJwtToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        reject("Invalid or expired token");
      }
      resolve(decoded);
    });
  });
}

// Middleware to authenticate JWT token
async function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return sendErrorResponse(res, 401, "Token is required");
  }

  try {
    const decoded = await verifyJwtToken(token);
    req.user = decoded; // Attach user data to the request object
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    return sendErrorResponse(res, 403, error); // Send specific error message
  }
}

// Middleware to check if the user is an admin
async function isAdmin(req, res, next) {
  const userEmail = req.user?.employee_email;

  if (!userEmail) {
    return sendErrorResponse(
      res,
      400,
      "User email not found in token",
      "User email missing in token"
    );
  }

  try {
    // Fetch employee by email from the database
    const employee = await employeeService.getEmployeeByEmail(userEmail);

    if (!employee || employee.length === 0) {
      return sendErrorResponse(
        res,
        404,
        "Employee not found",
        "Employee with email not found"
      );
    }

    // Check if the employee has admin role based on company_role_id
    const employeeRole = employee[0].company_role_id;
    const adminRoleId = parseInt(process.env.ADMIN_ROLE_ID);

    if (employeeRole === adminRoleId) {
      return next(); // User is admin, proceed to next middleware/controller
    } else {
      return sendErrorResponse(
        res,
        403,
        "You do not have admin privileges",
        "User does not have admin role"
      );
    }
  } catch (error) {
    return sendErrorResponse(res, 500, "Internal server error", error.message);
  }
}

// Middleware to authenticate and authorize as admin in one step
async function authenticateAdmin(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return sendErrorResponse(
      res,
      401,
      "Authentication invalid",
      "Token is missing"
    );
  }

  try {
    const decoded = await verifyJwtToken(token);
    req.user = decoded; // Attach the user data to request

    // Fetch employee to check for admin role
    const userEmail = decoded?.employee_email;
    if (!userEmail) {
      return sendErrorResponse(
        res,
        400,
        "User email missing in token",
        "User email missing in token"
      );
    }

    // Verify the employee's role
    const employee = await employeeService.getEmployeeByEmail(userEmail);

    if (!employee || employee.length === 0) {
      return sendErrorResponse(
        res,
        404,
        "Employee not found",
        "Employee with email not found"
      );
    }

    // Check if employee has admin role and it has value 3 it can get access to the page
    if (employee[0].company_role_id === 3) {
      return next(); // Proceed to the next middleware or controller
    } else {
      return sendErrorResponse(
        res,
        403,
        "You do not have the required admin privileges",
        "User is not an admin"
      );
    }
  } catch (error) {
    return sendErrorResponse(res, 500, "Internal server error", error.message);
  }
}

// Export the middleware functions
module.exports = {
  authenticateToken,
  isAdmin,
  authenticateAdmin,
};
