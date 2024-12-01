const jwt = require("jsonwebtoken");
const employeeService = require("../services/employee.service");

// Function to verify the token received from the frontend
const verifyToken = async (req, res, next) => {
   const token = req.headers["x-access-token"];

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

      if (!employee_email) {
         console.error("Employee email missing in request object.");
         return res.status(400).send({
            status: "fail",
            message: "Employee email not found in token payload.",
         });
      }

      const employee = await employeeService.getEmployeeByEmail(employee_email);

      if (!employee || employee.length === 0) {
         console.error(`Employee with email ${employee_email} not found.`);
         return res.status(404).send({
            status: "fail",
            message: "Employee not found!",
         });
      }

      if (employee[0].company_role_id === 3) {
         // Role ID 3 = Admin
         return next();
      } else {
         return res.status(403).send({
            status: "fail",
            message: "Access denied. Not an admin!",
         });
      }
   } catch (error) {
      console.error("Error while checking admin role:", error);
      return res.status(500).send({
         status: "fail",
         message: "Internal server error. Please try again later.",
      });
   }
};

// Function to check if the user is a manager
const isManager = async (req, res, next) => {
   try {
      const { employee_email } = req;

      if (!employee_email) {
         console.error("Employee email missing in request object.");
         return res.status(400).send({
            status: "fail",
            message: "Employee email not found in token payload.",
         });
      }

      const employee = await employeeService.getEmployeeByEmail(employee_email);

      if (!employee || employee.length === 0) {
         console.error(`Employee with email ${employee_email} not found.`);
         return res.status(404).send({
            status: "fail",
            message: "Employee not found!",
         });
      }

      if (employee[0].company_role_id === 2) {
         // Role ID 2 = Manager
         return next();
      } else {
         return res.status(403).send({
            status: "fail",
            message: "Access denied. Not a manager!",
         });
      }
   } catch (error) {
      console.error("Error while checking manager role:", error);
      return res.status(500).send({
         status: "fail",
         message: "Internal server error. Please try again later.",
      });
   }
};

// Function to check if the user is either an Admin or Manager for specific routes like adding services
const isAdminOrManagerForService = async (req, res, next) => {
   try {
      const { employee_email } = req;

      if (!employee_email) {
         console.error("Employee email missing in request object.");
         return res.status(400).send({
            status: "fail",
            message: "Employee email not found in token payload.",
         });
      }

      const employee = await employeeService.getEmployeeByEmail(employee_email);

      if (!employee || employee.length === 0) {
         console.error(`Employee with email ${employee_email} not found.`);
         return res.status(404).send({
            status: "fail",
            message: "Employee not found!",
         });
      }

      if (
         employee[0].company_role_id === 2 ||
         employee[0].company_role_id === 3
      ) {
         // Role ID 2 = Manager, Role ID 3 = Admin
         return next();
      } else {
         return res.status(403).send({
            status: "fail",
            message: "Access denied. Not an admin or manager!",
         });
      }
   } catch (error) {
      console.error("Error while checking admin or manager role:", error);
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
   isManager,
   isAdminOrManagerForService, // Export the new middleware for the service route
};

module.exports = authMiddleware;